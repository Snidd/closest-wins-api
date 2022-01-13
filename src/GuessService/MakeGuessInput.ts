import { Types } from "mongoose";
import { ObjectIdScalar } from "../types/ObjectIdScalar";
import { Field, InputType } from "type-graphql";
import { Guess } from "./GuessModel";

@InputType({ description: "New Guess Input" })
export class MakeGuessInput implements Partial<Guess> {
  @Field(() => ObjectIdScalar)
  game: Types.ObjectId;

  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field()
  playerName: string;
}
