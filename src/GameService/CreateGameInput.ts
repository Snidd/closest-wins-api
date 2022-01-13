import { Field, InputType } from "type-graphql";
import { Game } from "./GameModel";

@InputType({ description: "New Game data" })
export class AddGameInput implements Partial<Game> {
  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field({ nullable: true })
  maxTimer?: number;
}