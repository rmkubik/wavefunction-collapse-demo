import React from "react";

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

export default Column;
