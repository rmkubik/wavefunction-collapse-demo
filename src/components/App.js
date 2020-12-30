import { getDimensions, mapMatrix } from "functional-game-utils";
import { remove, mergeLeft } from "ramda";
import React, { useState } from "react";

import { startCollapseGrid } from "../services/waveFunctionCollapse";

const renderTile = ({ type }) => {
  if (type === "EMPTY") return ".";
  if (type === "TREE") return "🌲";
  if (type === "BEACH") return "🏖";
  if (type === "OCEAN") return "🌊";
};

const getStatusMessage = (status) => {
  if (status === "UNSTARTED") return "";
  if (status === "GENERATING") return "Generating...";
  if (status === "SUCCEEDED") return "Succeeded!";
  if (status === "FAILED") return "Failed!";
};

const App = ({ initialGrid }) => {
  // UNSTARTED, GENERATING, FAILED, SUCCEEDED
  const [status, setStatus] = useState("UNSTARTED");
  const [grid, setGrid] = useState(initialGrid);
  const [tileTypes, setTileTypes] = useState(["TREE", "BEACH"]);
  const [rules, setRules] = useState([
    ["TREE", "BEACH", "RIGHT"],
    ["BEACH", "TREE", "LEFT"],
    ["TREE", "TREE", "RIGHT"],
    ["TREE", "TREE", "LEFT"],
    ["TREE", "TREE", "UP"],
    ["TREE", "TREE", "DOWN"],
    ["BEACH", "BEACH", "RIGHT"],
    ["BEACH", "BEACH", "LEFT"],
    ["BEACH", "BEACH", "UP"],
    ["BEACH", "BEACH", "DOWN"],
    // ["OCEAN", "OCEAN", "RIGHT"],
    // ["OCEAN", "OCEAN", "LEFT"],
    // ["OCEAN", "OCEAN", "UP"],
    // ["OCEAN", "OCEAN", "DOWN"],
    // ['TREE', 'BEACH', 'UP'],
    // ['BEACH', 'TREE', 'DOWN'],
    // ['TREE', 'BEACH', 'DOWN'],
    // ['BEACH', 'TREE', 'UP'],
    // ["BEACH", "OCEAN", "RIGHT"],
    // ["OCEAN", "BEACH", "LEFT"],
  ]);
  const [newRuleFormSelections, setNewRuleFormSelections] = useState({
    target: tileTypes[0],
    origin: tileTypes[0],
    direction: "LEFT",
  });

  const { width, height } = getDimensions(grid);

  const addRule = (newRuleOptions) => {
    setRules([
      ...rules,
      [newRuleOptions.origin, newRuleOptions.target, newRuleOptions.direction],
    ]);
  };

  const removeRule = (ruleIndex) => {
    setRules(remove(ruleIndex, 1, rules));
  };

  const generateGrid = () => {
    const { grid: generatedGrid, success } = startCollapseGrid(
      grid,
      tileTypes,
      rules
    );

    if (success) {
      setStatus("SUCCEEDED");
    } else {
      setStatus("FAILED");
    }

    const gridIcons = mapMatrix((options) => {
      if (options.length > 1) {
        return { type: "EMPTY" };
      }

      return { type: options[0] };
    }, generatedGrid);

    setGrid(gridIcons);
  };

  return (
    <>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `1.5em `.repeat(width),
          gridTemplateRows: `1.5em `.repeat(height),
        }}
      >
        {mapMatrix(
          (tile, { row, col }) => (
            <div key={`${row}.${col}`}>{renderTile(tile)}</div>
          ),
          grid
        )}
      </div>
      <button onClick={generateGrid}>Generate</button>
      <p>{getStatusMessage(status)}</p>
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
      </div>
    </>
  );
};

export default App;
