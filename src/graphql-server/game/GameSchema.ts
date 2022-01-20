import GuessSchema from "../guess/GuessSchema";
import { Field, ObjectType, ID } from "type-graphql";
import { OneToMany, OneToOne } from "typeorm";
import { Types } from "mongoose";
import LocationSchema from "@graphql/location/LocationSchema";
import { Location } from "@db/location/LocationModel";

@ObjectType()
export class BasicGameSchema {
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

@ObjectType("Game", { description: "Game Schema" })
export default class GameSchema extends BasicGameSchema {
  @Field(() => [GuessSchema])
  @OneToMany(() => GuessSchema, (guess) => guess.game)
  guesses: GuessSchema[];

  @Field(() => LocationSchema, { nullable: true })
  @OneToOne(() => LocationSchema, (location) => location._id)
  location: Location;
}
