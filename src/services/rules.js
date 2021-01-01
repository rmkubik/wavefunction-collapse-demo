const createRulesFromGrid = (grid) => {};

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

export { areRulesEqual, removeDuplicateRules, createRulesFromGrid };
