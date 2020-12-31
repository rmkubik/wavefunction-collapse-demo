import React from "react";
import { createRNG } from "../services/utils";

const History = ({ history, generateGrid }) => {
  return (
    <>
      <h2>Generation History</h2>
      <ul>
        {history.map(({ seed, success }, index) => (
          <li key={history.length - index}>
            {`${seed} - ${success ? "succeeded" : "failed"} - `}
            <button
              onClick={() => {
                const newRng = createRNG(seed);
                generateGrid(newRng);
              }}
            >
              Re-generate
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default History;
