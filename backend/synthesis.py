def synthesize(
    technical,
    volume,
    sentiment,
    risk,
    portfolio,
    risk_profile
):

    agents = [
        technical,
        volume,
        sentiment
    ]

    buy_count = sum(
        agent["signal"] == "BUY"
        for agent in agents
    )

    sell_count = sum(
        agent["signal"] == "SELL"
        for agent in agents
    )

    hold_count = sum(
        agent["signal"] == "HOLD"
        for agent in agents
    )

    average_confidence = sum(
        agent["confidence"]
        for agent in agents
    ) / len(agents)

    # ------------------------------------------------
    # BASIC MARKET SIGNAL
    # ------------------------------------------------

    if buy_count >= 2:

        final_signal = "BUY"

    elif sell_count >= 2:

        final_signal = "SELL"

    else:

        final_signal = "HOLD"

    # ------------------------------------------------
    # RISK OVERRIDE
    # ------------------------------------------------

    if risk["risk_level"] == "HIGH":

        if risk_profile.lower() == "conservative":

            final_signal = "HOLD"

        elif risk_profile.lower() == "moderate":

            if final_signal == "BUY":
                final_signal = "HOLD"

    # ------------------------------------------------
    # PORTFOLIO OVERRIDE
    # ------------------------------------------------

    if portfolio["recommendation"] == "CONSIDER PARTIAL PROFIT":

        portfolio_action = "Consider partial profit booking."

    elif portfolio["recommendation"] == "REVIEW POSITION":

        portfolio_action = "Review the existing position."

    elif portfolio["recommendation"] == "WATCHLIST":

        portfolio_action = "Consider monitoring before entering."

    else:

        portfolio_action = "Existing position can be monitored."

    # ------------------------------------------------
    # REASONING
    # ------------------------------------------------

    reasoning = [

        technical["reason"],

        volume["reason"],

        sentiment["reason"],

        risk["reason"],

        portfolio["reason"],

        portfolio_action
    ]

    return {

        "recommendation": final_signal,

        "confidence": round(
            average_confidence,
            2
        ),

        "risk_profile": risk_profile,

        "risk_level": risk["risk_level"],

        "risk_score": risk["risk_score"],

        "portfolio_action": portfolio["recommendation"],

        "reasoning": reasoning,

        "agent_votes": {

            "BUY": buy_count,

            "HOLD": hold_count,

            "SELL": sell_count
        },

        "decision_factors": {

            "technical": technical["signal"],

            "volume": volume["signal"],

            "sentiment": sentiment["signal"],

            "risk": risk["risk_level"],

            "portfolio": portfolio["recommendation"]
        }
    }