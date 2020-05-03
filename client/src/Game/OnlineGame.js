import React, { useState } from "react";
import "./Game.css";

export default function OnlineGame(props) {
  const { sqrted, role } = props;
  const [matrix, setmatrix] = useState(props.matrix);
  const [turn, setTurn] = useState(props.turn);
  const [counters, setCounters] = useState({
    rows: new Array(sqrted).fill(0),
    cols: new Array(sqrted).fill(0),
    lD: 0,
    rD: 0
  });

  const symbol = role ? "X" : "O";
  const [isWinner, setWinner] = useState(false);

  React.useEffect(() => {
    if (props.isWinner !== undefined) setWinner(props.isWinner);
    setTurn(props.turn);
    setmatrix(props.matrix);
  }, [props.matrix, props.turn, props.isWinner]);
  const matrixMarkup = [];

  for (let r = 0; r < sqrted; r++) {
    let matrixRow = [];
    for (let c = 0; c < sqrted; c++) {
      matrixRow.push(
        <Square
          key={r + "_" + c}
          content={matrix[r][c]}
          onClick={() => {
            if (turn === role && matrix[r][c] === null) {
              let tempMatrix = [...matrix];
              tempMatrix[r][c] = symbol;
              //   setmatrix(matrix);
              props.publish(tempMatrix);

              //check is row
              let countersCopy = { ...counters };
              if (tempMatrix[r][c] === symbol) {
                countersCopy.rows[r]++;
                countersCopy.cols[c]++;
              }
              //check right diagonal
              if (r === matrix.length - c - 1) countersCopy.rD++;
              //check left diagonal
              if (r === c) countersCopy.lD++;

              ////////////////////////
              //Counters validations
              ////////////////////////
              if (
                countersCopy.rows[r] === sqrted ||
                countersCopy.cols[c] === sqrted ||
                countersCopy.lD === sqrted ||
                countersCopy.rD === sqrted
              ) {
                setWinner(symbol);

                props.publishWinner(symbol);
              } else setCounters(countersCopy);
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
          <div
            style={{
              minHeight: "30px",
              height: "50px"
            }}
          >
            {!isWinner && (
              <>
                <button className="info_left" style={{ float: "left" }}>
                  " {turn === 1 ? "X" : "O"} " &nbsp;Turn
                </button>
                <button className="info_right">
                  You are {role === 1 ? "X" : "O"}
                </button>
              </>
            )}
          </div>
        }
        {matrixMarkup}

        {isWinner && (
          <div style={{ textAlign: "center", padding: "2px" }}>
            <h1>{isWinner + " Wins!"}</h1>}
          </div>
        )}
        <div className="footer">
          <button
            onClick={() => {
              setmatrix(
                Array(sqrted)
                  .fill(null)
                  .map(x => Array(sqrted).fill(null))
              );
              setCounters({
                rows: new Array(sqrted).fill(0),
                cols: new Array(sqrted).fill(0),
                lD: 0,
                rD: 0
              });
              props.newOnlineGame();
            }}
          >
            New Online Game
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
