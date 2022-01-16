import { ObjectType } from "type-graphql";
import { BasicGameSchema } from "@app/graphql-server/game/GameSchema";

@ObjectType("GameStartedNotification", {
  description: "Game started notification",
})
export default class GameStartedNotification extends BasicGameSchema {}
