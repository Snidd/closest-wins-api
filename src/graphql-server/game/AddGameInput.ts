import { Field, InputType } from "type-graphql";

@InputType({ description: "New Game data" })
export class AddGameInput {
  @Field({ nullable: true })
  maxTimer?: number;
}
