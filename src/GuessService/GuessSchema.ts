import GameSchema from "../GameService/GameSchema";
import { Field, ObjectType, ID } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { ManyToOne } from "typeorm";

@ObjectType("Guess", { description: "Guess Schema" })
export default class GuessSchema {
  @Field(() => ID)
  _id: String;

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
  @TypeormLoader()
  game: GameSchema;

  @Field()
  updatedAt: Date;
}
