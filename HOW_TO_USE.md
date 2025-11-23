# 🎮 How to Use Your 3D Visualization

## Step-by-Step Visual Guide

### 🚀 Step 1: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python app.py
```
✅ You should see: `Backend running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ You should see: `Ready on http://localhost:3000`

---

### 🌐 Step 2: Open in Browser

Navigate to: **http://localhost:3000**

You should see:
```
┌─────────────────────────────────────────────────────────┐
│  ● Backend Online    ResNet50 • 3D Neural Network       │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│   ResNet50  │         [3D Visualization Area]          │
│ 3D Visual.  │                                           │
│             │        🎨 Floating Layer Blocks           │
│ [Upload]    │        ✨ Star Background                │
│             │        📊 Grid Floor                      │
│ [Preview]   │        🔗 Connection Lines                │
│             │                                           │
│ Layers:     │      [Use mouse to rotate/zoom]           │
│ • Conv 1    │                                           │
│ • Conv 2    │                                           │
│ • Conv 3    │                                           │
│ • Conv 4    │                                           │
│ • Conv 5    │                                           │
│ • GAP       │                                           │
│             │                                           │
│ 💡 Tips     │                                           │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

---

### 📸 Step 3: Upload an Image

1. **Click "Upload Image"** button in left sidebar
2. **Choose an image** from your computer
   - Dogs, cats, cars, objects work best
   - Keep size under 5MB
3. **Wait for processing** (~1-2 seconds)

**What happens:**
```
Your Image
    ↓
[Upload Button] → Backend Processing
    ↓
ResNet50 Forward Pass
    ↓
Activation Extraction
    ↓
3D Visualization Update!
```

---

### 🎨 Step 4: Explore the 3D Scene

#### Mouse Controls:

**🔄 Rotate View**
```
Click + Drag anywhere on the 3D canvas
- Move left/right: Rotate around Y-axis
- Move up/down: Rotate around X-axis
```

**🔍 Zoom In/Out**
```
Scroll wheel up/down
- Scroll up: Zoom in (closer view)
- Scroll down: Zoom out (wider view)
```

**↔️ Pan View**
```
Right-click + Drag (or Shift + Left-click + Drag)
- Move horizontally/vertically
```

---

### 🎯 Step 5: Select Layers

**Method 1: Click 3D Blocks**
- Click any floating cube in the 3D scene
- The block will glow and pulse
- Activation viewer appears bottom-right

**Method 2: Use Sidebar**
- Click layer name in left sidebar
- Same effect as clicking 3D block

**Visual Feedback:**
```
Selected Layer:
┌─────────────┐
│   ✨ Glowing │  ← Emissive effect
│   📦 Block   │  ← Pulsing animation  
│   🌟 Glow    │  ← Outer sphere
└─────────────┘

