# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Frontend (Port 3000)                 │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │           Next.js Application                     │  │ │
│  │  │  • App Router                                    │  │ │
│  │  │  • React Components                              │  │ │
│  │  │  • State Management                              │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │           3D Visualization Layer                  │  │ │
│  │  │  • React Three Fiber                             │  │ │
│  │  │  • Three.js Scene                                │  │ │
│  │  │  • WebGL Renderer                                │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │           API Client (Axios)                      │  │ │
│  │  │  • HTTP Requests                                 │  │ │
│  │  │  • Error Handling                                │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP REST API
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Port 5000)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Flask Server                         │ │
│  │  • CORS Enabled                                       │ │
│  │  • RESTful Endpoints                                  │ │
│  │  • Request Handling                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              PyTorch Model Layer                       │ │
│  │  • ResNet50 Architecture                              │ │
│  │  • Forward Hooks                                      │ │
│  │  • Activation Capture                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            Image Processing Pipeline                   │ │
│  │  • Preprocessing                                      │ │
│  │  • Normalization                                      │ │
│  │  • Tensor Conversion                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Image Upload & Processing Flow

```
1. User uploads image in browser
   ↓
2. Frontend sends image via POST /api/process-image
   ↓
3. Backend receives image
   ↓
4. Image preprocessing:
   • Resize to 256×256
   • Center crop to 224×224
   • Normalize with ImageNet stats
   ↓
5. Forward pass through ResNet50
   • Hooks capture layer activations
   ↓
6. Process activations:
   • Sample channels (max 16)
   • Normalize values
   • Convert to JSON
   ↓
7. Return to frontend:
   • Image preview (base64)
   • Layer activations
   • Top-5 predictions
   ↓
8. Frontend updates state
   ↓
9. 3D visualization rerenders with new data
   ↓
10. Activation heatmaps displayed
```

## Component Hierarchy

```
App (page.tsx)
├── Status Bar
│   └── Backend Health Indicator
├── Control Panel (ControlPanel.tsx)
│   ├── Header
│   ├── Upload Button
│   ├── Image Preview
│   ├── Layer List
│   └── Instructions
├── 3D Visualization (ResNet3DVisualization.tsx)
│   ├── Canvas
│   │   ├── Scene
│   │   │   ├── Lighting
│   │   │   ├── Stars
│   │   │   ├── Grid
│   │   │   ├── Layer Blocks (LayerBlock.tsx) ×6
│   │   │   │   ├── 3D Box Mesh
│   │   │   │   ├── Wireframe
│   │   │   │   ├── Particle System
│   │   │   │   ├── Labels
│   │   │   │   └── Glow Effect
│   │   │   └── Connection Lines (ConnectionLine.tsx) ×5
│   │   │       ├── Curved Line
│   │   │       └── Flowing Particles
│   │   ├── Camera
│   │   └── Controls (OrbitControls)
│   └── Environment
└── Activation Viewer (ActivationViewer.tsx)
    ├── Layer Name
    ├── Channel Count
    └── Heatmap Grid
```

## API Endpoints

### GET /api/health
**Purpose:** Health check
**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### GET /api/model-info
**Purpose:** Get ResNet50 architecture info
**Response:**
```json
{
  "architecture": "ResNet50",
  "layers": [
    {
      "name": "conv1",
      "title": "Conv Block 1",
      "description": "Low-level edges",
      "channels": 64,
      "size": 112,
      "position": [0, 0, 0]
    },
    ...
  ],
  "total_layers": 6
}
```

### POST /api/process-image
**Purpose:** Process uploaded image
**Request:** multipart/form-data with image file
**Response:**
```json
{
  "success": true,
  "image_preview": "data:image/jpeg;base64,...",
  "activations": {
    "conv1": {
      "type": "2d",
      "shape": [16, 112, 112],
      "data": [...],
      "num_channels": 64
    },
    ...
  },
  "predictions": {
    "top5_indices": [243, 245, ...],
    "top5_probabilities": [0.8, 0.1, ...]
  }
}
```

