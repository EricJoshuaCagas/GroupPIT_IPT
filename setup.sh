#!/bin/bash
# Comprehensive setup script for LoanTracker Authentication System

echo "=================================================="
echo "LoanTracker Authentication System Setup"
echo "=================================================="

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Backend Setup
echo -e "${YELLOW}Step 1: Installing Python dependencies...${NC}"
cd backend
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

# Step 2: Apply Migrations
echo -e "${YELLOW}Step 2: Applying database migrations...${NC}"
python manage.py migrate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations applied${NC}"
else
    echo -e "${RED}✗ Failed to apply migrations${NC}"
    exit 1
fi

# Step 3: Create Superuser
echo -e "${YELLOW}Step 3: Creating superuser account...${NC}"
echo "Visit http://localhost:8000/admin to login"
python manage.py createsuperuser

# Step 4: Frontend Setup
echo -e "${YELLOW}Step 4: Installing Node dependencies...${NC}"
cd ../frontend
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Node dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install Node dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}=================================================="
echo "Setup Complete!"
echo "=================================================="
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start the backend: cd backend && python manage.py runserver"
echo "2. In a new terminal, start the frontend: cd frontend && npm run dev"
echo "3. Access the application at http://localhost:3000"
echo "4. Login with your credentials or create a new account"
