import { Model, Types } from "mongoose";
import { Service, Inject } from "typedi";
import { Game } from "./GameModel";
import GameSchema from "./GameSchema";

@Service()
export class GameService {
  constructor(@Inject("GAME") private readonly user: Model<Game>) {}

  async getAll(): Promise<Omit<GameSchema, "guesses">[] | null> {
    return await this.user.find();
  }

  async getById(
    id: string | Types.ObjectId
  ): Promise<Omit<GameSchema, "guesses"> | null> {
    return await this.user.findOne({ _id: id });
  }

  async getByEmail(email: string): Promise<Omit<GameSchema, "guesses"> | null> {
    return await this.user.findOne({ latitude: email }).exec();
  }

  async createGame(
    userInfo: Partial<Game>
  ): Promise<Omit<GameSchema, "guesses">> {
    const user = new this.user(userInfo);
    return await user.save();
  }

  async updateById(
    id: string,
    game: Partial<Game>
  ): Promise<Omit<GameSchema, "guesses"> | null> {
    return this.user.findByIdAndUpdate(id, game, { returnDocument: "after" });
  }
}