### GET /api/layer-activations/:layer_name
**Purpose:** Get specific layer activation
**Response:**
```json
{
  "layer_name": "layer1",
  "activation": {
    "type": "2d",
    "shape": [16, 56, 56],
    "data": [...],
    "num_channels": 256
  }
}
```

## State Management

### Frontend State (page.tsx)

```typescript
interface AppState {
  // Model architecture
  layers: LayerInfo[]
  
  // User interaction
  selectedLayer: string | null
  
  // Processing state
  isProcessing: boolean
  
  // Image data
  imagePreview: string | null
  
  // Neural network data
  activations: { [key: string]: ActivationData }
  
  // Connection status
  backendOnline: boolean
  
  // Error handling
  error: string | null
}
```

### 3D Scene State

```typescript
interface SceneState {
  // Camera position & orientation
  camera: {
    position: [x, y, z]
    rotation: [rx, ry, rz]
  }
  
  // Layer states
  layers: {
    [layerName: string]: {
      isActive: boolean
      hasActivation: boolean
      particlePositions: Float32Array
    }
  }
  
  // Animation state
  clock: {
    elapsedTime: number
    delta: number
  }
}
```

## Performance Optimizations

### Frontend
1. **React.memo** for component memoization
2. **useMemo** for expensive calculations
3. **useCallback** for event handlers
4. **Lazy loading** for 3D assets
5. **Particle count limits** (max 100 per layer)
6. **Throttled animations** at 60fps

### Backend
1. **Model caching** (loaded once on startup)
2. **Activation sampling** (16 channels max)
3. **Numpy vectorization** for array operations
4. **Efficient tensor operations** with PyTorch
5. **Image downsampling** for heatmaps

### 3D Rendering
1. **Instanced meshes** for repeated geometry
2. **Buffer geometry** for particles
3. **Level of detail (LOD)** for distant objects
4. **Frustum culling** automatic by Three.js
5. **Additive blending** for particles

## Security Considerations

### Current Implementation (Development)
- CORS enabled for all origins
- Debug mode enabled
- No authentication
- File uploads without validation

### Production Recommendations
- Restrict CORS origins
- Disable debug mode
- Add authentication (JWT/OAuth)
- Validate file types and sizes
- Rate limiting on uploads
- Use production WSGI server (Gunicorn)
- HTTPS/TLS encryption
- Input sanitization

## Scalability Considerations

### Current Limitations
- Single model instance (no parallel processing)
- Synchronous request handling
- No caching layer
- In-memory activation storage

### Scaling Strategies
1. **Horizontal Scaling:** Multiple backend instances with load balancer
2. **Caching:** Redis for activation results
3. **Queue System:** Celery for async processing
4. **CDN:** Static assets delivery
5. **Database:** PostgreSQL for user data
6. **Object Storage:** S3 for uploaded images

## Technology Choices Rationale

### Why Next.js?
- Built-in routing
- Fast refresh
- TypeScript support
- Optimized builds
- SEO capabilities

### Why React Three Fiber?
- Declarative 3D with React
- Component-based architecture
- Excellent performance
- Active community
- Easy integration with React ecosystem

### Why Flask?
- Lightweight and fast
- Easy PyTorch integration
- Simple REST API creation
- Good for ML backends
- Python ecosystem access

### Why PyTorch?
- Industry standard for deep learning
- Excellent model zoo (ResNet50)
- Dynamic computation graphs
- Hook system for activations
- Great documentation

## File Organization Principles

### Frontend
- **app/**: Next.js App Router pages
- **components/**: Reusable React components
- **lib/**: Utility functions and services
- **public/**: Static assets

### Backend
- **app.py**: Main Flask application
- **requirements.txt**: Python dependencies
- **venv/**: Isolated Python environment
- **uploads/**: Temporary file storage

### Root
- Configuration files (tsconfig, tailwind, etc.)
- Documentation (README, guides)
- Scripts (setup, start, test)
- Environment files (.env.local)

---

This architecture provides a solid foundation for a production-ready 3D neural network visualization tool!
