import { model, Schema, Model } from "mongoose";

export interface Game {
  started: boolean;
  latitude: number;
  longitude: number;
  maxTimer: number;
  createdAt: Date;
  updatedAt: Date;
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
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    maxTimer: {
      type: Number,
      required: false,
      default: 90,
    },
  },
  { timestamps: true }
);

export const GameModel = model<Game>("Game", schema);

export interface IGameModel extends Model<Game> {}
