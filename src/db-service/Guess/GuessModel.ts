import { Schema, Types } from "mongoose";

export interface Guess {
  _id: Types.ObjectId;
  latitude: number;
  longitude: number;
  playerName: string;
  actualDistance: number;
  createdAt: Date;
  updatedAt: Date;
}

/*
export interface GuessDoc extends Guess {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
*/
export const guessSchema = new Schema<Guess>(
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
    actualDistance: {
      type: Number,
      required: false,
      default: -1,
    },
  },
  { timestamps: true }
);