Unselected Layer:
┌─────────────┐
│   📦 Block   │  ← Normal appearance
└─────────────┘
```

---

### 📊 Step 6: View Activations

When you select a layer, the **Activation Viewer** appears:

```
Bottom-Right Panel:
┌────────────────────────────────┐
│ layer3 Activations            │
│ 1024 channels total           │
├────────────────────────────────┤
│ ╔══╗ ╔══╗ ╔══╗ ╔══╗          │
│ ║🔥║ ║🟨║ ║🟦║ ║🟪║   Ch 0-3 │
│ ╚══╝ ╚══╝ ╚══╝ ╚══╝          │
│                                │
│ ╔══╗ ╔══╗ ╔══╗ ╔══╗          │
│ ║🟧║ ║🟩║ ║⬜║ ║🟥║   Ch 4-7 │
│ ╚══╝ ╚══╝ ╚══╝ ╚══╝          │
│                                │
│ ... 16 total heatmaps          │
└────────────────────────────────┘
```

**Color Meaning:**
- 🔥 Red/Yellow: High activation (feature detected)
- 🟦 Blue/Cyan: Medium activation
- ⬛ Dark: Low activation (no feature)

---

### 🎬 Complete Workflow Example

**1. Start both servers** ✅
**2. Open browser to localhost:3000** ✅
**3. See green "Backend Online" indicator** ✅
**4. Click "Upload Image"** 
**5. Select a picture of a dog** 🐕
**6. Image appears in preview** ✅
**7. 3D blocks light up** ✨
**8. Click "Conv Block 1" in sidebar**
**9. See edge detection heatmaps** 📊
**10. Click "Conv Block 5" in sidebar**
**11. See high-level object features** 🎯
**12. Rotate view to see connections** 🔄
**13. Watch particles flow between layers** ✨

---

### 💡 Pro Tips

#### Get the Best Visualizations:

1. **Use Clear Object Photos**
   ```
   ✅ Good: Single dog on plain background
   ✅ Good: Car in center of frame
   ✅ Good: Person clearly visible
   ❌ Avoid: Cluttered scenes
   ❌ Avoid: Abstract patterns
   ❌ Avoid: Very dark images
   ```

2. **Explore Different Layers**
   ```
   Conv 1 → Simple edges, lines
   Conv 2 → Textures, patterns
   Conv 3 → Complex shapes
   Conv 4 → Object parts (eyes, wheels)
   Conv 5 → Full objects
   GAP    → Spatial activation map
   ```

3. **Camera Angles**
   ```
   Side view:    See layer progression
   Top view:     See network depth
   Angled view:  See connections
   Close up:     Examine details
   ```

4. **Compare Layers**
   ```
   1. Upload cat image
   2. Click Conv 1 → See edges
   3. Click Conv 5 → See cat features
   4. Notice increasing abstraction!
   ```

---

### 🐛 Common Issues & Solutions

#### Problem: 3D Scene Not Showing
**Solution:**
```bash
1. Refresh browser (Cmd+R or Ctrl+R)
2. Check browser console (F12)
3. Try different browser (Chrome recommended)
4. Ensure WebGL is enabled
```

#### Problem: Upload Button Doesn't Work
**Solution:**
```bash
1. Check backend is running (Terminal 1)
2. Look for green "Backend Online" indicator
3. Check browser console for errors
4. Restart backend: cd backend && python app.py
```

#### Problem: No Activations Showing
**Solution:**
```bash
1. Wait for image processing to complete
2. Check that you uploaded a valid image
3. Click a layer after upload
4. Check backend terminal for errors
```

#### Problem: Slow Performance
**Solution:**
```bash
1. Close other tabs/applications
2. Use smaller image files
3. Reduce browser zoom level
4. Check GPU acceleration is enabled
```

---

### 🎨 Understanding the Visualization

#### What Am I Looking At?

**The 3D Blocks:**
- Each block = One major layer in ResNet50
- Size ≈ Feature map dimensions
- Color = Position in network (early → late)
- Glow = Selection status

**The Particles:**
- Represent neural activations
- More particles = More channels active
- Brighter = Stronger activation
- Rotation = Animation effect

**The Connection Lines:**
- Show data flow between layers
- Curved = Visual appeal
- Flowing dots = Data moving forward
- Brightness = Selection status

**The Heatmaps:**
- Each square = One feature channel
- Colors = Activation strength
- 4×4 grid = Sample of 16 channels
- Label shows original channel number

---

### 📱 Keyboard Shortcuts

```
Mouse Actions:
  Left Click + Drag    → Rotate view
  Right Click + Drag   → Pan view  
  Scroll Wheel         → Zoom

Selection:
  Click on 3D Block    → Select layer
  Click sidebar item   → Select layer

General:
  F12                  → Open dev tools
  Cmd+R / Ctrl+R       → Refresh page
```

---

### 🎯 Try These Experiments

1. **Edge Detection**
   - Upload photo with strong edges
   - Select Conv 1
   - See horizontal/vertical edge detectors!

2. **Feature Evolution**
   - Upload any image
   - Go through layers 1→5 sequentially
   - Watch features become more abstract

3. **Activation Intensity**
   - Upload clear object photo
   - Compare Conv 5 heatmaps
   - Brighter areas = Network "attention"

4. **Different Objects**
   - Try: dog, cat, car, airplane
   - Notice different activation patterns
   - Each class activates different features

---

### 📚 What You're Learning

Using this tool teaches:
- **CNN Architecture:** How layers process information
- **Feature Hierarchy:** Low-level → High-level features
- **Network Depth:** Why deep networks work
- **Activation Patterns:** What neurons "see"
- **Computer Vision:** How machines perceive images

---

### 🎉 Have Fun!

This is your personal neural network observatory. 

**Explore, experiment, and discover how ResNet50 sees the world!**

---

**Questions?** Check the full README.md or console output.
**Issues?** See troubleshooting section above.
**Ideas?** The code is yours to modify and extend!

Happy visualizing! 🚀✨
