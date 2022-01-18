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
import MakeGuessResponse from "./MakeGuessResponse";
@Resolver(GuessSchema)
@Service()
export class GuessResolver {
  @Inject()
  guessService: GuessService;

  @Inject()
  gameService: GameService;

  @FieldResolver()
  async game(
    @Root() guess: Omit<GuessSchema, "guesses">
  ): Promise<Omit<GameSchema, "guesses"> | null> {
    return await this.gameService.getByGuessId(guess._id);
  }

  @Query(() => [GuessSchema], { nullable: "items" })
  async guesses(
    @Arg("gameId", () => ObjectIdScalar) id: Types.ObjectId
  ): Promise<Omit<GuessSchema, "game">[] | null> {
    return await this.guessService.getByGameId(id);
  }

  @Mutation(() => MakeGuessResponse)
  async makeGuess(
    @Arg("data") newGuessData: MakeGuessInput,
    @PubSub() pubSub: PubSubEngine
  ): Promise<MakeGuessResponse | null> {
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
    const payload: GuessMadeNotification = newGuessData;

    await this.guessService.createGuess(newGuessData.gameId, newGuessData);

    pubSub.publish(TopicEnums.GUESSMADE, payload);
    return { success: true };
  }
}
