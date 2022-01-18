import { ApolloServer, ExpressContext } from "apollo-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { buildSchema } from "type-graphql";
import { execute, subscribe } from "graphql";
import { resolvers } from "@graphql/resolvers";
import Container from "typedi";
import { Server } from "http";
import { GameModel } from "@db/game/GameModel";

export const createSchema = async () => {
  const schema = await buildSchema({
    resolvers: resolvers,
    emitSchemaFile: true,
    container: Container,
  });

  return schema;
};

export const createApolloServer = async (
  httpServer?: Server
): Promise<ApolloServer<ExpressContext>> => {
  Container.set({ id: "GAME", factory: () => GameModel });

  const schema = await createSchema();

  let plugin:
    | {
        serverWillStart(): Promise<{
          drainServer(): Promise<void>;
        }>;
      }
    | undefined = undefined;

  if (httpServer !== undefined) {
    const subscriptionServer = SubscriptionServer.create(
      { schema, execute, subscribe },
      { server: httpServer, path: "/graphql" }
    );

    plugin = {
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          },
        };
      },
    };
  }

  const server = new ApolloServer({
    schema,
    context: () => ({}),
    plugins: plugin !== undefined ? [plugin] : [],
  });

  return server;
};
