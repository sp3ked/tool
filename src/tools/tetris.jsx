import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Pause, Play, RotateCw } from 'lucide-react';
import './tools.css';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const SHAPES = {
  I: [[1, 1, 1, 1]],
  L: [[1, 0], [1, 0], [1, 1]],
  J: [[0, 1], [0, 1], [1, 1]],
  O: [[1, 1], [1, 1]],
  Z: [[1, 1, 0], [0, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  T: [[1, 1, 1], [0, 1, 0]]
};

const COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000'
};

const Tetris = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [piecePosition, setPiecePosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [level, setLevel] = useState(1);

  function createEmptyBoard() {
    return Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
  }

  const spawnPiece = useCallback(() => {
    const shapes = Object.keys(SHAPES);
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentPiece({
      shape: SHAPES[randomShape],
      type: randomShape
    });
    setPiecePosition({
      x: Math.floor((BOARD_WIDTH - SHAPES[randomShape][0].length) / 2),
      y: 0
    });
  }, []);

  const checkCollision = (shape, position) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = position.x + x;
          const newY = position.y + y;
          if (
            newX < 0 || newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotatePiece = () => {
    if (!currentPiece || isPaused || gameOver) return;
    
    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[row.length - 1 - i] || 0)
    );
    
    if (!checkCollision(rotated, piecePosition)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
    }
  };

  const moveHorizontal = (direction) => {
    if (!currentPiece || isPaused || gameOver) return;
    
    const newPosition = { ...piecePosition, x: piecePosition.x + direction };
    if (!checkCollision(currentPiece.shape, newPosition)) {
      setPiecePosition(newPosition);
    }
  };

  const dropPiece = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;

    const newPosition = { ...piecePosition, y: piecePosition.y + 1 };
    
    if (!checkCollision(currentPiece.shape, newPosition)) {
      setPiecePosition(newPosition);
    } else {
      // Lock the piece
      const newBoard = [...board];
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            if (piecePosition.y + y <= 0) {
              setGameOver(true);
              return;
            }
            newBoard[piecePosition.y + y][piecePosition.x + x] = currentPiece.type;
          }
        }
      }

      // Check for completed lines
      let linesCleared = 0;
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (newBoard[y].every(cell => cell !== 0)) {
          newBoard.splice(y, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(0));
          linesCleared++;
          y++;
        }
      }

      // Update score and level
      if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800][linesCleared] * level;
        setScore(prev => prev + points);
        const newLevel = Math.floor((score + points) / 1000) + 1;
        if (newLevel !== level) {
          setLevel(newLevel);
          setSpeed(prev => Math.max(100, prev * 0.8));
        }
      }

      setBoard(newBoard);
      spawnPiece();
    }
  }, [board, currentPiece, piecePosition, level, score, isPaused, gameOver, spawnPiece]);

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      spawnPiece();
    }
  }, [currentPiece, gameOver, spawnPiece]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          moveHorizontal(-1);
          break;
        case 'ArrowRight':
          moveHorizontal(1);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dropPiece]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      const interval = setInterval(dropPiece, speed);
      return () => clearInterval(interval);
    }
  }, [dropPiece, isPaused, gameOver, speed]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setPiecePosition({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setLevel(1);
    setSpeed(1000);
  };

  const renderBoard = () => {
    const displayBoard = [...board];
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = piecePosition.y + y;
            const boardX = piecePosition.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Tetris</h1>
        <p className="tool-subtitle">Classic block-stacking puzzle game</p>
      </div>

      <div className="tool-content">
        <div className="tetris-container">
          <div className="game-info">
            <div className="info-item">
              <span>Score</span>
              <span>{score}</span>
            </div>
            <div className="info-item">
              <span>Level</span>
              <span>{level}</span>
            </div>
          </div>

          <div className="game-board">
            {renderBoard().map((row, y) => (
              <div key={y} className="board-row">
                {row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className={`board-cell ${cell ? 'filled' : ''}`}
                    style={{ backgroundColor: cell ? COLORS[cell] : undefined }}
                  />
                ))}
              </div>
            ))}

            {(gameOver || isPaused) && (
              <div className="game-overlay">
                <div className="overlay-content">
                  <span>{gameOver ? 'Game Over' : 'Paused'}</span>
                  <button onClick={gameOver ? resetGame : () => setIsPaused(false)} className="tool-button">
                    {gameOver ? (
                      <>
                        <RotateCw size={20} />
                        Play Again
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        Continue
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="game-controls">
            <button onClick={() => moveHorizontal(-1)} className="control-button">←</button>
            <button onClick={() => dropPiece()} className="control-button">↓</button>
            <button onClick={() => moveHorizontal(1)} className="control-button">→</button>
            <button onClick={rotatePiece} className="control-button">↻</button>
            <button 
              onClick={() => setIsPaused(p => !p)} 
              className="control-button"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
          </div>

          <div className="game-instructions">
            <h3>Controls</h3>
            <p>
              Use arrow keys to move (←↓→), up arrow to rotate (↑).<br />
              Space to pause/resume. Mobile users can use the buttons below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tetris;