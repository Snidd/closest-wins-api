import * as mongoose from "mongoose";
declare var __MONGO_URI__: string;

export interface TestDB {
  openDatabase(): Promise<void>;
  closeDatabase(): Promise<void>;
  clearDatabase(): Promise<void>;
}

export const openDatabase = async () => {
  await mongoose.connect(__MONGO_URI__, {});
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
