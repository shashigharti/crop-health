# Docker Development

## 1. Configure `.env.docker`
```env
GEE_SERVICE_ACCOUNT=crophealth@your-project.iam.gserviceaccount.com
GEE_SERVICE_ACCOUNT_KEY_PATH=/credentials/your-key.json
```

## 2. Build & Run
```bash
make docker-build
make docker-start
```

Open **http://localhost:7860**

## Available Commands
| Command | Description |
|---|---|
| `make docker-build` | Build the image |
| `make docker-start` | Run the container |
| `make docker-stop` | Stop and remove container |
| `make docker-restart` | Stop, rebuild, and run |
| `make docker-logs` | Tail container logs |