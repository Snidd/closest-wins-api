import { GameResolver } from "./game/GameResolver";
import { StartGameResolver } from "./game/resolvers/StartGameResolver";
import { GuessResolver } from "./guess/GuessResolver";
import { SubscriptionResolver } from "./subscription/SubscriptionResolver";

export const resolvers = [
  GameResolver,
  SubscriptionResolver,
  GuessResolver,
  StartGameResolver,
] as const;
