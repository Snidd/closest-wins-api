import { Field, ID, ObjectType } from "type-graphql";
import { Types } from "mongoose";

@ObjectType("GameStartedNotification", {
  description: "Game started notification",
})
export default class GameStartedNotification {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  started: boolean;

  @Field({ nullable: true })
  maxTimer: number;

  @Field()
  shorthand: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
