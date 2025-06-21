import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Text,
  Box,
  Sphere,
} from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import { GameUnit } from "@/lib/gameLogic";
import * as THREE from "three";

interface BattleArenaProps {
  playerUnits: GameUnit[];
  enemyUnits: GameUnit[];
  onArenaClick: (position: { x: number; z: number }) => void;
}

function CharacterModel({
  unit,
  onClick,
}: {
  unit: GameUnit;
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    if (unit.isPlayerUnit) {
      switch (unit.character.element) {
        case "fire":
          return "#ff6b6b";
        case "water":
          return "#4facfe";
        case "electric":
          return "#f093fb";
        case "shadow":
          return "#6c5ce7";
        case "light":
          return "#fdcb6e";
        default:
          return "#74b9ff";
      }
    } else {
      return "#d63031";
    }
  }, [unit.character.element, unit.isPlayerUnit]);

  const healthPercentage = unit.health / unit.maxHealth;

  return (
    <group position={[unit.position.x, unit.position.y, unit.position.z]}>
      {/* Character Body */}
      <Box
        ref={meshRef}
        args={[0.8, 1.6, 0.4]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Box>

      {/* Health Bar Background */}
      <Box args={[1, 0.1, 0.05]} position={[0, 1.2, 0]}>
        <meshBasicMaterial color="#333333" />
      </Box>

      {/* Health Bar Fill */}
      <Box
        args={[healthPercentage, 0.08, 0.03]}
        position={[-(1 - healthPercentage) / 2, 1.2, 0.01]}
      >
        <meshBasicMaterial
          color={
            healthPercentage > 0.5
              ? "#00ff00"
              : healthPercentage > 0.25
                ? "#ffff00"
                : "#ff0000"
          }
        />
      </Box>

      {/* Character Name */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {unit.character.name.split(" ")[0]}
      </Text>

      {/* Attack Effect */}
      {unit.state === "attacking" && (
        <Sphere args={[0.2]} position={[0, 0.8, 0]}>
          <meshBasicMaterial color="#ffff00" />
        </Sphere>
      )}
    </group>
  );
}

function ArenaFloor({
  onClick,
}: {
  onClick: (position: { x: number; z: number }) => void;
}) {
  const floorRef = useRef<THREE.Mesh>(null);

  const handleClick = (event: THREE.Event) => {
    event.stopPropagation();
    const intersect = event.intersections[0];
    if (intersect) {
      const { x, z } = intersect.point;
      onClick({ x, z });
    }
  };

  return (
    <group>
      {/* Main Arena Floor */}
      <Box
        ref={floorRef}
        args={[16, 0.2, 24]}
        position={[0, -0.1, 0]}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color="#2d3436"
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={0.8}
        />
      </Box>

      {/* Lane Dividers */}
      <Box args={[0.1, 0.3, 24]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#74b9ff"
          emissive="#74b9ff"
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Player Area Indicator */}
      <Box args={[16, 0.05, 2]} position={[0, 0.05, -10]}>
        <meshStandardMaterial
          color="#00b894"
          emissive="#00b894"
          emissiveIntensity={0.2}
        />
      </Box>

      {/* Enemy Area Indicator */}
      <Box args={[16, 0.05, 2]} position={[0, 0.05, 10]}>
        <meshStandardMaterial
          color="#e17055"
          emissive="#e17055"
          emissiveIntensity={0.2}
        />
      </Box>

      {/* Grid Lines */}
      {Array.from({ length: 9 }, (_, i) => (
        <Box
          key={`grid-x-${i}`}
          args={[0.02, 0.05, 24]}
          position={[-8 + i * 2, 0.02, 0]}
        >
          <meshBasicMaterial color="#636e72" transparent opacity={0.3} />
        </Box>
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <Box
          key={`grid-z-${i}`}
          args={[16, 0.05, 0.02]}
          position={[0, 0.02, -12 + i * 2]}
        >
          <meshBasicMaterial color="#636e72" transparent opacity={0.3} />
        </Box>
      ))}
    </group>
  );
}

function Tower({
  position,
  health,
  maxHealth,
  isPlayer,
}: {
  position: [number, number, number];
  health: number;
  maxHealth: number;
  isPlayer: boolean;
}) {
  const healthPercentage = health / maxHealth;
  const color = isPlayer ? "#00b894" : "#e17055";

  return (
    <group position={position}>
      {/* Tower Base */}
      <Box args={[2, 0.5, 2]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
      </Box>

      {/* Tower Body */}
      <Box args={[1.5, 3, 1.5]} position={[0, 2, 0]}>
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Box>

      {/* Tower Health Bar */}
      <Box args={[2, 0.2, 0.1]} position={[0, 4, 0]}>
        <meshBasicMaterial color="#333333" />
      </Box>
      <Box
        args={[2 * healthPercentage, 0.15, 0.08]}
        position={[-(2 - 2 * healthPercentage) / 2, 4, 0.01]}
      >
        <meshBasicMaterial
          color={
            healthPercentage > 0.5
              ? "#00ff00"
              : healthPercentage > 0.25
                ? "#ffff00"
                : "#ff0000"
          }
        />
      </Box>

      {/* Tower Name */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {isPlayer ? "PLAYER" : "ENEMY"}
      </Text>
    </group>
  );
}

export default function BattleArena({
  playerUnits,
  enemyUnits,
  onArenaClick,
}: BattleArenaProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <Canvas
        camera={{
          position: [0, 20, -15],
          fov: 60,
        }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 20, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[0, 10, 0]} intensity={0.5} color="#74b9ff" />

          {/* Environment */}
          <Environment preset="night" />

          {/* Arena Floor */}
          <ArenaFloor onClick={onArenaClick} />

          {/* Towers */}
          <Tower
            position={[0, 0, -11]}
            health={2000}
            maxHealth={2000}
            isPlayer={true}
          />
          <Tower
            position={[0, 0, 11]}
            health={2000}
            maxHealth={2000}
            isPlayer={false}
          />

          {/* Player Units */}
          {playerUnits.map((unit) => (
            <CharacterModel key={unit.id} unit={unit} />
          ))}

          {/* Enemy Units */}
          {enemyUnits.map((unit) => (
            <CharacterModel key={unit.id} unit={unit} />
          ))}

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={10}
            maxDistance={30}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
