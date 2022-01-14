import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema } from "type-graphql";
import * as Mongoose from "mongoose";
import { resolvers } from "./resolvers";
import Container from "typedi";
import { GameModel } from "./GameService/GameModel";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { GuessModel } from "./GuessService/GuessModel";

Container.set({ id: "GAME", factory: () => GameModel });
Container.set({ id: "GUESS", factory: () => GuessModel });

async function startServer() {
  require("dotenv").config(__dirname + ".env");

  const schema = await buildSchema({
    resolvers: resolvers,
    emitSchemaFile: true,
    container: Container,
  });

  const app = Express();
  const httpServer = createServer(app);
  //const MONGO_USER = process.env.MONGODB_USER;
  //const MONGO_PASS = process.env.MONGODB_PASS;
  const MONGO_SERVER_URI = process.env.MONGO_SERVER_URI;

  //mongodb://username:password@host:port/database
  //${MONGO_USER}:${MONGO_PASS}
  try {
    await Mongoose.connect(`${MONGO_SERVER_URI}`);
    console.log("Mongodb is connected successfully");

    const subscriptionServer = SubscriptionServer.create(
      { schema, execute, subscribe },
      { server: httpServer, path: "/graphql" }
    );

    const server = new ApolloServer({
      schema,
      context: () => ({}),
      plugins: [
        {
          async serverWillStart() {
            return {
              async drainServer() {
                subscriptionServer.close();
              },
            };
          },
        },
      ],
    });

    await server.start();
    server.applyMiddleware({ app });
    const PORT = process.env.PORT;
    httpServer.listen(PORT, () => {
      console.log(`server is running on PORT ${PORT}`);
    });
  } catch (ex) {
    console.log(ex);
  }
}

startServer();
