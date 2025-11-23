# GitHub Pages Deployment Instructions

## Complete Step-by-Step Process:

### 1. Create GitHub Repository
Go to https://github.com/new and create a new repository:
- Name: `resnet50-3d-visualization` (or your preferred name)
- Public repository (required for free GitHub Pages)
- Don't initialize with README (we already have code)

### 2. Push Your Code
```bash
cd "/Users/pragathi.vetrivelmurugan/ResNet50 Interface"

# Add your GitHub repository as remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/resnet50-3d-visualization.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Configure GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. Click **Save**

### 4. Add Backend URL Secret
1. In your repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `BACKEND_API_URL`
4. Value: Your deployed backend URL (e.g., `https://your-backend.onrender.com`)
5. Click **Add secret**

### 5. Deploy!
The GitHub Action will automatically run when you push to main. You can also:
- Go to **Actions** tab
- Click **Deploy Next.js to GitHub Pages**
- Click **Run workflow** → **Run workflow**

### 6. Access Your Site
After deployment completes (2-3 minutes):
- Your site will be at: `https://YOUR_USERNAME.github.io/resnet50-3d-visualization/`
- Check the Actions tab for deployment status

## Important Notes:

### Backend Deployment First
Before deploying frontend, deploy your backend to:
- **Render.com** (recommended): https://render.com
  1. Create new Web Service
  2. Connect GitHub repo: `now_you_see_me_backend`
  3. Build command: `pip install -r requirements.txt`
  4. Start command: `gunicorn app:app`
  5. Add environment variables if needed
  
- **Railway.app**: https://railway.app
- **PythonAnywhere**: https://www.pythonanywhere.com

### Update API URL
After backend is deployed, update the secret:
1. Get your backend URL (e.g., `https://resnet50-backend.onrender.com`)
2. Update `BACKEND_API_URL` secret in GitHub
3. Re-run the GitHub Action

## Troubleshooting:

If build fails:
- Check Actions tab for error logs
- Ensure `BACKEND_API_URL` secret is set
- Verify `node_modules` is in `.gitignore`

If deployment succeeds but site doesn't work:
- Check browser console for CORS errors
- Ensure backend has CORS enabled for your GitHub Pages domain
- Verify API URL in environment variables
