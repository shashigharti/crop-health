---
title: Crop Health
emoji: 🌍
colorFrom: green
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
license: mit
short_description: Crop Health Prediction
---

# 🌍 CropHealth

A crop mapping application for defining Areas of Interest (AOIs), labeling crop feature polygons, and training classification models using Google Earth Engine.

## Features
- Interactive map with Google Hybrid and Esri basemaps
- AOI management with editable classes
- Crop feature polygon labeling (cocoa, coffee, other)
- Guided stepper workflow with checkbox-based progress tracking
- Dynamic filters

## Documentation
- [Local Development](docs/local-development.md)
- [Docker](docs/docker.md)
- [HuggingFace Deployment](docs/deployment.md)
- [GEE Setup](docs/gee-setup.md)

## Quick Start

### 1. Add GEE Credentials
Place your GEE service account key (`.json`) inside the `credentials/` folder:

credentials/
└── your-key.json

### 2. Run
```bash
make start
```

That's it! The script will automatically:
- ✅ Detect your credentials and configure `.env`
- ✅ Install frontend dependencies
- ✅ Set up Python virtual environment
- ✅ Install Python dependencies
- ✅ Authenticate with Google Earth Engine
- ✅ Start the app at **http://localhost:7860**