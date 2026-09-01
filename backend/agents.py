import asyncio


# ============================================================
# 1. TECHNICAL AGENT
# ============================================================

async def technical_agent(market):

    await asyncio.sleep(0.2)

    change = market["change"]

    if change >= 2:
        signal = "BUY"
        confidence = 88
        reason = "Strong positive price momentum detected."

    elif change >= 0:
        signal = "HOLD"
        confidence = 68
        reason = "Price momentum is mildly positive."

    else:
        signal = "SELL"
        confidence = 78
        reason = "Negative price momentum detected."

    return {
        "agent": "Technical Agent",
        "signal": signal,
        "confidence": confidence,
        "reason": reason,
        "dimension": "price_momentum"
    }


# ============================================================
# 2. VOLUME AGENT
# ============================================================

async def volume_agent(market):

    await asyncio.sleep(0.2)

    volume = market["volume"]
    avg_volume = market["avg_volume"]

    ratio = volume / avg_volume

    if ratio >= 1.4:

        signal = "BUY"
        confidence = 85
        reason = "Trading volume is significantly above average."

    elif ratio >= 1:

        signal = "HOLD"
        confidence = 65
        reason = "Trading volume is around or slightly above average."

    else:

        signal = "HOLD"
        confidence = 60
        reason = "Trading volume is below recent average."

    return {
        "agent": "Volume Agent",
        "signal": signal,
        "confidence": confidence,
        "reason": reason,
        "dimension": "volume_anomaly",
        "volume_ratio": round(ratio, 2)
    }


# ============================================================
# 3. SENTIMENT + RAG AGENT
# ============================================================

async def sentiment_agent(rag_result):

    await asyncio.sleep(0.2)

    documents = rag_result.get("documents", [])

    if not documents:

        return {
            "agent": "Sentiment/RAG Agent",
            "signal": "HOLD",
            "confidence": 40,
            "reason": "No supporting financial document was retrieved.",
            "dimension": "financial_sentiment",
            "sources": []
        }

    document = documents[0]

    text = document["content"].lower()

    positive_words = [
        "positive",
        "stable",
        "steady",
        "constructive",
        "growth"
    ]

    negative_words = [
        "pressure",
        "decline",
        "negative",
        "risk"
    ]

    positive_score = sum(
        word in text
        for word in positive_words
    )

    negative_score = sum(
        word in text
        for word in negative_words
    )

    if positive_score > negative_score:

        signal = "BUY"
        confidence = 82

    elif negative_score > positive_score:

        signal = "SELL"
        confidence = 70

    else:

        signal = "HOLD"
        confidence = 65

    return {
        "agent": "Sentiment/RAG Agent",
        "signal": signal,
        "confidence": confidence,
        "reason": "Financial disclosure sentiment was evaluated from retrieved evidence.",
        "dimension": "financial_sentiment",
        "sources": [
            {
                "id": document["id"],
                "title": document["title"]
            }
        ]
    }


# ============================================================
# 4. RISK MANAGEMENT AGENT
# ============================================================

async def risk_management_agent(
    market,
    user,
    portfolio
):

    await asyncio.sleep(0.2)

    risk_profile = user.risk_profile.lower()

    change = abs(market["change"])

    # Calculate portfolio exposure
    total_value = 0
    target_value = 0

    for position in portfolio:

        value = (
            position.quantity *
            market["price"]
        )

        total_value += value

        if position.symbol.upper() == market["symbol"].upper():
            target_value += value

    if total_value > 0:

        concentration = (
            target_value /
            total_value
        ) * 100

    else:

        concentration = 0

    # Determine volatility risk
    if change >= 3:

        volatility_risk = "HIGH"

    elif change >= 1.5:

        volatility_risk = "MEDIUM"

    else:

        volatility_risk = "LOW"

    # Risk score
    risk_score = 0

    if volatility_risk == "HIGH":
        risk_score += 40

    elif volatility_risk == "MEDIUM":
        risk_score += 25

    else:
        risk_score += 10

    if concentration >= 50:
        risk_score += 40

    elif concentration >= 30:
        risk_score += 25

    else:
        risk_score += 10

    if risk_profile == "aggressive":
        risk_tolerance = "HIGH"

    elif risk_profile == "conservative":
        risk_tolerance = "LOW"

    else:
        risk_tolerance = "MEDIUM"

    if risk_score >= 60:

        risk_level = "HIGH"

    elif risk_score >= 35:

        risk_level = "MEDIUM"

    else:

        risk_level = "LOW"

    # Recommendation
    if risk_level == "HIGH":

        recommendation = "REDUCE EXPOSURE"

    elif (
        risk_level == "MEDIUM"
        and risk_profile == "conservative"
    ):

        recommendation = "HOLD / REDUCE"

    else:

        recommendation = "MAINTAIN"

    return {

        "agent": "Risk Management Agent",

        "risk_level": risk_level,

        "risk_score": risk_score,

        "risk_tolerance": risk_tolerance,

        "volatility_risk": volatility_risk,

        "portfolio_concentration": round(
            concentration,
            2
        ),

        "recommendation": recommendation,

        "reason": (
            f"Risk assessment considers "
            f"market volatility, portfolio "
            f"concentration and the user's "
            f"{risk_profile} risk profile."
        ),

        "dimension": "risk_management"
    }


# ============================================================
# 5. PORTFOLIO MANAGEMENT AGENT
# ============================================================

async def portfolio_management_agent(
    market,
    user,
    portfolio
):

    await asyncio.sleep(0.2)

    symbol = market["symbol"]

    current_price = market["price"]

    position = None

    for item in portfolio:

        if item.symbol.upper() == symbol.upper():

            position = item
            break

    if position:

        current_value = (
            position.quantity *
            current_price
        )

        invested_value = (
            position.quantity *
            position.average_price
        )

        profit_loss = (
            current_value -
            invested_value
        )

        profit_loss_percent = (
            profit_loss /
            invested_value
        ) * 100

        if profit_loss_percent > 10:

            recommendation = "CONSIDER PARTIAL PROFIT"

        elif profit_loss_percent < -10:

            recommendation = "REVIEW POSITION"

        else:

            recommendation = "HOLD POSITION"

        reason = (
            f"Current position has "
            f"{round(profit_loss_percent, 2)}% "
            f"unrealized return."
        )

    else:

        current_value = 0
        invested_value = 0
        profit_loss = 0
        profit_loss_percent = 0

        recommendation = "WATCHLIST"

        reason = (
            "Stock is not currently held "
            "in the user's portfolio."
        )

    # Portfolio diversification
    total_portfolio_value = 0

    for item in portfolio:

        total_portfolio_value += (
            item.quantity *
            current_price
        )

    if total_portfolio_value > 0:

        allocation = (
            current_value /
            total_portfolio_value
        ) * 100

    else:

        allocation = 0

    return {

        "agent": "Portfolio Management Agent",

        "recommendation": recommendation,

        "current_value": round(
            current_value,
            2
        ),

        "invested_value": round(
            invested_value,
            2
        ),

        "profit_loss": round(
            profit_loss,
            2
        ),

        "profit_loss_percent": round(
            profit_loss_percent,
            2
        ),

        "portfolio_allocation": round(
            allocation,
            2
        ),

        "reason": reason,

        "dimension": "portfolio_management"
    }