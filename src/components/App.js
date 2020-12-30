import { getDimensions, mapMatrix } from "functional-game-utils";
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
    // ["TREE", "BEACH", "RIGHT"],
    // ["BEACH", "TREE", "LEFT"],
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

  const { width, height } = getDimensions(grid);

  const generateGrid = () => {
    const { grid: generatedGrid, success } = startCollapseGrid(
      grid,
      tileTypes,
      rules
    );

    if (success) {
      setStatus("SUCCESS");
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
        {rules.map(([origin, target, direction]) => {
          return (
            <li
              key={`${origin}.${target}.${direction}`}
            >{`${target} can be ${direction} from ${origin}`}</li>
          );
        })}
      </ul>
    </>
  );
};

export default App;
