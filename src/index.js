import ReactDOM from "react-dom";
import React from "react";
import { constructMatrix } from "functional-game-utils";

import App from "./components/App";
import "./main.scss";

const height = 10;
const width = 10;
const initialGrid = constructMatrix(
  () => ({
    type: "EMPTY",
  }),
  { height, width }
);

ReactDOM.render(
  <App initialGrid={initialGrid} />,
  document.getElementById("root")
);
