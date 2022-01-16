import { Types } from "mongoose";
import { ObjectIdScalar } from "@graphql/types/ObjectIdScalar";
import { Field, InputType } from "type-graphql";

@InputType({ description: "New Guess Input" })
export class MakeGuessInput {
  @Field(() => ObjectIdScalar)
  game: Types.ObjectId;

  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field()
  playerName: string;
}
