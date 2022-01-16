import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema } from "type-graphql";
import { resolvers } from "@graphql/resolvers";
import Container from "typedi";
import { GameModel } from "@db/Game/GameModel";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
import { GuessModel } from "@db/Guess/GuessModel";
import { connect, disconnect } from "@db/connect";

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

  try {
    // connect with mongoose
    await connect();

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
  } finally {
    disconnect();
  }
}

startServer();
