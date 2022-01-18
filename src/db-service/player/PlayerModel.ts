import { Schema, Types } from "mongoose";

export interface Player {
  playerName: string;
  playerSessionId: string;
}

export interface PlayerDoc extends Player {
  _id: Types.ObjectId;
}

export const playerSchema = new Schema<Player>({
  playerName: {
    type: String,
    required: true,
  },
  playerSessionId: {
    type: String,
    required: true,
  },
});
