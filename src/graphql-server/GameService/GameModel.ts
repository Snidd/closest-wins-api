import { model, Schema, Model } from "mongoose";

export interface Game {
  started: boolean;
  latitude: number;
  longitude: number;
  maxTimer: number;
  createdAt: Date;
  updatedAt: Date;
  shorthand: string;
  adminKey: string;
}

export interface GameDoc extends Omit<Game, "guesses"> {
  _id: string;
}

const schema = new Schema<Game>(
  {
    started: {
      type: Boolean,
      required: false,
      default: false,
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    maxTimer: {
      type: Number,
      required: false,
      default: 90,
    },
    shorthand: {
      type: String,
      required: true,
    },
    adminKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const GameModel = model<Game>("Game", schema);

export interface IGameModel extends Model<Game> {}
