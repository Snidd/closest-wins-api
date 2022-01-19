import { createApolloServer } from "@graphql/createServer";
import { StartGameInput } from "@graphql/game/types/StartGameInput";
import { clearDatabase, closeDatabase, openDatabase } from "../environment/db";

describe("Test GuessResolver", () => {
  beforeAll(async () => await openDatabase());
  afterAll(async () => await closeDatabase());
  afterEach(async () => await clearDatabase());

  const MAKE_GUESS = `mutation MakeGuess($data: MakeGuessInput!) {
    makeGuess(data: $data) {
      success
    }
  }`;

  const START_GAME = `mutation StartGame($gameInput: StartGameInput!) {
    startGame(gameInput: $gameInput) {
      started
      latitude
      longitude
      maxTimer
      shorthand
    }
  }`;

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

  test("cannot call makeGuess when game doesn't exists", async () => {
    const server = await createApolloServer();
    const res = await server.executeOperation({
      query: MAKE_GUESS,
      variables: {
        data: {
          gameId: "61e01406e494d85effeb3504",
          latitude: 23.234,
          longitude: 11.123123,
          playerName: "Snidd",
        },
      },
    });

    expect(res.errors).not.toBe(undefined);
    expect(res.errors?.length).toBe(1);

    if (res.errors === undefined) {
      throw "Was expecting error";
    }

    expect(res.errors[0].message).toMatch(
      /GameID: [\w]+ doesn't exist or isn't started./gm
    );
  });

  test("can create game, start it and make a guess", async () => {
    const server = await createApolloServer();

    const gameRes = await server.executeOperation({
      query: ADD_GAME,
      variables: {
        data: {
          maxTimer: null,
        },
      },
    });

    expect(gameRes.errors).toBe(undefined);

    const id = gameRes.data?.addGame?._id;
    const adminKey = gameRes.data?.addGame?.adminKey;
    console.log(`id: ${id}`);

    const vars: Partial<StartGameInput> = {
      gameId: id,
      name: "Stockholm",
      adminKey: adminKey,
      latitude: 12.123123,
      longitude: 13.1451452345,
      maxTimer: null,
    };

    const startGame = await server.executeOperation({
      query: START_GAME,
      variables: {
        gameInput: vars,
      },
    });

    expect(startGame.errors).toBe(undefined);

    const res = await server.executeOperation({
      query: MAKE_GUESS,
      variables: {
        data: {
          gameId: id,
          latitude: 23.234,
          longitude: 11.123123,
          playerName: "Snidd",
        },
      },
    });

    expect(res.errors).toBe(undefined);
    expect(res.data?.makeGuess).toHaveProperties(["success"]);
  });
});
