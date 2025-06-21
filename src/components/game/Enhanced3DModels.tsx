import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Sphere, Cylinder } from "@react-three/drei";
import { GameUnit } from "@/lib/gameLogic";
import * as THREE from "three";

interface Enhanced3DCharacterProps {
  unit: GameUnit;
  onClick?: () => void;
}

export function Enhanced3DCharacter({
  unit,
  onClick,
}: Enhanced3DCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);

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

  // Simple animation based on character state
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    if (unit.state === "moving") {
      // Simple bobbing walk animation
      groupRef.current.position.y = Math.sin(time * 4) * 0.05;
    } else if (unit.state === "attacking") {
      // Simple attack animation
      groupRef.current.rotation.y = Math.sin(time * 8) * 0.1;
    }
  });

  // Simplified character model
  const getCharacterModel = () => {
    return (
      <>
        {/* Main Body */}
        <Box args={[0.8, 1.6, 0.4]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={color}
            metalness={0.3}
            roughness={0.4}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </Box>

        {/* Head */}
        <Sphere args={[0.3]} position={[0, 1.1, 0]}>
          <meshStandardMaterial color={color} metalness={0.1} roughness={0.6} />
        </Sphere>

        {/* Simple weapon indicator */}
        {unit.character.type === "melee" && (
          <Box args={[0.1, 1.0, 0.05]} position={[0.4, 0.5, 0]}>
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
          </Box>
        )}

        {/* Rarity glow for legendary */}
        {unit.character.rarity === "legendary" && (
          <Sphere args={[1.2]} position={[0, 0, 0]}>
            <meshStandardMaterial
              color="#ffff00"
              transparent
              opacity={0.1}
              emissive="#ffff00"
              emissiveIntensity={0.2}
            />
          </Sphere>
        )}
      </>
    );
  };

  return (
    <group
      ref={groupRef}
      position={[unit.position.x, unit.position.y, unit.position.z]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Character Model */}
      {getCharacterModel()}

      {/* Health Bar Background */}
      <Box args={[1.2, 0.1, 0.05]} position={[0, 2.2, 0]}>
        <meshBasicMaterial color="#333333" />
      </Box>

      {/* Health Bar Fill */}
      <Box
        args={[1.2 * healthPercentage, 0.08, 0.03]}
        position={[-(1.2 - 1.2 * healthPercentage) / 2, 2.2, 0.01]}
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
        position={[0, 2.8, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {unit.character.name.split(" ")[0]}
      </Text>

      {/* Level indicator */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.15}
        color="#ffff00"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="black"
      >
        Lv.{unit.character.cost}
      </Text>

      {/* Element Effect */}
      {unit.state === "attacking" && (
        <Sphere args={[0.3]} position={[0, 0.8, 0]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            emissive={color}
            emissiveIntensity={0.8}
          />
        </Sphere>
      )}

      {/* Rarity Glow */}
      {(unit.character.rarity === "epic" ||
        unit.character.rarity === "legendary") && (
        <Sphere args={[1.5]} position={[0, 0, 0]}>
          <meshBasicMaterial
            color={
              unit.character.rarity === "legendary" ? "#ffff00" : "#9b59b6"
            }
            transparent
            opacity={0.05}
            emissive={
              unit.character.rarity === "legendary" ? "#ffff00" : "#9b59b6"
            }
            emissiveIntensity={0.1}
          />
        </Sphere>
      )}
    </group>
  );
}
