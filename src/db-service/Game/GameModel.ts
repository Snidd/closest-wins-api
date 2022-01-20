import { Guess, guessSchema } from "@db/guess/GuessModel";
import { Player, playerSchema } from "@db/player/PlayerModel";
import { model, Schema, Types } from "mongoose";

export interface Game {
  started: boolean;
  location: Types.ObjectId;
  latitude: number;
  longitude: number;
  maxTimer: number;
  createdAt: Date;
  updatedAt: Date;
  shorthand: string;
  adminKey: string;
  players: Types.Array<Player>;
  guesses: Types.Array<Guess>;
}

export interface GameDoc extends Game {
  _id: Types.ObjectId;
}

export const schema = new Schema<Game>(
  {
    started: {
      type: Boolean,
      required: false,
      default: false,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: false,
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
    players: {
      type: [playerSchema],
      required: false,
    },
    guesses: {
      type: [guessSchema],
      required: false,
    },
  },
  { timestamps: true }
);

export const GameModel = model<Game>("Game", schema);
