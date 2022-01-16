import { GameResolver } from "./game/GameResolver";
import { GuessResolver } from "./guess/GuessResolver";
import { SubscriptionResolver } from "./subscription/SubscriptionResolver";

export const resolvers = [
  GameResolver,
  SubscriptionResolver,
  GuessResolver,
] as const;
