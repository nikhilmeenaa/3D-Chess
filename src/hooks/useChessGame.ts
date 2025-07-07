"use client";

import { useState, useCallback, useEffect } from "react";
import { Chess } from "chess.js";

// Define piece symbols
const PIECE_SYMBOLS = {
  wK: "♔",
  wQ: "♕",
  wR: "♖",
  wB: "♗",
  wN: "♘",
  wP: "♙",
  bK: "♚",
  bQ: "♛",
  bR: "♜",
  bB: "♝",
  bN: "♞",
  bP: "♟",
} as const;

// Sound effects using Web Audio API
const createSoundEffect = (frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine') => {
  return () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };
};

// Sound effects
const playMoveSound = createSoundEffect(400, 0.1, 'triangle');
const playCaptureSound = createSoundEffect(600, 0.15, 'square');

export type Player = "white" | "black";
export type GameStatus =
  | "active"
  | "check"
  | "checkmate"
  | "stalemate"
  | "draw";

export interface GameState {
  board: string[][];
  currentPlayer: Player;
  gameStatus: GameStatus;
  isAIEnabled: boolean;
  isAIThinking: boolean;
  capturedPieces: {
    white: string[];
    black: string[];
  };
  selectedSquare: string | null;
  validMoves: string[];
  lastMove: {
    from: string;
    to: string;
  } | null;
  playerColor: Player;
}

export interface Move {
  from: string;
  to: string;
  promotion?: string;
}

