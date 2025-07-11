# Go-Quant

A full-stack quantitative trading strategy builder and backtesting platform. The backend is powered by FastAPI and connects to the OKX exchange for real-time and historical market data. The frontend (in `src/`) provides a modern interface for strategy configuration, visualization, and performance analysis.

## Features

- Upload and store OHLCV (candlestick) data for multiple symbols
- Run backtests on custom strategies with technical indicators (EMA, RSI, MACD, etc.)
- Real-time strategy updates via WebSocket
- Integration with OKX exchange for live market data and account info
- Modular frontend for building and visualizing trading strategies

## Backend (FastAPI)

### Setup

1. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn pandas httpx pydantic numpy
   ```

2. **Configure OKX API keys:**
   Edit `backend/main.py` and set your `API_KEY`, `API_SECRET`, and `API_PASSPHRASE` at the top.

3. **Run the backend server:**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

### API Endpoints

- `POST /upload_ohlcv/{symbol}`: Upload OHLCV data for a symbol
- `GET /symbols`: List all uploaded symbols
- `POST /run_strategy`: Run a backtest with a given strategy configuration
- `GET /okx/candles`: Fetch OHLCV data from OKX
- `GET /okx/account`: Get OKX account balance
- `GET /okx/symbols`: List tradable symbols from OKX
- `WS /ws/{session_id}`: WebSocket for real-time strategy updates

## Frontend

The frontend is located in the `src/` directory and is built with React and TypeScript.

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the frontend:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**  
   Visit `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

```
project/
  backend/           # FastAPI backend
    main.py
  src/               # React frontend
    components/
    hooks/
    services/
    types/
  package.json       # Frontend dependencies
  README.md
```

## Notes

- Make sure to set your OKX API credentials before using exchange endpoints.
- The backend uses in-memory storage for uploaded data and sessions; restart will clear all data.
- For production, consider using a database and secure API key management.
