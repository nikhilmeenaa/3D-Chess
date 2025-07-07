"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import { useEffect, useState } from "react";

const socialLinks = [
  {
    icon: FaGithub,
    href: "https://github.com/yourusername",
    label: "GitHub",
  },
  {
    icon: FaLinkedin,
    href: "https://linkedin.com/in/yourusername",
    label: "LinkedIn",
  },
  {
    icon: FaInstagram,
    href: "https://instagram.com/yourusername",
    label: "Instagram",
  },
  {
    icon: FaTwitter,
    href: "https://twitter.com/yourusername",
    label: "Twitter",
  },
];

// Animated Chess Pieces Component
const AnimatedChessPieces = () => {
  const pieces = ["♔", "♕", "♖", "♗", "♘", "♙", "♚", "♛", "♜", "♝", "♞", "♟"];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((piece, index) => (
        <div
          key={index}
          className="absolute text-white/10 text-4xl animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        >
          {piece}
        </div>
      ))}
    </div>
  );
};

// Define types for chess moves
interface ChessMove {
  from: number;
  to: number;
  piece: string;
}

// Mini Chess Board Preview Component
const ChessBoardPreview = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(64).fill(null));
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [movingPiece, setMovingPiece] = useState<ChessMove | null>(null);
  const [lastMove, setLastMove] = useState<ChessMove | null>(null);

  // Initial board setup
  const initialBoard = [
    "♜",
    "♞",
    "♝",
    "♛",
    "♚",
    "♝",
    "♞",
    "♜",
    "♟",
    "♟",
    "♟",
    "♟",
    "♟",
    "♟",
    "♟",
    "♟",
    ...Array(32).fill(null),
    "♙",
    "♙",
    "♙",
    "♙",
    "♙",
    "♙",
    "♙",
    "♙",
    "♖",
    "♘",
    "♗",
    "♕",
    "♔",
    "♗",
    "♘",
    "♖",
  ];

  // Define a sequence of moves to animate
  const moves: ChessMove[] = [
    { from: 52, to: 36, piece: "♙" }, // e2-e4
    { from: 12, to: 28, piece: "♟" }, // e7-e5
    { from: 62, to: 45, piece: "♘" }, // Nf3
    { from: 1, to: 18, piece: "♞" }, // Nc6
    { from: 61, to: 34, piece: "♗" }, // Bc4
    { from: 6, to: 21, piece: "♞" }, // Nf6
  ];

  useEffect(() => {
    // Set initial board state
    setBoard([...initialBoard]);

    // Animate moves in a loop
    const animateMove = () => {
      setCurrentMoveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % moves.length;
        const move = moves[prevIndex];

        // Start piece movement animation
        setMovingPiece(move);
        setLastMove(move);

        // Update board after a short delay
        setTimeout(() => {
          setBoard((prevBoard) => {
            const newBoard = [...prevBoard];
            newBoard[move.from] = null;
            newBoard[move.to] = move.piece;
            return newBoard;
          });
          setMovingPiece(null);
        }, 300);

        return nextIndex;
      });
    };

    // Start animation loop with a longer interval to make moves more visible
    const interval = setInterval(animateMove, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-8 gap-0 w-64 h-64 mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl border border-white/20">
      {board.map((piece, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const isLight = (row + col) % 2 === 0;
        const isMovingFrom = movingPiece && movingPiece.from === i;
        const isMovingTo = movingPiece && movingPiece.to === i;
        const isLastMoveSquare =
          lastMove && (lastMove.from === i || lastMove.to === i);

        return (
          <div
            key={i}
            className={`w-8 h-8 flex items-center justify-center text-lg font-bold transition-all duration-300 
              ${isLight ? "bg-amber-100" : "bg-amber-800"}
              ${isLastMoveSquare ? "highlight-square" : ""}
              ${piece ? "hover:scale-110" : ""}`}
            style={{
              animationDelay: `${i * 0.05}s`,
            }}
          >
            {piece && (
              <span
                className={`transition-all duration-300 ${
                  piece.charCodeAt(0) >= 9812 && piece.charCodeAt(0) <= 9817
                    ? "text-white"
                    : "text-gray-800"
                } ${isMovingFrom ? "piece-fade-out" : ""} ${
                  isMovingTo ? "piece-fade-in" : ""
                }`}
              >
                {piece}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state after a small delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.1),transparent_50%)]"></div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      {/* Animated Chess Pieces */}
      <AnimatedChessPieces />

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-20 pb-16 text-center">
          <h1
            className={`text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-6 opacity-0 ${
              isLoaded ? "animate-fade-in" : ""
            }`}
          >
            3D Chess Reimagined
          </h1>
          <p
            className={`text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12 opacity-0 ${
              isLoaded ? "animate-fade-in-up" : ""
            }`}
          >
            Experience the classic game of chess in a stunning 3D environment
            with intelligent AI. Challenge yourself or play with friends in this
            beautifully crafted digital arena.
          </p>

          {/* Mini Chess Board Preview */}
          <div
            className={`opacity-0 ${
              isLoaded ? "animate-fade-in-up delay-200" : ""
            }`}
          >
            <ChessBoardPreview />
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 ${
              isLoaded ? "animate-fade-in-up delay-400" : ""
            }`}
          >
            <Link
              href="/play"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg group"
            >
              <span className="flex items-center gap-2">
                <span>Play Now</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-200 text-lg"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Interactive Chess Stats */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="text-4xl md:text-6xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                ♔
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                64
              </div>
              <div className="text-slate-300">Squares of Strategy</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-6xl font-bold text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                ♕
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                32
              </div>
              <div className="text-slate-300">Pieces in Play</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-6xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                ♖
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                ∞
              </div>
              <div className="text-slate-300">Possible Games</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-slate-900/50 backdrop-blur-sm py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
              Why Choose Our 3D Chess?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transform hover:scale-105 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:animate-bounce">
                  🎮
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Immersive 3D Experience
                </h3>
                <p className="text-slate-300">
                  Stunning visuals and smooth animations bring the classic game
                  to life like never before.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transform hover:scale-105 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:animate-pulse">
                  🤖
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Smart AI Opponent
                </h3>
                <p className="text-slate-300">
                  Challenge yourself against an intelligent AI that adapts to
                  your playing style.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transform hover:scale-105 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:animate-spin">📱</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Cross-Platform
                </h3>
                <p className="text-slate-300">
                  Play seamlessly across all your devices with our responsive
                  design.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Section */}
        <div className="container mx-auto px-4 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Meet the Creator
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Hi! I&apos;m a passionate developer who loves creating immersive
              experiences. Check out my other projects and connect with me on
              social media.
            </p>
            <div className="flex justify-center gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transform hover:scale-110 transition-all duration-200 p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                  aria-label={link.label}
                >
                  <link.icon className="w-8 h-8" />
                </a>
              ))}
            </div>
            <div className="mt-8">
              <a
                href="https://yourportfolio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold text-lg hover:underline"
              >
                View My Portfolio →
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900/50 backdrop-blur-sm py-8">
          <div className="container mx-auto px-4 text-center text-slate-400">
            <p>© 2024 3D Chess. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
