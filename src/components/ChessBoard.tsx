"use client";

import { useRef, useMemo } from "react";
import { Group, Mesh } from "three";
import { GameState } from "@/hooks/useChessGame";
import ChessPiece from "./ChessPiece";

interface ChessBoardProps {
  gameState: GameState;
  onSquareClick: (square: string) => void;
  onGameStateChange: (gameState: GameState) => void;
}

export default function ChessBoard({
  gameState,
  onSquareClick,
}: ChessBoardProps) {
  const boardRef = useRef<Group>(null);
  const squareRefs = useRef<{ [key: string]: Mesh }>({});

  // Generate square names (a1, b1, etc.)
  const getSquareName = (row: number, col: number) => {
    const file = String.fromCharCode(97 + col); // a-h
    const rank = (8 - row).toString(); // 8-1
    return file + rank;
  };

  // Get 3D position from board coordinates
  const getPosition = (row: number, col: number): [number, number, number] => {
    const x = (col - 3.5) * 1;
    const z = (3.5 - row) * 1;
    return [x, 0.05, z]; // Slightly elevated squares for better shadow casting
  };

  // Board squares with simplified rendering to prevent flickering
  const squares = useMemo(() => {
    const squareArray = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        const squareName = getSquareName(row, col);
        const position = getPosition(row, col);
        const isSelected = gameState.selectedSquare === squareName;
        const isValidMove = gameState.validMoves.indexOf(squareName) !== -1;
        const isLastMove =
          gameState.lastMove &&
          (gameState.lastMove.from === squareName ||
            gameState.lastMove.to === squareName);

        squareArray.push({
          key: squareName,
          row,
          col,
          isLight,
          position,
          isSelected,
          isValidMove,
          isLastMove,
        });
      }
    }
    return squareArray;
  }, [gameState.selectedSquare, gameState.validMoves, gameState.lastMove]);

  // Chess pieces - positioned closer to the board
  const pieces = useMemo(() => {
    const pieceArray = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];
        if (piece) {
          const squareName = getSquareName(row, col);
          const position = getPosition(row, col);
          const pieceType = piece.charAt(0);
          const pieceColor = piece.charAt(1);

          pieceArray.push({
            key: squareName,
            type: pieceType,
            color: pieceColor,
            position: [position[0], 0.15, position[2]] as [
              number,
              number,
              number
            ],
            squareName,
          });
        }
      }
    }
    return pieceArray;
  }, [gameState.board]);

  const handleSquareClick = (squareName: string) => {
    onSquareClick(squareName);
  };

  return (
    <group ref={boardRef}>
      {/* Single unified board base - no duplicate borders to prevent flickering */}
      <mesh position={[0, -0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[9.0, 0.3, 9.0]} />
        <meshStandardMaterial color="#654321" roughness={0.8} metalness={0} />
      </mesh>

      {/* Decorative inset border - positioned to avoid z-fighting */}
      <mesh position={[0, 0.01, 0]} receiveShadow castShadow>
        <boxGeometry args={[8.4, 0.02, 8.4]} />
        <meshStandardMaterial color="#4A3728" roughness={0.7} metalness={0} />
      </mesh>

      {/* Chess squares with simplified rendering - no overlapping geometries */}
      {squares.map((square) => {
        // Get colors for different states with better contrast
        let squareColor = square.isLight ? "#F5DEB3" : "#4A3728"; // Wheat vs Dark Brown
        let emissive = "#000000";
        let emissiveIntensity = 0;

        if (square.isSelected) {
          squareColor = "#FFD700"; // Gold
          emissive = "#B8860B";
          emissiveIntensity = 0.15;
        } else if (square.isValidMove) {
          squareColor = square.isLight ? "#90EE90" : "#228B22"; // Light/Dark Green
          emissive = "#006400";
          emissiveIntensity = 0.1;
        } else if (square.isLastMove) {
          squareColor = square.isLight ? "#FFE4B5" : "#DEB887"; // Moccasin/BurlyWood
          emissive = "#CD853F";
          emissiveIntensity = 0.05;
        }

        return (
          <mesh
            key={square.key}
            position={square.position}
            receiveShadow
            castShadow
            onClick={() => handleSquareClick(square.key)}
            ref={(ref) => {
              if (ref) squareRefs.current[square.key] = ref;
            }}
          >
            <boxGeometry args={[0.98, 0.1, 0.98]} />
            <meshStandardMaterial
              color={squareColor}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
              roughness={0.9}
              metalness={0}
            />
          </mesh>
        );
      })}

      {/* Simplified valid move indicators - elevated to prevent z-fighting */}
      {gameState.validMoves.map((moveName) => {
        const row = 8 - parseInt(moveName[1]);
        const col = moveName.charCodeAt(0) - 97;
        const position = getPosition(row, col);
        const hasPiece = gameState.board[row][col] !== "";

        return (
          <mesh
            key={`indicator-${moveName}`}
            position={[position[0], 0.15, position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {hasPiece ? (
              // Capture indicator (ring)
              <ringGeometry args={[0.25, 0.35, 16]} />
            ) : (
              // Move indicator (circle)
              <circleGeometry args={[0.15, 16]} />
            )}
            <meshStandardMaterial
              color="#00FF40"
              emissive="#003300"
              emissiveIntensity={0.2}
              transparent
              opacity={0.9}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Simplified board coordinates - elevated and simplified */}
      {/* Files (a-h) */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`file-${i}`}
          position={[(i - 3.5) * 1, 0.1, -4.3]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.25, 0.25]} />
          <meshStandardMaterial
            color="#654321"
            transparent
            opacity={0.7}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Ranks (1-8) */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`rank-${i}`}
          position={[-4.3, 0.1, (3.5 - i) * 1]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.25, 0.25]} />
          <meshStandardMaterial
            color="#654321"
            transparent
            opacity={0.7}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Chess pieces with enhanced shadow casting */}
      {pieces.map((piece) => (
        <ChessPiece
          key={piece.key}
          type={piece.type}
          color={piece.color}
          position={piece.position}
          onClick={() => handleSquareClick(piece.squareName)}
        />
      ))}
    </group>
  );
}
