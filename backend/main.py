from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

import asyncio
import time
import json

from database import engine, get_db
from models import Base, User, Portfolio, AnalysisLog
from schemas import UserCreate, PortfolioCreate, AnalysisRequest

from market import get_market_data
from rag import retrieve_documents

from agents import (
    technical_agent,
    volume_agent,
    sentiment_agent,
    risk_management_agent,
    portfolio_management_agent
)

from synthesis import synthesize

# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Multi-Agent Financial Intelligence API",
    description="HackVerse Sprint 1 - PS-01",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():

    return {
        "message": "Financial Intelligence Backend is running",
        "status": "online",
        "version": "1.0.0"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "multi-agent-financial-intelligence"
    }


# ------------------------------------------------
# USER
# ------------------------------------------------

@app.post("/api/users")
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):

    user = User(
        name=user_data.name,
        risk_profile=user_data.risk_profile,
        investment_goal=user_data.investment_goal
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.name,
        "risk_profile": user.risk_profile,
        "investment_goal": user.investment_goal
    }


@app.get("/api/users/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "id": user.id,
        "name": user.name,
        "risk_profile": user.risk_profile,
        "investment_goal": user.investment_goal
    }


# ------------------------------------------------
# PORTFOLIO
# ------------------------------------------------

@app.post("/api/portfolio")
def add_portfolio(
    portfolio_data: PortfolioCreate,
    db: Session = Depends(get_db)
):

    portfolio = Portfolio(
        user_id=portfolio_data.user_id,
        symbol=portfolio_data.symbol.upper(),
        quantity=portfolio_data.quantity,
        average_price=portfolio_data.average_price
    )

    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)

    return {
        "message": "Portfolio position added",
        "id": portfolio.id,
        "symbol": portfolio.symbol,
        "quantity": portfolio.quantity,
        "average_price": portfolio.average_price
    }


@app.get("/api/portfolio/{user_id}")
def get_portfolio(
    user_id: int,
    db: Session = Depends(get_db)
):

    positions = db.query(Portfolio).filter(
        Portfolio.user_id == user_id
    ).all()

    return [
        {
            "symbol": position.symbol,
            "quantity": position.quantity,
            "average_price": position.average_price
        }
        for position in positions
    ]


# ------------------------------------------------
# MARKET DATA
# ------------------------------------------------

@app.get("/api/market/{symbol}")
def market_data(symbol: str):

    return get_market_data(symbol)


# ------------------------------------------------
# RAG
# ------------------------------------------------

@app.get("/api/documents/{symbol}")
def documents(symbol: str):

    return retrieve_documents(
        symbol,
        f"financial information for {symbol}"
    )


# ------------------------------------------------
# MAIN MULTI-AGENT ANALYSIS
# ------------------------------------------------

@app.post("/api/analyze")
async def analyze(
    request: AnalysisRequest,
    db: Session = Depends(get_db)
):

    start_time = time.perf_counter()

    # ============================================================
    # 1. GET USER
    # ============================================================

    user = db.query(User).filter(
        User.id == request.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    symbol = request.symbol.upper()

    # ============================================================
    # 2. GET USER PORTFOLIO
    # ============================================================

    user_portfolio = db.query(Portfolio).filter(
        Portfolio.user_id == user.id
    ).all()

    # ============================================================
    # 3. GET MARKET DATA
    # ============================================================

    market = get_market_data(symbol)

    # ============================================================
    # 4. RAG DOCUMENT RETRIEVAL
    # ============================================================

    rag_result = retrieve_documents(
        symbol,
        f"financial outlook and risk information for {symbol}"
    )

    # ============================================================
    # 5. RUN ALL 5 AGENTS IN PARALLEL
    # ============================================================

    (
        technical_result,
        volume_result,
        sentiment_result,
        risk_result,
        portfolio_result
    ) = await asyncio.gather(

        technical_agent(market),

        volume_agent(market),

        sentiment_agent(rag_result),

        risk_management_agent(
            market,
            user,
            user_portfolio
        ),

        portfolio_management_agent(
            market,
            user,
            user_portfolio
        )
    )

    # ============================================================
    # 6. SYNTHESIS AGENT
    # ============================================================

    synthesis_result = synthesize(

        technical_result,

        volume_result,

        sentiment_result,

        risk_result,

        portfolio_result,

        user.risk_profile
    )

    # ============================================================
    # 7. CALCULATE LATENCY
    # ============================================================

    latency_ms = round(
        (time.perf_counter() - start_time) * 1000,
        2
    )

    # ============================================================
    # 8. GET SOURCES
    # ============================================================

    sources = sentiment_result.get(
        "sources",
        []
    )

    # ============================================================
    # 9. SAVE ANALYSIS LOG
    # ============================================================

    log = AnalysisLog(

        user_id=user.id,

        symbol=symbol,

        final_signal=synthesis_result[
            "recommendation"
        ],

        confidence=synthesis_result[
            "confidence"
        ],

        latency_ms=latency_ms,

        reasoning=json.dumps(
            synthesis_result[
                "reasoning"
            ]
        )
    )

    db.add(log)

    db.commit()

    # ============================================================
    # 10. FINAL RESPONSE
    # ============================================================

    return {

        "status": "success",

        "symbol": symbol,

        "market": market,

        "user": {

            "id": user.id,

            "name": user.name,

            "risk_profile": user.risk_profile,

            "investment_goal": user.investment_goal
        },

        "agents": {

            "technical": technical_result,

            "volume": volume_result,

            "sentiment": sentiment_result,

            "risk_management": risk_result,

            "portfolio_management": portfolio_result
        },

        "synthesis": synthesis_result,

        "sources": sources,

        "performance": {

            "latency_ms": latency_ms,

            "agents_executed": 5,

            "data_source": market[
                "data_status"
            ]
        }
    }
@app.get("/api/logs/{user_id}")
def get_logs(
    user_id: int,
    db: Session = Depends(get_db)
):

    logs = db.query(AnalysisLog).filter(
        AnalysisLog.user_id == user_id
    ).order_by(
        AnalysisLog.created_at.desc()
    ).limit(20).all()

    return [
        {
            "symbol": log.symbol,
            "signal": log.final_signal,
            "confidence": log.confidence,
            "latency_ms": log.latency_ms,
            "created_at": log.created_at
        }
        for log in logs
    ]