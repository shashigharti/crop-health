---
title: CropMap
---

# CropMap

A crop mapping application for defining Areas of Interest (AOIs), labeling crop feature polygons, and training classification models.

## Features

- Interactive map with Google Hybrid and Esri basemaps
- AOI management with editable classes
- Crop feature polygon labeling (cocoa, coffee, other)
- Guided stepper workflow with checkbox-based progress tracking
- Dynamic filters

## Local Development

### 1. Configure Environment Variables

Create a `.env` file in the project root:
```env
GEE_SERVICE_ACCOUNT=crophealth@abc-project.iam.gserviceaccount.com
GEE_SERVICE_ACCOUNT_KEY_PATH=/path/to/credentials/<filename>.json
```

### 2. Add GEE Credentials

Place your Google Earth Engine service account key (`.json`) inside the `credentials/` folder.

### 3. Install & Run
```bash
cd frontend && npm install && npm run build

uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## Production Build
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## Web UI

![Web UI](frontend/src/docs/webui.png)