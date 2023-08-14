// SolverJS
// https://github.com/johannesheesterman/SolverJS

function prettyPrintAV(avs) {
  let assignments = avs.map((av) => `${av._name}->${av.value.id}`);
  return assignments.join(',');
}

class Solver {

  constructor() {
    this._variables = [];
    this._constraints = [];
  }

  newDomain(...values) {
    return new Domain(values);
  }

  newVariable(name, domain) {
    let newVariable = new Variable(name, domain);
    this._variables.push(newVariable);
    return newVariable;
  }

  newConstraint(expression, ...variables) {
    let newConstraint = new Constraint(expression, variables);
    this._constraints.push(newConstraint);
    return newConstraint;
  }

  solve() {
    this._assignedVariables = [];
    return this.backtrack();
  }

  backtrack() {
    if (this._assignedVariables.length == this._variables.length) { return true; } // Assignment is completed.

    // Select unassigned variable. 
    // TODO: Variable selection should be optimized.       
    let variable = this._variables.find(v => !this._assignedVariables.some(av => av == v));
    let correspondingConstraints = this._constraints.filter(c =>
      c._variables.indexOf(variable) !== -1 &&
      c._variables.filter(v => v != variable).every(v => this._assignedVariables.indexOf(v) !== -1));

    for (let i = 0; i < variable._domain._values.length; i++) {
      variable.value = variable._domain._values[i];
      if (correspondingConstraints.every(c => c.invoke())) {
        this._assignedVariables.push(variable);
        console.log('placed', variable._name, '- Entering again with', prettyPrintAV(this._assignedVariables));
        let result = this.backtrack();
        if (result) {
          return true;
        } else {
          return false;
        }
      }
    }
    this._assignedVariables = this._assignedVariables.filter(av => av == variable);
    console.log('could not place', variable._name);
    return false;
  }

}

class Domain {
  constructor(values) {
    this._values = values;
  }
}

class Variable {
  constructor(name, domain) {
    this._name = name;
    this._domain = domain;
    this.value = this._domain._values[0];
  }
}

class Constraint {
  constructor(expression, variables) {
    this._variables = variables;
    this._expression = expression;
  }

  invoke() {
    return this._expression(...this._variables.map(v => v.value));
  }
}

// Maths

function areNeighboring(locationA, locationB) {
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

class Point {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
}
class Vector2 {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
}

function magnitude(vector2) {
  return Math.sqrt(vector2.x ** 2 + vector2.y ** 2);
}
function dotProduct(vector2A, vector2B) {
  return vector2A.x*vector2B.x + vector2A.y*vector2B.y;
}
function toDegrees(radians) {
  return radians * 180 / Math.PI;
}
function angleBetween(vector2A, vector2B) {
  const magU = magnitude(vector2A);
  const magV = magnitude(vector2B);
  const dproduct = dotProduct(vector2A, vector2B);

  return Math.acos(dproduct / (magU * magV)); // radians
}


function areFacingEachOther(heading1, location1, heading2, location2, fieldOfViewInDegrees) {
  // super official formula: https://youtu.be/dYPRYO8QhxU?t=51

  //side 1
  const dx1 = location2.x - location1.x;
  const dy1 = location2.y - location1.y;

  const v1 = new Vector2(dx1, dy1);
  const location1Angle = toDegrees(angleBetween(heading1, v1));

  //side 2
  const dx2 = location1.x - location2.x;
  const dy2 = location1.y - location2.y;

  const v2 = new Vector2(dx2, dy2);
  const location2Angle = toDegrees(angleBetween(heading2, v2));

  return location1Angle < (fieldOfViewInDegrees / 2) && location2Angle < (fieldOfViewInDegrees / 2);
}

const NORTH = new Vector2(0, 1);
const SOUTH = new Vector2(0, -1);
const EAST = new Vector2(1, 0);
const WEST = new Vector2(-1, 0);


function acceptAllPairs(array, visit) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i; j < array.length; j++) {
      if (i !== j) {
        visit(array[i], array[j]);
      }
    }
  }
}

//// Problem space

class Desk {
  constructor(id, location, heading) {
    this.id = id;
    this.location = location;
    this.heading = heading;
  }
  isFacing(otherDesk, fov) {
    return areFacingEachOther(
      this.heading,
      this.location,
      otherDesk.heading,
      otherDesk.location,
      fov
    );
  }
}

// constraints

const cannotShare = (a, b) => a.id != b.id;
const cannotNeighbor = (a, b) => !areNeighboring(a.location, b.location);
const cannotFace = (a, b) => !a.isFacing(b, 150) && cannotNeighbor(a,b);

// Input


const studentNames = [
  "Ethan",
  "Olivia",
  "Liam",
  "Ava",
  "Jackson",
  "Emma",
  "Noah",
  "Sophia",
  "Mason",
  "Isabella",
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Frank",
  "Grace",
];
const deskArrangement = [
  new Desk('A', new Point(0, 0), NORTH),
  new Desk('B', new Point(0, 1), WEST),
  new Desk('C', new Point(1, 1), SOUTH),
  new Desk('D', new Point(1, 0), EAST),
  // group 2
  new Desk('E', new Point(0, 3), NORTH),
  new Desk('F', new Point(0, 4), WEST),
  new Desk('G', new Point(1, 4), SOUTH),
  new Desk('H', new Point(1, 3), EAST),
  // group 3
  new Desk('I', new Point(3, 0), NORTH),
  new Desk('J', new Point(3, 1), WEST),
  new Desk('K', new Point(4, 1), SOUTH),
  new Desk('L', new Point(4, 0), EAST),
  // group 4
  new Desk('M', new Point(3, 3), NORTH),
  new Desk('N', new Point(3, 4), WEST),
  new Desk('O', new Point(4, 4), SOUTH),
  new Desk('P', new Point(4, 3), EAST),
];


var solver = new Solver();
/* console.log(areNeighboring(deskArrangement[0].location, deskArrangement[1].location)); // true */
/* console.log(areNeighboring(deskArrangement[0].location, deskArrangement[4].location)); // false */
/* console.log(deskArrangement[0].isFacing(deskArrangement[6], 90)); // true */
let deskDomain = solver.newDomain(...deskArrangement);
let vars = {};
for (let name of studentNames) {
  vars[name] = solver.newVariable(name, deskDomain);
}

acceptAllPairs(Object.values(vars), (a, b) => solver.newConstraint(cannotShare, a, b));
solver.newConstraint(cannotNeighbor, vars['Ethan'], vars['Olivia']);
solver.newConstraint(cannotNeighbor, vars['Ethan'], vars['Jackson']);
solver.newConstraint(cannotNeighbor, vars['Jackson'], vars['Emma']);
solver.newConstraint(cannotFace, vars['Ethan'], vars['Liam']);

let result = solver.solve();

if (result) {
  console.log('yay');
} else {
  console.log('no solution');
}
