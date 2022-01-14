import * as mongoose from "mongoose";

export const connect = async () => {
  return await mongoose.connect(`${process.env.MONGO_SERVER_URI}`);
};

export const disconnect = async () => {
  return await mongoose.disconnect();
};
