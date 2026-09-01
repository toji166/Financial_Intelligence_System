import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Download,
  FileText,
  Gauge,
  Info,
  Landmark,
  Layers,
  LineChart as LineChartIcon,
  LogOut,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  User,
  UserRound,
  Users,
  Wallet,
  X,
  Zap
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

// --- STATIC STOCKS & PROFILES ---

const STOCKS = {
  RELIANCE: {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 2980.5,
    change: 1.42,
    risk: "Medium",
    sector: "Energy / Retail",
    pe: 26.4,
    marketCap: "₹20.1T",
    volume: "3.4M",
    dayHigh: 3012.0,
    dayLow: 2945.0
  },
  TCS: {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 4120.1,
    change: -0.35,
    risk: "Low",
    sector: "Technology",
    pe: 31.8,
    marketCap: "₹14.9T",
    volume: "1.8M",
    dayHigh: 4160.0,
    dayLow: 4098.5
  },
  BAJFINANCE: {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Ltd",
    price: 6850.0,
    change: 2.84,
    risk: "High",
    sector: "Financial Services",
    pe: 34.1,
    marketCap: "₹4.2T",
    volume: "980K",
    dayHigh: 6920.0,
    dayLow: 6710.0
  },
  INFY: {
    symbol: "INFY",
    name: "Infosys Ltd",
    price: 1780.4,
    change: 0.12,
    risk: "Low",
    sector: "Technology",
    pe: 25.2,
    marketCap: "₹7.4T",
    volume: "4.2M",
    dayHigh: 1802.0,
    dayLow: 1765.0
  },
  HDFCBANK: {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    price: 1640.2,
    change: -0.82,
    risk: "Low",
    sector: "Banking",
    pe: 18.9,
    marketCap: "₹12.5T",
    volume: "8.1M",
    dayHigh: 1665.0,
    dayLow: 1632.0
  }
};

const PROFILES = {
  retail: {
    id: "retail",
    label: "Retail Investor",
    icon: UserRound,
    baseMultiplier: 1,
    maxAllocationPercent: 5,
    riskCapacity: 42,
    description: "Capital preservation & liquidity priority. Controlled downside sensitivity.",
    objective: "Balanced Personal Growth"
  },
  institutional: {
    id: "institutional",
    label: "Institutional Investor",
    icon: Building2,
    baseMultiplier: 8,
    maxAllocationPercent: 20,
    riskCapacity: 64,
    description: "Scale deployment driven by structural fundamentals and balance-sheet liquidity.",
    objective: "Risk-Adjusted Alpha"
  },
  hnwi: {
    id: "hnwi",
    label: "HNWI Portfolio",
    icon: CircleDollarSign,
    baseMultiplier: 15,
    maxAllocationPercent: 12,
    riskCapacity: 80,
    description: "High-risk elasticity with flexible time horizons and tactical momentum capacity.",
    objective: "High Growth & Asymmetric Upside"
  }
};

const generateInitialTicks = (basePrice, interval = "1D") => {
  const intervals = {
    "1D": ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30"],
    "1W": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "1M": ["Week 1", "Week 2", "Week 3", "Week 4"],
    "1Y": ["Q1", "Q2", "Q3", "Q4"]
  };
  const times = intervals[interval] || intervals["1D"];
  let curr = basePrice * 0.985;
  return times.map((time, idx) => {
    const change = (Math.random() - 0.47) * (basePrice * 0.008);
    curr = idx === times.length - 1 ? basePrice : Number((curr + change).toFixed(2));
    return { time, price: curr };
  });
};

// --- AUTH COMPONENT ---

