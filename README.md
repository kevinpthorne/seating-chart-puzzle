# Seating Chart - A Puzzle

## Problem

You are an elementary school teacher and need to create a seating chart for your classroom. However, due to childish things, certain kids cannot sit next to one another. In extreme cases, some cannot even face each other.

## Approach

Rewrite the problem in to a Constraint-Satisfiability Problem (CSP). With some solver, feed in the domain (desks), variables (students), and constraints such as `cannotShare` (desks), `cannotNeighbor`, and `cannotFace`. Then let the solver do the magic.

## Current Implementation

This currently uses a modified [SolverJS class](https://github.com/johannesheesterman/SolverJS) that does naive backtracking to explore all combinations. Input data is statically defined in code.

## Goals

- [x] Naive implementation
- [ ] Fix `cannotFace` to do proper vector maths
- [ ] Test limits
- [ ] Allow User input for students, desk-layout (via web app)
- [ ] Publish web app
- [ ] Improve variable selection for CSP Solver?