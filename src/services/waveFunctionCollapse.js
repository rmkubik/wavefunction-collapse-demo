import {
  mapMatrix,
  getLocation,
  getNeighbors,
  getCrossDirections,
  isLocationInBounds,
  compareLocations,
} from "functional-game-utils";

import {
  getUpLocation,
  getDownLocation,
  getRightLocation,
  getLeftLocation,
  pickRandomlyFromArray,
  mutateLocation,
  intersectionMany,
} from "./utils";

const isLocationCollapsed = (grid, location) => {
  return getLocation(grid, location).length === 1;
};

const evaluateRuleInDirection = (
  originLocation,
  targetDirection,
  grid,
  rules,
  tileTypes
) => {
  if (!isLocationInBounds(grid, originLocation)) {
    // Treat out of bounds locations as permanent wild cards
    return [...tileTypes];
  }

  const possibleOptions = [];
  const originOptions = getLocation(grid, originLocation);

  rules.forEach((rule) => {
    const [origin, target, direction] = rule;

    originOptions.forEach((option) => {
      // Does this rule pertain to this neighbor
      // Is this rule's direction applying to our current cell
      if (origin === option && direction === targetDirection) {
        // Add this rule as a possible option for this current cell
        possibleOptions.push(target);
      }
    });
  });

  return possibleOptions;
};

const evaluateCellOptions = (grid, location, rules, tileTypes) => {
  const upLocation = getUpLocation(location);
  const upOptions = evaluateRuleInDirection(
    upLocation,
    "DOWN",
    grid,
    rules,
    tileTypes
  );

  const downLocation = getDownLocation(location);
  const downOptions = evaluateRuleInDirection(
    downLocation,
    "UP",
    grid,
    rules,
    tileTypes
  );

  const leftLocation = getLeftLocation(location);
  const leftOptions = evaluateRuleInDirection(
    leftLocation,
    "RIGHT",
    grid,
    rules,
    tileTypes
  );

  const rightLocation = getRightLocation(location);
  const rightOptions = evaluateRuleInDirection(
    rightLocation,
    "LEFT",
    grid,
    rules,
    tileTypes
  );

  return intersectionMany(upOptions, downOptions, leftOptions, rightOptions);
};

let iteration;

const startCollapseGrid = (
  grid,
  tileTypes,
  rules,
  rng,
  iterationCutOff = 100
) => {
  iteration = 0;

  const defaultOptions = mapMatrix(() => [...tileTypes], grid);

  return collapseGrid(defaultOptions, tileTypes, rules, rng, iterationCutOff);
};

const startRipple = (grid, location, rules, tileTypes) => {
  // start with neighbors of modified location
  const neighbors = getNeighbors(getCrossDirections, grid, location);

  return ripple(grid, rules, tileTypes, [...neighbors], [location]);
};

const ripple = (grid, rules, tileTypes, open = [], closed = []) => {
  if (open.length === 0) {
    // we have visited all opened cells, finished our floodfill
    return true;
  }

  // remove first item in open list
  const location = open.shift();

  if (!isLocationInBounds(grid, location)) {
    // we have reached the edge of the grid
    return true;
  }

  if (
    closed.some((closedLocation) => compareLocations(closedLocation, location))
  ) {
    // If we have already visited this location, do not perform any calculations
    return true;
  }

  // mark this node as visited
  closed.push(location);

  const neighbors = getNeighbors(getCrossDirections, grid, location)
    // Remove any neighbor that is already closed
    .filter((neighborLocation) =>
      closed.every(
        (closedLocation) => !compareLocations(closedLocation, neighborLocation)
      )
    )
    // Remove any neighbor that is already opened
    .filter((neighborLocation) =>
      open.every(
        (openLocation) => !compareLocations(openLocation, neighborLocation)
      )
    );

  // add all valid neighbors to the open list so we can visit them later
  open.push(...neighbors);

  // evaluate new options for this location
  const options = evaluateCellOptions(grid, location, rules, tileTypes);

  if (options.length === 0) {
    // we have reached an invalid waveform collapse pattern
    // we'll need to try again
    return false;
  }

  if (isLocationCollapsed(grid, location)) {
    // this location is already collapsed
    // if it's collapsed option is not a valid option
    // we should mark this generation as invalid, and return false
    const [collapsedOption] = getLocation(grid, location);
    if (!options.includes(collapsedOption)) {
      return false;
    }
  } else {
    // mutate the grid with the newly calculated options
    // we do not want to mutate already collapsed locations
    mutateLocation(grid, location, options);
  }

  return ripple(grid, rules, tileTypes, open, closed);
};

const collapseGrid = (grid, tileTypes, rules, rng, iterationCutOff) => {
  const location = pickLowestEntropyUncollapsedLocation(grid);

  if (location?.finished) {
    return { grid, success: true };
  }

  let options = getLocation(grid, location);

  if (options.length === 0) {
    // this is an unstarted tile, no rules have been applied to it yet
    // default to choosing any random tileType at all
    options = [...tileTypes];
  }

  const chosenOption = pickRandomlyFromArray(options, rng);

  mutateLocation(grid, location, [chosenOption]);

  // deal with ripples from this selection
  const didRippleSucceed = startRipple(grid, location, rules, tileTypes);

  iteration++;

  if (iteration > iterationCutOff) {
    console.error(`Reached iteration cut off value of ${iterationCutOff}`);
    return { grid, success: false };
  }

  if (!didRippleSucceed) {
    return { grid, success: false };
  }

  return collapseGrid(grid, tileTypes, rules, rng, iterationCutOff);
};

const evaluateTileEntropy = (tile) => {
  return tile.length;
};

const pickLowestEntropyUncollapsedLocation = (optionsGrid) => {
  const allLocations = mapMatrix((_, location) => location, optionsGrid).flat();
  const unCollapsedLocations = allLocations.filter(
    (location) => !isLocationCollapsed(optionsGrid, location)
  );

  if (unCollapsedLocations.length === 0) {
    return { finished: true };
  }

  // sort tiles by their entropy
  unCollapsedLocations.sort(
    (locationA, locationB) =>
      evaluateTileEntropy(getLocation(optionsGrid, locationA)) -
      evaluateTileEntropy(getLocation(optionsGrid, locationB))
  );

  // pick lowest entropy tile next
  const [location] = unCollapsedLocations;

  return location;
};

export { startCollapseGrid };
