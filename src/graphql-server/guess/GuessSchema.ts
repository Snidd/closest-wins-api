import GameSchema from "@graphql/game/GameSchema";
import { Field, ObjectType, ID } from "type-graphql";
import { ManyToOne } from "typeorm";

@ObjectType("Guess", { description: "Guess Schema" })
export default class GuessSchema {
  @Field(() => ID)
  _id: string;

  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field()
  playerName: string;

  @Field()
  createdAt: Date;

  @Field(() => GameSchema)
  @ManyToOne(() => GameSchema, (game) => game.guesses)
  game: GameSchema;

  @Field()
  updatedAt: Date;
}
