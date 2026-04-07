# Local Development

## Prerequisites
- Node.js 20+
- Python 3.11+
- Google Earth Engine service account

## 1. Configure Environment Variables
Create a `.env` file in the project root:
```env
GEE_SERVICE_ACCOUNT=crophealth@your-project.iam.gserviceaccount.com
GEE_SERVICE_ACCOUNT_KEY_PATH=/path/to/credentials/your-key.json
```

## 2. Add GEE Credentials
Place your GEE service account key (`.json`) inside the `credentials/` folder:

credentials/
└── your-key.json

## 3. Install & Run
```bash
cd frontend && npm install && npm run build && cd ..
pip install -r requirements.txt
make start
```

Open **http://localhost:7860**