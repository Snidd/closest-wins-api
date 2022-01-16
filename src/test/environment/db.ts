import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";

export interface TestDB {
  openDatabase(): Promise<void>;
  closeDatabase(): Promise<void>;
  clearDatabase(): Promise<void>;
}

let mongoServer: MongoMemoryServer;

export const openDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoose.disconnect();
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
