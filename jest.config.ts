import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*Test.ts"],
  globalSetup: "<rootDir>/src/test/globalSetup.ts",
  globalTeardown: "<rootDir>/src/test/globalTeardown.ts",
  setupFilesAfterEnv: ["<rootDir>/src/test/setupFile.ts"],
  maxWorkers: 4,
};
export default config;
