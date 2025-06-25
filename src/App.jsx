/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'

function Square({ value, onSquareClick, className }) {
  
  return (
    <button className="square" onClick={onSquareClick}>
      <p className={`w-max mx-auto ${className ?? "text-red-400"}`}>
        {value}
      </p>
    </button>
  )
}

function Board({xIsNext, squares, onPlay}) {
  const [winner, setWinner] = useState(null)
  function handleClick(i){
    if(squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice()

    nextSquares[i] = (xIsNext ? 'X' : 'O')
    onPlay(nextSquares)
  }

  useEffect(() => {
    if(calculateWinner(squares)) return setWinner(calculateWinner(squares))
  }, [squares])

  let status = ''

  if(winner) {
    status = '🥳 Winner: ' + winner.winnerPlayer + ' 🎉'
  } else if(!calculateWinner(squares) && !squares.includes(null)){
    status = '🤝 DRAW 🤝'
  } else {
    status = 'Player: ' + (xIsNext ? 'X' : 'O')
  }

  return (
    <div className='main-container'>
      <div className='board-container'>
        <div className='status'>{status}</div>
        <div className='board'>        
          {Array.from({length: 9}, (_, i) => i).map((i) => (
            winner && winner.winnerSquares.includes(i) 
              ? (
                <Square 
                  key={i} 
                  value={squares[i]} 
                  onSquareClick={() => handleClick(i)} 
                  className={'animate-bounce bg-gradient-to-r from-yellow-400 via-cyan-400 to-green-500 bg-clip-text text-transparent'}/>
              ) 
              : (
                <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)}/>
              )
          ))}
          {/* <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
          <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
          <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
          <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
          <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
          <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
          <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
          <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
          <Square value={squares[8]} onSquareClick={() => handleClick(8)}/> */}
        </div>
      </div>
    </div>
  )
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = (currentMove % 2 === 0) ? true : false
  const currentSquares = history[currentMove];

  function backTo(index) {
    setCurrentMove(index);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  const moves = history.map((squares, index) => {
    let text = '';
    if (index > 0){
      text = 'Back to move #' + index
    } else {
      text = 'Game Start'
    }

    return (
      <li key={index}>
        <button onClick={() => backTo(index)}>{text}</button>
      </li>
    );
  })

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className='game-info'>
        <h2>Time Travel</h2>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares){
  const rules = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  
  for(let i = 0; i < rules.length; i++) {
    const [a, b, c] = rules[i]

    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      const winnerSquares = [a, b, c]
      const winnerPlayer = squares[a]
      return {winnerSquares, winnerPlayer}
      // return squares[a]
    }
  }

  return false
}