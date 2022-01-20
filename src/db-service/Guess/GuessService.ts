import { Model, Types } from "mongoose";
import { Service, Inject } from "typedi";
import { Guess } from "./GuessModel";
import { Game, GameDoc } from "@db/game/GameModel";

@Service()
export class GuessService {
  constructor(@Inject("GAME") private readonly gameService: Model<Game>) {}

  async getByGameId(id: Types.ObjectId): Promise<Guess[] | null> {
    const game = await this.gameService.findById(id);
    if (game !== null) {
      return game.guesses;
    }
    return null;
  }

  async getByGameIdAndPlayerName(
    id: Types.ObjectId,
    playerName: string
  ): Promise<Guess | null> {
    const game = await this.gameService.findById(id);
    if (game !== null) {
      const guess = game.guesses.find(
        (guess) => guess.playerName === playerName
      );
      return guess !== undefined ? guess : null;
    }
    return null;
  }

  async updateAllGuesses(
    gameId: Types.ObjectId,
    guesses: Guess[]
  ): Promise<GameDoc | null> {
    const game = await this.gameService.findOneAndUpdate(
      { _id: gameId },
      { $set: { guesses: guesses } }
    );
    return game;
  }

  async createGuess(
    gameId: Types.ObjectId,
    newGuess: Partial<Guess>
  ): Promise<GameDoc | null> {
    const game = await this.gameService.findOneAndUpdate(
      { _id: gameId },
      { $push: { guesses: newGuess } }
    );
    return game;
  }
}
