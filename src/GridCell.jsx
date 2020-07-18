import React from "react";
// import { useState } from "react";

export function GridCell({ onClick, style }) {
  return (
    <div onClick={() => onClick()} style={style} className="grid-cell"></div>
  );
}
