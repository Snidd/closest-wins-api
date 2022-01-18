import { ObjectIdScalar } from "@graphql/types/ObjectIdScalar";
import { Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType("PlayerAddedNotification", {
  description: "Player added notification",
})
export default class PlayerAddedNotification {
  @Field(() => ObjectIdScalar)
  gameId: Types.ObjectId;

  @Field()
  playerName: string;
}
