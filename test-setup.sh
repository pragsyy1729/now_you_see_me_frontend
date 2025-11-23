#!/bin/bash

# Test script to verify the setup

echo "🧪 Testing ResNet50 3D Visualization Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

# Test 1: Check Node.js
echo -n "Testing Node.js installation... "
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ PASS${NC} ($(node --version))"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 2: Check Python
echo -n "Testing Python installation... "
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓ PASS${NC} ($(python3 --version))"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 3: Check node_modules
echo -n "Testing frontend dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (run 'npm install')"
    ((FAILED++))
fi

# Test 4: Check Python venv
echo -n "Testing backend virtual environment... "
if [ -d "backend/venv" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (run setup.sh)"
    ((FAILED++))
fi

# Test 5: Check checkpoint file
echo -n "Testing model checkpoint... "
if [ -f "latest_checkpoint.pth" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ SKIP${NC} (will use pretrained weights)"
fi

# Test 6: Check .env.local
echo -n "Testing environment configuration... "
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (creating .env.local)"
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
    ((PASSED++))
fi

# Test 7: Check key files
echo -n "Testing project structure... "
FILES_OK=true
for file in "app/page.tsx" "components/ResNet3DVisualization.tsx" "backend/app.py"; do
    if [ ! -f "$file" ]; then
        FILES_OK=false
        break
    fi
done

if $FILES_OK; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Results: ${GREEN}${PASSED} passed${NC}, ${RED}${FAILED} failed${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! You're ready to go.${NC}"
    echo ""
    echo "To start the application:"
    echo "  Terminal 1: cd backend && source venv/bin/activate && python app.py"
    echo "  Terminal 2: npm run dev"
    echo ""
    echo "Then open: http://localhost:3000"
else
    echo -e "${RED}⚠️  Some tests failed. Please run ./setup.sh${NC}"
fi
