from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import pandas as pd
import uvicorn
import uuid
import time
import hmac
import hashlib
import base64
import httpx
import asyncio
from datetime import datetime, timezone
import numpy as np
from fastapi import FastAPI, HTTPException
import requests
from datetime import datetime

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------- OKX Configuration ----------------------------
OKX_BASE_URL = "https://www.okx.com"
API_KEY = "your_api_key"
API_SECRET = "your_api_secret"
API_PASSPHRASE = "your_passphrase"

# ---------------------------- Data Models ----------------------------
class OHLCVData(BaseModel):
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    volume: float

class StrategyConfig(BaseModel):
    symbols: List[str]
    market_type: str
    exchange: str
    indicators: List[str]
    logic: str
    order_type: str
    slippage: float
    fees: float
    risk: dict
    portfolio_allocation: float

# ---------------------------- In-Memory Storage ----------------------------
ohlcv_store = {}
strategy_sessions = {}
connections = {}

# ---------------------------- Utility Functions ----------------------------
def generate_okx_headers(method: str, endpoint: str, body: str = ""):
    timestamp = datetime.now(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z')
    message = f"{timestamp}{method}{endpoint}{body}"
    sign = base64.b64encode(
        hmac.new(
            API_SECRET.encode(), message.encode(), hashlib.sha256
        ).digest()
    ).decode()
    return {
        "OK-ACCESS-KEY": API_KEY,
        "OK-ACCESS-SIGN": sign,
        "OK-ACCESS-TIMESTAMP": timestamp,
        "OK-ACCESS-PASSPHRASE": API_PASSPHRASE,
        "Content-Type": "application/json"
    }

def calculate_indicators(df: pd.DataFrame):
    df['EMA_12'] = df['close'].ewm(span=12, adjust=False).mean()
    df['EMA_26'] = df['close'].ewm(span=26, adjust=False).mean()
    df['RSI'] = compute_rsi(df['close'])
    macd_line = df['EMA_12'] - df['EMA_26']
    signal_line = macd_line.ewm(span=9, adjust=False).mean()
    df['MACD'] = macd_line - signal_line
    return df

def compute_rsi(series: pd.Series, period: int = 14):
    delta = series.diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

def run_backtest(symbol: str, df: pd.DataFrame, config: StrategyConfig):
    df = calculate_indicators(df)
    df.dropna(inplace=True)

    entry_price = df.iloc[0]['close']
    exit_price = df.iloc[-1]['close']
    pnl_percent = ((exit_price - entry_price) / entry_price) * 100

    max_drawdown = ((df['close'].cummax() - df['close']) / df['close'].cummax()).max() * 100
    sharpe_ratio = df['close'].pct_change().mean() / df['close'].pct_change().std() * np.sqrt(252)
    volatility = df['close'].pct_change().std() * np.sqrt(252) * 100

    return {
        "symbol": symbol,
        "PnL %": round(pnl_percent, 2),
        "PnL $": round(pnl_percent * 1000 / 100, 2),
        "CAGR %": round(pnl_percent / (len(df)/252), 2),
        "Sharpe": round(sharpe_ratio, 2),
        "Sortino": round(sharpe_ratio, 2),  # Placeholder
        "Calmar": round(pnl_percent / max_drawdown, 2) if max_drawdown != 0 else None,
        "Max Drawdown %": round(max_drawdown, 2),
        "Max Drawdown $": round(max_drawdown * entry_price / 100, 2),
        "Volatility %": round(volatility, 2),
        "Total Trades": len(df),
        "Win Rate %": 60.0,  # Placeholder
        "Avg Trade Duration (hrs)": round(len(df) / 24, 2),
        "Largest win %": 4.5,  # Placeholder
        "Largest loss %": -2.8,  # Placeholder
        "Turnover %": 130.0,  # Placeholder
        "Value at Risk (VaR) %": 5.0,  # Placeholder
        "Leverage %": 2.0,  # Placeholder
        "Beta to BTC-USDT": 1.1  # Placeholder
    }
@app.post("/fetch_ohlcv/{symbol}")
def fetch_and_store_ohlcv(symbol: str):
    try:
        interval = "1m"
        limit = 100
        url = f"https://www.okx.com/api/v5/market/candles?instId={symbol}&bar={interval}&limit={limit}"
        resp = requests.get(url)

        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail="Failed to fetch from OKX")

        raw_data = resp.json()["data"]
        formatted = [
            {
                "timestamp": datetime.utcfromtimestamp(int(row[0]) / 1000).isoformat() + "Z",
                "open": float(row[1]),
                "high": float(row[2]),
                "low": float(row[3]),
                "close": float(row[4]),
                "volume": float(row[5])
            }
            for row in raw_data
        ]

        # Save this data to database or cache
        save_ohlcv_to_db(symbol, formatted)  # You must implement this

        return { "message": f"OHLCV for {symbol} uploaded", "count": len(formatted) }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# ---------------------------- API Routes ----------------------------
