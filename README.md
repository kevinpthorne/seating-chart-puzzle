# Seating Chart - A Puzzle

## Problem

You are an elementary school teacher and need to create a seating chart for your classroom. However, due to childish things, certain kids cannot sit next to one another. In extreme cases, some cannot even face each other.

## Approach

Rewrite the problem in to a Constraint-Satisfiability Problem (CSP). With some solver, feed in the domain (desks), variables (students), and constraints such as `cannotShare` (desks), `cannotNeighbor`, and `cannotFace`. Then let the solver do the magic.

## Current Implementation

This currently uses a modified [SolverJS class](https://github.com/johannesheesterman/SolverJS) that does naive backtracking to explore all combinations. Input data is statically defined in code.

### Data Model

Students are just `const studentNames: string[]`.

Desks have a unique `id`, `location: Point`, and `heading: Vector2`. The desk arrangement is defined as `const deskArrangement: Desk[]`.

`Point` and `Vector2` are trivally defined.

### Usage

After editing the `const`s at the end of `main.js`, run `node main.js`. Example output:
```log
placed Ethan - Entering again with Ethan->A
placed Olivia - Entering again with Ethan->A,Olivia->E
placed Liam - Entering again with Ethan->A,Olivia->E,Liam->C
placed Ava - Entering again with Ethan->A,Olivia->E,Liam->C,Ava->B
[...]
placed Grace - Entering again with Ethan->A,Olivia->E,Liam->C,Ava->B,Jackson->F,Emma->D,Noah->G,Sophia->H,Mason->I,Isabella->J,Alice->K,Bob->L,Charlie->M,David->N,Frank->O,Grace->P
yay
```
`yay` meaning a full solution was found. (There's a chance the output is missing the last student, but should be trivial to place given the rest.)

## Goals

- [x] Naive implementation
- [x] Fix `cannotFace` to do proper vector maths
- [ ] Test limits
- [ ] Allow User input for students, desk-layout (via web app)
- [ ] Publish web app
- [ ] Improve variable selection for CSP Solver?