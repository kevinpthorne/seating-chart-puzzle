// Maths

export function areNeighboring(locationA, locationB) {
    const dx = Math.abs(locationA.x - locationB.x);
    const dy = Math.abs(locationA.y - locationB.y);

    // Check if the locations are within 1 unit of each other
    if (dx <= 1 && dy <= 1) {
        return true;
    }

    // Check if the locations are diagonally touching
    if (dx === 1 && dy === 1) {
        return true;
    }

    return false;
}

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export function magnitude(vector2) {
    return Math.sqrt(vector2.x ** 2 + vector2.y ** 2);
}
export function dotProduct(vector2A, vector2B) {
    return vector2A.x * vector2B.x + vector2A.y * vector2B.y;
}
export function toDegrees(radians) {
    return radians * 180 / Math.PI;
}
export function angleBetween(vector2A, vector2B) {
    const magU = magnitude(vector2A);
    const magV = magnitude(vector2B);
    const dproduct = dotProduct(vector2A, vector2B);

    return Math.acos(dproduct / (magU * magV)); // radians
}

export function areFacingEachOther(heading1, location1, heading2, location2, fieldOfViewInDegrees) {
    return isFacing(heading1, location1, location2, fieldOfViewInDegrees) && isFacing(heading2, location2, location1, fieldOfViewInDegrees);
}

export function isFacing(heading1, location1, location2, fieldOfViewInDegrees) {
    // super official formula: https://youtu.be/dYPRYO8QhxU?t=51
    const dx1 = location2.x - location1.x;
    const dy1 = location2.y - location1.y;
    const v1 = new Vector2(dx1, dy1);
    const angle = toDegrees(angleBetween(heading1, v1));
    return angle < (fieldOfViewInDegrees / 2);
}

export function acceptAllPairs(array, visit) {
    for (let i = 0; i < array.length; i++) {
        for (let j = i; j < array.length; j++) {
            if (i !== j) {
                visit(array[i], array[j]);
            }
        }
    }
}