"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useChessGame, GameState } from "@/hooks/useChessGame";
import ChessBoard from "./ChessBoard";
import ChessBoard2D from "./ChessBoard2D";
import GameUI from "./GameUI";

interface ChessGameProps {
  layout?: "sidebar" | "top";
}

export default function ChessGame({ layout = "sidebar" }: ChessGameProps) {
  const { gameState, handleSquareClick, resetGame, undoMove, toggleAI } =
    useChessGame();
  const [currentGameState, setCurrentGameState] =
    useState<GameState>(gameState);
  const [is3DView, setIs3DView] = useState(true);

  // Sync game state with UI
  useEffect(() => {
    setCurrentGameState(gameState);
  }, [gameState]);

  const handleGameStateChange = (newGameState: GameState) => {
    setCurrentGameState(newGameState);
  };

  const containerClass =
    layout === "top" ? "w-full flex flex-col" : "w-full flex flex-col lg:block";

  const canvasHeight =
    layout === "top"
      ? "h-[50vh] sm:h-[60vh] lg:h-[70vh]"
      : "h-[60vh] sm:h-[70vh] lg:h-[85vh]";

  return (
    <div className={containerClass}>
      {/* Enhanced GameUI with responsive design */}
      <GameUI
        gameState={gameState}
        onReset={resetGame}
        onUndo={undoMove}
        onToggleAI={toggleAI}
        layout={layout}
        is3DView={is3DView}
        onToggleView={() => setIs3DView(!is3DView)}
      />

      {/* Chess Board Container */}
      <div
        className={`w-full ${
          is3DView ? canvasHeight : ""
        } relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 ${
          layout === "top" ? "lg:mr-0" : "lg:mr-80 xl:mr-96"
        } shadow-2xl mt-6 sm:mt-8`}
      >
        {is3DView ? (
          <Canvas
            camera={{ position: [0, 8, 8], fov: 60 }}
            shadows="soft"
            gl={{
              antialias: true,
              alpha: true,
              shadowMapType: 2,
            }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <Environment preset="warehouse" />
              <ambientLight intensity={0.1} color="#f8fafc" />
              <directionalLight
                position={[5, 8, 3]}
                castShadow
                intensity={1.5}
                color="#ffffff"
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={0.1}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
                shadow-bias={-0.001}
                shadow-radius={1}
              />
              <directionalLight
                position={[-3, 6, -2]}
                castShadow
                intensity={0.6}
                color="#e0e7ff"
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={0.1}
                shadow-camera-far={30}
                shadow-camera-left={-8}
                shadow-camera-right={8}
                shadow-camera-top={8}
                shadow-camera-bottom={-8}
                shadow-bias={-0.001}
              />
              <directionalLight
                position={[0, 4, -6]}
                intensity={0.2}
                color="#f1f5f9"
              />

              <ChessBoard
                gameState={gameState}
                onSquareClick={handleSquareClick}
                onGameStateChange={handleGameStateChange}
              />

              <ContactShadows
                position={[0, -0.28, 0]}
                opacity={1}
                scale={12}
                blur={1}
                far={8}
                resolution={1024}
                color="#0f172a"
                frames={1}
              />

              <mesh
                position={[0, -0.35, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
              >
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial
                  color="#0f172a"
                  roughness={1}
                  metalness={0}
                  transparent
                  opacity={0.3}
                />
              </mesh>

              <OrbitControls
                enablePan={false}
                enableZoom={true}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 6}
                maxDistance={25}
                minDistance={6}
                enableDamping
                dampingFactor={0.05}
                rotateSpeed={0.5}
                zoomSpeed={0.5}
              />
            </Suspense>
          </Canvas>
        ) : (
          <div className="p-8">
            <ChessBoard2D
              gameState={gameState}
              onSquareClick={handleSquareClick}
              onGameStateChange={handleGameStateChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
