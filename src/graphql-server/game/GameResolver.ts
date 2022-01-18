import "reflect-metadata";
import { TopicEnums } from "@graphql/types/TopicEnums";
import {
  Arg,
  FieldResolver,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Inject, Service } from "typedi";
import { AddGameInput } from "./AddGameInput";
import GameSchema, { BasicGameSchema } from "./GameSchema";
import { GameService } from "@db/game/GameService";
import { GuessService } from "@db/guess/GuessService";
import { generate } from "randomstring";
import AddGameOutput from "./AddGameOutput";
import GameStartedNotification from "@graphql/subscription/GameStartedNotification";
import { StartGameInput } from "./StartGameInput";
import { Types } from "mongoose";
import { ObjectIdScalar } from "@graphql/types/ObjectIdScalar";
import PlayerAddedNotification from "@graphql/subscription/PlayerAddedNotification";

@Resolver(GameSchema)
@Service()
export class GameResolver {
  @Inject()
  gameService: GameService;

  @Inject()
  guessService: GuessService;

  @Query(() => String)
  sample(): String {
    return "Hello";
  }

  @Query(() => [GameSchema])
  async games(): Promise<Omit<GameSchema, "guesses">[] | null> {
    return await this.gameService.getAll();
  }

  @Query(() => GameSchema, { nullable: true })
  async game(
    @Arg("id", () => ObjectIdScalar) id: Types.ObjectId
  ): Promise<Omit<GameSchema, "guesses"> | null> {
    const game = await this.gameService.getById(id);
    if (game === null) {
      throw new Error("No Game found");
    }
    return game;
  }

  @FieldResolver()
  async guesses(@Root() game: { _doc: GameSchema }) {
    return await this.guessService.getByGameId(game._doc._id);
  }

  @Mutation(() => AddGameOutput)
  async addGame(
    @Arg("data") newGameData: AddGameInput
  ): Promise<Omit<AddGameOutput, "guesses">> {
    const adminKey = generate(16);
    const shorthand = await this.gameService.getUniqueShorthand();
    const createdGame = await this.gameService.createGame({
      ...newGameData,
      shorthand: shorthand,
      adminKey: adminKey,
    });
    return createdGame;
  }

  @Mutation(() => GameSchema, { nullable: true })
  async startGame(
    @Arg("gameInput") startGame: StartGameInput,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Omit<GameSchema, "guesses"> | null> {
    const game = await this.gameService.getById(startGame.id);
    if (game === null || game.adminKey !== startGame.adminKey) {
      throw new Error("Invalid Game!");
    }
    const payload: GameStartedNotification = game;
    pubSub.publish(TopicEnums.GAMESTARTED, payload);
    return this.gameService.updateById(startGame.id, {
      started: true,
      latitude: startGame.latitude,
      longitude: startGame.longitude,
      maxTimer: startGame.maxTimer,
    });
  }

  @Mutation(() => GameSchema, { nullable: true })
  async addPlayer(
    @Arg("gameId", () => ObjectIdScalar) gameId: Types.ObjectId,
    @Arg("playerName") playerName: string,
    @Arg("sessionId") playerSessionId: string,
    @PubSub() pubSub: PubSubEngine
  ): Promise<BasicGameSchema | null> {
    const game = await this.gameService.getById(gameId);
    if (game === null) return null;

    if (
      game.players.find(
        (p) =>
          p.playerSessionId === playerSessionId || p.playerName === playerName
      ) !== undefined
    ) {
      throw new Error("That player already exists!");
    }

    game.players.push({
      playerName: playerName,
      playerSessionId: playerSessionId,
    });

    const payload: PlayerAddedNotification = {
      gameId: gameId,
      playerName: playerName,
    };

    pubSub.publish(TopicEnums.PLAYERADDED, payload);

    return await this.gameService.updateById(gameId, game);
  }
}
