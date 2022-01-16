import * as mongoose from "mongoose";

export const connect = async () => {
  console.log(`connecting to mongodb ${process.env.MONGO_SERVER_URI}...`);
  try {
    await mongoose.connect(`${process.env.MONGO_SERVER_URI}`);
  } catch (err) {
    console.log(`couldnt connect to: ${JSON.stringify(err)}`);
  }
  return;
};

export const disconnect = async () => {
  console.log("disconnecting from the mongodb...");
  return await mongoose.disconnect();
};
