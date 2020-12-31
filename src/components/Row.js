import React from "react";

const Column = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      {children}
    </div>
  );
};

export default Column;
