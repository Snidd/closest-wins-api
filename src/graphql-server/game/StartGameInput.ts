import { ObjectIdScalar } from "@graphql/types/ObjectIdScalar";
import { Types } from "mongoose";
import { Field, InputType } from "type-graphql";

@InputType({ description: "Start Game data" })
export class StartGameInput {
  @Field(() => ObjectIdScalar)
  id: Types.ObjectId;

  @Field()
  adminKey: string;

  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field({ nullable: true })
  maxTimer?: number;
}
