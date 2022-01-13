import GuessSchema from "../GuessService/GuessSchema";
import { Field, ObjectType, ID } from "type-graphql";
import { OneToMany } from "typeorm";

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

  @Field(() => [GuessSchema])
  @OneToMany(() => GuessSchema, (guess) => guess.game)
  guesses: GuessSchema[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
