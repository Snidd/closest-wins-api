import { GameResolver } from "./GameService/GameResolver";
import { GuessResolver } from "./GuessService/GuessResolver";
import { SubscriptionResolver } from "./SubscriptionService/SubscriptionResolver";

export const resolvers = [
  GameResolver,
  SubscriptionResolver,
  GuessResolver,
] as const;
