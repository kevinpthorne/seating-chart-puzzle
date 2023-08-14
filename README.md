# Seating Chart - A Puzzle

## Problem

You are an elementary school teacher and need to create a seating chart for your classroom.
However, due to childish things, certain kids cannot sit next to one another. In extreme
cases, some cannot even face each other.

## Approach

Rewrite the problem in to a Constraint-Satisfiability Problem (CSP). With some solver, feed
in the domain (desks), variables (students), and constraints such as `cannotShare` (desks), 
`cannotNeighbor`, and `cannotFace`. Then let the solver do the magic. This currently uses a 
modified [SolverJS class](https://github.com/johannesheesterman/SolverJS) that does simple 
backtracking to explore all combinations.

WIP