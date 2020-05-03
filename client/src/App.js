import React, { Component } from "react";
import "./App.css";
import Game from "./Game/Game";
import OnlineGame from "./Game/OnlineGame";
import axios from "axios";
import mqtt from "mqtt";
//var client;

const size = 16;
const sqrted = Math.sqrt(size);
class App extends Component {
  constructor(props) {
    super(props);
    this.getTopic = this.getTopic.bind(this);

    this.state = {
      client: undefined,
      turn: 0,
      online: false,
      game: undefined,
      isGameOn: false,
      matrix: Array(sqrted)
        .fill(null)
        .map(x => Array(sqrted).fill(null))
    };
  }
  handleState(data) {
    this.setState(ps => ({ ...ps, ...data }));
  }
  async getTopic() {
    let res = await axios.get("http://localhost:8000/new_game", {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
    let game = res.data;
    this.setState({ game: game.name, role: game.role, isOnline: true });
    let tempclient = mqtt.connect("mqtt://broker.hivemq.com:8000/mqtt");
    this.setState({
      isWinner: undefined,
      game: game.name,
      role: game.role,
      isOnline: true,
      client: tempclient,
      isGameOn: true
    });
    let self = this;

    self.state.client.on("connect", function() {
      self.state.client.subscribe(game.name, function(err) {
        if (!err) {
          console.log("connected");
        }
      });
    });

    if (self.state.client !== undefined)
      self.state.client.on("message", function(message, payload, packet) {
        if (payload.toString().indexOf("matrix") > -1) {
          let payloadObj = JSON.parse(payload.toString());
          let newMatrix = payloadObj.matrix;
          let newTurn = payloadObj.turn;
          if (
            newMatrix !== undefined &&
            newMatrix.length > 0 &&
            newMatrix.toString() !== self.state.matrix.toString()
          )
            self.handleState({ matrix: newMatrix, turn: newTurn });
        }
        if (payload.toString().indexOf("winner") > -1) {
          let jsoned = JSON.parse(payload);
          self.setState({ isWinner: jsoned.winner });
        }
      });
  }

  render() {
    return (
      <div className="App">
        <div className="game_info">
          <button
            onClick={async () => {
              if (this.state.isOnline)
                this.setState({
                  client: undefined,
                  isOnline: false,
                  online: false,
                  isGameOn: false
                });
              else
                this.setState(
                  p => ({ isOnline: true, online: true }),
                  async () => {
                    await this.getTopic();
                  }
                );
            }}
          >
            {this.state.online ? "Play Offline" : "Play Online"}
          </button>
          <br /> <br />
          {this.state.isGameOn && (
            <div style={{ textAlign: "center" }}>
              {this.state.game.toString()}
              <br />
              {this.state.matrix}
            </div>
          )}{" "}
        </div>
        {this.state.topic}

        {!this.state.online && this.state.isGameOn && (
          <div className="waiting_message">
            <br />
            <Waiting />
          </div>
        )}
        {
          <div>
            {" "}
            {this.state.isOnline && (
              <OnlineGame
                isWinner={this.state.isWinner}
                publishWinner={winner => {
                  this.state.client.publish(
                    this.state.game,
                    JSON.stringify({ winner: winner })
                  );
                }}
                newOnlineGame={async () => await this.getTopic()}
                setMatrix={matrix => this.setState({ matrix: matrix })}
                publish={async matrix => {
                  let turn = this.state.turn === 1 ? 0 : 1;
                  if (this.state.client !== undefined)
                    this.state.client.publish(
                      this.state.game,
                      JSON.stringify({
                        matrix: matrix,
                        turn: turn
                      })
                    );
                  this.setState({ matrix: matrix, turn: turn });
                }}
                isOnline={this.state.online}
                sqrted={sqrted}
                matrix={this.state.matrix}
                turn={this.state.turn}
                role={this.state.role}
              />
            )}
            {!this.state.isOnline && (
              <Game
                sqrted={sqrted}
                matrix={Array(sqrted)
                  .fill(null)
                  .map(x => Array(sqrted).fill(null))}
              />
            )}
          </div>
        }
      </div>
    );
  }
}

export default App;

const Waiting = () => {
  return <span className="loading">Waiting for opponent to connect</span>;
};
