import React, { useState } from "react";
import { mergeLeft, remove } from "ramda";
import { getOppositeDirection } from "../services/utils";

const Rules = ({ rules, setRules, tileTypes }) => {
  const [newRuleFormSelections, setNewRuleFormSelections] = useState({
    target: tileTypes[0],
    origin: tileTypes[0],
    direction: "LEFT",
    addSymmetricRule: true,
  });

  const addRule = (newRuleOptions) => {
    const newRules = newRuleOptions.addSymmetricRule
      ? [
          [
            newRuleOptions.origin,
            newRuleOptions.target,
            newRuleOptions.direction,
          ],
          [
            newRuleOptions.target,
            newRuleOptions.origin,
            getOppositeDirection(newRuleOptions.direction),
          ],
        ]
      : [
          [
            newRuleOptions.origin,
            newRuleOptions.target,
            newRuleOptions.direction,
          ],
        ];

    setRules([...rules, ...newRules]);
  };

  const removeRule = (ruleIndex) => {
    setRules(remove(ruleIndex, 1, rules));
  };

  return (
    <>
      <h2>Rules</h2>
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
      <div>
        <h3>Add a new rule</h3>
        <select
          value={newRuleFormSelections.target}
          onChange={(event) => {
            setNewRuleFormSelections(
              mergeLeft(
                {
                  target: event.target.value,
                },
                newRuleFormSelections
              )
            );
          }}
          name="target"
          id="new-rule-target-select"
        >
          {tileTypes.map((tile) => (
            <option key={tile} value={tile}>
              {tile}
            </option>
          ))}
        </select>
        <select
          value={newRuleFormSelections.direction}
          onChange={(event) => {
            setNewRuleFormSelections(
              mergeLeft(
                {
                  direction: event.target.value,
                },
                newRuleFormSelections
              )
            );
          }}
          name="direction"
          id="new-rule-direction-select"
        >
          <option value="LEFT">LEFT</option>
          <option value="RIGHT">RIGHT</option>
          <option value="UP">UP</option>
          <option value="DOWN">DOWN</option>
        </select>
        <select
          value={newRuleFormSelections.origin}
          onChange={(event) => {
            setNewRuleFormSelections(
              mergeLeft(
                {
                  origin: event.target.value,
                },
                newRuleFormSelections
              )
            );
          }}
          name="origin"
          id="new-rule-origin-select"
        >
          {tileTypes.map((tile) => (
            <option key={tile} value={tile}>
              {tile}
            </option>
          ))}
        </select>
        <button onClick={() => addRule(newRuleFormSelections)}>Add Rule</button>
        <input
          name="addSymmetricRule"
          type="checkbox"
          checked={newRuleFormSelections.addSymmetricRule}
          onChange={(event) => {
            setNewRuleFormSelections(
              mergeLeft(
                {
                  addSymmetricRule: event.target.checked,
                },
                newRuleFormSelections
              )
            );
          }}
        />
        <label htmlFor="addSymmetricRule">Add symmetric rule</label>
      </div>
    </>
  );
};

export default Rules;
