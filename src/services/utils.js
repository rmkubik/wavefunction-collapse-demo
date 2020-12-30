import seedRandom from "seedrandom";
import { intersection } from "ramda";

const intBetweenExclusive = (low, high, rng) => {
  return Math.floor(rng() * (high - low)) + low;
};

const pickRandomLocation = (matrix, rng) => {
  const dimensions = getDimensions(matrix);

  return {
    row: intBetweenExclusive(0, dimensions.height, rng),
    col: intBetweenExclusive(0, dimensions.width, rng),
  };
};

const mutateLocation = (matrix, location, value) => {
  matrix[location.row][location.col] = value;
};

function pickRandomlyFromArray(array, rng) {
  return array[Math.floor(rng() * array.length)];
}

const getLeftLocation = (location) => {
  return {
    row: location.row,
    col: location.col - 1,
  };
};

const getRightLocation = (location, dimensions) => {
  return {
    row: location.row,
    col: location.col + 1,
  };
};

const getUpLocation = (location) => {
  return {
    row: location.row - 1,
    col: location.col,
  };
};

const getDownLocation = (location, dimensions) => {
  return {
    row: location.row + 1,
    col: location.col,
  };
};

const getOppositeDirection = (direction) => {
  if (direction === "LEFT") return "RIGHT";
  if (direction === "RIGHT") return "LEFT";
  if (direction === "UP") return "DOWN";
  if (direction === "DOWN") return "UP";
};

const intersectionMany = (...arrays) =>
  arrays.reduce((currentIntersection, array) => {
    return intersection(currentIntersection, array);
  });

// randomly generate a default seed if one is not provided
const createRNG = (seed = seedRandom()()) => {
  // Always treat seeds as strings to disambiguate between a user
  // copy a float type seed and it being treated as a string on paste.
  const stringifiedSeed = seed.toString();

  return { seed: stringifiedSeed, rng: seedRandom(stringifiedSeed) };
};

export {
  getLeftLocation,
  getRightLocation,
  getUpLocation,
  getDownLocation,
  pickRandomLocation,
  pickRandomlyFromArray,
  mutateLocation,
  intersectionMany,
  getOppositeDirection,
  createRNG,
};
