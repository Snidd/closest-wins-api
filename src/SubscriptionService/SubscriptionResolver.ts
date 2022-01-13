import { TopicEnums } from "../types/TopicEnums";
import {
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Service } from "typedi";
import GameStartedNotification from "./GameStartedNotification";

@Resolver()
@Service()
export class SubscriptionResolver {
  @Query(() => String)
  async hello(@PubSub() pubSub: PubSubEngine) {
    await pubSub.publish("MESSAGES", "Hello world");
    return "Hello world!";
  }

  @Subscription(() => String, {
    topics: "MESSAGES",
  })
  async subscription(@Root() payload: string): Promise<any> {
    return "payload" + payload;
  }

  @Subscription(() => GameStartedNotification, {
    topics: TopicEnums.GAMESTARTED,
  })
  async gameStartedSubscription(
    @Root() payload: GameStartedNotification
  ): Promise<GameStartedNotification> {
    return payload;
  }
}
