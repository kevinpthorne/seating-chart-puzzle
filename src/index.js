import Solver from './lib/solver';
import { Point, acceptAllPairs } from './lib/math';
import * as dir from './lib/directions';
import * as constraints from './constraints';
import Desk from './desk';

let studentNames = [];
/*  "Ethan",
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
];*/
const deskArrangement = [
  new Desk('A', new Point(0, 0), dir.NORTH),
  new Desk('B', new Point(0, 1), dir.WEST),
  new Desk('C', new Point(1, 1), dir.SOUTH),
  new Desk('D', new Point(1, 0), dir.EAST),
  // group 2
  new Desk('E', new Point(0, 3), dir.NORTH),
  new Desk('F', new Point(0, 4), dir.WEST),
  new Desk('G', new Point(1, 4), dir.SOUTH),
  new Desk('H', new Point(1, 3), dir.EAST),
  // group 3
  new Desk('I', new Point(3, 0), dir.NORTH),
  new Desk('J', new Point(3, 1), dir.WEST),
  new Desk('K', new Point(4, 1), dir.SOUTH),
  new Desk('L', new Point(4, 0), dir.EAST),
  // group 4
  new Desk('M', new Point(3, 3), dir.NORTH),
  new Desk('N', new Point(3, 4), dir.WEST),
  new Desk('O', new Point(4, 4), dir.SOUTH),
  new Desk('P', new Point(4, 3), dir.EAST),
];

const rules = [
  // new constraints.SimpleRule("cannotNeighbor", "Ethan", "Olivia"),
  // new constraints.SimpleRule("cannotNeighbor", "Ethan", "Jackson"),
  // new constraints.SimpleRule("cannotNeighbor", "Jackson", "Emma"),
  // new constraints.SimpleRule("cannotFace", "Ethan", "Liam"),
  new constraints.SimpleRule("cannotNeighbor", "test", "test2"),
];

function solve(studentNames, deskArrangement, rules, noSharing = true) {
  var solver = new Solver();

  let deskDomain = solver.newDomain(...deskArrangement);
  let vars = {};
  for (let name of studentNames) {
    vars[name] = solver.newVariable(name, deskDomain);
  }

  if (noSharing) {
    acceptAllPairs(Object.values(vars), (a, b) => solver.newConstraint(constraints.cannotShare, a, b));
  }
  for (let rule of rules) {
    solver.newConstraint(rule.constraint, ...(rule.variables().map((name) => vars[name])));
  }

  let result = solver.solve();

  if (result) {
    console.log('yay');
    console.log(solver._assignedVariables);
    return solver._assignedVariables;
  } else {
    console.log('no solution');
  }
}

function hookUi() {
  const names = document.getElementById("names");
  names.addEventListener("input", function() {
    studentNames = this.value.split("\n");
    console.log(studentNames);
  });
  names.dispatchEvent(new Event('input'));

  document.getElementById("solveBtn").addEventListener("click", () => solve(studentNames, deskArrangement, rules));
}

hookUi();


