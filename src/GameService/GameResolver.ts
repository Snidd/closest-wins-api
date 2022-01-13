import "reflect-metadata";
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
import { AddGameInput } from "./CreateGameInput";
import GameSchema from "./GameSchema";
import { GameService } from "./GameService";

@Resolver(GameSchema)
@Service()
export class GameResolver {
  @Inject()
  service: GameService;

  @Query(() => String)
  sample(): String {
    return "Hello";
  }

  @Query(() => [GameSchema])
  async games(): Promise<GameSchema[] | null> {
    return await this.service.getAll();
  }

  @Query(() => GameSchema, { nullable: true })
  async game(@Arg("id") id: string): Promise<GameSchema | null> {
    const game = await this.service.getById(id);
    if (game === null) {
      throw new Error("No Game found");
    }
    return game;
  }

  @Mutation(() => GameSchema)
  async addGame(@Arg("data") newGameData: AddGameInput): Promise<GameSchema> {
    return this.service.createGame(newGameData);
  }

  @Mutation(() => GameSchema, { nullable: true })
  async startGame(
    @Arg("id") id: string,
    @PubSub() pubSub: PubSubEngine
  ): Promise<GameSchema | null> {
    pubSub.publish(TopicEnums.GAMESTARTED, { _id: id, started: true });
    return this.service.updateById(id, { started: true });
  }
}
