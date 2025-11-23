import React, { useState } from "react";

// ResNet50 visualization inspired by bbycroft.net/llm aesthetics
// Layout: horizontal pipeline of blocks (like your screenshot)
// Styling: dark, minimal, with a strong 3D / parallax feel using CSS transforms.

const BLOCKS = [
  {
    id: "block1",
    title: "Convolution Block 1",
    subtitle: "Edges (conv1)",
    description: "Low-level edges, simple color blobs.",
  },
  {
    id: "block2",
    title: "Convolution Block 2",
    subtitle: "Textures (layer1)",
    description: "Repetitive textures and color patterns.",
  },
  {
    id: "block3",
    title: "Convolution Block 3",
    subtitle: "Patterns (layer2)",
    description: "More complex motifs and shapes.",
  },
  {
    id: "block4",
    title: "Convolution Block 4",
    subtitle: "Parts (layer3)",
    description: "Object parts: eyes, wheels, handles.",
  },
  {
    id: "block5",
    title: "Convolution Block 5",
    subtitle: "Objects (layer4)",
    description: "High-level object templates.",
  },
  {
    id: "gap",
    title: "Global Average Pooling",
    subtitle: "Activations",
    description: "Spatial activation over the input image.",
    isGap: true,
  },
];

// Simple pseudo-feature tiles with gradients (so it looks good even without real images)
const FeatureTile: React.FC<{ index: number }> = ({ index }) => {
  const palette = [
    "from-cyan-400 via-blue-500 to-fuchsia-500",
    "from-amber-300 via-orange-500 to-rose-500",
    "from-emerald-300 via-teal-500 to-sky-500",
    "from-pink-400 via-red-500 to-yellow-400",
    "from-indigo-400 via-purple-500 to-pink-500",
    "from-lime-300 via-emerald-500 to-cyan-500",
  ];
  const color = palette[index % palette.length];
  return (
    <div
      className={`relative aspect-square rounded-md border border-white/5 bg-gradient-to-br ${color} overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08)]`}
    >
      <div className="absolute inset-0 opacity-30 mix-blend-soft-light bg-[radial-gradient(circle_at_0_0,#fff_0,transparent_45%),radial-gradient(circle_at_100%_100%,#fff_0,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.45),transparent_40%,transparent_60%,rgba(0,0,0,0.55))]" />
    </div>
  );
};

const ArrowLabel: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div
      className="relative flex items-center justify-center px-5 py-2 rounded-md bg-white/95 text-slate-900 text-[11px] font-semibold tracking-[0.16em] shadow-[0_10px_40px_rgba(0,0,0,0.8)] uppercase select-none origin-center transform-gpu perspective-[900px] hover:-translate-y-[2px] hover:shadow-[0_16px_50px_rgba(0,0,0,0.9)] transition-all duration-150"
    >
      <span>{label}</span>
      <div
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-4 [clip-path:polygon(0_0,100%_50%,0_100%)] bg-white/95"
      />
    </div>
  );
};

const BlockCard: React.FC<{
  title: string;
  subtitle: string;
  description: string;
  isGap?: boolean;
}> = ({ title, subtitle, description, isGap }) => {
  return (
    <div className="flex flex-col items-center gap-3 min-w-[230px]">
      <ArrowLabel label={title} />

      <div
        className="relative w-full rounded-2xl border border-slate-700/80 bg-[radial-gradient(circle_at_0_0,#22c1c3_0,transparent_40%),radial-gradient(circle_at_100%_100%,#fdbb2d_0,transparent_40%),linear-gradient(to_bottom,#020617,#020617)]/cover shadow-[0_20px_60px_rgba(0,0,0,0.9)] px-3 pt-3 pb-4 transform-gpu hover:-translate-y-1 hover:scale-[1.03] transition-transform duration-150"
      >
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200/80">
              {subtitle}
            </div>
            <div className="mt-1 text-[10px] text-slate-400 max-w-[180px] leading-snug">
              {description}
            </div>
          </div>
          <div className="text-[9px] text-slate-500/80 uppercase tracking-[0.16em]">
            ResNet50
          </div>
        </div>

        {!isGap ? (
          <div className="grid grid-cols-3 gap-[5px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <FeatureTile key={i} index={i} />
            ))}
          </div>
        ) : (
          <div className="relative mt-1 h-[180px] w-full rounded-xl border border-white/10 overflow-hidden bg-slate-900">
            {/* Color blobs */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#22c55e_0,transparent_45%),radial-gradient(circle_at_80%_30%,#0ea5e9_0,transparent_45%),radial-gradient(circle_at_30%_80%,#f97316_0,transparent_45%),radial-gradient(circle_at_80%_85%,#ec4899_0,transparent_45%)] opacity-80" />
            {/* Grid overlay to mimic activation map */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 mix-blend-overlay">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-white/10" style={{ opacity: 0.7 }} />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/70" />
          </div>
        )}
      </div>
    </div>
  );
};

