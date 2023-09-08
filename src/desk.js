import { areFacingEachOther } from "./lib/math";

export default class Desk {
    constructor(id, location, heading) {
      this.id = id;
      this.location = location;
      this.heading = heading;
    }
    isFacingEachOther(otherDesk, fov) {
      return areFacingEachOther(
        this.heading,
        this.location,
        otherDesk.heading,
        otherDesk.location,
        fov
      );
    }
  }