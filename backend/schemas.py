from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    risk_profile: str = "moderate"
    investment_goal: str = "wealth_growth"


class PortfolioCreate(BaseModel):
    user_id: int
    symbol: str
    quantity: int
    average_price: float


class AnalysisRequest(BaseModel):
    user_id: int
    symbol: str