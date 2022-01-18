import { Types } from "mongoose";
import { ObjectIdScalar } from "@graphql/types/ObjectIdScalar";
import { Field, ObjectType } from "type-graphql";

@ObjectType("GuessMadeNotification", {
  description: "Game started notification",
})
export default class GuessMadeNotification {
  @Field()
  playerName: string;

  @Field(() => ObjectIdScalar)
  gameId: Types.ObjectId;

  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
