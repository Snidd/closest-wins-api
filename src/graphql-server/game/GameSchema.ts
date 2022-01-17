import GuessSchema from "../guess/GuessSchema";
import { Field, ObjectType, ID } from "type-graphql";
import { OneToMany } from "typeorm";
import { Types } from "mongoose";

@ObjectType()
export class BasicGameSchema {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  started: boolean;

  @Field({ nullable: true })
  @Field()
  latitude: number;

  @Field({ nullable: true })
  @Field()
  longitude: number;

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
}
