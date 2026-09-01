import random
from datetime import datetime


STOCKS = {
    "RELIANCE": {
        "price": 1450.50,
        "change": 2.35,
        "volume": 18500000,
        "avg_volume": 12000000
    },
    "TCS": {
        "price": 3250.75,
        "change": 1.42,
        "volume": 9200000,
        "avg_volume": 10000000
    },
    "INFY": {
        "price": 1520.20,
        "change": -1.15,
        "volume": 15000000,
        "avg_volume": 11000000
    },
    "HDFCBANK": {
        "price": 1680.30,
        "change": 0.85,
        "volume": 14000000,
        "avg_volume": 13000000
    }
}


def get_market_data(symbol: str):

    symbol = symbol.upper()

    if symbol not in STOCKS:
        return {
            "symbol": symbol,
            "price": 1000,
            "change": 0.5,
            "volume": 1000000,
            "avg_volume": 1000000,
            "data_status": "fallback"
        }

    data = STOCKS[symbol].copy()

    # Small simulated market movement
    movement = random.uniform(-0.5, 0.5)

    data["price"] += movement
    data["change"] += movement

    data["timestamp"] = datetime.utcnow().isoformat()
    data["symbol"] = symbol
    data["data_status"] = "simulated_realtime"

    return data