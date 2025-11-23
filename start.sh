#!/bin/bash

# ResNet50 3D Visualization - Start Script
# Starts both frontend and backend servers

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting ResNet50 3D Visualization...${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend
echo -e "${BLUE}Starting backend server...${NC}"
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Failed to start backend server${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend running on http://localhost:5000 (PID: $BACKEND_PID)${NC}"
echo ""

# Start frontend
echo -e "${BLUE}Starting frontend server...${NC}"
npm run dev &
FRONTEND_PID=$!
sleep 5

# Check if frontend started successfully
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Failed to start frontend server${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi
echo -e "${GREEN}✅ Frontend running on http://localhost:3000 (PID: $FRONTEND_PID)${NC}"
echo ""

echo -e "${GREEN}🎉 Application is running!${NC}"
echo ""
echo -e "${BLUE}Open http://localhost:3000 in your browser${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
