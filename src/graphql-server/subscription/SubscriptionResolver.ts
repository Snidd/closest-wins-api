import { ObjectIdScalar } from "@graphql/types/ObjectIdScalar";
import { TopicEnums } from "@graphql/types/TopicEnums";
import { Types } from "mongoose";
import {
  Arg,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { Service } from "typedi";
import GameStartedNotification from "./GameStartedNotification";
import GuessMadeNotification from "./GuessMadeNotification";

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
    nullable: true,
    topics: TopicEnums.GAMESTARTED,
    filter: ({ payload, args }) => {
      const success = args.gameId.equals(payload._doc._id);
      console.log(success);
      return success;
    },
  })
  async gameStartedSubscription(
    @Root() payload: { _doc: GameStartedNotification },
    @Arg("gameId", () => ObjectIdScalar) gameId: Types.ObjectId
  ): Promise<GameStartedNotification | null> {
    console.log("checking payload vs id");
    console.log(JSON.stringify(payload));
    if (gameId.equals(payload._doc._id)) {
      return payload._doc;
    }
    return null;
  }

  @Subscription(() => GuessMadeNotification, {
    topics: TopicEnums.GUESSMADE,
  })
  async guessMadeSubscription(
    @Root() payload: GuessMadeNotification
  ): Promise<GuessMadeNotification> {
    return payload;
  }
}
