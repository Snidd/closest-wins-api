import { MongoMemoryServer } from "mongodb-memory-server";
import NodeEnvironment = require("jest-environment-node");
import type { Config } from "@jest/types";

class MongoDbEnvironment extends NodeEnvironment {
  mongod: MongoMemoryServer | null;
  constructor(config: Config.ProjectConfig) {
    // console.error('\n# MongoDB Environment Constructor #\n');
    super(config);
    this.mongod = new MongoMemoryServer({
      instance: {
        // settings here
        // dbName is null, so it's random
        // dbName: MONGO_DB_NAME,
      },
      // debug: true,
    });
  }

  async setup() {
    await super.setup();
    // console.error('\n# MongoDB Environment Setup #\n');
    if (this.mongod !== null) {
      //console.log("starting new mongodb in memory...");
      await this.mongod.start();

      this.global.__MONGO_URI__ = this.mongod.getUri();
    }
  }

  async teardown() {
    await super.teardown();
    // console.error('\n# MongoDB Environment Teardown #\n');
    if (this.mongod !== null) {
      //console.log("stopping mongodb in memory...");
      await this.mongod.stop();
      this.mongod = null;
    }
  }
}

module.exports = MongoDbEnvironment;
