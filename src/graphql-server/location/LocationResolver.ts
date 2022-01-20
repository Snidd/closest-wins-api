import { LocationService } from "@db/location/LocationService";
import { Service, Inject } from "typedi";
import { Query, Resolver } from "type-graphql";
import LocationSchema from "./LocationSchema";
import { LocationDoc } from "@db/location/LocationModel";

@Resolver(LocationSchema)
@Service()
export class LocationResolver {
  @Inject()
  locationService: LocationService;

  @Query(() => [LocationSchema])
  async locations(): Promise<LocationDoc[] | null> {
    const locations = await this.locationService.getAll();
    return locations === null ? [] : locations;
  }
}
