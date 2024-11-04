import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCw } from 'lucide-react';
import './tools.css';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;

const Snake = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Create random food position
  const createFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    // Make sure food doesn't spawn on snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return createFood();
    }
    return newFood;
  }, [snake]);

  // Reset game
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(createFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(currentSnake => {
        const head = currentSnake[0];
        const newHead = { ...head };

        // Move head based on direction
        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
          default: break;
        }

        // Check wall collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return currentSnake;
        }

        // Check self collision
        if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return currentSnake;
        }

        const newSnake = [newHead, ...currentSnake];
        
        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(createFood());
          setScore(s => {
            const newScore = s + 1;
            setHighScore(h => Math.max(h, newScore));
            setSpeed(current => Math.max(50, current - SPEED_INCREMENT));
            return newScore;
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, isPaused, speed, createFood]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  // Handle touch controls
  const handleDirectionClick = (newDirection) => {
    if (gameOver) return;
    
    const opposites = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };

    if (direction !== opposites[newDirection]) {
      setDirection(newDirection);
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Snake Game</h1>
        <p className="tool-subtitle">Classic snake game with a modern twist</p>
      </div>

      <div className="tool-content">
        <div className="snake-container">
          <div className="game-info">
            <div className="info-item">
              <span>Score</span>
              <span>{score}</span>
            </div>
            <div className="info-item">
              <span>High Score</span>
              <span>{highScore}</span>
            </div>
            <div className="info-item">
              <span>Speed</span>
              <span>{Math.round((INITIAL_SPEED - speed) / SPEED_INCREMENT + 1)}</span>
            </div>
          </div>

          <div className="snake-board">
            {Array.from({ length: GRID_SIZE }).map((_, y) => (
              <div key={y} className="board-row">
                {Array.from({ length: GRID_SIZE }).map((_, x) => {
                  const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                  const isHead = snake[0].x === x && snake[0].y === y;
                  const isFood = food.x === x && food.y === y;
                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`snake-cell ${isSnake ? 'snake' : ''} 
                        ${isHead ? 'head' : ''} ${isFood ? 'food' : ''}`}
                    />
                  );
                })}
              </div>
            ))}

            {(gameOver || isPaused) && (
              <div className="game-overlay">
                <div className="overlay-content">
                  <span>{gameOver ? 'Game Over!' : 'Paused'}</span>
                  <button 
                    onClick={gameOver ? resetGame : () => setIsPaused(false)}
                    className="tool-button"
                  >
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
            <button onClick={() => handleDirectionClick('UP')} className="control-button">↑</button>
            <button onClick={() => handleDirectionClick('LEFT')} className="control-button">←</button>
            <button onClick={() => handleDirectionClick('DOWN')} className="control-button">↓</button>
            <button onClick={() => handleDirectionClick('RIGHT')} className="control-button">→</button>
            <button 
              onClick={() => setIsPaused(p => !p)} 
              className="control-button"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
          </div>

          <div className="game-instructions">
            <h3>How to Play</h3>
            <p>
              Use arrow keys or buttons to control the snake. Collect food to grow and increase your score.
              Avoid walls and don't collide with yourself! Space to pause/resume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Snake;