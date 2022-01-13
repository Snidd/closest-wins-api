import { Field, ObjectType, ID } from "type-graphql";

@ObjectType("Game", { description: "Game Schema" })
export default class GameSchema {
  @Field(() => ID)
  _id: String;

  @Field()
  started: boolean;

  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field()
  maxTimer: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
