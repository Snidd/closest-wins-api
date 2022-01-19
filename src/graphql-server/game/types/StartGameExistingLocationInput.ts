import { ObjectIdScalar } from "@graphql/types/ObjectIdScalar";
import { Types } from "mongoose";
import { Field, InputType } from "type-graphql";

@InputType({ description: "Start Game with existing location data" })
export class StartGameExistingLocationInput {
  @Field(() => ObjectIdScalar)
  id: Types.ObjectId;

  @Field()
  adminKey: string;

  @Field(() => ObjectIdScalar)
  locationId: Types.ObjectId;

  @Field({ nullable: true })
  maxTimer?: number;
}
