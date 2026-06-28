import React, { useState } from 'react'
import './index.css'

function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b,c] of lines){
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return { winner: squares[a], line: [a,b,c] };
    }
  }
  return null;
}

function Square({value, onClick, isWinning}){
  return (
    <button className={`square ${isWinning? 'winning':''}`} onClick={onClick}>
      {value}
    </button>
  )
}

function Board({squares, onClick, winningLine}){
  function renderSquare(i){
    const isWinning = winningLine && winningLine.includes(i);
    return <Square key={i} value={squares[i]} onClick={() => onClick(i)} isWinning={isWinning} />;
  }
  return <div className="board">{Array.from({length:9}).map((_,i)=>renderSquare(i))}</div>;
}

export default function App(){
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [step, setStep] = useState(0)
  const squares = history[step].slice()
  const win = calculateWinner(squares)
  const xIsNext = (step % 2) === 0

  function handleClick(i){
    if (win || squares[i]) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    const newHistory = history.slice(0, step+1).concat([next]);
    setHistory(newHistory);
    setStep(step+1);
  }

  function jumpTo(move){ setStep(move); }

  function reset(){ setHistory([Array(9).fill(null)]); setStep(0); }

  return (
    <div className="container">
      <h1>Tick Tock — Tic-Tac-Toe</h1>
      <div className="game">
        <Board squares={squares} onClick={handleClick} winningLine={win && win.line} />
        <div className="info">
          <div><strong>Next:</strong> {win ? '—' : (xIsNext ? 'X' : 'O')}</div>
          {win ? (<div style={{marginTop:8}}><strong>Winner:</strong> {win.winner}</div>) : null}
          <div className="controls"><button onClick={reset}>Reset</button></div>
          <div className="moves">
            <strong>History</strong>
            <ol>
              {history.map((_,move)=> (
                <li key={move}><button onClick={() => jumpTo(move)} style={{fontWeight: move===step? 'bold':'normal'}}>{move===0? 'Go to start' : `Go to move #${move}`}</button></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
