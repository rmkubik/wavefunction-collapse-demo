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

const startCollapseGrid = (grid, tileTypes, rules) => {
  const defaultOptions = mapMatrix(() => [...tileTypes], grid);

  return collapseGrid(defaultOptions, tileTypes, rules);
};

const ripple = (grid, location, rules, tileTypes, closed = []) => {
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
    );

  for (const neighborLocation of neighbors) {
    const neighborOptions = evaluateCellOptions(
      grid,
      neighborLocation,
      rules,
      tileTypes
    );

    if (neighborOptions.length === 0) {
      // we have reached an invalid waveform collapse pattern
      // we'll need to try again
      return false;
    }

    // mutate the grid with the newly calculated options
    mutateLocation(grid, neighborLocation, neighborOptions);

    return ripple(grid, neighborLocation, rules, tileTypes, closed);
  }

  // If we reach this point then we have no open neighbors
  return true;
};

const collapseGrid = (grid, tileTypes, rules) => {
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

  const chosenOption = pickRandomlyFromArray(options);

  mutateLocation(grid, location, [chosenOption]);

  // deal with ripples from this selection
  const didRippleSucceed = ripple(grid, location, rules, tileTypes);

  if (!didRippleSucceed) {
    return { grid, success: false };
  }

  return collapseGrid(grid, tileTypes, rules);
};

const evaluateTileEntropy = (tile) => {
  return tile.length;
};

const pickLowestEntropyUncollapsedLocation = (optionsGrid) => {
  const allLocations = mapMatrix((_, location) => location, optionsGrid).flat();
  const unCollapsedLocations = allLocations.filter((location) => {
    return getLocation(optionsGrid, location).length > 1;
  });

  if (unCollapsedLocations.length === 0) {
    console.log("We have collapsed every location!");
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