const ResNet50Visualization: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);

  // 3D tilt state for the main pipeline panel
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    setUploadedName(file.name);
  };

  const handlePipelineMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    // Scale the tilt for a subtle but noticeable 3D effect
    const tiltX = x * 12; // rotateY
    const tiltY = -y * 10; // rotateX (invert so up is positive)

    setTilt({ x: tiltX, y: tiltY });
  };

  const handlePipelineMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-50 flex flex-col">
      {/* Top chrome similar to bbycroft: thin bar + title */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-black/40 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 shadow-[0_0_20px_rgba(56,189,248,0.7)]" />
          <div className="flex flex-col">
            <span className="text-[11px] tracking-[0.22em] uppercase text-slate-400">
              Model Visualization
            </span>
            <span className="text-xs font-semibold text-slate-100">
              ResNet50 Feature Hierarchy
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase tracking-[0.16em]">
          <div className="hidden sm:flex items-center gap-2">
            <span className="h-[6px] w-[6px] rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>Running Offline</span>
          </div>

          <label className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/70 text-[10px] tracking-[0.16em] cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.75)] hover:border-sky-400/70 hover:bg-slate-900/90 hover:shadow-[0_16px_40px_rgba(56,189,248,0.45)] transition-all">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <span className="h-[6px] w-[6px] rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
            <span>Upload Image</span>
          </label>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-6 pt-5 pb-8 overflow-hidden">
        {/* Left description panel */}
        <div className="lg:w-[280px] flex-shrink-0 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-800/80 bg-black/40 px-4 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.8)] flex flex-col gap-3">
            <div>
              <h1 className="text-sm font-semibold text-slate-50 mb-2">
                How ResNet50 builds understanding
              </h1>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Follow the image as it flows through the network. Each block sharpens the
                representation: edges turn into textures, textures into patterns, patterns into
                object parts, and finally into full objects and class scores.
              </p>
            </div>

            {/* Uploaded image preview */}
            <div className="mt-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span className="uppercase tracking-[0.16em]">Input Image</span>
                {uploadedName && (
                  <span className="truncate max-w-[130px] text-[9px] text-slate-500">
                    {uploadedName}
                  </span>
                )}
              </div>
              <div className="relative w-full aspect-[4/3] rounded-xl border border-slate-700/80 bg-slate-900/80 overflow-hidden flex items-center justify-center text-[10px] text-slate-600">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="px-4 text-center">
                    Upload an image above to trace how ResNet50 transforms it layer by layer.
                  </span>
                )}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(56,189,248,0.18)_0,transparent_45%),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.2)_0,transparent_45%)]" />
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
              <span>Step-by-step activations</span>
              <span className="px-[6px] py-[2px] rounded-full border border-slate-700/80 text-[9px] uppercase tracking-[0.16em] text-slate-300">
                ResNet50
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-black/40 px-4 py-3 text-[10px] text-slate-400 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-[0.16em] text-slate-500">Legend</span>
              <span className="text-slate-500">Edges → Objects</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="h-[9px] w-[9px] rounded-sm bg-gradient-to-br from-sky-400 to-cyan-500" />
                <span>Low-level filters (conv1)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-[9px] w-[9px] rounded-sm bg-gradient-to-br from-amber-300 to-rose-500" />
                <span>Textures & motifs (layer1–2)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-[9px] w-[9px] rounded-sm bg-gradient-to-br from-emerald-300 to-fuchsia-500" />
                <span>Parts & objects (layer3–4)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: horizontal pipeline of blocks with 3D feel */}
        <div className="flex-1 relative overflow-hidden">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.4)_0,transparent_55%),radial-gradient(circle_at_90%_80%,rgba(236,72,153,0.55)_0,transparent_55%)]" />

          {/* 3D floor grid behind the panel */}
          <div className="pointer-events-none absolute bottom-[-40%] left-1/2 -translate-x-1/2 w-[160%] h-[60%] bg-[radial-gradient(circle_at_50%_0,rgba(15,23,42,0.9)_0,transparent_60%)]">
            <div className="w-full h-full origin-top transform-gpu perspective-[1200px] -rotateX-60">
              <div className="w-full h-full bg-[linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-[size:24px_24px] opacity-70" />
            </div>
          </div>

          <div
            className="relative h-full w-full rounded-3xl border border-slate-800/80 bg-black/70 shadow-[0_30px_90px_rgba(0,0,0,1)] overflow-hidden flex flex-col transform-gpu"
            style={{
              transform: `perspective(1400px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(${tilt.y * -0.6}px)`,
              transition: "transform 0.18s ease-out",
            }}
            onMouseMove={handlePipelineMouseMove}
            onMouseLeave={handlePipelineMouseLeave}
          >
            <div className="px-5 pt-4 pb-2 flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800/80 bg-black/70">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-[0.16em]">Forward Pass</span>
                <span className="h-[3px] w-16 bg-gradient-to-r from-sky-400 to-fuchsia-500 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <span>Image → Features → Logits</span>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <div className="flex gap-7 px-5 py-5 min-w-max">
                {BLOCKS.map((b) => (
                  <BlockCard
                    key={b.id}
                    title={b.title}
                    subtitle={b.subtitle}
                    description={b.description}
                    isGap={b.isGap}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResNet50Visualization;
