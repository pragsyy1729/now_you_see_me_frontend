import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  isActive: boolean;
  flowSpeed?: number;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  start,
  end,
  isActive,
  flowSpeed = 1,
}) => {
  const lineRef = useRef<any>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create flowing particles along the line
  const particles = React.useMemo(() => {
    const particleCount = 20;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const t = i / (particleCount - 1);
      positions[i * 3] = start[0] + (end[0] - start[0]) * t;
      positions[i * 3 + 1] = start[1] + (end[1] - start[1]) * t;
      positions[i * 3 + 2] = start[2] + (end[2] - start[2]) * t;
    }
    
    return positions;
  }, [start, end]);

  // Animate particles flowing through the connection
  useFrame((state) => {
    if (particlesRef.current && isActive) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime * flowSpeed;
      
      for (let i = 0; i < positions.length / 3; i++) {
        const t = (i / (positions.length / 3 - 1) + time * 0.2) % 1;
        positions[i * 3] = start[0] + (end[0] - start[0]) * t;
        positions[i * 3 + 1] = start[1] + (end[1] - start[1]) * t;
        positions[i * 3 + 2] = start[2] + (end[2] - start[2]) * t;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const midPoint = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ] as [number, number, number];

  // Create curved line path
  const points = React.useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(midPoint[0], midPoint[1] + 0.3, midPoint[2]),
      new THREE.Vector3(...end)
    );
    return curve.getPoints(50);
  }, [start, end, midPoint]);

  return (
    <group>
      {/* Main connection line */}
      <Line
        ref={lineRef}
        points={points}
        color={isActive ? '#38bdf8' : '#475569'}
        lineWidth={isActive ? 2 : 1}
        transparent
        opacity={isActive ? 0.8 : 0.3}
      />

      {/* Flowing particles */}
      {isActive && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.length / 3}
              array={particles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.1}
            color="#38bdf8"
            transparent
            opacity={0.8}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
};
