import { Field, ObjectType } from "type-graphql";
import GameSchema from "./GameSchema";

@ObjectType("CreateGameOutput", { description: "Create Game Output" })
export default class AddGameOutput extends GameSchema {
  @Field()
  adminKey: string;

  guesses: never;
}
