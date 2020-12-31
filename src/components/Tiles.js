import React from "react";

const Tiles = ({ tileTypes, setTileTypes, renderTile }) => {
  return (
    <>
      <h2>Tiles</h2>
      <ul>
        {tileTypes.map((type) => (
          <li key={type}>{`${type} - ${renderTile({ type })}`}</li>
        ))}
      </ul>
    </>
  );
};

export default Tiles;
