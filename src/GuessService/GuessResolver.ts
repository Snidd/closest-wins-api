import "reflect-metadata";
import { Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import GuessSchema from "./GuessSchema";

@Resolver(GuessSchema)
@Service()
export class GuessResolver {
  @Query(() => [GuessSchema], { nullable: "items" })
  guesses(): GuessSchema[] {
    return [];
  }
}
