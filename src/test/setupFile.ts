import { connect, disconnect } from "../graphql-server/db/connect";

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});
