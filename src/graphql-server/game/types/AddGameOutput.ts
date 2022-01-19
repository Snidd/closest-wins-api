import { Field, ObjectType } from "type-graphql";
import { BasicGameSchema } from "../GameSchema";

@ObjectType("AddGameOutput", { description: "Create Game Output" })
export default class AddGameOutput extends BasicGameSchema {
  @Field()
  adminKey: string;
}
