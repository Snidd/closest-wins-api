import { Field, ObjectType, ID } from "type-graphql";
import { Types } from "mongoose";
import { Location, LocationDoc } from "@db/location/LocationModel";

@ObjectType("Location", { description: "Location" })
export default class LocationSchema implements Location, LocationDoc {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  name: string;

  @Field()
  longitude: number;

  @Field()
  latitude: number;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  imageURL: string | null;

  @Field()
  playedCount: number;

  @Field()
  upvotes: number;

  @Field()
  downvotes: number;

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;
}
