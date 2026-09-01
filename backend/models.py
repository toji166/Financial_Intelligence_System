from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    risk_profile = Column(String, default="moderate")
    investment_goal = Column(String, default="wealth_growth")


class Portfolio(Base):
    __tablename__ = "portfolio"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    symbol = Column(String)
    quantity = Column(Integer)
    average_price = Column(Float)


class AnalysisLog(Base):
    __tablename__ = "analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    symbol = Column(String)
    final_signal = Column(String)
    confidence = Column(Float)
    latency_ms = Column(Float)
    reasoning = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)