@app.post("/upload_ohlcv/{symbol}")
def save_ohlcv_to_db(symbol: str, data: List[dict]):
    df = pd.DataFrame(data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)
    ohlcv_store[symbol] = df

async def upload_ohlcv(symbol: str, data: List[OHLCVData]):
    df = pd.DataFrame([d.dict() for d in data])
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)
    ohlcv_store[symbol] = df
    return {"message": f"Data uploaded for {symbol}", "rows": len(df)}

@app.get("/symbols")
async def get_symbols():
    return list(ohlcv_store.keys())

@app.post("/run_strategy")
async def run_strategy(config: StrategyConfig):
    session_id = str(uuid.uuid4())
    strategy_sessions[session_id] = config

    results = []
    for symbol in config.symbols:
        df = ohlcv_store.get(symbol)
        if df is not None:
            res = run_backtest(symbol, df, config)
            results.append(res)
    return {"session_id": session_id, "results": results}

# ---------------------------- WebSocket ----------------------------
@app.websocket("/ws/{session_id}")
async def strategy_updates(session_id: str, websocket: WebSocket):
    await websocket.accept()
    connections[session_id] = websocket
    try:
        while True:
            await websocket.send_json({"update": f"Running strategy session {session_id}..."})
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        del connections[session_id]
        print(f"WebSocket closed for session {session_id}")

# ---------------------------- OKX Endpoints ----------------------------
@app.get("/okx/candles")
async def get_okx_ohlcv(inst_id: str = "BTC-USDT", bar: str = "1m", limit: int = 100):
    endpoint = f"/api/v5/market/candles?instId={inst_id}&bar={bar}&limit={limit}"
    url = OKX_BASE_URL + endpoint
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    if response.status_code == 200:
        data = response.json()["data"]
        df = pd.DataFrame(data, columns=[
            "timestamp", "open", "high", "low", "close", "volume", "turnover", "confirm", "trade_id"
        ])
        df = df.astype({"open": float, "high": float, "low": float, "close": float, "volume": float})
        df['timestamp'] = pd.to_datetime(df['timestamp'].astype('int64'), unit='ms')
        df = df[['timestamp', 'open', 'high', 'low', 'close', 'volume']]
        return df.to_dict(orient='records')
    return response.json()

@app.get("/okx/account")
async def get_account_balance():
    endpoint = "/api/v5/account/balance"
    headers = generate_okx_headers("GET", endpoint)
    async with httpx.AsyncClient() as client:
        response = await client.get(OKX_BASE_URL + endpoint, headers=headers)
    return response.json()

@app.get("/okx/symbols")
async def get_okx_symbols(inst_type: str = "SPOT"):
    endpoint = f"/api/v5/public/instruments?instType={inst_type}"
    url = OKX_BASE_URL + endpoint
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    return response.json()

# ---------------------------- Entry Point ----------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)