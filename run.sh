#!/bin/bash
set -e

echo "🌿 CropHealth"

# Resolve absolute path of project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 1. Check for credentials
if ! ls "$PROJECT_ROOT/credentials"/*.json &>/dev/null; then
  echo ""
  echo "📋 GEE Credentials Required:"
  echo "   1. Go to Google Cloud Console"
  echo "   2. Download your service account key (.json)"
  echo "   3. Place it in the credentials/ folder"
  echo ""
  read -p "Press Enter once you've added the credentials file..."
  ls "$PROJECT_ROOT/credentials"/*.json &>/dev/null || { echo "❌ Still missing. Exiting."; exit 1; }
fi

# 2. Create .env from .env.example if missing
if [ ! -f "$PROJECT_ROOT/.env" ]; then
  if [ -f "$PROJECT_ROOT/.env.example" ]; then
    cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
    echo "📄 .env created from .env.example"
  fi

  CRED_FILE=$(ls "$PROJECT_ROOT/credentials"/*.json | head -1)
  CRED_FILE_ABS="$(realpath "$CRED_FILE")"
  SERVICE_ACCOUNT=$(cat "$CRED_FILE_ABS" | python3 -c "import sys,json; print(json.load(sys.stdin)['client_email'])")

  grep -v "^GEE_" "$PROJECT_ROOT/.env" > "$PROJECT_ROOT/.env.tmp" 2>/dev/null || true
  echo "GEE_SERVICE_ACCOUNT=$SERVICE_ACCOUNT" >> "$PROJECT_ROOT/.env.tmp"
  echo "GEE_SERVICE_ACCOUNT_KEY_PATH=$CRED_FILE_ABS" >> "$PROJECT_ROOT/.env.tmp"
  mv "$PROJECT_ROOT/.env.tmp" "$PROJECT_ROOT/.env"
  echo "✅ .env configured"
fi

# 3. Install frontend dependencies (only if node_modules missing)
if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd "$PROJECT_ROOT/frontend" && npm install --fund=false --audit=false && cd "$PROJECT_ROOT"
  echo "✅ Frontend ready"
fi

# 4. Set up Python virtual environment (only if missing)
if [ ! -d "$PROJECT_ROOT/.venv" ]; then
  echo "🐍 Creating Python virtual environment..."
  python3 -m venv "$PROJECT_ROOT/.venv"
  echo "✅ Virtual environment created"
fi

source "$PROJECT_ROOT/.venv/bin/activate"

# 5. Install Python dependencies (only if missing)
if ! python3 -c "import fastapi" &>/dev/null; then
  echo "📦 Installing Python dependencies..."
  pip install -r "$PROJECT_ROOT/requirements.txt" -q
  echo "✅ Python dependencies installed"
fi

# 6. Install earthengine-api if missing
if ! python3 -c "import ee" &>/dev/null; then
  echo "🌍 Installing earthengine-api..."
  pip install earthengine-api -q
fi

# 7. Authenticate with Google Earth Engine (using absolute path from .env)
export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)

echo "🌍 Authenticating with Google Earth Engine..."
python3 - <<EOF
import os, ee

key_path = os.getenv("GEE_SERVICE_ACCOUNT_KEY_PATH")
service_account = os.getenv("GEE_SERVICE_ACCOUNT")

if not key_path or not service_account:
    print("❌ GEE env vars missing in .env")
    exit(1)

credentials = ee.ServiceAccountCredentials(service_account, key_path)
ee.Initialize(credentials)
print("✅ GEE authenticated successfully")
EOF

echo ""
echo "🚀 Starting CropHealth..."
echo ""

npx concurrently -n API,UI -c green,blue \
  "cd '$PROJECT_ROOT/backend' && PYTHONPATH=. uvicorn main:app --reload --port 8000" 