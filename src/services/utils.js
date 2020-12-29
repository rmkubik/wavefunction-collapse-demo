import { intersection } from "ramda";

const intBetweenExclusive = (low, high) => {
  return Math.floor(Math.random() * (high - low)) + low;
};

const pickRandomLocation = (matrix) => {
  const dimensions = getDimensions(matrix);

  return {
    row: intBetweenExclusive(0, dimensions.height),
    col: intBetweenExclusive(0, dimensions.width),
  };
};

const mutateLocation = (matrix, location, value) => {
  matrix[location.row][location.col] = value;
};

function pickRandomlyFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
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

const intersectionMany = (...arrays) =>
  arrays.reduce((currentIntersection, array) => {
    return intersection(currentIntersection, array);
  });

export {
  getLeftLocation,
  getRightLocation,
  getUpLocation,
  getDownLocation,
  pickRandomLocation,
  pickRandomlyFromArray,
  mutateLocation,
  intersectionMany,
};
