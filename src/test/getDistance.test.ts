import { getDistance } from "../graphql-server/lib/getDistance";

test("can calculate the meters between 1,1 & 2,2", () => {
  const distance = getDistance(
    { latitude: 1, longitude: 1 },
    { latitude: 2, longitude: 2 }
  );
  expect(distance).toBe(157401.56104583552);
});
