import React, { useState } from "react";
import { constructMatrix, updateMatrix } from "functional-game-utils";

import { createRulesFromGrid } from "../../services/rules";
import renderTile from "../../services/renderTile";
import Grid from "../Grid";
import Row from "../Row";

const height = 10;
const width = 10;
const initialTiles = constructMatrix(
  () => ({
    type: "EMPTY",
  }),
  { height, width }
);

const renderTileWithClickable = (updateTile) => (tile, location) => {
  return (
    <div
      style={{
        cursor: "pointer",
      }}
      onClick={() => {
        updateTile(location);
      }}
    >
      {renderTile(tile)}
    </div>
  );
};

const GridPainter = ({ tileTypes }) => {
  const [tiles, setTiles] = useState(initialTiles);
  const [selected, setSelected] = useState(tileTypes[0]);

  const updateTile = (location) => {
    setTiles(updateMatrix(location, { type: selected }, tiles));
  };

  return (
    <Row>
      <Grid tiles={tiles} renderTile={renderTileWithClickable(updateTile)} />
      <div>
        <h4>Tiles</h4>
        <ul>
          {tileTypes.map((type) => (
            <li key={type}>
              <input
                type="checkbox"
                checked={type === selected}
                onChange={() => setSelected(type)}
              ></input>
              {`${type} - ${renderTile({ type })}`}
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            console.log(createRulesFromGrid(tiles));
          }}
        >
          Create Rules
        </button>
      </div>
    </Row>
  );
};

export default GridPainter;
