import { ObjectType } from "type-graphql";
import { BasicGameSchema } from "@graphql/GameService/GameSchema";

@ObjectType("GameStartedNotification", {
  description: "Game started notification",
})
export default class GameStartedNotification extends BasicGameSchema {}