export const useChessGame = () => {
  const [chess] = useState(() => new Chess());
  const [gameState, setGameState] = useState<GameState>({
    board: chess
      .board()
      .map((row) =>
        row.map((square) => (square ? square.type + square.color : ""))
      ),
    currentPlayer: "white",
    gameStatus: "active",
    isAIEnabled: true,
    isAIThinking: false,
    capturedPieces: { white: [], black: [] },
    selectedSquare: null,
    validMoves: [],
    lastMove: null,
    playerColor: "white",
  });

  const updateGameState = useCallback(() => {
    const board = chess
      .board()
      .map((row) =>
        row.map((square) => (square ? square.type + square.color : ""))
      );

    let status: GameStatus = "active";
    if (chess.isCheckmate()) status = "checkmate";
    else if (chess.isStalemate()) status = "stalemate";
    else if (chess.isDraw()) status = "draw";
    else if (chess.isCheck()) status = "check";

    setGameState((prev) => ({
      ...prev,
      board,
      currentPlayer: chess.turn() === "w" ? "white" : "black",
      gameStatus: status,
      selectedSquare: null,
      validMoves: [],
    }));
  }, [chess]);

  const makeMove = useCallback(
    (from: string, to: string) => {
      try {
        const move = chess.move({ from, to, promotion: "q" });
        if (move) {
          // Play appropriate sound effect
          if (move.captured) {
            try {
              playCaptureSound();
            } catch (e) {
              console.log('Audio not available');
            }
            
            // Track captured piece
            setGameState((prev) => {
              const capturedPiece = move.captured + (move.color === 'w' ? 'b' : 'w');
              const newCapturedPieces = { ...prev.capturedPieces };
              
              if (move.color === 'w') {
                newCapturedPieces.white.push(capturedPiece);
              } else {
                newCapturedPieces.black.push(capturedPiece);
              }
              
              return {
                ...prev,
                lastMove: { from, to },
                capturedPieces: newCapturedPieces,
              };
            });
          } else {
            try {
              playMoveSound();
            } catch (e) {
              console.log('Audio not available');
            }
            
            setGameState((prev) => ({
              ...prev,
              lastMove: { from, to },
            }));
          }
          
          updateGameState();
          return true;
        }
      } catch (error) {
        console.error("Invalid move:", error);
      }
      return false;
    },
    [chess, updateGameState]
  );

  const getValidMoves = useCallback(
    (square: string) => {
      const moves = chess.moves({ square: square as any, verbose: true });
      return moves.map((move: any) => move.to);
    },
    [chess]
  );

  const handleSquareClick = useCallback(
    (square: string) => {
      if (gameState.isAIThinking || gameState.gameStatus !== "active") return;

      const piece = chess.get(square as any);

      if (gameState.selectedSquare) {
        if (gameState.selectedSquare === square) {
          // Deselect
          setGameState((prev) => ({
            ...prev,
            selectedSquare: null,
            validMoves: [],
          }));
        } else if (gameState.validMoves.indexOf(square) !== -1) {
          // Make move
          if (makeMove(gameState.selectedSquare, square)) {
            setGameState((prev) => ({
              ...prev,
              selectedSquare: null,
              validMoves: [],
            }));
          }
        } else if (piece && piece.color === chess.turn()) {
          // Select different piece
          const validMoves = getValidMoves(square);
          setGameState((prev) => ({
            ...prev,
            selectedSquare: square,
            validMoves,
          }));
        } else {
          // Deselect
          setGameState((prev) => ({
            ...prev,
            selectedSquare: null,
            validMoves: [],
          }));
        }
      } else {
        // Select piece
        if (piece && piece.color === chess.turn()) {
          const validMoves = getValidMoves(square);
          setGameState((prev) => ({
            ...prev,
            selectedSquare: square,
            validMoves,
          }));
        }
      }
    },
    [gameState, chess, makeMove, getValidMoves]
  );

  const makeAIMove = useCallback(() => {
    if (
      !gameState.isAIEnabled ||
      chess.turn() !== "b" ||
      gameState.gameStatus !== "active"
    )
      return;

    setGameState((prev) => ({ ...prev, isAIThinking: true }));

    setTimeout(() => {
      const moves = chess.moves({ verbose: true });
      if (moves.length > 0) {
        // Simple AI: prefer captures, then random moves
        const captureMoves = moves.filter(
          (move: any) => move.flags && move.flags.indexOf("c") !== -1
        );
        const selectedMove =
          captureMoves.length > 0
            ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

        makeMove((selectedMove as any).from, (selectedMove as any).to);
      }
      setGameState((prev) => ({ ...prev, isAIThinking: false }));
    }, 1000);
  }, [gameState.isAIEnabled, chess, gameState.gameStatus, makeMove]);

  const resetGame = useCallback(() => {
    chess.reset();
    setGameState({
      board: chess
        .board()
        .map((row) =>
          row.map((square) => (square ? square.type + square.color : ""))
        ),
      currentPlayer: "white",
      gameStatus: "active",
      isAIEnabled: gameState.isAIEnabled,
      isAIThinking: false,
      capturedPieces: { white: [], black: [] },
      selectedSquare: null,
      validMoves: [],
      lastMove: null,
      playerColor: "white",
    });
  }, [chess, gameState.isAIEnabled]);

  const undoMove = useCallback(() => {
    if (gameState.isAIThinking) return;

    const history = chess.history({ verbose: true });
    if (history.length > 0) {
      chess.undo();
      if (gameState.isAIEnabled && history.length > 1) {
        chess.undo(); // Undo AI move too
      }
      updateGameState();
    }
  }, [chess, gameState.isAIThinking, gameState.isAIEnabled, updateGameState]);

  const toggleAI = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isAIEnabled: !prev.isAIEnabled,
      isAIThinking: false,
    }));
  }, []);

  // Effect to trigger AI moves
  useEffect(() => {
    if (
      gameState.isAIEnabled &&
      gameState.currentPlayer === "black" &&
      gameState.gameStatus === "active"
    ) {
      makeAIMove();
    }
  }, [
    gameState.isAIEnabled,
    gameState.currentPlayer,
    gameState.gameStatus,
    makeAIMove,
  ]);

  return {
    gameState,
    handleSquareClick,
    resetGame,
    undoMove,
    toggleAI,
  };
};
