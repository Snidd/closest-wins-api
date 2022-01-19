import { Model, Types } from "mongoose";
import { Inject, Service } from "typedi";
import { Location, LocationDoc } from "./LocationModel";

@Service()
export class LocationService {
  constructor(
    @Inject("LOCATION") private readonly locations: Model<Location>
  ) {}

  async getAll(): Promise<LocationDoc[] | null> {
    return await this.locations.find();
  }

  async getById(id: Types.ObjectId): Promise<LocationDoc | null> {
    return await this.locations.findOne({ _id: id });
  }

  async createLocation(
    location: Partial<Location>
  ): Promise<LocationDoc | null> {
    const newLocation = new this.locations(location);
    return await newLocation.save();
  }

  async updateById(
    id: Types.ObjectId,
    location: Partial<Location>
  ): Promise<LocationDoc | null> {
    return this.locations.findByIdAndUpdate(id, location, {
      returnDocument: "after",
    });
  }
}
