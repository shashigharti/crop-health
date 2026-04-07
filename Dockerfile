FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json .
RUN npm install
COPY frontend/ .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app

RUN useradd -m -u 1000 user
RUN mkdir -p /credentials && chown user:user /credentials

USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONPATH=/app/backend

COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user backend/ ./backend/
COPY --chown=user --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 7860

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]