import { GameModel } from "@db/game/GameModel";
import { GuessModel } from "@db/guess/GuessModel";
import { createApolloServer } from "@graphql/createServer";
import Container from "typedi";
import { clearDatabase, closeDatabase, openDatabase } from "../environment/db";

describe("Test GameResolver", () => {
  beforeAll(async () => await openDatabase());
  afterAll(async () => await closeDatabase());
  afterEach(async () => await clearDatabase());

  const ADD_GAME = `mutation Mutation($data: AddGameInput!) {
    addGame(data: $data) {
      _id
      started
      latitude
      longitude
      maxTimer
      shorthand
      adminKey
      updatedAt
    }
  }`;

  test("can call addGame and make a simple game", async () => {
    Container.set({ id: "GAME", factory: () => GameModel });
    Container.set({ id: "GUESS", factory: () => GuessModel });

    const server = await createApolloServer();
    const res = await server.executeOperation({
      query: ADD_GAME,
      variables: {
        data: {
          maxTimer: null,
        },
      },
    });

    expect(res.errors).toBe(undefined);
    expect(res.data?.addGame).not.toBe(undefined);
    expect(res.data?.addGame).toHaveProperties([
      "_id",
      "started",
      "latitude",
      "longitude",
      "maxTimer",
      "shorthand",
      "adminKey",
      "updatedAt",
    ]);

    /*
    ([
      "_id",
      "started",
      "latitude",
      "longitude",
      "maxTimer",
      "shorthand",
      "adminKey",
    ]);*/
  });
});
