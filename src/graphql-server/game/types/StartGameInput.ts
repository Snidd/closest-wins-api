import { Location } from "@db/location/LocationModel";
import { ObjectIdScalar } from "@graphql/types/ObjectIdScalar";
import { Types } from "mongoose";
import { Field, InputType } from "type-graphql";

@InputType({ description: "Start Game data" })
export class StartGameInput {
  @Field(() => ObjectIdScalar)
  gameId: Types.ObjectId;

  @Field()
  adminKey: string;

  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  imageURL: string | null;

  @Field(() => Number, { nullable: true })
  maxTimer?: number | null;

  toLocation(): Partial<Location> {
    const { adminKey, gameId: id, maxTimer, ...newLocation } = this;
    return newLocation;
  }
}
