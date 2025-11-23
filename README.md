# ResNet50 3D Visualization

A stunning, fully functional web application that visualizes the ResNet50 neural network architecture in interactive 3D space. Upload images and watch as they flow through the network layers, with real-time activation visualizations.

![ResNet50 3D Visualization](https://img.shields.io/badge/ResNet50-3D%20Visualization-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-3D-green)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)

## Features

✨ **Interactive 3D Visualization**
- Navigate through ResNet50 architecture in 3D space
- Real-time layer activations rendered as particles and heatmaps
- Smooth animations and transitions

🎨 **Beautiful UI**
- Dark, minimal aesthetic inspired by modern visualization tools
- Responsive design with Tailwind CSS
- Intuitive controls and interactions

🧠 **Real Neural Network**
- Uses PyTorch ResNet50 model
- Loads your custom checkpoint (`latest_checkpoint.pth`)
- Real activation extraction from all layers

🖼️ **Image Processing**
- Upload any image for classification
- See how the network processes it layer by layer
- View top-5 predictions with probabilities

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React Three Fiber** - 3D rendering with Three.js
- **@react-three/drei** - Useful helpers for R3F
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - API requests

### Backend
- **Flask** - Python web framework
- **PyTorch** - Deep learning framework
- **torchvision** - Pre-trained models and transforms
- **Pillow** - Image processing

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **pip** for Python packages

## Installation

### 1. Clone and Navigate

```bash
cd "ResNet50 Interface"
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

## Running the Application

You need to run both the backend and frontend servers.

### Option 1: Run Both Servers Simultaneously (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

The backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### Option 2: Using NPM Scripts

**Terminal 1:**
```bash
npm run backend
```

**Terminal 2:**
```bash
npm run dev
```

## Usage

1. **Open your browser** to `http://localhost:3000`

2. **Wait for backend connection** - You'll see a green "Backend Online" indicator when ready

3. **Upload an image:**
   - Click the "Upload Image" button in the left panel
   - Select any image file (JPG, PNG, etc.)
   - The backend will process it through ResNet50

4. **Explore the visualization:**
   - **Rotate**: Click and drag on the 3D canvas
   - **Zoom**: Scroll wheel
   - **Pan**: Right-click and drag (or Shift + drag)
   - **Select layers**: Click on blocks in 3D or use the sidebar

5. **View activations:**
   - Selected layer activations appear in the bottom-right panel
   - Each heatmap shows a different feature channel
   - Brighter areas indicate higher activation

## Project Structure

```
ResNet50 Interface/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ResNet3DVisualization.tsx  # Main 3D scene
│   ├── LayerBlock.tsx        # Individual layer visualization
│   ├── ConnectionLine.tsx    # Connections between layers
│   ├── ControlPanel.tsx      # Left sidebar controls
│   └── ActivationViewer.tsx  # Activation heatmap display
├── lib/
│   └── api.ts                # API service for backend communication
├── backend/
│   ├── app.py                # Flask server
│   ├── requirements.txt      # Python dependencies
│   └── uploads/              # Temporary image storage
├── latest_checkpoint.pth     # Your ResNet50 checkpoint
├── package.json              # Node.js dependencies
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── next.config.js            # Next.js configuration
```

## Architecture

### Frontend Architecture

The application uses a modern React setup with:
- **Next.js App Router** for routing and server-side rendering
- **React Three Fiber** for declarative 3D scene management
- **Component-based architecture** for modularity

Key components:
- `ResNet3DVisualization`: Manages the 3D scene, camera, and lighting
- `LayerBlock`: Renders individual network layers as 3D objects
- `ConnectionLine`: Animates data flow between layers
- `ControlPanel`: Provides UI controls for interaction
- `ActivationViewer`: Displays activation heatmaps

### Backend Architecture

Flask server with:
- **Model loading**: Loads ResNet50 and your custom checkpoint
- **Forward hooks**: Captures layer activations during inference
- **Image preprocessing**: Standardizes input images
- **RESTful API**: Provides endpoints for model interaction

API Endpoints:
- `GET /api/health` - Health check
- `GET /api/model-info` - Get layer information
- `POST /api/process-image` - Upload and process image
- `GET /api/layer-activations/<layer>` - Get specific layer activation

## Customization

### Using Your Own Model

The backend automatically loads `latest_checkpoint.pth`. Ensure your checkpoint:
- Is a PyTorch state dict
- Contains weights compatible with ResNet50 architecture
- Is located in the project root directory

### Adjusting Visualization

Edit `components/LayerBlock.tsx` to customize:
- Block sizes and colors
- Particle effects
- Animation speeds

Edit `components/ResNet3DVisualization.tsx` to adjust:
- Camera position and controls
- Lighting setup
- Grid and environment

### Styling

Modify `app/globals.css` and `tailwind.config.js` for:
- Color schemes
- Typography
- Animations

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed: `python3 --version`
- Activate virtual environment: `source backend/venv/bin/activate`
- Install dependencies: `pip install -r backend/requirements.txt`

### Frontend shows "Backend Offline"
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure `.env.local` has correct API URL

### 3D scene not rendering
- Check browser console for WebGL errors
- Ensure your browser supports WebGL 2.0
- Try disabling hardware acceleration if issues persist

### Image processing fails
- Ensure image is a valid format (JPG, PNG)
- Check image file size (< 10MB recommended)
- Verify checkpoint loaded successfully in backend logs

### Module not found errors
- Delete `node_modules` and run `npm install` again
- Delete `.next` folder and rebuild: `npm run build`
- Ensure all dependencies are installed

## Performance Tips

- **Reduce particle count** in `LayerBlock.tsx` if performance is slow
- **Limit heatmap samples** in backend `activation_to_heatmap()`
- **Use smaller images** for faster processing
- **Close other 3D-intensive applications**

## Development

### Running in Development Mode

```bash
npm run dev
```

This enables:
- Hot module replacement
- Fast refresh
- Source maps
- Detailed error messages

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Credits

- **Architecture inspiration**: [bbycroft.net/llm](https://bbycroft.net/llm)
- **ResNet50**: [Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385)
- **Three.js**: [threejs.org](https://threejs.org/)
- **React Three Fiber**: [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Special thanks to the PyTorch, Three.js, and React communities for their amazing tools and documentation.

---

**Enjoy visualizing your neural networks! 🚀**

For questions or issues, please open an issue on the repository.
