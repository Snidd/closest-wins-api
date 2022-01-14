import "reflect-metadata";
import { TopicEnums } from "../types/TopicEnums";
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
import GameSchema from "./GameSchema";
import { GameService } from "./GameService";
import { GuessService } from "../GuessService/GuessService";
import { generate } from "randomstring";
import AddGameOutput from "./AddGameOutput";

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
    @Arg("id") id: string
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
    @Arg("id") id: string,
    @Arg("adminKey") adminKey: string,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Omit<GameSchema, "guesses"> | null> {
    const game = await this.gameService.getById(id);
    if (game === null || game.adminKey !== adminKey) {
      throw new Error("Invalid Game!");
    }
    pubSub.publish(TopicEnums.GAMESTARTED, { _id: id, started: true });
    return this.gameService.updateById(id, { started: true });
  }
}
