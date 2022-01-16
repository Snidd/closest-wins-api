import "reflect-metadata";
import * as Express from "express";
import Container from "typedi";
import { GameModel } from "@app/db-service/game/GameModel";
import { createServer } from "http";
import { GuessModel } from "@app/db-service/guess/GuessModel";
import { connect } from "@db/connect";
import { createApolloServer } from "./graphql-server/createServer";

Container.set({ id: "GAME", factory: () => GameModel });
Container.set({ id: "GUESS", factory: () => GuessModel });

async function startServer() {
  require("dotenv").config(__dirname + ".env");

  const app = Express();
  const httpServer = createServer(app);

  try {
    // connect with mongoose
    await connect();

    console.log("Mongodb is connected successfully");

    const server = await createApolloServer(httpServer);
    await server.start();
    server.applyMiddleware({ app });
    const PORT = process.env.PORT;
    httpServer.listen(PORT, () => {
      console.log(`server is running on PORT ${PORT}`);
    });
  } catch (ex) {
    console.log(ex);
  } finally {
    //disconnect();
  }
}

startServer();
