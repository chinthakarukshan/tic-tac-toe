import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  /*class Square extends React.Component {

    render() {
      return (
        <button className="square" onClick={() => this.props.onClick()}>
          {this.props.value}
        </button>
      );
    }
  }*/

  function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
          {props.value}
        </button>
    );
  }

  function Board(props) {
    const rows = [];
        for (let i = 0; i<3;i++) {
            let columns = [];
            for (let j=0;j<3;j++) {
                columns.push(<Square 
                    value={props.squares[3 * i + j]}
                    onClick={() => props.onClick(3 * i + j)}
                  />);
            }
            //rows[i] = columns;
        rows.push(<div className="board-row">{columns}</div>);
        }
      return (
        <div>
          {rows}
        </div>
      );
  }
  
  class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            clickHistory: [{
                squareId: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscendingOrder: true,
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const clickHistory = this.state.clickHistory.slice(0, this.state.stepNumber + 1);

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            clickHistory: clickHistory.concat({
                squareId: i,
            }),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    orderMoves() {
      this.setState({
        isAscendingOrder: !this.state.isAscendingOrder,
      });
    }

    render() {
      const history = this.state.history;
      const currentEntry = history[this.state.stepNumber];
      const winner = calculateWinner(currentEntry.squares);
      const clickHistory = this.state.clickHistory;
      const orderType = this.state.isAscendingOrder? "Decending" : "Ascending";
      let coordinates;
      let orderedMoves;

      const moves = history.map((step,move) => {
        const selectedSquare = clickHistory[move];
        const selectedSquareId = selectedSquare.squareId;
        if (selectedSquare) {
            coordinates = getCoordinates(selectedSquareId);
          }
        const desc = move ? 
            'Go to move #' + move + '(' + coordinates + ')' :
            'Go to game start';

        if (move === this.state.stepNumber) {
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
                </li>
            );
        }
        return (
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
      });

      if (!this.state.isAscendingOrder) {
        orderedMoves = moves.reverse();
      } else {
        orderedMoves = moves;
      }

      let status;
      if (winner) {
        status = 'Winner is: ' + winner;
      } else {
        const player = this.state.xIsNext ? 'X' : 'O';
        status = 'Next player: ' + player;
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={currentEntry.squares}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.orderMoves()}>Order {orderType}</button>
            <ol>{orderedMoves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    for(let i = 0; i < winningCombinations.length; i++) {
        const [a,b,c] = winningCombinations[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;

  }

  function getCoordinates(squareId) {
      let column;
      let row;
      let coordinates;
    const rowIndices = [
        [0,1,2],
        [3,4,5],
        [6,7,8]
    ];
    const columnIndices = [
        [0,3,6],
        [1,4,7],
        [2,5,8]
    ];

    for (let i = 0; i < rowIndices.length; i++) {
        const[a,b,c] = rowIndices[i];
        if (a === squareId || b === squareId || c === squareId) {
            coordinates = i + 1;
        }
    }

    for (let i = 0; i < columnIndices.length; i++) {
        const[a,b,c] = columnIndices[i];
        if (a === squareId || b === squareId || c === squareId) {
            coordinates = coordinates + ',' + (i + 1);
        }
    }

    return coordinates;

  }

  function getColumnNumber() {

  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  