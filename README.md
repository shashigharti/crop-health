---
title: CropMap
---

# CropMap

A crop mapping application for defining Areas of Interest, labeling crop feature polygons, and training classification models.

## Features

- Interactive map with Google Hybrid and Esri basemaps
- AOI management with editable classes
- Crop feature polygon management (cocoa, coffee, other)
- Stepper workflow with checkbox progress tracking
- Filters

## Local Development

### Backend
```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Build for production
```bash
cd frontend && npm run build
cd .. && uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Web View
![Alt text](frontend/src/docs/webui.png)