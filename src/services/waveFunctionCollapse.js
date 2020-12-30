import {
  getDimensions,
  mapMatrix,
  getLocation,
  getNeighbors,
  getCrossDirections,
  isLocationInBounds,
  updateMatrix,
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
  rules
) => {
  const possibleOptions = [];

  if (isLocationInBounds(grid, originLocation)) {
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
  }

  return possibleOptions;
};

const evaluateCellOptions = (grid, location, rules) => {
  const upLocation = getUpLocation(location);
  const upOptions = evaluateRuleInDirection(upLocation, "DOWN", grid, rules);

  const downLocation = getUpLocation(location);
  const downOptions = evaluateRuleInDirection(downLocation, "UP", grid, rules);

  const leftLocation = getUpLocation(location);
  const leftOptions = evaluateRuleInDirection(
    leftLocation,
    "RIGHT",
    grid,
    rules
  );

  const rightLocation = getUpLocation(location);
  const rightOptions = evaluateRuleInDirection(
    rightLocation,
    "LEFT",
    grid,
    rules
  );

  return intersectionMany(upOptions, downOptions, leftOptions, rightOptions);
};

const startCollapseGrid = (grid, tileTypes, rules) => {
  const defaultOptions = mapMatrix(() => [...tileTypes], grid);

  return collapseGrid(defaultOptions, tileTypes, rules);
};

const applyRules = (chosenOption, location, grid, rules) => {
  const dimensions = getDimensions(grid);

  if (open.length === 0) {
    // finished applying rules ripple
    return;
  }

  rules.forEach(([originType, targetType, direction]) => {
    if (chosenOption === originType) {
      // this rule relates to our chosen option so let's apply it
      let targetLocation;

      switch (direction) {
        case "LEFT":
          targetLocation = getLeftLocation(location, dimensions);
          break;
        case "RIGHT":
          targetLocation = getRightLocation(location, dimensions);
          break;
        case "UP":
          targetLocation = getUpLocation(location, dimensions);
          break;
        case "DOWN":
          targetLocation = getDownLocation(location, dimensions);
          break;
      }

      // Add our option from this rule to any potential options already there
      const target = getLocation(grid, targetLocation);
      // console.log(JSON.parse(JSON.stringify({ target, targetLocation, rules })));
      if (target.length === 0) {
        // target is an unitialized node
        mutateLocation(grid, targetLocation, [...target, targetType]);
        applyRules(chosenOption, targetLocation, grid, rules);
      }
    }
  });
};

const ripple = (grid, location, rules, closed = []) => {
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

  const neighbors = getNeighbors(getCrossDirections, grid, location);

  neighbors.forEach((neighborLocation) => {
    const neighborOptions = evaluateCellOptions(grid, neighborLocation, rules);

    if (neighborOptions.length === 0) {
      console.log(JSON.parse(JSON.stringify({ grid, neighborLocation })));
      // we have reached an invalid waveform collapse pattern
      // we'll need to try again
      // console.log(
      //   `There was no valid option for the neighbor ${neighborLocation}`
      // );

      return false;
    }

    // mutate the grid with the newly calculated options
    mutateLocation(grid, neighborLocation, neighborOptions);

    return ripple(grid, neighborLocation, rules, closed);
  });
};

const collapseGrid = (grid, tileTypes, rules) => {
  const location = pickLowestEntropyUncollapsedLocation(grid);

  // console.log(JSON.parse(JSON.stringify(grid)));

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
  const didRippleSucceed = ripple(grid, location, rules);

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
