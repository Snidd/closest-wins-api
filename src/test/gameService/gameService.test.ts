import { Game, GameModel, schema } from "@db/Game/GameModel";
import { GameService } from "@db/Game/GameService";
import { model } from "mongoose";
import { clearDatabase, closeDatabase, openDatabase } from "../environment/db";

describe("Test gameService", () => {
  beforeAll(async () => await openDatabase());
  afterAll(async () => await closeDatabase());
  afterEach(async () => await clearDatabase());

  test("can instanciate gameService", () => {
    const model = GameModel;
    const gameService = new GameService(model);
    expect(gameService).toBeDefined();
  });

  test("can create simple gameDoc", async () => {
    const gameModel = model<Game>("Game", schema);

    const gameService = new GameService(gameModel);
    const newGame: Partial<Game> = {
      maxTimer: 30,
      adminKey: "TEST",
      shorthand: "TEST",
    };
    const gameDoc = await gameService.createGame(newGame);
    expect(gameDoc).not.toBe(null);
  });
});
