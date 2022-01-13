import { Field, ObjectType } from "type-graphql";

@ObjectType("GameStartedNotification", {
  description: "Game started notification",
})
export default class GameStartedNotification {
  @Field()
  started: boolean;

  @Field()
  _id: string;
}
