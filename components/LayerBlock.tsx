import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface LayerBlockProps {
  position: [number, number, number];
  name: string;
  title: string;
  channels: number;
  size: number;
  isActive: boolean;
  hasActivation: boolean;
  activationData?: any;
  onClick: () => void;
  isFinalLayer?: boolean;
  predictionConfidence?: number;
}

export const LayerBlock: React.FC<LayerBlockProps> = ({
  position,
  name,
  title,
  channels,
  size,
  isActive,
  hasActivation,
  activationData,
  onClick,
  isFinalLayer = false,
  predictionConfidence = 0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Normalize size for visualization (scale between 0.5 and 2)
  const visualSize = useMemo(() => {
    const normalized = Math.log(size + 1) / Math.log(224);
    return 0.5 + normalized * 1.5;
  }, [size]);

  // Color based on depth in network
  const color = useMemo(() => {
    if (isFinalLayer && predictionConfidence > 0) {
      // Special gold color for final layer with predictions
      return predictionConfidence > 0.7 ? '#fbbf24' : predictionConfidence > 0.4 ? '#60a5fa' : '#f472b6';
    }
    const colors = [
      '#38bdf8', // sky-400
      '#22d3ee', // cyan-400
      '#a78bfa', // violet-400
      '#f472b6', // pink-400
      '#fb923c', // orange-400
      '#fbbf24', // amber-400
    ];
    const index = Math.floor(position[0] / 3);
    return colors[Math.min(index, colors.length - 1)];
  }, [position, isFinalLayer, predictionConfidence]);

  // Create particle system for activations
  const particles = useMemo(() => {
    if (!hasActivation || !activationData) return null;

    const particleCount = Math.min(channels, 100);
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Random position around the block
      positions[i * 3] = (Math.random() - 0.5) * visualSize * 1.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * visualSize * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * visualSize * 1.5;

      // Color based on activation intensity
      const intensity = Math.random(); // Would use actual activation data
      const c = new THREE.Color(color);
      colors[i * 3] = c.r * (0.5 + intensity * 0.5);
      colors[i * 3 + 1] = c.g * (0.5 + intensity * 0.5);
      colors[i * 3 + 2] = c.b * (0.5 + intensity * 0.5);
    }

    return { positions, colors };
  }, [hasActivation, activationData, channels, visualSize, color]);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Pulse when active
      if (isActive) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        meshRef.current.scale.setScalar(scale);
      }
    }

    // Rotate particles
    if (particlesRef.current && hasActivation) {
      particlesRef.current.rotation.y += 0.005;
      particlesRef.current.rotation.x += 0.002;
    }
  });

  return (
    <group position={position}>
      {/* Main block */}
      <Box
        ref={meshRef}
        args={[visualSize, visualSize, visualSize]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={hasActivation ? 0.9 : 0.6}
        />
      </Box>

      {/* Wireframe overlay */}
      <Box args={[visualSize, visualSize, visualSize]}>
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.3}
        />
      </Box>

      {/* Particle system for activations */}
      {particles && hasActivation && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.positions.length / 3}
              array={particles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={particles.colors.length / 3}
              array={particles.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            vertexColors
            transparent
            opacity={0.8}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Label */}
      <Text
        position={[0, visualSize / 2 + 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      <Text
        position={[0, visualSize / 2 + 0.3, 0]}
        fontSize={0.12}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {channels} channels
      </Text>

      {/* Show prediction confidence for final layer */}
      {isFinalLayer && predictionConfidence > 0 && (
        <Text
          position={[0, visualSize / 2 + 0.05, 0]}
          fontSize={0.15}
          color={color}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {(predictionConfidence * 100).toFixed(0)}% confident
        </Text>
      )}

      {/* Glow effect when active */}
      {isActive && (
        <Sphere args={[visualSize * 0.8, 32, 32]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  );
};
