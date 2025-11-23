# Quick Start Guide

## ⚡ Fast Setup (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

### Step 2: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 3: Open Browser

Navigate to: **http://localhost:3000**

---

## 🎯 What to Expect

1. **Green "Backend Online" indicator** appears in top-left
2. **3D visualization** of ResNet50 layers in the center
3. **Upload button** in the left sidebar

---

## 🖼️ Try It Out

1. Click **"Upload Image"** in the left panel
2. Select any image (dog, cat, car, etc.)
3. Watch the network process it!
4. Click on 3D blocks to see layer activations
5. View heatmaps in the bottom-right panel

---

## 🎮 Controls

- **Rotate:** Click + Drag
- **Zoom:** Scroll Wheel  
- **Pan:** Right-Click + Drag
- **Select Layer:** Click on blocks

---

## 🐛 Troubleshooting

### Backend shows offline?
```bash
# Make sure Flask is running on port 5000
cd backend
source venv/bin/activate
python app.py
```

### Frontend errors?
```bash
# Reinstall dependencies
rm -rf node_modules .next
npm install
npm run dev
```

### Can't see 3D visualization?
- Refresh the page
- Check browser console (F12)
- Make sure WebGL is enabled

---

## 📁 Project Structure

```
ResNet50 Interface/
├── app/page.tsx           # Main app
├── components/            # UI components
├── backend/app.py         # Flask API
└── latest_checkpoint.pth  # Your model
```

---

## 💡 Tips

- Use **smaller images** (< 1MB) for faster processing
- **Click layers** in 3D to see their activations
- **Drag the view** to explore from different angles
- Check the **sidebar** for layer information

---

**Need help?** Check the full README.md for detailed documentation.
