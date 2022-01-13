import "reflect-metadata";
import GuessMadeNotification from "../SubscriptionService/GuessMadeNotification";
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
import GuessSchema from "./GuessSchema";
import { GuessService } from "./GuessService";
import { MakeGuessInput } from "./MakeGuessInput";
import GameSchema from "../GameService/GameSchema";
import { GameService } from "../GameService/GameService";

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
