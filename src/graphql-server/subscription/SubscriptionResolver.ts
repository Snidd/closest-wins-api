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
import PlayerAddedNotification from "./PlayerAddedNotification";

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
    filter: ({
      payload,
      args,
    }: {
      payload: { _doc: GameStartedNotification };
      args: { gameId: Types.ObjectId };
    }) => {
      const success = args.gameId.equals(payload._doc._id);
      console.log(success);
      return success;
    },
  })
  async gameStartedSubscription(
    @Root() payload: { _doc: GameStartedNotification },
    @Arg("gameId", () => ObjectIdScalar) gameId: Types.ObjectId
  ): Promise<GameStartedNotification | null> {
    if (gameId.equals(payload._doc._id)) {
      return payload._doc;
    }
    return null;
  }

  @Subscription(() => PlayerAddedNotification, {
    nullable: true,
    topics: TopicEnums.PLAYERADDED,
    filter: ({
      payload,
      args,
    }: {
      payload: PlayerAddedNotification;
      args: { gameId: Types.ObjectId };
    }) => {
      const success = args.gameId.equals(payload.gameId);
      return success;
    },
  })
  async playerAddedSubscription(
    @Root() payload: PlayerAddedNotification,
    @Arg("gameId", () => ObjectIdScalar) gameId: Types.ObjectId
  ): Promise<PlayerAddedNotification | null> {
    if (gameId.equals(payload.gameId)) {
      return payload;
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
