import { Field, ObjectType } from "type-graphql";

@ObjectType("MakeGuessResponse", { description: "Response to making schema" })
export default class MakeGuessResponse {
  @Field()
  success: boolean;
}
