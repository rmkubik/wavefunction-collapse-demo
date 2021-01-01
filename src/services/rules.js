import {
  mapMatrix,
  getLocation,
  isLocationInBounds,
} from "functional-game-utils";
import {
  getDownLocation,
  getLeftLocation,
  getRightLocation,
  getUpLocation,
} from "./utils";

const areRulesEqual = (a, b) => {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
};

const removeDuplicateRules = (rules) => {
  const deDupedRules = [];

  rules.forEach((rule) => {
    if (
      deDupedRules.every((deDupedRule) => !areRulesEqual(deDupedRule, rule))
    ) {
      // If this rule is not in deDupedRules, add it
      deDupedRules.push(rule);
    }
  });

  return deDupedRules;
};

const createRule = (grid, originLocation) => (targetLocation, direction) => {
  const origin = getLocation(grid, originLocation);
  const target = getLocation(grid, targetLocation);

  return [origin.type, target.type, direction];
};

const createRulesFromGrid = (grid) => {
  const rules = [];

  // We're using mapMatrix as a forEachMatrix since
  // forEachMatrix doesn't exist yet
  mapMatrix((tile, location) => {
    const createRuleWithLocation = createRule(grid, location);

    const upLocation = getUpLocation(location);
    if (isLocationInBounds(grid, upLocation)) {
      rules.push(createRuleWithLocation(upLocation, "UP"));
    }

    const downLocation = getDownLocation(location);
    if (isLocationInBounds(grid, downLocation)) {
      rules.push(createRuleWithLocation(downLocation, "DOWN"));
    }

    const leftLocation = getLeftLocation(location);
    if (isLocationInBounds(grid, leftLocation)) {
      rules.push(createRuleWithLocation(leftLocation, "LEFT"));
    }

    const rightLocation = getRightLocation(location);
    if (isLocationInBounds(grid, rightLocation)) {
      rules.push(createRuleWithLocation(rightLocation, "RIGHT"));
    }
  }, grid);

  const deDupedRules = removeDuplicateRules(rules);
  const noEmptyRules = deDupedRules.filter(([origin, target]) => {
    return origin !== "EMPTY" && target !== "EMPTY";
  });

  return noEmptyRules;
};

export { areRulesEqual, removeDuplicateRules, createRulesFromGrid };
