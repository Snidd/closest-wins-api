import { model, Schema, Types } from "mongoose";

export interface Guess {
  latitude: number;
  longitude: number;
  playerName: string;
  game: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<Guess>(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    playerName: {
      type: String,
      required: true,
    },
    game: {
      type: Types.ObjectId,
      ref: "Game",
    },
  },
  { timestamps: true }
);

export const GuessModel = model<Guess>("Guess", schema);
