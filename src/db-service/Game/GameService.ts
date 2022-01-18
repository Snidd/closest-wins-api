import { Model, Types } from "mongoose";
import { generate } from "randomstring";
import { Service, Inject } from "typedi";
import { Game, GameDoc } from "./GameModel";

@Service()
export class GameService {
  constructor(@Inject("GAME") private readonly game: Model<Game>) {}

  async getAll(): Promise<GameDoc[] | null> {
    return await this.game.find();
  }

  async getByGuessId(guessId: Types.ObjectId): Promise<GameDoc | null> {
    const game = await this.game
      .findOne({ guesses: { $elemMatch: { _id: guessId } } })
      .exec();
    return game;
  }

  async getById(id: Types.ObjectId): Promise<GameDoc | null> {
    return await this.game.findOne({ _id: id });
  }

  async getUniqueShorthand(): Promise<string> {
    let shorthand = generate({
      length: 5,
      charset: "alphabetic",
      capitalization: "uppercase",
    });
    let existingGame = await this.getByShorthand(shorthand);

    while (existingGame !== null) {
      shorthand = generate({ length: 5, charset: "alphabetic" });
      existingGame = await this.getByShorthand(shorthand);
    }
    return shorthand;
  }

  async getByShorthand(shorthand: string): Promise<GameDoc | null> {
    return await this.game.findOne({ shorthand: shorthand });
  }

  async getByEmail(email: string): Promise<GameDoc | null> {
    return await this.game.findOne({ latitude: email }).exec();
  }

  async createGame(userInfo: Partial<Game>): Promise<GameDoc> {
    const user = new this.game(userInfo);
    return await user.save();
  }

  async updateById(
    id: Types.ObjectId,
    game: Partial<Game>
  ): Promise<GameDoc | null> {
    return this.game.findByIdAndUpdate(id, game, { returnDocument: "after" });
  }
}
