import { Field, InputType } from "type-graphql";

@InputType({ description: "Start Game data" })
export class StartGameInput {
  @Field()
  id: string;

  @Field()
  adminKey: string;

  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field({ nullable: true })
  maxTimer?: number;
}
