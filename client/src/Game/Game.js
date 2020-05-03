import React, { useState } from "react";
import "./Game.css";

export default function Game(props) {
  const { sqrted } = props;
  const [matrix, setmatrix] = useState(props.matrix);
  const [turn, setTurn] = useState(false);
  const symbol = turn ? "X" : "O";
  const [status, setStatus] = useState(false);
  const matrixMarkup = [];

  for (let r = 0; r < sqrted; r++) {
    let matrixRow = [];
    for (let c = 0; c < sqrted; c++) {
      matrixRow.push(
        <Square
          key={r + "_" + c}
          content={matrix[r][c]}
          onClick={() => {
            if (matrix[r][c] === null) {
              let tempMatrix = [...matrix];
              tempMatrix[r][c] = symbol;
              if (calculateWinner(tempMatrix, [r, c], symbol)) {
                setmatrix(tempMatrix);

                setStatus(s => !s);
              } else {
                setmatrix(tempMatrix);
                setTurn(t => !t);
              }
            }
          }}
        />
      );
    }

    matrixMarkup.push(
      <div className="row" key={r}>
        {matrixRow}
      </div>
    );
  }
  return (
    <div className="container">
      <div className="game">
        {
          <div style={{ minHeight: "30px", height: "50px" }}>
            {!status && (
              <button className="info">" {symbol} " &nbsp;Turn</button>
            )}
          </div>
        }
        {matrixMarkup}
        {status && (
          <div style={{ textAlign: "center", padding: "2px" }}>
            <h1>{symbol + " Wins!"}</h1>
          </div>
        )}
        <div className="footer">
          <button
            onClick={() => {
              setStatus(false);
              setmatrix(
                Array(sqrted)
                  .fill(null)
                  .map(x => Array(sqrted).fill(null))
              );
            }}
          >
            New Game
          </button>
        </div>
      </div>{" "}
    </div>
  );
}

function Square(props) {
  const { content } = props;
  return (
    <button className="square" onClick={() => props.onClick()}>
      {content}
    </button>
  );
}

function calculateWinner(matrix, point, symbol) {
  let row = point[0];
  let col = point[1];
  //Check rows
  let isWinner = true;
  let lowPointer = point[1];
  let highPointer = point[1];
  while (highPointer < matrix[0].length) {
    if (matrix[row][highPointer] !== symbol) {
      isWinner = false;
      break;
    }

    highPointer++;
  }
  while (lowPointer > -1) {
    if (matrix[row][lowPointer] !== symbol) {
      isWinner = false;
      break;
    }

    lowPointer--;
  }
  console.log("rows");
  if (isWinner) return isWinner;
  //check Columns
  isWinner = true;
  lowPointer = point[0];
  highPointer = point[0];
  while (highPointer < matrix[0].length) {
    if (matrix[highPointer][col] !== symbol) {
      isWinner = false;
      break;
    }
    highPointer++;
  }
  while (lowPointer > -1) {
    if (matrix[lowPointer][col] !== symbol) {
      isWinner = false;
      break;
    }
    lowPointer--;
  }
  if (isWinner) return isWinner;

  //checl ltr diagoanl
  isWinner = true;
  lowPointer = point[0];
  highPointer = point[0];
  while (highPointer < matrix[0].length) {
    if (matrix[highPointer][highPointer] !== symbol) {
      isWinner = false;
      break;
    }
    highPointer++;
  }
  while (lowPointer > -1) {
    if (matrix[lowPointer][lowPointer] !== symbol) {
      isWinner = false;
      break;
    }
    lowPointer--;
  }
  if (isWinner) return isWinner;

  //check rtl diagonal
  //middle to left button check
  isWinner = true;
  let counter = 0;
  let x = point[1];
  let y = point[0];
  x--;
  y++;

  while (x < matrix.length && x > -1 && y < matrix.length && y > -1) {
    if (matrix[y][x] !== symbol) {
      isWinner = false;
      break;
    }
    counter++;
    x--;
    y++;
  }
  console.log(counter);

  //from middle to right corner
  console.log("rtl1");
  x = point[1];

  y = point[0];
  x++;
  y--;

  while (x < matrix.length && x > -1 && y < matrix.length && y > -1) {
    if (matrix[y][x] !== symbol) {
      isWinner = false;
      break;
    }
    counter++;
    x++;
    y--;
  }
  if (counter === matrix.length - 1) isWinner = true;
  else isWinner = false;
  return isWinner;
}
