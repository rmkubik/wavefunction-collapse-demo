import { getDimensions, mapMatrix, getLocation } from "functional-game-utils";

import {
  getUpLocation,
  getDownLocation,
  getRightLocation,
  getLeftLocation,
  pickRandomlyFromArray,
  mutateLocation,
} from "./utils";

const startCollapseGrid = (grid, tileTypes, rules) => {
  const defaultOptions = mapMatrix(() => [], grid);

  return collapseGrid(defaultOptions, tileTypes, rules);
};

const evaluateCellOptions = (grid, location, rules, tileTypes) => {};

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

const collapseGrid = (grid, tileTypes, rules) => {
  const location = pickRandomUncollapsedLocation(grid);

  if (location?.finished) {
    return grid;
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
  // we need to handle this rules application to every other tile
  // that we adjust with these rules as well
  applyRules(chosenOption, location, grid, rules);

  return collapseGrid(grid, tileTypes, rules);
};

const pickRandomUncollapsedLocation = (optionsGrid) => {
  const allLocations = mapMatrix((_, location) => location, optionsGrid).flat();
  const unCollapsedLocations = allLocations.filter((location) => {
    return (
      getLocation(optionsGrid, location).length > 1 ||
      getLocation(optionsGrid, location).length === 0
    );
    // empty arrays represent a location that hasn't been analyzed yet
  });

  if (unCollapsedLocations.length === 0) {
    console.log("We have collapsed every location!");
    return { finished: true };
  }

  const location = pickRandomlyFromArray(unCollapsedLocations);

  return location;
};

export { startCollapseGrid };
