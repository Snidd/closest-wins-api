import { ApolloServer, ExpressContext } from "apollo-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { buildSchema } from "type-graphql";
import { execute, subscribe } from "graphql";
import { resolvers } from "@graphql/resolvers";
import Container from "typedi";
import { Server } from "http";

export const createSchema = async () => {
  const schema = await buildSchema({
    resolvers: resolvers,
    emitSchemaFile: true,
    container: Container,
  });

  return schema;
};

export const createApolloServer = async (
  httpServer: Server
): Promise<ApolloServer<ExpressContext>> => {
  const schema = await createSchema();

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

  return server;
};
