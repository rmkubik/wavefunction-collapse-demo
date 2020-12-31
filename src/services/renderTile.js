const renderTile = ({ type }) => {
  if (type === "EMPTY") return ".";
  if (type === "TREE") return "🌲";
  if (type === "BEACH") return "🏖";
  if (type === "OCEAN") return "🌊";
};

export default renderTile;
