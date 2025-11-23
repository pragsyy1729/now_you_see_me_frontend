import React from 'react';
import { getClassName } from '../lib/imagenet-classes';

interface ActivationViewerProps {
  layerName: string | null;
  activationData: any;
  predictions?: {
    indices: number[];
    probabilities: number[];
    names?: string[];
  } | null;
}

export const ActivationViewer: React.FC<ActivationViewerProps> = ({
  layerName,
  activationData,
  predictions,
}) => {
  const [showChannelGrid, setShowChannelGrid] = React.useState(true);

  if (!layerName || !activationData) {
    return null;
  }

  const renderHeatmap = () => {
    // Channel grid visualization for layer4 (2048 channels × 7×7 spatial)
    // Can be toggled to show sampled channels instead
    if (activationData.type === 'channel_grid' && activationData.data) {
      const gridData = activationData.data as number[][];
      const layout = activationData.grid_layout;
      
      // If user toggles off, show sampled channel view instead
      if (!showChannelGrid) {
        // Convert back to sampled view - just show first 16 channels
        const channels = activationData.num_channels;
        const sampleIndices = Array.from({length: 16}, (_, i) => Math.floor(i * channels / 16));
        const heatmaps: number[][][] = [];
        
        for (let idx of sampleIndices) {
          const row = Math.floor(idx / layout.cols);
          const col = idx % layout.cols;
          const channelHeatmap: number[][] = [];
          
          for (let i = 0; i < layout.cell_height; i++) {
            const rowData: number[] = [];
            for (let j = 0; j < layout.cell_width; j++) {
              const gridRow = row * layout.cell_height + i;
              const gridCol = col * layout.cell_width + j;
              rowData.push(gridData[gridRow][gridCol]);
            }
            channelHeatmap.push(rowData);
          }
          heatmaps.push(channelHeatmap);
        }
        
        return (
          <div className="space-y-4">
            <div className="mb-2 px-3 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-300">
                  📊 Original View: Sampled Channels
                </p>
                <p className="text-xs text-blue-200/70 mt-1">
                  Showing 16 of {channels} channels
                </p>
              </div>
              <button
                onClick={() => setShowChannelGrid(true)}
                className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded transition-colors"
              >
                🔬 Show All Channels
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {heatmaps.map((heatmap: number[][], index: number) => (
                <div
                  key={index}
                  className="aspect-square bg-slate-900 rounded border border-slate-700 overflow-hidden relative"
                >
                  <canvas
                    ref={(canvas) => {
                      if (canvas && heatmap) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          const height = heatmap.length;
                          const width = heatmap[0]?.length || 0;
                          
                          canvas.width = width;
                          canvas.height = height;
                          
                          const imageData = ctx.createImageData(width, height);
                          
                          for (let y = 0; y < height; y++) {
                            for (let x = 0; x < width; x++) {
                              const value = heatmap[y][x];
                              const pixelIndex = (y * width + x) * 4;
                              
                              // Create hot colormap (blue -> cyan -> yellow -> red)
                              const r = Math.floor(value * 255);
                              const g = Math.floor(value * 200);
                              const b = Math.floor((1 - value) * 255);
                              
                              imageData.data[pixelIndex] = r;
                              imageData.data[pixelIndex + 1] = g;
                              imageData.data[pixelIndex + 2] = b;
                              imageData.data[pixelIndex + 3] = 255;
                            }
                          }
                          
                          ctx.putImageData(imageData, 0, 0);
                        }
                      }
                    }}
                    className="w-full h-full"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                    <span className="text-[8px] text-slate-300">
                      Ch {sampleIndices[index]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      return (
        <div className="space-y-4">
          <div className="mb-2 px-3 py-2 bg-purple-500/20 border border-purple-400/30 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-300">
                🔬 Advanced View: All Channels Grid
              </p>
              <p className="text-xs text-purple-200/70 mt-1">
                Showing all {activationData.num_channels} channels as 7×7 heatmaps
              </p>
            </div>
            <button
              onClick={() => setShowChannelGrid(false)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors"
            >
              📊 Show Sampled
            </button>
          </div>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-blue-300">
              Channel Grid ({layout.rows}×{layout.cols} cells, {layout.cell_height}×{layout.cell_width} each)
            </h4>
            <div className="flex gap-2 items-center text-xs text-gray-400">
              <span>Low</span>
              <div className="w-24 h-4 rounded" 
                   style={{background: 'linear-gradient(to right, #1e3a8a, #3b82f6, #fbbf24, #dc2626)'}} />
              <span>High</span>
            </div>
          </div>
          <canvas
            ref={(canvas) => {
              if (!canvas) return;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) return;
              
              // Set canvas size for crisp rendering
              const cellSize = 2; // pixels per spatial location
              canvas.width = gridData[0].length * cellSize;
              canvas.height = gridData.length * cellSize;
              
              // Draw mega-grid with color mapping
              for (let i = 0; i < gridData.length; i++) {
                for (let j = 0; j < gridData[i].length; j++) {
                  const value = gridData[i][j];
                  
                  // Color mapping: blue (low) -> cyan -> yellow -> red (high)
                  let r, g, b;
                  if (value < 0.25) {
                    // Blue to cyan
                    const t = value / 0.25;
                    r = Math.floor(30 + t * (59 - 30));
                    g = Math.floor(58 + t * (130 - 58));
                    b = Math.floor(138 + t * (246 - 138));
                  } else if (value < 0.5) {
                    // Cyan to yellow
                    const t = (value - 0.25) / 0.25;
                    r = Math.floor(59 + t * (251 - 59));
                    g = Math.floor(130 + t * (191 - 130));
                    b = Math.floor(246 + t * (36 - 246));
                  } else if (value < 0.75) {
                    // Yellow to orange
                    const t = (value - 0.5) / 0.25;
                    r = Math.floor(251 + t * (249 - 251));
                    g = Math.floor(191 + t * (115 - 191));
                    b = Math.floor(36 + t * (22 - 36));
                  } else {
                    // Orange to red
                    const t = (value - 0.75) / 0.25;
                    r = Math.floor(249 + t * (220 - 249));
                    g = Math.floor(115 + t * (38 - 115));
                    b = Math.floor(22 + t * (38 - 22));
                  }
                  
                  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                  ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                  
                  // Draw grid lines to separate channels
                  if (j % layout.cell_width === 0 || i % layout.cell_height === 0) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                  }
                }
              }
            }}
            className="w-full h-auto border border-gray-700 rounded"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="text-xs text-slate-400">
            All {activationData.num_channels} channels displayed as {layout.cell_height}×{layout.cell_width} heatmaps. 
            Each small square shows what that filter detects.
          </p>
        </div>
      );
    }
    
    // Grid visualization for avgpool layer (1x1 spatial with many channels)
    if (activationData.type === 'grid' && activationData.data) {
      const gridData = activationData.data as number[][];
      const gridSize = gridData.length;
      
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-blue-300">
              Activation Grid ({gridSize}×{gridSize} cells)
            </h4>
            <div className="flex gap-2 items-center text-xs text-gray-400">
              <span>Low</span>
              <div className="w-24 h-4 rounded" 
                   style={{background: 'linear-gradient(to right, #1e3a8a, #3b82f6, #fbbf24, #dc2626)'}} />
              <span>High</span>
            </div>
          </div>
          <canvas
            ref={(canvas) => {
              if (!canvas) return;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) return;
              
              // Set canvas size for crisp rendering
              const cellSize = 4; // pixels per cell
              canvas.width = gridSize * cellSize;
              canvas.height = gridSize * cellSize;
              
              // Draw grid with color mapping
              for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                  const value = gridData[i][j];
                  
                  // Color mapping: blue (low) -> cyan -> yellow -> red (high)
                  let r, g, b;
                  if (value < 0.25) {
                    // Blue to cyan
                    const t = value / 0.25;
                    r = Math.floor(30 + t * (59 - 30));
                    g = Math.floor(58 + t * (130 - 58));
                    b = Math.floor(138 + t * (246 - 138));
                  } else if (value < 0.5) {
                    // Cyan to yellow
                    const t = (value - 0.25) / 0.25;
                    r = Math.floor(59 + t * (251 - 59));
                    g = Math.floor(130 + t * (191 - 130));
                    b = Math.floor(246 + t * (36 - 246));
                  } else if (value < 0.75) {
                    // Yellow to orange
                    const t = (value - 0.5) / 0.25;
                    r = Math.floor(251 + t * (249 - 251));
                    g = Math.floor(191 + t * (115 - 191));
                    b = Math.floor(36 + t * (22 - 36));
                  } else {
                    // Orange to red
                    const t = (value - 0.75) / 0.25;
                    r = Math.floor(249 + t * (220 - 249));
                    g = Math.floor(115 + t * (38 - 115));
                    b = Math.floor(22 + t * (38 - 22));
                  }
                  
                  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                  ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                }
              }
            }}
            className="w-full h-auto border border-gray-700 rounded"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="text-xs text-slate-400">
            Each cell represents one of {activationData.num_channels} channel activations
          </p>
        </div>
      );
    }
    
    if (activationData.type === '2d' && activationData.data) {
      const heatmaps = activationData.data;
      
      return (
        <div className="grid grid-cols-4 gap-2">
          {heatmaps.slice(0, 16).map((heatmap: number[][], index: number) => (
            <div
              key={index}
              className="aspect-square bg-slate-900 rounded border border-slate-700 overflow-hidden relative"
            >
              <canvas
                ref={(canvas) => {
                  if (canvas && heatmap) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      const height = heatmap.length;
                      const width = heatmap[0]?.length || 0;
                      
                      canvas.width = width;
                      canvas.height = height;
                      
                      const imageData = ctx.createImageData(width, height);
                      
                      for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                          const value = heatmap[y][x];
                          const pixelIndex = (y * width + x) * 4;
                          
                          // Create hot colormap (blue -> cyan -> yellow -> red)
                          const r = Math.floor(value * 255);
                          const g = Math.floor(value * 200);
                          const b = Math.floor((1 - value) * 255);
                          
                          imageData.data[pixelIndex] = r;
                          imageData.data[pixelIndex + 1] = g;
                          imageData.data[pixelIndex + 2] = b;
                          imageData.data[pixelIndex + 3] = 255;
                        }
                      }
                      
                      ctx.putImageData(imageData, 0, 0);
                    }
                  }
                }}
                className="w-full h-full"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                <span className="text-[8px] text-slate-300">
                  Ch {activationData.sampled_channels?.[index] || index}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="absolute bottom-0 right-0 m-6 w-96 max-h-96 bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-xl overflow-hidden z-10">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-white">
          {layerName} Activations
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {activationData.num_channels} channels total
        </p>
      </div>
      
      <div className="p-4 overflow-y-auto max-h-80">
        {/* Show top predictions for final layer */}
        {predictions && (
          <div className="mb-4 p-3 bg-gradient-to-r from-sky-500/10 to-fuchsia-500/10 border border-sky-400/30 rounded-lg">
            <p className="text-xs font-semibold text-sky-400 mb-2">🎯 Top Prediction</p>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-white">
                {predictions.names?.[0] || getClassName(predictions.indices[0])}
              </span>
              <span className="text-lg font-bold text-sky-400">
                {(predictions.probabilities[0] * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Class {predictions.indices[0]}</p>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-fuchsia-500 rounded-full"
                style={{ width: `${predictions.probabilities[0] * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {renderHeatmap()}
      </div>
    </div>
  );
};
