import { Model, Types } from "mongoose";
import { Service, Inject } from "typedi";
import { Guess, GuessDoc } from "./GuessModel";
import { MakeGuessInput } from "@graphql/guess/MakeGuessInput";

@Service()
export class GuessService {
  constructor(@Inject("GUESS") private readonly guess: Model<Guess>) {}

  async getById(id: string): Promise<GuessDoc | null> {
    return await this.guess.findOne({ _id: id });
  }

  async getByGameId(id: string): Promise<GuessDoc[] | null> {
    return await this.guess.find({ game: id });
  }

  async getByGameIdAndPlayerName(
    id: string | Types.ObjectId,
    playerName: string
  ): Promise<GuessDoc | null> {
    return await this.guess.findOne({ game: id, playerName: playerName });
  }

  async createGuess(input: MakeGuessInput): Promise<GuessDoc | null> {
    const guess = new this.guess(input);
    return await guess.save();
  }
}
