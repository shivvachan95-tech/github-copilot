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

// Simple game over sound using Web Audio API
function playGameOverSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    console.log('Audio API not supported');
  }
}

function Square({value, onClick, isWinning}){
  const getEmoji = (val) => val === 'X' ? '❌' : val === 'O' ? '⭕' : '';
  return (
    <button className={`square ${isWinning? 'winning':''} ${value? 'filled':''}`} onClick={onClick}>
      {getEmoji(value)}
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
  const [gameEnded, setGameEnded] = useState(false)
  const squares = history[step].slice()
  const win = calculateWinner(squares)
  const xIsNext = (step % 2) === 0
  const isBoardFull = squares.every(s => s !== null)
  
  React.useEffect(() => {
    if (win && !gameEnded) {
      playGameOverSound();
      setGameEnded(true);
    }
  }, [win, gameEnded])

  function handleClick(i){
    if (win || squares[i]) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    const newHistory = history.slice(0, step+1).concat([next]);
    setHistory(newHistory);
    setStep(step+1);
  }

  function jumpTo(move){ 
    setStep(move);
    setGameEnded(false);
  }

  function reset(){ 
    setHistory([Array(9).fill(null)]);
    setStep(0);
    setGameEnded(false);
  }

  return (
    <div className="container">
      <h1 className="title">🎮 Tick Tock — Tic-Tac-Toe</h1>
      <div className="game">
        <Board squares={squares} onClick={handleClick} winningLine={win && win.line} />
        <div className="info">
          <div className="status-box">
            {win ? (
              <div className="winner-display">🏆 Winner: <span className="winner-text">{win.winner}</span></div>
            ) : isBoardFull ? (
              <div className="draw-display">🤝 It's a Draw!</div>
            ) : (
              <div className="next-player">Current Player: <span className="player-text">{xIsNext ? '❌ X' : '⭕ O'}</span></div>
            )}
          </div>
          <div className="controls">
            <button className="reset-btn" onClick={reset}>🔄 Reset Game</button>
          </div>
          <div className="moves">
            <strong>📜 Move History</strong>
            <ol className="move-list">
              {history.map((_,move)=> (
                <li key={move}>
                  <button 
                    className={`history-btn ${move===step? 'active':''}`}
                    onClick={() => jumpTo(move)}
                  >
                    {move===0? '🏠 Start' : `#${move}`}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