function Login({ onLogin }) {
  const [email, setEmail] = useState("lead.analyst@finintel.ai");
  const [password, setPassword] = useState("••••••••");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    onLogin({
      name: email.split("@")[0].toUpperCase(),
      email,
      role: "Lead Strategist"
    });
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginLogo">
          <Brain size={32} />
        </div>
        <h1>FIN-INTEL OS</h1>
        <p className="loginSubtitle">Multi-Agent Autonomous Financial Intelligence</p>

        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Terminal User</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@domain.com"
              required
            />
          </div>
          <div className="formGroup">
            <label>Access Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="loginButton">
            Authenticate Terminal <ChevronRight size={16} />
          </button>
        </form>

        <div className="demoLogin">
          <Info size={14} /> Sandbox Environment — Ready for Analysis
        </div>
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD CONTAINER ---

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("telemetry"); // 'telemetry' | 'matrix' | 'trade' | 'audit'
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [activeProfileKey, setActiveProfileKey] = useState("institutional");
  const [chartInterval, setChartInterval] = useState("1D");
  const [isDegradedFeed, setIsDegradedFeed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeModalCitation, setActiveModalCitation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlist, setWatchlist] = useState(["RELIANCE", "TCS", "BAJFINANCE"]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderNote, setReminderNote] = useState("");
  const [reminders, setReminders] = useState([
    { id: 1, stock: "RELIANCE", text: "Validate Q3 EBITDA margin guidance", time: "15:30 IST" }
  ]);

  // Paper Trading State
  const [portfolio, setPortfolio] = useState({
    cash: 500000.0,
    holdings: {
      RELIANCE: 25,
      TCS: 10
    }
  });
  const [tradeQuantity, setTradeQuantity] = useState(5);
  const [tradeStatusMsg, setTradeStatusMsg] = useState("");

  const activeStock = STOCKS[selectedSymbol] || STOCKS.RELIANCE;
  const activeProfile = PROFILES[activeProfileKey];

  const [priceHistory, setPriceHistory] = useState(() =>
    generateInitialTicks(activeStock.price, chartInterval)
  );

  const currentPrice = priceHistory[priceHistory.length - 1]?.price || activeStock.price;

  // Change Stock
  const handleSelectStock = useCallback(
    (symbol) => {
      if (symbol === selectedSymbol) return;
      setSelectedSymbol(symbol);
      setPriceHistory(generateInitialTicks(STOCKS[symbol].price, chartInterval));
      setIsAnalyzing(true);
      setTimeout(() => setIsAnalyzing(false), 500);
    },
    [selectedSymbol, chartInterval]
  );

  // Interval Change
  const handleIntervalChange = (interval) => {
    setChartInterval(interval);
    setPriceHistory(generateInitialTicks(activeStock.price, interval));
  };

  // Real-time market tick generator
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceHistory((prev) => {
        const lastPrice = prev[prev.length - 1].price;
        const delta = (Math.random() - 0.48) * (lastPrice * 0.002);
        const nextPrice = Number((lastPrice + delta).toFixed(2));
        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        });
        return [...prev.slice(1), { time: timeStr, price: nextPrice }];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Multi-Agent Definitions
  const agents = useMemo(
    () => [
      {
        id: "market",
        name: "Market Data Agent",
        icon: Activity,
        status: "ACTIVE",
        confidence: 93,
        signal: activeStock.change >= 0 ? "BULLISH" : "BEARISH",
        desc: "Order flow volume, price velocity & implied volatility",
        reasoning: `Order book liquidity for ${activeStock.symbol} indicates high accumulation above ₹${(currentPrice * 0.99).toFixed(1)}.`
      },
      {
        id: "fundamental",
        name: "Fundamental Agent",
        icon: Landmark,
        status: "OPTIMAL",
        confidence: 87,
        signal: activeStock.pe < 30 ? "BUY" : "HOLD",
        desc: "P/E ratios, free cash flow conversion & capital structure",
        reasoning: `Sector valuation metrics (${activeStock.sector}) are steady with P/E trading at ${activeStock.pe}x versus historical sector average.`
      },
      {
        id: "news",
        name: "Sentiment & News Agent",
        icon: Newspaper,
        status: isDegradedFeed ? "DEGRADED" : "VERIFIED",
        confidence: isDegradedFeed ? 15 : 78,
        signal: isDegradedFeed ? "NEUTRAL" : "BULLISH",
        desc: "Regulatory filings, news scrapers & corporate disclosures",
        reasoning: isDegradedFeed
          ? "Critical Warning: Upstream NLP pipeline disconnected. Using reduced-confidence zero-weight model."
          : `Recent disclosures and quarterly filing sentiment remain positive.`
      },
      {
        id: "risk",
        name: "Risk Management Agent",
        icon: Shield,
        status: "GOVERNED",
        confidence: 91,
        signal: "ACTIVE",
        desc: "Value at Risk (VaR), portfolio covariance & sizing limits",
        reasoning: `Constraint limits indexed to ${activeProfile.label} (${activeProfile.riskCapacity}% capacity ceiling).`
      }
    ],
    [activeStock, currentPrice, isDegradedFeed, activeProfile]
  );

  // Synthesis Output
  const synthesis = useMemo(() => {
    const rawConf = agents.reduce((acc, a) => acc + a.confidence, 0) / agents.length;
    const finalConfidence = Number(rawConf.toFixed(1));
    const isBull = activeStock.change >= 0 && (!isDegradedFeed || activeProfileKey !== "retail");

    let units = Math.round(activeProfile.baseMultiplier * (isDegradedFeed ? 0.6 : 1.2));
    if (units <= 0) units = 1;

    const action =
      isDegradedFeed && activeProfileKey === "retail"
        ? "HOLD / WAIT"
        : `ACCUMULATE ${units} UNITS`;

    return {
      action,
      confidence: finalConfidence,
      units,
      sentiment: isBull ? "MODERATE OVERWEIGHT" : "NEUTRAL DEFENSIVE"
    };
  }, [agents, activeStock, isDegradedFeed, activeProfile, activeProfileKey]);

  // Execute Order
  const handleExecuteTrade = (type) => {
    const cost = currentPrice * tradeQuantity;
    if (type === "BUY") {
      if (portfolio.cash < cost) {
        setTradeStatusMsg("Insufficient cash reserve for this order.");
        return;
      }
      setPortfolio((prev) => ({
        cash: Number((prev.cash - cost).toFixed(2)),
        holdings: {
          ...prev.holdings,
          [selectedSymbol]: (prev.holdings[selectedSymbol] || 0) + Number(tradeQuantity)
        }
      }));
      setTradeStatusMsg(`Executed: BUY ${tradeQuantity} ${selectedSymbol} @ ₹${currentPrice.toFixed(2)}`);
    } else {
      const currentHoldings = portfolio.holdings[selectedSymbol] || 0;
      if (currentHoldings < tradeQuantity) {
        setTradeStatusMsg("Insufficient units to execute SELL order.");
        return;
      }
      setPortfolio((prev) => ({
        cash: Number((prev.cash + cost).toFixed(2)),
        holdings: {
          ...prev.holdings,
          [selectedSymbol]: currentHoldings - Number(tradeQuantity)
        }
      }));
      setTradeStatusMsg(`Executed: SELL ${tradeQuantity} ${selectedSymbol} @ ₹${currentPrice.toFixed(2)}`);
    }
  };

  // Watchlist Toggle
  const toggleWatchlist = (symbol) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Add Reminder
  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!reminderNote.trim()) return;
    setReminders((prev) => [
      ...prev,
      {
        id: Date.now(),
        stock: selectedSymbol,
        text: reminderNote,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST"
      }
    ]);
    setReminderNote("");
    setShowReminderModal(false);
  };

  if (!user) return <Login onLogin={setUser} />;

  const ProfileIcon = activeProfile.icon;

  return (
    <div className="appContainer">
      {/* GLOBAL HEADER */}
      <header className="navbar">
        <div className="navBrand">
          <div className="brandBadge">
            <Brain size={20} />
          </div>
          <div>
            <span className="brandName">FIN-INTEL</span>
            <span className="brandTag">Multi-Agent Intelligence OS</span>
          </div>
        </div>

        {/* TOP TABS */}
        <div className="navTabs">
          <button
            className={`tabBtn ${activeTab === "telemetry" ? "active" : ""}`}
            onClick={() => setActiveTab("telemetry")}
          >
            <LineChartIcon size={15} /> Telemetry
          </button>
          <button
            className={`tabBtn ${activeTab === "matrix" ? "active" : ""}`}
            onClick={() => setActiveTab("matrix")}
          >
            <Layers size={15} /> Peer Matrix
          </button>
          <button
            className={`tabBtn ${activeTab === "trade" ? "active" : ""}`}
            onClick={() => setActiveTab("trade")}
          >
            <Wallet size={15} /> Trade Desk
          </button>
          <button
            className={`tabBtn ${activeTab === "audit" ? "active" : ""}`}
            onClick={() => setActiveTab("audit")}
          >
            <FileText size={15} /> Agent Ledger
          </button>
        </div>

        <div className="navCenter">
          <div className="profileSelector">
            <ProfileIcon size={16} />
            <select
              value={activeProfileKey}
              onChange={(e) => {
                setActiveProfileKey(e.target.value);
                setIsAnalyzing(true);
                setTimeout(() => setIsAnalyzing(false), 500);
              }}
            >
              {Object.values(PROFILES).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className={`feedToggleBtn ${isDegradedFeed ? "active" : ""}`}
            onClick={() => {
              setIsDegradedFeed(!isDegradedFeed);
              setIsAnalyzing(true);
              setTimeout(() => setIsAnalyzing(false), 500);
            }}
          >
            <AlertTriangle size={15} />
            <span>{isDegradedFeed ? "Feed: Degraded" : "Feed: Realtime"}</span>
          </button>
        </div>

        <div className="navRight">
          <div className="userBadge">
            <User size={15} />
            <span>{user.name}</span>
          </div>
          <button className="iconBtn" onClick={() => setUser(null)} title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* DASHBOARD WORKSPACE */}
      <main className="dashboardLayout">
        {/* LEFT COLUMN: WATCHLIST & SEARCH */}
        <aside className="panel leftPanel">
          <div className="panelHeader">
            <div className="flexRow">
              <LineChartIcon size={16} /> <h2>Market Scope</h2>
            </div>
            <span className="countBadge">{Object.keys(STOCKS).length}</span>
          </div>

          <div className="searchBox">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search ticker or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="stockList">
            {Object.entries(STOCKS)
              .filter(([sym, data]) =>
                `${sym} ${data.name} ${data.sector}`
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map(([sym, data]) => {
                const isSelected = sym === selectedSymbol;
                const isStarred = watchlist.includes(sym);
                return (
                  <div
                    key={sym}
                    className={`stockRow ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectStock(sym)}
                  >
                    <div className="stockDetails">
                      <div className="stockHeading">
                        <b>{sym}</b>
                        <button
                          className={`starBtn ${isStarred ? "starred" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(sym);
                          }}
                        >
                          <Star size={13} fill={isStarred ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <small>{data.name}</small>
                    </div>
                    <div className="stockValues">
                      <b>₹{data.price.toFixed(2)}</b>
                      <span className={`pill ${data.change >= 0 ? "positive" : "negative"}`}>
                        {data.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(data.change)}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* ACTIVE PROFILE SPECIFICATION */}
          <div className="profileInfoBox">
            <div className="flexRow spaceBetween">
              <span className="subhead">{activeProfile.label}</span>
              <span className="riskIndicator">{activeProfile.riskCapacity}% Cap</span>
            </div>
            <p className="profileDesc">{activeProfile.description}</p>
            <div className="riskTrack">
              <div
                className="riskProgress"
                style={{
                  width: `${activeProfile.riskCapacity}%`,
                  background: activeProfile.riskCapacity > 70 ? "#f59e0b" : "#3b82f6"
                }}
              />
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: DYNAMIC TABS VIEW */}
        <section className="panel centerPanel">
          {activeTab === "telemetry" && (
            <>
              {/* HERO BANNER */}
              <div className="stockHeroHeader">
                <div>
                  <div className="flexRow gap8">
                    <h1>
                      {activeStock.name} ({activeStock.symbol})
                    </h1>
                    <span className="sectorBadge">{activeStock.sector}</span>
                  </div>
                  <div className="heroSubInfo">
                    <span>Market Cap: <b>{activeStock.marketCap}</b></span>
                    <span>P/E: <b>{activeStock.pe}</b></span>
                    <span>Volume: <b>{activeStock.volume}</b></span>
                    <span>Range: <b>₹{activeStock.dayLow} - ₹{activeStock.dayHigh}</b></span>
                  </div>
                </div>

                <div className="liveTickerBlock">
                  <div className="livePrice">₹{currentPrice.toFixed(2)}</div>
                  <div className={`statusPill ${activeStock.change >= 0 ? "positive" : "negative"}`}>
                    {activeStock.change >= 0 ? "+" : ""}
                    {activeStock.change}% Today
                  </div>
                </div>
              </div>

              {/* LIVE RECHARTS WITH TIMEFRAME SELECTOR */}
              <div className="chartSurface">
                <div className="chartMeta">
                  <div className="flexRow gap8">
                    <span className="pulseDot" />
                    <span className="liveLabel">Live Telemetry Feed (3000ms Latency)</span>
                  </div>
                  <div className="intervalGroup">
                    {["1D", "1W", "1M", "1Y"].map((int) => (
                      <button
                        key={int}
                        className={`intervalBtn ${chartInterval === int ? "active" : ""}`}
                        onClick={() => handleIntervalChange(int)}
                      >
                        {int}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ width: "100%", height: 210 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceHistory}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#232936" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis
                        stroke="#64748b"
                        domain={["dataMin - 5", "dataMax + 5"]}
                        orientation="right"
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          fontSize: "12px"
                        }}
                        formatter={(val) => [`₹${Number(val).toFixed(2)}`, "Price"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#areaGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AGENT INFERENCE CARDS */}
              <div className="sectionHeading">
                <div className="flexRow gap8">
                  <Sparkles size={16} />
                  <h2>Specialized Analytical Agents</h2>
                </div>
                {isAnalyzing && (
                  <span className="analyzingPill">
                    <RefreshCw className="spin" size={12} /> Computing Signals...
                  </span>
                )}
              </div>

              <div className="agentGrid">
                {agents.map((agent) => {
                  const Icon = agent.icon;
                  const isDeg = agent.status === "DEGRADED";
                  return (
                    <div key={agent.id} className={`agentCard ${isDeg ? "degraded" : ""}`}>
                      <div className="agentCardHeader">
                        <div className="flexRow gap8">
                          <div className="agentIconWrap">
                            <Icon size={16} />
                          </div>
                          <div>
                            <h4>{agent.name}</h4>
                            <small>{agent.desc}</small>
                          </div>
                        </div>
                        <span className={`statusTag ${isDeg ? "tagDegraded" : "tagActive"}`}>
                          {agent.confidence}% Conf
                        </span>
                      </div>
                      <p className="agentReasoning">{agent.reasoning}</p>
                      <div className="agentCardFooter">
                        <span className="signalBadge">
                          Signal: <b>{agent.signal}</b>
                        </span>
                        <button
                          className="citeLink"
                          onClick={() => setActiveModalCitation(agent)}
                        >
                          <FileText size={12} /> Inspect Proof
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === "matrix" && (
            <div className="matrixView">
              <div className="sectionHeading">
                <h2>Sector Peer Comparison Matrix</h2>
              </div>
              <table className="dataTable">
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>P/E</th>
                    <th>Market Cap</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(STOCKS).map((s) => (
                    <tr
                      key={s.symbol}
                      className={s.symbol === selectedSymbol ? "highlightedRow" : ""}
                      onClick={() => handleSelectStock(s.symbol)}
                    >
                      <td><b>{s.symbol}</b></td>
                      <td>{s.name}</td>
                      <td>₹{s.price.toFixed(2)}</td>
                      <td className={s.change >= 0 ? "posText" : "negText"}>
                        {s.change >= 0 ? "+" : ""}{s.change}%
                      </td>
                      <td>{s.pe}x</td>
                      <td>{s.marketCap}</td>
                      <td><span className="riskBadge">{s.risk}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "trade" && (
            <div className="tradeDeskView">
              <div className="sectionHeading">
                <h2>Simulated Order Execution Desk</h2>
              </div>
              <div className="portfolioOverview">
                <div className="portfolioBox">
                  <small>Available Cash Balance</small>
                  <h3>₹{portfolio.cash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h3>
                </div>
                <div className="portfolioBox">
                  <small>{selectedSymbol} Position</small>
                  <h3>{portfolio.holdings[selectedSymbol] || 0} Units</h3>
                </div>
              </div>

              <div className="tradeFormCard">
                <h3>Order Ticket: {selectedSymbol}</h3>
                <div className="tradeInputs">
                  <label>Order Units</label>
                  <input
                    type="number"
                    min="1"
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(Math.max(1, Number(e.target.value)))}
                  />
                  <div className="orderEstimated">
                    <span>Estimated Consideration:</span>
                    <b>₹{(currentPrice * tradeQuantity).toFixed(2)}</b>
                  </div>
                </div>

                <div className="tradeActionButtons">
                  <button className="buyBtn" onClick={() => handleExecuteTrade("BUY")}>
                    Execute BUY
                  </button>
                  <button className="sellBtn" onClick={() => handleExecuteTrade("SELL")}>
                    Execute SELL
                  </button>
                </div>

                {tradeStatusMsg && <div className="tradeMsg">{tradeStatusMsg}</div>}
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="auditView">
              <div className="sectionHeading">
                <h2>Deterministic Multi-Agent State Ledger</h2>
              </div>
              <div className="auditLogList">
                {agents.map((a, i) => (
                  <div key={a.id} className="auditCard">
                    <div className="auditHead">
                      <b>[Step {i + 1}] {a.name} State Machine</b>
                      <small>Status: {a.status}</small>
                    </div>
                    <p>{a.reasoning}</p>
                    <div className="auditFooter">
                      <span>Evaluation Confidence: {a.confidence}%</span>
                      <span>Signal Vector: {a.signal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: AI SYNTHESIS & AUDIT TRACE */}
        <aside className="panel rightPanel">
          <div className="panelHeader">
            <div className="flexRow">
              <Zap size={16} /> <h2>Synthesis Arbiter</h2>
            </div>
            <span className="liveLabel">Auto-Sizing</span>
          </div>

          <div className="decisionModule">
            <span className="decisionSub">Direct Consensus Action</span>
            <h3 className="decisionAction">
              {isAnalyzing ? "SYNTHESIZING..." : synthesis.action}
            </h3>
            <div className="confidenceRow">
              <span>Model Confidence:</span>
              <b>{synthesis.confidence}%</b>
            </div>
            <div className="confidenceTrack">
              <div
                className="confidenceFill"
                style={{ width: `${synthesis.confidence}%` }}
              />
            </div>
            <div className="strategyNote">
              Target Profile: <b>{activeProfile.objective}</b>
            </div>
          </div>

          {/* AUDIT TRACE STREAM */}
          <div className="sectionHeading">
            <div className="flexRow gap8">
              <Brain size={15} />
              <h3>Audit Trace Engine</h3>
            </div>
          </div>

          <div className="traceStream">
            <div className="traceItem">
              <CheckCircle2 className="traceSuccess" size={14} />
              <div>
                <b>Data Ingestion Engine</b>
                <p>Synced telemetry for {activeStock.symbol} @ ₹{currentPrice.toFixed(2)}.</p>
              </div>
            </div>
            {agents.map((a) => (
              <div key={a.id} className="traceItem">
                <a.icon
                  size={14}
                  className={a.status === "DEGRADED" ? "traceWarn" : "traceNeutral"}
                />
                <div>
                  <b>{a.name}</b>
                  <p>{a.reasoning}</p>
                </div>
              </div>
            ))}
            <div className="traceItem">
              <Zap className="traceSuccess" size={14} />
              <div>
                <b>Position Sizing Engine</b>
                <p>Derived {synthesis.units} units allocation within VaR bounds.</p>
              </div>
            </div>
          </div>

          {/* OPERATIONAL REMINDERS */}
          <div className="remindersBlock">
            <div className="flexRow spaceBetween">
              <span className="subhead">Action Items</span>
              <button className="addNoteBtn" onClick={() => setShowReminderModal(true)}>
                <Plus size={13} /> Add
              </button>
            </div>
            <div className="reminderList">
              {reminders.map((r) => (
                <div key={r.id} className="reminderItem">
                  <div>
                    <b>{r.stock}</b> — <span>{r.text}</span>
                    <small>{r.time}</small>
                  </div>
                  <button
                    className="deleteBtn"
                    onClick={() => setReminders(reminders.filter((x) => x.id !== r.id))}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER SYSTEM TELEMETRY */}
      <footer className="footerBar">
        <div className="telemetryItem">
          <Gauge size={14} /> Historical Accuracy: <b>76.4%</b>
        </div>
        <div className="telemetryItem">
          <Activity size={14} /> Latency: <b>240ms</b>
        </div>
        <div className="telemetryItem">
          <ShieldAlert size={14} /> Volatility Index: <b>14.2</b>
        </div>
        <div className="telemetryItem">
          <Users size={14} /> Active Agents: <b>4 Observers, 1 Arbiter</b>
        </div>
      </footer>

      {/* CITATION INSPECT MODAL */}
      {activeModalCitation && (
        <div className="modalBackdrop" onClick={() => setActiveModalCitation(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div className="flexRow gap8">
                <activeModalCitation.icon size={18} />
                <h3>{activeModalCitation.name} Proof Trace</h3>
              </div>
              <button className="iconBtn" onClick={() => setActiveModalCitation(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modalBody">
              <label>Agent Observation</label>
              <p>{activeModalCitation.reasoning}</p>

              <label>Operational Metadata</label>
              <div className="metaGrid">
                <div>Status: <b>{activeModalCitation.status}</b></div>
                <div>Confidence Score: <b>{activeModalCitation.confidence}%</b></div>
                <div>Recommended Vector: <b>{activeModalCitation.signal}</b></div>
                <div>Target Asset: <b>{selectedSymbol}</b></div>
              </div>

              <div className="evidenceBox">
                <FileText size={16} />
                <span>Deterministic trace verified via SHA-256 state snapshot. Simulated ID: 0x9f4a...e12b</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD REMINDER MODAL */}
      {showReminderModal && (
        <div className="modalBackdrop" onClick={() => setShowReminderModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Create Tactical Action Item</h3>
              <button className="iconBtn" onClick={() => setShowReminderModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddReminder} className="modalBody">
              <label>Action Item for {selectedSymbol}</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g., Check implied volatility skew before expiry..."
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
                required
              />
              <button type="submit" className="saveBtn">
                <CheckCircle2 size={16} /> Save Action Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}