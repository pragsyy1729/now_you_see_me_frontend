import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Grid } from '@react-three/drei';
import { LayerBlock } from './LayerBlock';
import { ConnectionLine } from './ConnectionLine';
import * as THREE from 'three';

interface Layer {
  name: string;
  title: string;
  description: string;
  channels: number;
  size: number;
  position: [number, number, number];
}

interface ResNet3DVisualizationProps {
  layers: Layer[];
  activations: { [key: string]: any };
  selectedLayer: string | null;
  onLayerSelect: (layerName: string) => void;
  predictions?: {
    indices: number[];
    probabilities: number[];
  } | null;
}

const Scene: React.FC<ResNet3DVisualizationProps> = ({
  layers,
  activations,
  selectedLayer,
  onLayerSelect,
  predictions,
}) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#38bdf8" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f472b6" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
      />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Grid floor */}
      <Grid
        args={[30, 30]}
        position={[7.5, -3, 0]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#1e293b"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#334155"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
      />

      {/* Render layer blocks */}
      {layers.map((layer, index) => (
        <React.Fragment key={layer.name}>
          <LayerBlock
            position={layer.position}
            name={layer.name}
            title={layer.title}
            channels={layer.channels}
            size={layer.size}
            isActive={selectedLayer === layer.name}
            hasActivation={!!activations[layer.name]}
            activationData={activations[layer.name]}
            onClick={() => onLayerSelect(layer.name)}
            isFinalLayer={layer.name === 'avgpool'}
            predictionConfidence={layer.name === 'avgpool' && predictions ? predictions.probabilities[0] : 0}
          />

          {/* Connection to next layer */}
          {index < layers.length - 1 && (
            <ConnectionLine
              start={layer.position}
              end={layers[index + 1].position}
              isActive={
                selectedLayer === layer.name ||
                selectedLayer === layers[index + 1].name
              }
            />
          )}
        </React.Fragment>
      ))}

      {/* Camera and controls */}
      <PerspectiveCamera makeDefault position={[10, 5, 10]} fov={60} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
        target={[7.5, 0, 0]}
      />

      {/* Environment for reflections */}
      <Environment preset="night" />
    </>
  );
};

export const ResNet3DVisualization: React.FC<ResNet3DVisualizationProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};
