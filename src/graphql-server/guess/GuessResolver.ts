import "reflect-metadata";
import GuessMadeNotification from "@graphql/subscription/GuessMadeNotification";
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
import GuessSchema from "./GuessSchema";
import { GuessService } from "@db/guess/GuessService";
import { MakeGuessInput } from "./MakeGuessInput";
import GameSchema from "@graphql/game/GameSchema";
import { GameService } from "@db/game/GameService";
import { Types } from "mongoose";
import { ObjectIdScalar } from "@graphql/types/ObjectIdScalar";
@Resolver(GuessSchema)
@Service()
export class GuessResolver {
  @Inject()
  guessService: GuessService;

  @Inject()
  gameService: GameService;

  @FieldResolver()
  async game(
    @Root() guess: { _doc: GuessSchema }
  ): Promise<Omit<GameSchema, "guesses"> | null> {
    return await this.gameService.getById(guess._doc.game._id);
  }

  @Query(() => [GuessSchema], { nullable: "items" })
  async guesses(
    @Arg("gameId", () => ObjectIdScalar) id: Types.ObjectId
  ): Promise<Omit<GuessSchema, "game">[] | null> {
    return await this.guessService.getByGameId(id);
  }

  @Mutation(() => GuessSchema)
  async makeGuess(
    @Arg("data") newGuessData: MakeGuessInput,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Omit<GuessSchema, "game"> | null> {
    const game = await this.gameService.getById(newGuessData.gameId);
    if (game === null || game.started === false) {
      throw new Error(
        "GameID: " + newGuessData.gameId + " doesn't exist or isn't started."
      );
    }
    const guess = await this.guessService.getByGameIdAndPlayerName(
      newGuessData.gameId,
      newGuessData.playerName
    );
    if (guess !== null) {
      throw new Error("This player already guessed!");
    }
    console.log(JSON.stringify(guess));
    const payload: GuessMadeNotification = {
      gameId: newGuessData.gameId,
      playerName: newGuessData.playerName,
    };
    pubSub.publish(TopicEnums.GUESSMADE, payload);
    return this.guessService.createGuess(newGuessData);
  }
}
