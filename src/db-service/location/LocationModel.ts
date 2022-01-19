import { model, Schema, Types } from "mongoose";

export interface Location {
  latitude: number;
  longitude: number;
  name: string;
  description: string | null;
  imageURL: string | null;
  playedCount: number;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationDoc extends Location {
  _id: Types.ObjectId;
}

export const locationSchema = new Schema<Location>(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    imageURL: {
      type: String,
      required: false,
    },
    playedCount: {
      type: Number,
      required: true,
      default: 0,
    },
    upvotes: {
      type: Number,
      required: true,
      default: 0,
    },
    downvotes: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const LocationModel = model<Location>("Location", locationSchema);
