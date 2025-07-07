"use client";

import React from "react";

interface PlayerIndicatorProps {
  playerColor: "white" | "black";
  currentPlayer: "white" | "black";
  gameStatus: string;
}

const PlayerIndicator: React.FC<PlayerIndicatorProps> = ({
  playerColor,
  currentPlayer,
  gameStatus,
}) => {
  const isPlayerTurn = playerColor === currentPlayer;

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">You are playing</h3>
        <div
          className={`w-4 h-4 rounded-full ${
            isPlayerTurn ? "bg-green-400 animate-pulse" : "bg-slate-500"
          }`}
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
            playerColor === "white"
              ? "bg-white border-slate-300 text-black"
              : "bg-slate-900 border-slate-600 text-white"
          }`}
        >
          {playerColor === "white" ? "♔" : "♚"}
        </div>
        <div>
          <div className="text-white font-medium capitalize">{playerColor}</div>
          <div className="text-sm text-slate-400">
            {isPlayerTurn ? "Your turn" : "Opponent's turn"}
          </div>
        </div>
      </div>

      {gameStatus !== "active" && (
        <div
          className={`text-sm px-3 py-2 rounded ${
            gameStatus === "checkmate"
              ? "bg-red-900/50 text-red-300"
              : gameStatus === "check"
              ? "bg-yellow-900/50 text-yellow-300"
              : "bg-blue-900/50 text-blue-300"
          }`}
        >
          <span className="font-medium">
            {gameStatus === "checkmate"
              ? "Checkmate!"
              : gameStatus === "check"
              ? "Check!"
              : gameStatus === "stalemate"
              ? "Stalemate!"
              : gameStatus === "draw"
              ? "Draw!"
              : gameStatus}
          </span>
        </div>
      )}
    </div>
  );
};

export default PlayerIndicator;
