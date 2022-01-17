import { model, Schema, Types } from "mongoose";

export interface Guess {
  latitude: number;
  longitude: number;
  playerName: string;
  game: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuessDoc extends Omit<Guess, "game"> {
  _id: Types.ObjectId;
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
