import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";
const { compilerOptions } = require("./tsconfig");

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "<rootDir>/src/test/environment/mongodb.ts",
  testMatch: ["**/test/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/test/environment/extend.ts"],
  maxWorkers: 4,
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
export default config;
