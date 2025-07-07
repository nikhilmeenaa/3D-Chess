"use client";

import React from "react";

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

interface CapturedPiecesProps {
  capturedPieces: {
    white: string[];
    black: string[];
  };
  playerColor: "white" | "black";
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  capturedPieces,
  playerColor,
}) => {
  const renderPieceGroup = (
    pieces: string[],
    title: string,
    isOpponent: boolean
  ) => {
    const groupedPieces = pieces.reduce((acc, piece) => {
      acc[piece] = (acc[piece] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div
        className={`bg-slate-800/50 rounded-lg p-3 border ${
          isOpponent ? "border-red-500/30" : "border-green-500/30"
        }`}
      >
        <h3
          className={`text-sm font-semibold mb-2 ${
            isOpponent ? "text-red-300" : "text-green-300"
          }`}
        >
          {title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {Object.entries(groupedPieces).length === 0 ? (
            <span className="text-slate-400 text-xs">None</span>
          ) : (
            Object.entries(groupedPieces).map(([piece, count]) => (
              <div
                key={piece}
                className={`flex items-center gap-1 px-2 py-1 rounded ${
                  isOpponent ? "bg-red-900/30" : "bg-green-900/30"
                }`}
              >
                <span className="text-lg">
                  {PIECE_SYMBOLS[piece as keyof typeof PIECE_SYMBOLS] || piece}
                </span>
                {count > 1 && (
                  <span className="text-xs text-slate-300 bg-slate-700 px-1 rounded">
                    {count}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Opponent's captured pieces (pieces you captured) */}
      {renderPieceGroup(
        playerColor === "white" ? capturedPieces.white : capturedPieces.black,
        "Captured",
        false
      )}

      {/* Your captured pieces (pieces opponent captured) */}
      {renderPieceGroup(
        playerColor === "white" ? capturedPieces.black : capturedPieces.white,
        "Lost",
        true
      )}
    </div>
  );
};

export default CapturedPieces;
