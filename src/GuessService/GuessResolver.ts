import "reflect-metadata";
import GuessMadeNotification from "../SubscriptionService/GuessMadeNotification";
import { TopicEnums } from "../types/TopicEnums";
import {
  Arg,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
} from "type-graphql";
import { Inject, Service } from "typedi";
import GuessSchema from "./GuessSchema";
import { GuessService } from "./GuessService";
import { MakeGuessInput } from "./MakeGuessInput";

@Resolver(GuessSchema)
@Service()
export class GuessResolver {
  @Inject()
  guessService: GuessService;

  @Query(() => [GuessSchema], { nullable: "items" })
  async guesses(
    @Arg("gameId") id: string
  ): Promise<Omit<GuessSchema, "game">[] | null> {
    return await this.guessService.getByGameId(id);
  }

  @Mutation(() => GuessSchema)
  async makeGuess(
    @Arg("data") newGuessData: MakeGuessInput,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Omit<GuessSchema, "game"> | null> {
    const payload: GuessMadeNotification = {
      gameId: newGuessData.game,
      playerName: newGuessData.playerName,
    };
    pubSub.publish(TopicEnums.GAMESTARTED, payload);
    return this.guessService.createGuess(newGuessData);
  }
}
