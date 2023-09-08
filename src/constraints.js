import { areNeighboring } from "./lib/math";

const STUDENT_FOV = 150;

// a, b are of type Desk
export const cannotShare = (a, b) => a.id != b.id;
export const cannotNeighbor = (a, b) => !areNeighboring(a.location, b.location);
export const cannotFace = (a, b) => !a.isFacingEachOther(b, STUDENT_FOV) && cannotNeighbor(a, b);

export const registry = {
    cannotShare,
    cannotNeighbor,
    cannotFace
};

export class SimpleRule {
    constructor(constraintName, source, target) {
        this.constraint = registry[constraintName];
        this.source = source;
        this.target = target;
    }
    variables() {
        return [this.source, this.target];
    }
}