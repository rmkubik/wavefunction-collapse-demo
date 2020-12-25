import { getDimensions, mapMatrix } from "functional-game-utils";
import React from "react";

import { startCollapseGrid } from "../services/waveFunctionCollapse";

const renderTile = ({ type }) => {
  if (type === "EMPTY") return ".";
  if (type === "TREE") return "🌲";
  if (type === "BEACH") return "🏖";
  if (type === "OCEAN") return "🌊";
};

const App = ({ initialGrid }) => {
  const [grid, setGrid] = React.useState(initialGrid);
  const [tileTypes, setTileTypes] = React.useState(["TREE", "BEACH", "OCEAN"]);
  const [rules, setRules] = React.useState([
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
    ["OCEAN", "OCEAN", "RIGHT"],
    ["OCEAN", "OCEAN", "LEFT"],
    ["OCEAN", "OCEAN", "UP"],
    ["OCEAN", "OCEAN", "DOWN"],
    // ['TREE', 'BEACH', 'UP'],
    // ['BEACH', 'TREE', 'DOWN'],
    // ['TREE', 'BEACH', 'DOWN'],
    // ['BEACH', 'TREE', 'UP'],
    ["BEACH", "OCEAN", "RIGHT"],
    ["OCEAN", "BEACH", "LEFT"],
  ]);

  const { width, height } = getDimensions(grid);

  React.useEffect(() => {
    const generatedGrid = startCollapseGrid(grid, tileTypes, rules);
    const gridIcons = mapMatrix(([type]) => ({ type }), generatedGrid);

    setGrid(gridIcons);
  }, [tileTypes, rules]);

  return (
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
  );
};

export default App;
