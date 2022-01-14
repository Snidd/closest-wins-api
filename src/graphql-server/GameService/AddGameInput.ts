import { Field, InputType } from "type-graphql";
import { Game } from "./GameModel";

@InputType({ description: "New Game data" })
export class AddGameInput implements Partial<Game> {
  @Field({ nullable: true })
  maxTimer?: number;
}
