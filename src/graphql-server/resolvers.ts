import { GameResolver } from "./game/GameResolver";
import { StartGameResolver } from "./game/resolvers/StartGameResolver";
import { StopGameResolver } from "./game/resolvers/StopGameResolver";
import { GuessResolver } from "./guess/GuessResolver";
import { LocationResolver } from "./location/LocationResolver";
import { SubscriptionResolver } from "./subscription/SubscriptionResolver";

export const resolvers = [
  GameResolver,
  SubscriptionResolver,
  GuessResolver,
  StartGameResolver,
  StopGameResolver,
  LocationResolver,
] as const;
