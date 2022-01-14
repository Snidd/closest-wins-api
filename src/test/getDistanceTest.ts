import { getDistance } from "../graphql-server/lib/getDistance";

test("can calculate the meters between 1,1 & 2,2", () => {
  const distance = getDistance({ lat: 1, lng: 1 }, { lat: 2, lng: 2 });
  expect(distance).toBe(157401.56104583552);
});
