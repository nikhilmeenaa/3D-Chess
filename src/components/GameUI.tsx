"use client";

import { GameState } from "@/hooks/useChessGame";
import PlayerIndicator from "./PlayerIndicator";
import CapturedPieces from "./CapturedPieces";

// Define piece symbols for display
const PIECE_SYMBOLS = {
  pw: "♙",
  pb: "♟",
  rw: "♖",
  rb: "♜",
  nw: "♘",
  nb: "♞",
  bw: "♗",
  bb: "♝",
  qw: "♕",
  qb: "♛",
  kw: "♔",
  kb: "♚",
} as const;

interface GameUIProps {
  gameState: GameState;
  onReset: () => void;
  onUndo: () => void;
  onToggleAI: () => void;
  layout?: "sidebar" | "top";
  is3DView?: boolean;
  onToggleView?: () => void;
}

export default function GameUI({
  gameState,
  onReset,
  onUndo,
  onToggleAI,
  layout = "sidebar",
  is3DView = true,
  onToggleView,
}: GameUIProps) {
  const {
    currentPlayer,
    gameStatus,
    isAIThinking,
    isAIEnabled,
    capturedPieces,
    playerColor,
  } = gameState;

  const getStatusText = () => {
    switch (gameStatus) {
      case "checkmate":
        return `${
          currentPlayer === "white" ? "Black" : "White"
        } wins by checkmate!`;
      case "stalemate":
        return "Game ended in stalemate!";
      case "draw":
        return "Game ended in a draw!";
      case "check":
        return `${currentPlayer} is in check!`;
      default:
        return `${currentPlayer}'s turn`;
    }
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case "checkmate":
        return "text-red-400";
      case "stalemate":
      case "draw":
        return "text-yellow-400";
      case "check":
        return "text-orange-400";
      default:
        return currentPlayer === "white" ? "text-slate-100" : "text-slate-800";
    }
  };

  const getStatusIcon = () => {
    switch (gameStatus) {
      case "checkmate":
        return "👑";
      case "stalemate":
      case "draw":
        return "🤝";
      case "check":
        return "⚠️";
      default:
        return currentPlayer === "white" ? "⚪" : "⚫";
    }
  };

  // Top layout for play page with mobile responsive design
  if (layout === "top") {
    return (
      <div className="w-full">
        {/* Game controls and info in a single row */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch mb-6 sm:mb-8">
          <div className="flex-1 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            {/* Player Color & Status */}
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  playerColor === "white"
                    ? "bg-white border-slate-300 text-black"
                    : "bg-slate-900 border-slate-600 text-white"
                }`}
              >
                {playerColor === "white" ? "♔" : "♚"}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium capitalize">
                  {playerColor}
                </span>
                <span className="text-sm text-slate-400">
                  {currentPlayer === playerColor
                    ? "Your turn"
                    : "Opponent's turn"}
                </span>
              </div>
            </div>

            {/* Captured Pieces - Compact */}
            <div className="flex items-center gap-4 px-4 border-l border-r border-slate-700/30">
              {/* Pieces you captured */}
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm font-medium">
                  Captured:
                </span>
                <div className="flex gap-1">
                  {capturedPieces[
                    playerColor === "white" ? "white" : "black"
                  ].map((piece, idx) => (
                    <span key={idx} className="text-lg">
                      {piece.charAt(1) === (playerColor === "white" ? "b" : "w")
                        ? PIECE_SYMBOLS[piece as keyof typeof PIECE_SYMBOLS]
                        : null}
                    </span>
                  ))}
                  {capturedPieces[playerColor === "white" ? "white" : "black"]
                    .length === 0 && (
                    <span className="text-slate-500 text-sm">None</span>
                  )}
                </div>
              </div>

              {/* Pieces you lost */}
              <div className="flex items-center gap-2">
                <span className="text-red-400 text-sm font-medium">Lost:</span>
                <div className="flex gap-1">
                  {capturedPieces[
                    playerColor === "white" ? "black" : "white"
                  ].map((piece, idx) => (
                    <span key={idx} className="text-lg">
                      {piece.charAt(1) === (playerColor === "white" ? "w" : "b")
                        ? PIECE_SYMBOLS[piece as keyof typeof PIECE_SYMBOLS]
                        : null}
                    </span>
                  ))}
                  {capturedPieces[playerColor === "white" ? "black" : "white"]
                    .length === 0 && (
                    <span className="text-slate-500 text-sm">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* Game Status */}
            {gameStatus !== "active" && (
              <div
                className={`px-3 py-1 rounded text-sm ${
                  gameStatus === "checkmate"
                    ? "bg-red-900/50 text-red-300"
                    : gameStatus === "check"
                    ? "bg-yellow-900/50 text-yellow-300"
                    : "bg-blue-900/50 text-blue-300"
                }`}
              >
                {gameStatus === "checkmate"
                  ? "Checkmate!"
                  : gameStatus === "check"
                  ? "Check!"
                  : gameStatus === "stalemate"
                  ? "Stalemate!"
                  : gameStatus === "draw"
                  ? "Draw!"
                  : gameStatus}
              </div>
            )}

            {/* AI Status */}
            {isAIThinking && (
              <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/20 rounded border border-blue-500/30">
                <div className="animate-spin h-3 w-3 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                <span className="text-blue-300 font-medium text-xs">
                  AI thinking...
                </span>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex sm:flex-col lg:flex-row gap-2 justify-end">
            <button
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
              onClick={onReset}
              disabled={isAIThinking}
            >
              <span className="flex items-center justify-center gap-1">
                <span>🆕</span>
                <span className="hidden sm:inline">New Game</span>
              </span>
            </button>

            <button
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
              onClick={onUndo}
              disabled={isAIThinking}
            >
              <span className="flex items-center justify-center gap-1">
                <span>↩️</span>
                <span className="hidden sm:inline">Undo</span>
              </span>
            </button>

            <button
              className={`flex-1 font-medium py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm ${
                isAIEnabled
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              }`}
              onClick={onToggleAI}
              disabled={isAIThinking}
            >
              <span className="flex items-center justify-center gap-1">
                <span>{isAIEnabled ? "🤖" : "👥"}</span>
                <span className="hidden sm:inline">
                  {isAIEnabled ? "AI Off" : "AI On"}
                </span>
              </span>
            </button>

            {/* View Toggle Button */}
            {onToggleView && (
              <button
                onClick={onToggleView}
                className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
              >
                <span className="flex items-center justify-center gap-1">
                  <span>{is3DView ? "♟" : "🎲"}</span>
                  <span className="hidden sm:inline">
                    {is3DView ? "2D" : "3D"} View
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sidebar layout (default) - Enhanced with new components
  return (
    <div className="w-full lg:w-80 xl:w-96 lg:absolute lg:top-6 lg:right-6 mt-6 lg:mt-0 px-4 lg:px-0 space-y-4">
      {/* Player Color Indicator */}
      <PlayerIndicator
        playerColor={playerColor}
        currentPlayer={currentPlayer}
        gameStatus={gameStatus}
      />

      {/* Captured Pieces */}
      <CapturedPieces
        capturedPieces={capturedPieces}
        playerColor={playerColor}
      />

      {/* Game Status Panel */}
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 lg:p-6 shadow-2xl">
        <div className="space-y-3 lg:space-y-4">
          {/* Status Header */}
          <div className="text-center pb-3 lg:pb-4 border-b border-slate-700/50">
            <div className="flex items-center justify-center gap-2 lg:gap-3 mb-2">
              <span className="text-xl lg:text-2xl">{getStatusIcon()}</span>
              <h3 className="text-lg lg:text-xl font-bold text-white">
                Game Status
              </h3>
            </div>
            <div
              className={`text-base lg:text-lg font-semibold ${getStatusColor()}`}
            >
              {getStatusText()}
            </div>
          </div>

          {/* AI Status */}
          {isAIThinking && (
            <div className="flex items-center justify-center gap-2 lg:gap-3 p-2 lg:p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <div className="animate-spin h-3 w-3 lg:h-4 lg:w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="text-blue-300 font-medium text-sm lg:text-base">
                AI is thinking...
              </span>
            </div>
          )}

          {/* Game Mode */}
          <div className="flex items-center justify-between p-2 lg:p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300 font-medium text-sm lg:text-base">
              Mode:
            </span>
            <span
              className={`font-semibold text-sm lg:text-base ${
                isAIEnabled ? "text-green-400" : "text-purple-400"
              }`}
            >
              {isAIEnabled ? "🤖 vs AI" : "👥 Two Players"}
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-3">
        <button
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 lg:py-3 px-3 lg:px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm lg:text-base"
          onClick={onReset}
          disabled={isAIThinking}
        >
          <span className="flex items-center justify-center gap-1 lg:gap-2">
            <span className="text-base lg:text-lg">��</span>
            <span className="hidden sm:inline lg:inline">New Game</span>
            <span className="sm:hidden lg:hidden">New</span>
          </span>
        </button>

        <button
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 lg:py-3 px-3 lg:px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm lg:text-base"
          onClick={onUndo}
          disabled={isAIThinking}
        >
          <span className="flex items-center justify-center gap-1 lg:gap-2">
            <span className="text-base lg:text-lg">↩️</span>
            <span className="hidden sm:inline lg:inline">Undo Move</span>
            <span className="sm:hidden lg:hidden">Undo</span>
          </span>
        </button>

        <button
          className={`w-full font-semibold py-2 lg:py-3 px-3 lg:px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm lg:text-base ${
            isAIEnabled
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
          }`}
          onClick={onToggleAI}
          disabled={isAIThinking}
        >
          <span className="flex items-center justify-center gap-1 lg:gap-2">
            <span className="text-base lg:text-lg">
              {isAIEnabled ? "🤖" : "👥"}
            </span>
            <span className="hidden sm:inline lg:inline">
              {isAIEnabled ? "Disable AI" : "Enable AI"}
            </span>
            <span className="sm:hidden lg:hidden">
              {isAIEnabled ? "AI Off" : "AI On"}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
