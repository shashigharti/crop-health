.PHONY: start stop clean

start:
	@bash run.sh

stop:
	@pkill -f uvicorn || true

clean:
	@rm -rf .venv frontend/node_modules .env