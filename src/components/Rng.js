import React, { useState } from "react";

import { createRNG } from "../services/utils";
import Column from "./Column";

const Rng = ({
  rng,
  setRng,
  pickNewSeedAfterGeneration,
  setPickNewSeedAfterGeneration,
}) => {
  const [newSeed, setNewSeed] = useState("");

  return (
    <Column>
      <h2>RNG &amp; Seeding</h2>
      <Column>
        <h3>Current seed</h3>
        <div>
          <input type="text" value={rng.seed} disabled />
          <button onClick={() => setRng(createRNG())}>{"\u27f3"}</button>
        </div>
      </Column>
      <h3>Set a new seed</h3>
      <input
        type="text"
        value={newSeed}
        onChange={(event) => setNewSeed(event.target.value)}
      />
      <button onClick={() => setRng(createRNG(newSeed))}>Set Seed</button>
      <br />
      <div>
        <input
          name="pickNewSeedAfterGeneration"
          type="checkbox"
          checked={pickNewSeedAfterGeneration}
          onChange={(event) => {
            setPickNewSeedAfterGeneration(event.target.checked);
          }}
        />
        <label htmlFor="pickNewSeedAfterGeneration">
          Pick new seed automatically after generation
        </label>
      </div>
    </Column>
  );
};

export default Rng;
