import React from "react";

const RulesList = ({ rules, removeRule }) => {
  return (
    <ul>
      {rules.map(([origin, target, direction], ruleIndex) => {
        return (
          <li key={`${origin}.${target}.${direction}`}>
            {`${target} can be ${direction} from ${origin}`}
            <button onClick={() => removeRule(ruleIndex)}>X</button>
          </li>
        );
      })}
    </ul>
  );
};

export default RulesList;
