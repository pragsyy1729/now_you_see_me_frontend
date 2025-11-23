'use client';

import React, { useState, useEffect } from 'react';
import { ResNet3DVisualization } from '../components/ResNet3DVisualization';
import { ControlPanel } from '../components/ControlPanel';
import { ActivationViewer } from '../components/ActivationViewer';
import { apiService, LayerInfo } from '../lib/api';
import { getClassName } from '../lib/imagenet-classes';

export default function Home() {
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [activations, setActivations] = useState<{ [key: string]: any }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [gradcamOverlay, setGradcamOverlay] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<{ indices: number[], probabilities: number[], names?: string[] } | null>(null);
  const [processingStage, setProcessingStage] = useState<string | null>(null);

  // Check backend health and load model info
  useEffect(() => {
    const initializeBackend = async () => {
      try {
        const isHealthy = await apiService.checkHealth();
        setBackendOnline(isHealthy);

        if (isHealthy) {
          const modelInfo = await apiService.getModelInfo();
          setLayers(modelInfo.layers);
          setError(null);
        } else {
          setError('Backend is offline. Please start the Flask server.');
        }
      } catch (err) {
        console.error('Failed to initialize backend:', err);
        setBackendOnline(false);
        setError('Failed to connect to backend. Make sure the Flask server is running on port 5000.');
      }
    };

    initializeBackend();

    // Poll backend health every 1 second to keep it awake and show real-time status
    const interval = setInterval(async () => {
      const isHealthy = await apiService.checkHealth();
      setBackendOnline(isHealthy);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setPredictions(null);
    setActivations({});
    setGradcamOverlay(null);

    try {
      // Animate preprocessing
      setProcessingStage('Preprocessing image...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await apiService.processImage(file);
      
      if (response.success) {
        setImagePreview(response.image_preview);
        setGradcamOverlay(response.gradcam_overlay || null);
        
        // Animate through layers
        const layerNames = ['conv1', 'layer1', 'layer2', 'layer3', 'layer4', 'avgpool'];
        for (let i = 0; i < layerNames.length; i++) {
          setProcessingStage(`Processing ${layerNames[i]}...`);
          setSelectedLayer(layerNames[i]);
          await new Promise(resolve => setTimeout(resolve, 400));
        }
        
        setActivations(response.activations);
        setPredictions({
          indices: response.predictions.top5_indices,
          probabilities: response.predictions.top5_probabilities,
          names: response.predictions.top5_names
        });
        
        // Select final layer
        setSelectedLayer('avgpool');
        setProcessingStage(null);
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image. Please try again.');
      setProcessingStage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLayerSelect = (layerName: string) => {
    setSelectedLayer(layerName);
  };

  return (
    <main className="relative w-screen h-screen bg-slate-950 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950" />
      
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/40 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${backendOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'}`} />
          <span className="text-xs text-slate-400">
            {backendOnline ? 'Backend Online' : 'Backend Offline'}
          </span>
        </div>
        
        <div className="text-xs text-slate-500">
          ResNet50 • 3D Neural Network Visualization
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-xl border border-red-400 rounded-lg px-6 py-3 shadow-lg z-30 max-w-md">
          <p className="text-sm text-white">{error}</p>
        </div>
      )}

      {/* Control panel */}
      <div className="absolute top-12 left-0 bottom-0 z-10">
        <ControlPanel
          selectedLayer={selectedLayer}
          layers={layers}
          onLayerSelect={handleLayerSelect}
          onUploadImage={handleImageUpload}
          isProcessing={isProcessing}
          imagePreview={imagePreview}
          gradcamOverlay={gradcamOverlay}
        />
      </div>

      {/* Main 3D visualization */}
      <div className="absolute top-12 left-0 right-0 bottom-0">
        {layers.length > 0 ? (
          <ResNet3DVisualization
            layers={layers}
            activations={activations}
            selectedLayer={selectedLayer}
            onLayerSelect={handleLayerSelect}
            predictions={predictions}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-sky-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-slate-400">Loading model architecture...</p>
            </div>
          </div>
        )}
      </div>

      {/* Activation viewer */}
      {selectedLayer && activations[selectedLayer] && (
        <ActivationViewer
          layerName={selectedLayer}
          activationData={activations[selectedLayer]}
          predictions={selectedLayer === 'avgpool' ? predictions : null}
        />
      )}

      {/* Processing stage indicator */}
      {processingStage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="bg-slate-950/95 backdrop-blur-xl border-2 border-sky-400 rounded-2xl px-8 py-6 shadow-[0_0_50px_rgba(56,189,248,0.5)] animate-pulse-slow">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{processingStage}</p>
                <p className="text-sm text-slate-400">Neural network forward pass</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prediction display panel */}
      {predictions && !processingStage && (
        <div className="absolute top-20 right-6 w-80 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl z-20">
          <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-sky-500/10 to-fuchsia-500/10">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="text-xl">🎯</span>
              Top Predictions
            </h3>
            <p className="text-xs text-slate-400 mt-1">ImageNet Classes</p>
          </div>
          <div className="p-4 space-y-2">
            {predictions.indices.map((classIdx, index) => {
              const probability = predictions.probabilities[index];
              const className = predictions.names?.[index] || getClassName(classIdx);
              const isTop = index === 0;
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all ${
                    isTop
                      ? 'bg-gradient-to-r from-sky-500/20 to-fuchsia-500/20 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isTop && <span className="text-lg">🏆</span>}
                      <span className={`text-xs font-semibold ${
                        isTop ? 'text-sky-400' : 'text-slate-400'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {className}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${
                      isTop ? 'text-sky-400' : 'text-slate-300'
                    }`}>
                      {(probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isTop
                          ? 'bg-gradient-to-r from-sky-400 to-fuchsia-500'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${probability * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions overlay (shown when no image loaded) */}
      {!imagePreview && backendOnline && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-xl px-6 py-4 shadow-2xl z-10">
          <p className="text-sm text-slate-300 text-center">
            Upload an image to visualize ResNet50 activations in 3D
          </p>
        </div>
      )}
    </main>
  );
}
