import React from "react";
import { getDimensions, mapMatrix } from "functional-game-utils";

const Grid = ({ tiles, renderTile }) => {
  const { width, height } = getDimensions(tiles);

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
        tiles
      )}
    </div>
  );
};

export default Grid;
