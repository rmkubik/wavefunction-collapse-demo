import { mapMatrix } from "functional-game-utils";
import React, { useState } from "react";

import { startCollapseGrid } from "../services/waveFunctionCollapse";
import { createRNG } from "../services/utils";
import Grid from "./Grid";
import Rules from "./Rules";
import Tiles from "./Tiles";
import renderTile from "../services/renderTile";
import Rng from "./Rng";
import History from "./History";

const getStatusMessage = (status) => {
  if (status === "UNSTARTED") return "";
  if (status === "GENERATING") return "Generating...";
  if (status === "SUCCEEDED") return "Succeeded!";
  if (status === "FAILED") return "Failed!";
};

const App = ({ initialGrid, initialRng }) => {
  // UNSTARTED, GENERATING, FAILED, SUCCEEDED
  const [status, setStatus] = useState("UNSTARTED");
  const [grid, setGrid] = useState(initialGrid);
  const [tileTypes, setTileTypes] = useState(["TREE", "BEACH", "OCEAN"]);
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
  ]);
  const [rng, setRng] = useState(initialRng);
  const [pickNewSeedAfterGeneration, setPickNewSeedAfterGeneration] = useState(
    true
  );
  const [history, setHistory] = useState([]);
  const [iterationCutOff, setIterationCutOff] = useState(100);

  const generateGrid = (chosenRng) => {
    const { grid: generatedGrid, success } = startCollapseGrid(
      grid,
      tileTypes,
      rules,
      chosenRng.rng,
      iterationCutOff
    );

    if (success) {
      setStatus("SUCCEEDED");
    } else {
      setStatus("FAILED");
    }

    // track our last used seed
    setHistory([{ seed: chosenRng.seed, success }, ...history]);

    if (pickNewSeedAfterGeneration) {
      // create a new rng with an unspecified seed
      setRng(createRNG());
    } else {
      // re-seed the RNG with our current seed
      setRng(createRNG(chosenRng.seed));
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
      <Grid tiles={grid} renderTile={renderTile} />
      <button onClick={() => generateGrid(rng)}>Generate</button>
      <button
        onClick={() => {
          const newRng = createRNG(history[0].seed);
          generateGrid(newRng);
        }}
      >
        Re-generate
      </button>
      {status !== "UNSTARTED" && (
        <p>{`${getStatusMessage(status)} with seed ${history[0].seed}`}</p>
      )}
      <Tiles
        tileTypes={tileTypes}
        setTileTypes={setTileTypes}
        renderTile={renderTile}
      />
      <Rules rules={rules} setRules={setRules} tileTypes={tileTypes} />
      <h3>Iteration cut off count</h3>
      <input
        type="text"
        value={iterationCutOff}
        onChange={(event) => setIterationCutOff(event.target.value)}
      />
      <Rng
        rng={rng}
        setRng={setRng}
        pickNewSeedAfterGeneration={pickNewSeedAfterGeneration}
        setPickNewSeedAfterGeneration={setPickNewSeedAfterGeneration}
      />
      <History history={history} generateGrid={generateGrid} />
      <p>
        This site was made while referencing{" "}
        <a href="https://robertheaton.com/2018/12/17/wavefunction-collapse-algorithm/">
          this excellent break down of the Wave Function Collapse algorithm
        </a>{" "}
        by Robert Heaton.
      </p>
    </>
  );
};

export default App;
