import React, { useState, useCallback, useRef } from "react";
import "./App.css";
import { GridCell } from "./GridCell";
import produce from "immer";

function App() {
  const [grid, setGrid] = useState([]);
  const [gridSize, setGridSize] = useState({
    x: 0,
    y: 0,
  });
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [turns, setTurns] = useState(0);
  const [cols, setCols] = useState([0, 0]);
  const [gridCSS, setGridCSS] = useState(0);

  const runningRef = useRef(running);
  runningRef.current = running;

  const countRef = useRef(count);
  countRef.current = count;

  const turnsRef = useRef(turns);
  turnsRef.current = turns;

  const gridRef = useRef(grid);
  gridRef.current = grid;

  const gridNeighbours = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  const handleChange = ({ target }) =>
    setGridSize({
      ...gridSize,
      [target.name]: Number(target.value),
    });

  const onClickCreateGrid = (event) => {
    event.preventDefault();
    const newGrid = [];
    for (let i = 0; i < gridSize.x; i++) {
      newGrid.push(new Array(gridSize.y).fill(0));
    }

    setGridCSS(gridSize.x);
    setGrid(newGrid);
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    if (!turnsRef.current) {
      return;
    }

    setGrid((grid) =>
      produce(grid, (gridCopy) => {
        for (let i = 0; i < gridSize.x; i++) {
          for (let j = 0; j < gridSize.y; j++) {
            let greenNeighbours = 0;
            gridNeighbours.forEach(([x, y]) => {
              const newX = i + x;
              const newY = j + y;
              if (
                newX < gridSize.x &&
                newX >= 0 &&
                newY < gridSize.y &&
                newY >= 0
              ) {
                if (grid[newX][newY]) {
                  greenNeighbours++;
                }
              }
            });

            if (
              !gridCopy[i][j] &&
              (greenNeighbours === 3 || greenNeighbours === 6)
            ) {
              gridCopy[i][j] = 1;
            } else if (
              gridCopy[i][j] &&
              (greenNeighbours === 0 ||
                greenNeighbours === 1 ||
                greenNeighbours === 4 ||
                greenNeighbours === 5 ||
                greenNeighbours === 7 ||
                greenNeighbours === 8)
            ) {
              gridCopy[i][j] = 0;
            }
          }
        }
      })
    );

    const [x, y] = cols;
    if (gridRef.current[x][y]) {
      setCount(countRef.current + 1);
    }

    setTurns(turnsRef.current - 1);
    if (!turnsRef.current) {
      setRunning(!runningRef.current);
    } else {
      setTimeout(runSimulation, 100);
    }
  }, [gridSize, cols]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
        className="App"
      >
        <div className="generation-zero">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div>
              <label className="white">X: </label>
              <input onChange={handleChange} name="x" />
            </div>
            <div>
              <label className="white">Y: </label>
              <input onChange={handleChange} name="y" />
            </div>
            <div>
              <label className="white">Turns: </label>
              <input
                onChange={({ target }) => {
                  setCount(0);
                  setTurns(Number(target.value));
                  turnsRef.current = Number(target.value);
                }}
              />
            </div>
            <div>
              <label className="white">X1: </label>
              <input
                value={cols[0]}
                onChange={({ target }) =>
                  setCols([Number(target.value), cols[1]])
                }
              />
            </div>
            <div>
              <label className="white">Y1: </label>
              <input
                value={cols[1]}
                onChange={({ target }) =>
                  setCols([cols[0], Number(target.value)])
                }
              />
            </div>
          </div>

          <div>
            <button className="white btn" onClick={onClickCreateGrid}>
              Set Grid
            </button>
            <button
              className="white btn"
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
              }}
            >
              {running ? "Stop" : "Start"}
            </button>
            <button
              className="white btn"
              onClick={() => {
                setGrid((grid) =>
                  grid.map((arr) =>
                    arr.map(() => (Math.random() > 0.5 ? 1 : 0))
                  )
                );
              }}
            >
              Randomize
            </button>
          </div>
          <div style={{ fontSize: "1.1rem" }} className="white">
            {count ? `The cell was green  ${count} times ` : undefined}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridCSS}, auto)`,
            marginTop: 10,
          }}
          className="grid-container"
        >
          {grid.map((ar, i) =>
            ar.map((cell, k) => (
              <GridCell
                onClick={() =>
                  setGrid((grid) =>
                    produce(grid, (gridCopy) => {
                      gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                    })
                  )
                }
                key={`${i}-${k}`}
                style={{
                  border: "2px solid white",
                  width: 30,
                  height: 30,
                  backgroundColor: grid[i][k] ? "#006400" : "#cd0000",
                }}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
