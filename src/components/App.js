import { getDimensions, mapMatrix } from "functional-game-utils";
import { remove, mergeLeft } from "ramda";
import React, { useState } from "react";

import { startCollapseGrid } from "../services/waveFunctionCollapse";
import { getOppositeDirection, createRNG } from "../services/utils";

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

const Column = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
      }}
    >
      {children}
    </div>
  );
};

const App = ({ initialGrid, initialRng }) => {
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
  ]);
  const [newRuleFormSelections, setNewRuleFormSelections] = useState({
    target: tileTypes[0],
    origin: tileTypes[0],
    direction: "LEFT",
    addSymmetricRule: true,
  });
  const [rng, setRng] = useState(initialRng);
  const [newSeed, setNewSeed] = useState("");
  const [pickNewSeedAfterGeneration, setPickNewSeedAfterGeneration] = useState(
    true
  );
  const [seeds, setSeeds] = useState([]);

  const { width, height } = getDimensions(grid);

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

  const generateGrid = () => {
    const { grid: generatedGrid, success } = startCollapseGrid(
      grid,
      tileTypes,
      rules,
      rng.rng
    );

    if (success) {
      setStatus("SUCCEEDED");
    } else {
      setStatus("FAILED");
    }

    // track our last used seed
    setSeeds([rng.seed, ...seeds]);

    if (pickNewSeedAfterGeneration) {
      // create a new rng with an unspecified seed
      setRng(createRNG());
    } else {
      // re-seed the RNG with our current seed
      setRng(createRNG(rng.seed));
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
      {status !== "UNSTARTED" && (
        <p>{`${getStatusMessage(status)} with seed ${seeds[0]}`}</p>
      )}
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
          <h3>Previous seeds</h3>
          <ul>
            {seeds.map((seed, index) => (
              <li key={seeds.length - index}>{seed}</li>
            ))}
          </ul>
        </div>
      </Column>
      <p>
        This site was made while referencing{" "}
        <a href="https://robertheaton.com/2018/12/17/wavefunction-collapse-algorithm/">
          this excellent break down of the Wave Function Collapse algorithm
        </a>
        .
      </p>
    </>
  );
};

export default App;
