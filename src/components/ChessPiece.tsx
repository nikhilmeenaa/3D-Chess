"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface ChessPieceProps {
  type: string;
  color: string;
  position: [number, number, number];
  onClick: () => void;
}

export default function ChessPiece({
  type,
  color,
  position,
  onClick,
}: ChessPieceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Enhanced piece materials with realistic properties
  const pieceMaterial = useMemo(() => {
    const baseProps = {
      roughness: color === "w" ? 0.3 : 0.5,
      metalness: color === "w" ? 0 : 0,
      clearcoat: color === "w" ? 0.4 : 0.2,
      clearcoatRoughness: 0.2,
      shadowSide: THREE.DoubleSide,
    };

    return color === "w"
      ? {
          ...baseProps,
          color: "#FFFEF7", // Ivory white
          emissive: "#F5F5F0",
          emissiveIntensity: 0.03,
        }
      : {
          ...baseProps,
          color: "#0A0A0A", // Deep black
          emissive: "#050505",
          emissiveIntensity: 0.02,
        };
  }, [color]);

  // Enhanced piece geometries with realistic proportions
  const renderPiece = () => {
    switch (type) {
      case "p": // Pawn - Classic design with head and base
        return (
          <group>
            {/* Base */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.1, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Shaft */}
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.12, 0.16, 0.3, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.15, 16, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
          </group>
        );

      case "r": // Rook - Castle-like with battlements
        return (
          <group>
            {/* Base */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.26, 0.1, 8]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Main tower */}
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.2, 0.5, 8]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Top cylinder */}
            <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.18, 0.1, 8]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Battlements */}
            {Array.from({ length: 8 }, (_, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((i * Math.PI * 2) / 8) * 0.18,
                  0.75,
                  Math.sin((i * Math.PI * 2) / 8) * 0.18,
                ]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[0.06, 0.1, 0.06]} />
                <meshStandardMaterial {...pieceMaterial} />
              </mesh>
            ))}
          </group>
        );

      case "n": // Knight - Horse head design
        return (
          <group>
            {/* Base */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.24, 0.1, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Neck/body */}
            <mesh
              position={[0, 0.25, 0]}
              rotation={[0.2, 0, 0]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[0.14, 0.18, 0.3, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Horse head */}
            <mesh
              position={[0, 0.45, 0.15]}
              rotation={[0.3, 0, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.16, 0.3, 0.25]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Mane */}
            <mesh
              position={[-0.05, 0.55, 0.05]}
              rotation={[0.2, -0.3, 0]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.08, 0.2, 0.12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Ears */}
            <mesh position={[-0.06, 0.58, 0.22]} castShadow receiveShadow>
              <coneGeometry args={[0.04, 0.08, 6]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            <mesh position={[0.06, 0.58, 0.22]} castShadow receiveShadow>
              <coneGeometry args={[0.04, 0.08, 6]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
          </group>
        );

      case "b": // Bishop - Mitre design with cross
        return (
          <group>
            {/* Base */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.24, 0.1, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Lower body */}
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.15, 0.18, 0.3, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Upper body (mitre shape) */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <coneGeometry args={[0.16, 0.4, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Cross on top */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.08, 0.1, 0.02]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.04, 0.02, 0.02]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Decorative band */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.17, 0.17, 0.04, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
          </group>
        );

      case "q": // Queen - Elaborate crown design
        return (
          <group>
            {/* Base */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.26, 0.1, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Lower body */}
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.16, 0.2, 0.3, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Upper body */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.16, 0.3, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Crown base */}
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.18, 0.08, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Crown spikes */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * Math.PI * 2) / 8;
              const radius = 0.18;
              const height = i % 2 === 0 ? 0.15 : 0.12; // Alternating heights
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * radius,
                    0.74 + height / 2,
                    Math.sin(angle) * radius,
                  ]}
                  castShadow
                  receiveShadow
                >
                  <coneGeometry args={[0.03, height, 6]} />
                  <meshStandardMaterial {...pieceMaterial} />
                </mesh>
              );
            })}
            {/* Central crown jewel */}
            <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.05, 12, 8]} />
              <meshStandardMaterial
                {...pieceMaterial}
                emissive={color === "w" ? "#FFD700" : "#8B0000"}
                emissiveIntensity={0.1}
              />
            </mesh>
          </group>
        );

      case "k": // King - Majestic crown with cross
        return (
          <group>
            {/* Base */}
            <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.24, 0.28, 0.1, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Lower body */}
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.3, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Upper body */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.2, 0.18, 0.3, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Crown base */}
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.2, 0.08, 12]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Crown peaks */}
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (i * Math.PI * 2) / 6;
              const radius = 0.2;
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * radius,
                    0.82,
                    Math.sin(angle) * radius,
                  ]}
                  castShadow
                  receiveShadow
                >
                  <coneGeometry args={[0.04, 0.16, 6]} />
                  <meshStandardMaterial {...pieceMaterial} />
                </mesh>
              );
            })}
            {/* Central cross */}
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 0.15, 0.03]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.06, 0.03, 0.03]} />
              <meshStandardMaterial {...pieceMaterial} />
            </mesh>
            {/* Crown jewels */}
            <mesh position={[0, 0.75, 0.22]} castShadow receiveShadow>
              <sphereGeometry args={[0.03, 8, 6]} />
              <meshStandardMaterial
                {...pieceMaterial}
                emissive={color === "w" ? "#FF4500" : "#8B0000"}
                emissiveIntensity={0.1}
              />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.8, 0.3]} />
            <meshStandardMaterial {...pieceMaterial} />
          </mesh>
        );
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      {renderPiece()}
    </mesh>
  );
}
