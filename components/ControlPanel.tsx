import React from 'react';

interface ControlPanelProps {
  selectedLayer: string | null;
  layers: Array<{
    name: string;
    title: string;
    description: string;
    channels: number;
  }>;
  onLayerSelect: (layerName: string) => void;
  onUploadImage: (file: File) => void;
  isProcessing: boolean;
  imagePreview: string | null;
  gradcamOverlay?: string | null;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedLayer,
  layers,
  onLayerSelect,
  onUploadImage,
  isProcessing,
  imagePreview,
  gradcamOverlay,
}) => {
  const [showGradCAM, setShowGradCAM] = React.useState(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800 overflow-y-auto z-10">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 shadow-[0_0_20px_rgba(56,189,248,0.7)]" />
          <div>
            <h1 className="text-lg font-bold text-white">ResNet50</h1>
            <p className="text-xs text-slate-400">3D Visualization</p>
          </div>
        </div>

        {/* Upload button */}
        <label className="relative flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/50 text-sm cursor-pointer hover:border-sky-400 hover:bg-slate-900 transition-all group">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          <svg
            className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-slate-300 group-hover:text-white transition-colors">
            {isProcessing ? 'Processing...' : 'Upload Image'}
          </span>
        </label>
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {showGradCAM && gradcamOverlay ? 'Grad-CAM Heatmap' : 'Input Image'}
            </p>
            {gradcamOverlay && (
              <button
                onClick={() => setShowGradCAM(!showGradCAM)}
                className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-sky-600 hover:text-white transition-colors"
              >
                {showGradCAM ? '👁️ Original' : '🔥 Grad-CAM'}
              </button>
            )}
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-700">
            <img
              src={showGradCAM && gradcamOverlay ? gradcamOverlay : imagePreview}
              alt={showGradCAM ? 'Grad-CAM overlay' : 'Uploaded preview'}
              className="w-full h-full object-cover"
            />
          </div>
          {gradcamOverlay && (
            <p className="text-xs text-slate-500 mt-2">
              💡 Grad-CAM shows which image regions influenced the prediction
            </p>
          )}
        </div>
      )}

      {/* Layer list */}
      <div className="p-6">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-4">
          Network Layers
        </p>
        <div className="space-y-2">
          {layers.map((layer, index) => (
            <button
              key={layer.name}
              onClick={() => onLayerSelect(layer.name)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedLayer === layer.name
                  ? 'bg-sky-500/20 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">
                  {layer.title}
                </span>
                <span className="text-xs text-slate-500">#{index + 1}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                {layer.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-800">
                  {layer.channels} ch
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info section */}
      <div className="p-6 border-t border-slate-800">
        <div className="text-xs text-slate-500 space-y-2">
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Click layer blocks to inspect
          </p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            Drag to rotate view
          </p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
            Scroll to zoom
          </p>
        </div>
      </div>
    </div>
  );
};
