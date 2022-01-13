import { GameResolver } from "./GameService/GameResolver";
import { SubscriptionResolver } from "./SubscriptionService/SubscriptionResolver";

export const resolvers = [GameResolver, SubscriptionResolver] as const;
