"use client";

import { useMemo } from "react";
import { GameState } from "@/hooks/useChessGame";

interface ChessBoard2DProps {
  gameState: GameState;
  onSquareClick: (square: string) => void;
  onGameStateChange: (gameState: GameState) => void;
}

export default function ChessBoard2D({
  gameState,
  onSquareClick,
}: ChessBoard2DProps) {
  // Generate square names (a1, b1, etc.)
  const getSquareName = (row: number, col: number) => {
    const file = String.fromCharCode(97 + col); // a-h
    const rank = (8 - row).toString(); // 8-1
    return file + rank;
  };

  // Board squares with state-based styling
  const squares = useMemo(() => {
    const squareArray = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        const squareName = getSquareName(row, col);
        const isSelected = gameState.selectedSquare === squareName;
        const isValidMove = gameState.validMoves.indexOf(squareName) !== -1;
        const isLastMove =
          gameState.lastMove &&
          (gameState.lastMove.from === squareName ||
            gameState.lastMove.to === squareName);
        const piece = gameState.board[row][col];

        squareArray.push({
          key: squareName,
          row,
          col,
          isLight,
          isSelected,
          isValidMove,
          isLastMove,
          piece,
        });
      }
    }
    return squareArray;
  }, [
    gameState.selectedSquare,
    gameState.validMoves,
    gameState.lastMove,
    gameState.board,
  ]);

  return (
    <div className="w-full aspect-square max-w-[600px] mx-auto relative">
      <div className="grid grid-cols-8 h-full">
        {squares.map((square) => {
          // Get colors for different states
          let bgColor = square.isLight ? "bg-amber-100" : "bg-amber-800";
          let ringColor = "";

          if (square.isSelected) {
            ringColor = "ring-4 ring-yellow-400";
          } else if (square.isValidMove) {
            ringColor = "ring-2 ring-green-500";
          } else if (square.isLastMove) {
            ringColor = "ring-2 ring-blue-400";
          }

          return (
            <div
              key={square.key}
              className={`relative flex items-center justify-center text-4xl cursor-pointer transition-all duration-200 
                ${bgColor} ${ringColor} hover:brightness-110`}
              onClick={() => onSquareClick(square.key)}
            >
              {/* Chess piece */}
              {square.piece && (
                <span
                  className={
                    square.piece.charAt(1) === "w"
                      ? "text-white drop-shadow-lg"
                      : "text-gray-900 drop-shadow-lg"
                  }
                >
                  {(() => {
                    // Convert piece code to Unicode chess symbol
                    const type = square.piece.charAt(0);
                    const isWhite = square.piece.charAt(1) === "w";
                    switch (type) {
                      case "k":
                        return isWhite ? "♔" : "♚";
                      case "q":
                        return isWhite ? "♕" : "♛";
                      case "r":
                        return isWhite ? "♖" : "♜";
                      case "b":
                        return isWhite ? "♗" : "♝";
                      case "n":
                        return isWhite ? "♘" : "♞";
                      case "p":
                        return isWhite ? "♙" : "♟";
                      default:
                        return "";
                    }
                  })()}
                </span>
              )}

              {/* Move indicator dot */}
              {square.isValidMove && !square.piece && (
                <div className="absolute w-3 h-3 bg-green-500 rounded-full opacity-75" />
              )}

              {/* Capture indicator ring */}
              {square.isValidMove && square.piece && (
                <div className="absolute w-full h-full border-4 border-green-500 rounded-full opacity-75" />
              )}
            </div>
          );
        })}
      </div>

      {/* Board coordinates */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-around px-3 text-slate-300">
        {["a", "b", "c", "d", "e", "f", "g", "h"].map((file) => (
          <span key={file} className="text-sm">
            {file}
          </span>
        ))}
      </div>
      <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-around py-1 text-slate-300">
        {["8", "7", "6", "5", "4", "3", "2", "1"].map((rank) => (
          <span key={rank} className="text-sm">
            {rank}
          </span>
        ))}
      </div>
    </div>
  );
}
