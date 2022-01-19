import { GameService } from "@db/game/GameService";
import { LocationService } from "@db/location/LocationService";
import GameStartedNotification from "@graphql/subscription/GameStartedNotification";
import { TopicEnums } from "@graphql/types/TopicEnums";
import { Arg, Mutation, PubSub, PubSubEngine, Resolver } from "type-graphql";
import { Service, Inject } from "typedi";
import GameSchema from "../GameSchema";
import { StartGameExistingLocationInput } from "../types/StartGameExistingLocationInput";
import { StartGameInput } from "../types/StartGameInput";

@Resolver(GameSchema)
@Service()
export class StartGameResolver {
  @Inject()
  gameService: GameService;

  @Inject()
  locationService: LocationService;

  @Mutation(() => GameSchema, { nullable: true })
  async startGame(
    @Arg("gameInput") startGameInput: StartGameInput,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Omit<GameSchema, "guesses"> | null> {
    const game = await this.gameService.getById(startGameInput.gameId);
    if (game === null || game.adminKey !== startGameInput.adminKey) {
      throw new Error("Invalid Game!");
    }

    const location = await this.locationService.createLocation(
      startGameInput.toLocation()
    );
    if (location === null) {
      throw new Error("Invalid location.");
    }

    const payload: GameStartedNotification = game;
    pubSub.publish(TopicEnums.GAMESTARTED, payload);
    return this.gameService.updateById(startGameInput.gameId, {
      started: true,
      location: location._id,
      maxTimer: startGameInput.maxTimer ? startGameInput.maxTimer : 90,
    });
  }

  @Mutation(() => GameSchema, { nullable: true })
  async startGameWithExistingLocation(
    @Arg("locationId") startGameInput: StartGameExistingLocationInput,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Omit<GameSchema, "guesses"> | null> {
    const game = await this.gameService.getById(startGameInput.id);
    if (game === null || game.adminKey !== startGameInput.adminKey) {
      throw new Error("Invalid Game!");
    }

    const location = await this.locationService.getById(
      startGameInput.locationId
    );
    if (location === null) {
      throw new Error("Invalid location.");
    }

    const payload: GameStartedNotification = game;
    pubSub.publish(TopicEnums.GAMESTARTED, payload);
    return this.gameService.updateById(startGameInput.id, {
      started: true,
      location: location._id,
      maxTimer: startGameInput.maxTimer,
    });
  }
}

/*
@Mutation(() => GameSchema, { nullable: true })
  async startGame(
    @Arg("gameInput") startGameInput: StartGameInput,
    @PubSub() pubSub: PubSubEngine
  ): Promise<Omit<GameSchema, "guesses"> | null> {
    const game = await this.gameService.getById(startGameInput.gameId);
    if (game === null || game.adminKey !== startGameInput.adminKey) {
      throw new Error("Invalid Game!");
    }

    const location = await this.locationService.createLocation(
      startGameInput.toLocation()
    );
    if (location === null) {
      throw new Error("Invalid location.");
    }

    const payload: GameStartedNotification = game;
    pubSub.publish(TopicEnums.GAMESTARTED, payload);
    return this.gameService.updateById(startGameInput.gameId, {
      started: true,
      location: location._id,
      maxTimer: startGameInput.maxTimer ? startGameInput.maxTimer : 90,
    });
  }
  */
