import { Model } from "mongoose";
import { Service, Inject } from "typedi";
import { Guess } from "./GuessModel";
import GuessSchema from "./GuessSchema";
import { MakeGuessInput } from "./MakeGuessInput";

@Service()
export class GuessService {
  constructor(@Inject("GUESS") private readonly guess: Model<Guess>) {}

  async getById(id: string): Promise<Omit<GuessSchema, "game"> | null> {
    return await this.guess.findOne({ _id: id });
  }

  async getByGameId(id: string): Promise<Omit<GuessSchema, "game">[] | null> {
    return await this.guess.find({ game: id });
  }

  async createGuess(
    input: MakeGuessInput
  ): Promise<Omit<GuessSchema, "game"> | null> {
    const guess = new this.guess(input);
    return await guess.save();
  }
}
