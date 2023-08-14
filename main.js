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

///// Generators

function generate2DArray(rows, columns) {
  const array2D = new Array(rows);
  for (let i = 0; i < rows; i++) {
    array2D[i] = new Array(columns);
  }
  return array2D;
}

function areNeighboring(locationA, locationB) {
  const dx = Math.abs(locationA[0] - locationB[0]);
  const dy = Math.abs(locationA[1] - locationB[1]);

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

// TODO this is actually broken
function areFacingEachOther(heading1, location1, heading2, location2, fieldOfViewAngle) {
  const headingToVector = {
    "North": [0, 1],
    "South": [0, -1],
    "East": [1, 0],
    "West": [-1, 0]
  };

  const vector1 = headingToVector[heading1];
  const vector2 = headingToVector[heading2];

  if (!vector1 || !vector2) {
    throw new Error("Invalid heading");
  }

  const dx = location2[0] - location1[0];
  const dy = location2[1] - location1[1];
  //const c = Math.sqrt(a ** 2 + b ** 2); // Pythagorean theorem

  const location1SideAngleRadians = Math.atan2(dy, dx);
  const location1SideAngleDegrees = location1SideAngleRadians * 180 / Math.PI;

  return location1SideAngleDegrees > (fieldOfViewAngle / 2);
}

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
const cannotFace = (a, b) => !a.isFacing(b, 90);

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
  new Desk('A', [0, 0], "North"),
  new Desk('B', [0, 1], "West"),
  new Desk('C', [1, 1], "South"),
  new Desk('D', [1, 0], "East"),
  // group 2
  new Desk('E', [0, 3], "North"),
  new Desk('F', [0, 4], "West"),
  new Desk('G', [1, 4], "South"),
  new Desk('H', [1, 3], "East"),
  // group 3
  new Desk('I', [3, 0], "North"),
  new Desk('J', [3, 1], "West"),
  new Desk('K', [4, 1], "South"),
  new Desk('L', [4, 0], "East"),
  // group 4
  new Desk('M', [3, 3], "North"),
  new Desk('N', [3, 4], "West"),
  new Desk('O', [4, 4], "South"),
  new Desk('P', [4, 3], "East"),
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
