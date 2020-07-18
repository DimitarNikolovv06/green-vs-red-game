import React from "react";

export function GridCell({ onClick, style }) {
  return (
    <div onClick={() => onClick()} style={style} className="grid-cell"></div>
  );
}
