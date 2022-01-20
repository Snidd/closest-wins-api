import { GameService } from "@db/game/GameService";
import { LocationService } from "@db/location/LocationService";
import { getDistance } from "@graphql/lib/getDistance";
import { Types } from "mongoose";
import { Arg, Mutation, Resolver } from "type-graphql";
import { Service, Inject } from "typedi";
import GameSchema from "../GameSchema";
import { GuessService } from "@db/guess/GuessService";
import { ObjectIdScalar } from "@graphql/types/ObjectIdScalar";

@Resolver(GameSchema)
@Service()
export class StopGameResolver {
  @Inject()
  gameService: GameService;

  @Inject()
  guessService: GuessService;

  @Inject()
  locationService: LocationService;

  @Mutation(() => GameSchema, { nullable: true })
  async stopGame(
    @Arg("gameId", () => ObjectIdScalar) gameId: Types.ObjectId,
    @Arg("adminKey") adminKey: string
  ): Promise<Omit<GameSchema, "guesses" | "location"> | null> {
    const game = await this.gameService.getByIdAndAdminKey(gameId, adminKey);
    if (game === null) {
      throw new Error("Invalid game!");
    }
    const location = await this.locationService.getById(game.location._id);
    if (location === null) {
      throw new Error("Invalid location!?");
    }

    const calculatedGuesses = game.guesses
      .map((guess) => {
        guess.actualDistance = getDistance(location, guess);
        return guess;
      })
      .sort((guess) => guess.actualDistance);

    await this.guessService.updateAllGuesses(gameId, calculatedGuesses);
    return await this.gameService.updateStartedById(gameId, false);
  }
}
