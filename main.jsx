import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertTriangle, BarChart3, Brain, Building2, CheckCircle2,
  ChevronRight, CircleDollarSign, FileText, Gauge, Globe2, Landmark,
  LineChart, Newspaper, Shield, ShieldAlert, Sparkles, UserRound, Users,
  X, Zap
} from "lucide-react";
import {
  LineChart as RLineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import "./styles.css";

const STOCKS = {
  RELIANCE: { name: "Reliance Industries", price: 2980.50, change: "+1.4%", positive: true, risk: "Medium" },
  TCS: { name: "Tata Consultancy Services", price: 4120.10, change: "-0.3%", positive: false, risk: "Low" },
  BAJFINANCE: { name: "Bajaj Finance", price: 6850.00, change: "+2.8%", positive: true, risk: "High" },
  INFY: { name: "Infosys Ltd", price: 1780.40, change: "+0.1%", positive: true, risk: "Low" }
};
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Bell,
  Brain,
  Building2,
  CheckCircle,
  CircleDollarSign,
  FileText,
  LineChart,
  LogOut,
  Menu,
  Newspaper,
  Plus,
  Search,
  Shield,
  Star,
  Trash2,
  User,
  UserRound,
  X,
  Zap,
} from "lucide-react";

import "./styles.css";

const STOCKS = {
  RELIANCE: {
    name: "Reliance Industries",
    price: 2980.5,
    change: "+1.40%",
    positive: true,
    risk: "Medium",
  },
  TCS: {
    name: "Tata Consultancy Services",
    price: 4120.1,
    change: "-0.30%",
    positive: false,
    risk: "Low",
  },
  INFY: {
    name: "Infosys",
    price: 1780.4,
    change: "+0.10%",
    positive: true,
    risk: "Low",
  },
  BAJFINANCE: {
    name: "Bajaj Finance",
    price: 6850,
    change: "+2.80%",
    positive: true,
    risk: "High",
  },
};

const INVESTORS = [
  {
    id: "retail",
    name: "Retail Investor",
    icon: UserRound,
    units: 4,
    confidence: 79,
    reason: "Smaller capital allocation with controlled risk.",
  },
  {
    id: "institutional",
    name: "Institutional Investor",
    icon: Building2,
    units: 8,
    confidence: 86,
    reason: "Larger capital deployment with liquidity and fundamentals.",
  },
  {
    id: "hnwi",
    name: "HNWI Investor",
    icon: CircleDollarSign,
    units: 15,
    confidence: 83,
    reason: "High capital capacity with flexible position sizing.",
  },
];

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    onLogin({
      name: email.split("@")[0],
      email,
    });
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginLogo">
          <Brain size={35} />
        </div>

        <h1>FIN-INTEL</h1>

        <p className="loginSubtitle">
          Multi-Agent Financial Intelligence
        </p>

        <form onSubmit={submit}>
          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="loginButton">
            Login
          </button>
        </form>

        <div className="demoLogin">
          Demo login — any email/password works
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

function Dashboard({ user, onLogout }) {
  const [selectedStock, setSelectedStock] = useState("RELIANCE");

  const [wishlist, setWishlist] = useState([
    "RELIANCE",
    "TCS",
  ]);

  const [search, setSearch] = useState("");

  const [reminders, setReminders] = useState([
    {
      id: 1,
      stock: "RELIANCE",
      text: "Review Reliance analysis",
      date: "Today 6:00 PM",
    },
  ]);

  const [showReminder, setShowReminder] = useState(false);

  const [newReminder, setNewReminder] = useState("");

  const [profile, setProfile] = useState("institutional");

  const [menuOpen, setMenuOpen] = useState(false);

  const [priceHistory, setPriceHistory] = useState([
    2920,
    2935,
    2948,
    2940,
    2962,
    2970,
    2980,
  ]);

  const stock = STOCKS[selectedStock];

  const investor = INVESTORS.find(
    (item) => item.id === profile
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setPriceHistory((old) => {
        const last = old[old.length - 1];

        const next = Number(
          (last + (Math.random() - 0.45) * 8).toFixed(2)
        );

        return [...old.slice(1), next];
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const filteredStocks = useMemo(() => {
    return Object.entries(STOCKS).filter(([symbol, info]) =>
      `${symbol} ${info.name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  function toggleWishlist(symbol) {
    if (wishlist.includes(symbol)) {
      setWishlist(wishlist.filter((item) => item !== symbol));
    } else {
      setWishlist([...wishlist, symbol]);
    }
  }

  function addReminder(e) {
    e.preventDefault();

    if (!newReminder.trim()) return;

    setReminders([
      ...reminders,
      {
        id: Date.now(),
        stock: selectedStock,
        text: newReminder,
        date: "Today",
      },
    ]);

    setNewReminder("");
    setShowReminder(false);
  }

  function selectStock(symbol) {
    setSelectedStock(symbol);

    const base = STOCKS[symbol].price;

    setPriceHistory([
      base - 60,
      base - 45,
      base - 32,
      base - 20,
      base - 15,
      base - 7,
      base,
    ]);
  }

  return (
    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">

        <div className="brand">
          <Brain size={23} />
          <span>FIN-INTEL</span>
        </div>

        <div className="navRight">

          <div className="userBox">
            <User size={16} />
            {user.name}
          </div>

          <button
            className="logout"
            onClick={onLogout}
          >
            <LogOut size={15} />
            Logout
          </button>

        </div>

      </header>

      <div className="layout">

        {/* SIDEBAR */}

        <aside className={`sidebar ${menuOpen ? "open" : ""}`}>

          <div className="sidebarTitle">
            <Menu size={18} />
            Navigation
          </div>

          <button className="sideItem active">
            <LineChart size={17} />
            Dashboard
          </button>

          <button className="sideItem">
            <Star size={17} />
            Wishlist
            <span className="count">
              {wishlist.length}
            </span>
          </button>

          <button
            className="sideItem"
            onClick={() => setShowReminder(true)}
          >
            <Bell size={17} />
            Reminders
            <span className="count">
              {reminders.length}
            </span>
          </button>

          <div className="sidebarSection">
            <span>WATCHLIST</span>
          </div>

          {wishlist.map((symbol) => (
            <button
              key={symbol}
              className={`watchItem ${
                selectedStock === symbol ? "selected" : ""
              }`}
              onClick={() => selectStock(symbol)}
            >
              <div>
                <b>{symbol}</b>
                <small>
                  {STOCKS[symbol].name}
                </small>
              </div>

              <Star
                size={14}
                fill="currentColor"
              />
            </button>
          ))}

        </aside>

        {/* MAIN */}

        <main className="main">

          <button
            className="mobileMenu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu />
          </button>

          {/* SEARCH */}

          <div className="topSearch">

            <div className="searchBox">
              <Search size={17} />

              <input
                placeholder="Search stock..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button
              className="reminderButton"
              onClick={() => setShowReminder(true)}
            >
              <Bell size={16} />
              Add Reminder
            </button>

          </div>

          {search && (
            <div className="searchResults">

              {filteredStocks.map(([symbol, info]) => (
                <button
                  key={symbol}
                  onClick={() => {
                    selectStock(symbol);
                    setSearch("");
                  }}
                >
                  <b>{symbol}</b>
                  <span>{info.name}</span>
                </button>
              ))}

            </div>
          )}

          {/* STOCK HEADER */}

          <section className="stockHeader">

            <div>

              <div className="stockTitle">

                <h1>{selectedStock}</h1>

                <button
                  className="starButton"
                  onClick={() =>
                    toggleWishlist(selectedStock)
                  }
                >
                  <Star
                    size={21}
                    fill={
                      wishlist.includes(selectedStock)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>

              </div>

              <p>{stock.name}</p>

            </div>

            <div className="stockValue">

              <strong>
                ₹{priceHistory.at(-1).toFixed(2)}
              </strong>

              <span
                className={
                  stock.positive
                    ? "positive"
                    : "negative"
                }
              >
                {stock.change}
              </span>

            </div>

          </section>

          {/* CHART */}

          <section className="card">

            <div className="cardHeader">

              <div>
                <h2>Market Analysis</h2>
                <span>
                  Intraday price movement
                </span>
              </div>

              <div className="live">
                <span />
                LIVE
              </div>

            </div>

            <StockChart
              data={priceHistory}
            />

          </section>

          {/* SIGNALS */}

          <div className="signalGrid">

            <Signal
              icon={<Activity />}
              title="Market Momentum"
              value="STRONG BUY"
              confidence="91%"
            />

            <Signal
              icon={<Landmark />}
              title="Fundamentals"
              value="POSITIVE"
              confidence="84%"
            />

            <Signal
              icon={<Newspaper />}
              title="News Sentiment"
              value="BULLISH"
              confidence="76%"
            />

            <Signal
              icon={<Shield />}
              title="Risk Analysis"
              value={stock.risk}
              confidence="88%"
            />

          </div>

          {/* INVESTOR AGENTS */}

          <section className="card">

            <div className="cardHeader">
              <div>
                <h2>
                  Investor Perspective Agents
                </h2>

                <span>
                  Same market data • different capital perspectives
                </span>
              </div>

              <UsersIcon />
            </div>

            <div className="investorGrid">

              {INVESTORS.map((item) => (
                <InvestorCard
                  key={item.id}
                  investor={item}
                  active={profile === item.id}
                  onClick={() =>
                    setProfile(item.id)
                  }
                />
              ))}

            </div>

          </section>

        </main>

        {/* RIGHT PANEL */}

        <aside className="rightPanel">

          {/* DECISION */}

          <section className="decisionCard">

            <div className="decisionIcon">
              <Zap size={20} />
            </div>

            <span className="decisionLabel">
              AI SYNTHESIS
            </span>

            <h2>
              BUY {investor.units} UNITS
            </h2>

            <div className="confidence">
              Confidence {investor.confidence}%
            </div>

            <div className="profileLabel">
              Optimized for
              <b>{investor.name}</b>
            </div>

          </section>

          {/* REASONING */}

          <section className="card reasoning">

            <div className="cardHeader">
              <div>
                <h2>Reasoning Trace</h2>
                <span>Explainable AI</span>
              </div>

              <Brain size={17} />
            </div>

            <Trace
              title="Market Data Agent"
              text={`Momentum for ${selectedStock} is positive.`}
            />

            <Trace
              title="Fundamental Agent"
              text="Valuation and business fundamentals support the signal."
            />

            <Trace
              title="News Agent"
              text="Current sentiment is positive."
            />

            <Trace
              title={investor.name}
              text={investor.reason}
            />

            <Trace
              title="Decision Agent"
              text={`Final position size: ${investor.units} units.`}
              final
            />

          </section>

          {/* REMINDERS */}

          <section className="card reminders">

            <div className="cardHeader">

              <div>
                <h2>Reminders</h2>
                <span>Your scheduled actions</span>
              </div>

              <Bell size={17} />

            </div>

            {reminders.length === 0 && (
              <p className="empty">
                No reminders yet.
              </p>
            )}

            {reminders.map((reminder) => (
              <div
                className="reminder"
                key={reminder.id}
              >

                <div className="reminderIcon">
                  <Bell size={14} />
                </div>

                <div>
                  <b>{reminder.stock}</b>
                  <p>{reminder.text}</p>
                  <small>{reminder.date}</small>
                </div>

                <button
                  onClick={() =>
                    setReminders(
                      reminders.filter(
                        (r) =>
                          r.id !== reminder.id
                      )
                    )
                  }
                >
                  <Trash2 size={14} />
                </button>

              </div>
            ))}

            <button
              className="addReminder"
              onClick={() => setShowReminder(true)}
            >
              <Plus size={15} />
              Add reminder
            </button>

          </section>

        </aside>

      </div>

      {/* REMINDER MODAL */}

      {showReminder && (
        <div
          className="modalBackdrop"
          onClick={() => setShowReminder(false)}
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modalHeader">

              <div>
                <h2>Add Reminder</h2>
                <span>
                  {selectedStock}
                </span>
              </div>

              <button
                onClick={() =>
                  setShowReminder(false)
                }
              >
                <X size={18} />
              </button>

            </div>

            <form onSubmit={addReminder}>

              <label>Reminder</label>

              <input
                autoFocus
                placeholder="Example: Check price tomorrow"
                value={newReminder}
                onChange={(e) =>
                  setNewReminder(e.target.value)
                }
              />

              <button className="saveReminder">
                <CheckCircle size={16} />
                Save Reminder
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

function StockChart({ data }) {
  const width = 800;
  const height = 260;
  const padding = 20;

  const min = Math.min(...data) - 10;
  const max = Math.max(...data) + 10;

  const points = data
    .map((value, index) => {

      const x =
        padding +
        (index * (width - padding * 2)) /
          (data.length - 1);

      const y =
        height -
        padding -
        ((value - min) / (max - min)) *
          (height - padding * 2);

      return `${x},${y}`;

    })
    .join(" ");

  return (
    <div className="chart">

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >

        <defs>
          <linearGradient
            id="chartGradient"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#3b82f6"
              stopOpacity=".30"
            />

            <stop
              offset="100%"
              stopColor="#3b82f6"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[1, 2, 3, 4].map((line) => (
          <line
            key={line}
            x1="0"
            x2={width}
            y1={(height / 5) * line}
            y2={(height / 5) * line}
            stroke="#293140"
          />
        ))}

        <polygon
          points={`20,${height - 20} ${points} ${width - 20},${height - 20}`}
          fill="url(#chartGradient)"
        />

        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

      </svg>

      <div className="chartLabels">
        <span>10:00</span>
        <span>11:00</span>
        <span>12:00</span>
        <span>13:00</span>
      </div>

    </div>
  );
}

function Signal({
  icon,
  title,
  value,
  confidence,
}) {
  return (
    <div className="signal">

      <div className="signalIcon">
        {icon}
      </div>

      <div>
        <small>{title}</small>
        <b>{value}</b>
      </div>

      <span>{confidence}</span>

    </div>
  );
}

function InvestorCard({
  investor,
  active,
  onClick,
}) {
  const Icon = investor.icon;

  return (
    <button
      className={`investor ${
        active ? "activeInvestor" : ""
      }`}
      onClick={onClick}
    >

      <div className="investorTop">

        <div className="investorIcon">
          <Icon size={20} />
        </div>

        {active && (
          <span className="selectedBadge">
            SELECTED
          </span>
        )}

      </div>

      <h3>{investor.name}</h3>

      <p>{investor.reason}</p>

      <div className="investorBottom">

        <div>
          <small>Recommended</small>
          <strong>
            {investor.units} units
          </strong>
        </div>

        <div>
          <small>Confidence</small>
          <strong>
            {investor.confidence}%
          </strong>
        </div>

      </div>

    </button>
  );
}

function Trace({
  title,
  text,
  final,
}) {
  return (
    <div className={`trace ${final ? "finalTrace" : ""}`}>

      <div className="traceDot">
        {final ? (
          <CheckCircle size={15} />
        ) : (
          <Activity size={15} />
        )}
      </div>

      <div>
        <b>{title}</b>
        <p>{text}</p>
      </div>

    </div>
  );
}

function UsersIcon() {
  return (
    <div className="usersIcon">
      <UserRound size={14} />
      <Building2 size={14} />
      <CircleDollarSign size={14} />
    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);
const PROFILES = {
  retail: {
    label: "Retail Investor",
    icon: UserRound,
    risk: 42,
    description: "Smaller capital base. Prioritizes understandable signals, liquidity and controlled risk.",
    objective: "Balanced personal growth"
  },
  institutional: {
    label: "Institutional Investor",
    icon: Building2,
    risk: 56,
    description: "Large capital deployment. Focuses on liquidity, fundamentals, flows and portfolio exposure.",
    objective: "Risk-adjusted portfolio growth"
  },
  hnwi: {
    label: "HNWI Investor",
    icon: CircleDollarSign,
    risk: 68,
    description: "High-net-worth individual investing substantial personal capital without an institutional structure.",
    objective: "Capital growth with flexibility"
  }
};

function App() {
  const [stock, setStock] = useState("RELIANCE");
  const [profile, setProfile] = useState("retail");
  const [degraded, setDegraded] = useState(false);
  const [analyzing, setAnalyzing] = useState(true);
  const [citation, setCitation] = useState(null);
  const [price, setPrice] = useState(STOCKS.RELIANCE.price);
  const [chart, setChart] = useState(
    [2940, 2952, 2948, 2965, 2970, 2980].map((v, i) => ({ time: ["10:00","10:30","11:00","11:30","12:00","12:30"][i], price: v }))
  );

  const profileInfo = PROFILES[profile];
  const ProfileIcon = profileInfo.icon;

  const agents = useMemo(() => [
    {
      id: "market", name: "Market Data Agent", icon: Activity,
      status: "LIVE", confidence: 91, signal: "BUY",
      desc: "Price, volume, volatility & market telemetry",
      reasoning: `Live market telemetry for ${stock} shows positive short-term momentum.`
    },
    {
      id: "fundamental", name: "Fundamental Analysis Agent", icon: Landmark,
      status: "STRONG", confidence: 84, signal: "BUY",
      desc: "Valuation, earnings, balance-sheet & growth analysis",
      reasoning: "Fundamental factors remain supportive under the current mock dataset."
    },
    {
      id: "news", name: "News & Regulatory Agent", icon: Newspaper,
      status: degraded ? "DEGRADED" : "POSITIVE", confidence: degraded ? 0 : 76,
      signal: degraded ? "NEUTRAL" : "BUY",
      desc: "News, filings, announcements & regulatory signals",
      reasoning: degraded
        ? "Regulatory/news feed is unavailable. Synthesis is using a reduced-confidence fallback."
        : "Recent filing and sentiment signals are positive in this prototype."
    },
    {
      id: "risk", name: "Risk & Behavior Agent", icon: Shield,
      status: profileInfo.risk > 60 ? "HIGH CAPACITY" : "CONTROLLED",
      confidence: 88, signal: "HOLD",
      desc: "Risk tolerance, concentration & behavioral constraints",
      reasoning: `${profileInfo.label} risk framework applied with a ${profileInfo.risk}% portfolio risk score.`
    }
  ], [stock, degraded, profileInfo]);

  const investorAgents = useMemo(() => [
    {
      name: "Retail Investor Agent", icon: UserRound,
      view: "Liquidity + understandable upside", confidence: 79,
      decision: profile === "retail" ? "BUY" : "WATCH"
    },
    {
      name: "Institutional Investor Agent", icon: Building2,
      view: "Scale + fundamentals + capital flows", confidence: 86,
      decision: profile === "institutional" ? "BUY" : "ACCUMULATE"
    },
    {
      name: "HNWI Investor Agent", icon: CircleDollarSign,
      view: "Flexible sizing + long-term growth", confidence: 83,
      decision: profile === "hnwi" ? "BUY" : "HOLD"
    }
  ], [profile]);

  const overallConfidence = degraded ? 76.2 : 84.7;
  const decision = degraded
    ? (profile === "retail" ? "HOLD" : "BUY 5 UNITS")
    : (profile === "institutional" ? "BUY 8 UNITS" : profile === "hnwi" ? "BUY 10 UNITS" : "BUY 4 UNITS");

  useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 1000);
    return () => clearTimeout(timer);
  }, [stock, profile, degraded]);

  useEffect(() => {
    const id = setInterval(() => {
      setChart(old => {
        const last = old[old.length - 1].price;
        const next = +(last + (Math.random() - 0.46) * 4).toFixed(2);
        const now = new Date();
        const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
        return [...old.slice(1), { time, price: next }];
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setPrice(chart[chart.length - 1].price);
  }, [chart]);

  const selectStock = (symbol) => {
    setStock(symbol);
    setPrice(STOCKS[symbol].price);
    setChart([2940, 2952, 2948, 2965, 2970, STOCKS[symbol].price].map((v, i) => ({
      time: ["10:00","10:30","11:00","11:30","12:00","12:30"][i], price: v
    })));
    setAnalyzing(true);
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand"><Brain size={21}/><span>HACKVERSE:</span> FIN-INTEL</div>
        <div className="navControls">
          <div className="selectWrap">
            <ProfileIcon size={16}/>
            <select value={profile} onChange={e => { setProfile(e.target.value); setAnalyzing(true); }}>
              <option value="retail">Retail Investor</option>
              <option value="institutional">Institutional Investor</option>
              <option value="hnwi">HNWI Investor</option>
            </select>
          </div>
          <button className={degraded ? "danger active" : "danger"} onClick={() => { setDegraded(!degraded); setAnalyzing(true); }}>
            <AlertTriangle size={15}/> Simulated Degraded Feed
          </button>
          <div className="clock">{new Date().toLocaleTimeString("en-IN")} IST</div>
        </div>
      </header>

      <main className="dashboard">
        <aside className="panel left">
          <PanelTitle title="Watchlist & Risk" icon={<LineChart size={16}/>}/>
          <div className="watchlist">
            {Object.entries(STOCKS).map(([symbol, info]) => (
              <button key={symbol} className={`stockItem ${symbol === stock ? "selected" : ""}`} onClick={() => selectStock(symbol)}>
                <div>
                  <b>{symbol}</b>
                  <small>{info.name}</small>
                </div>
                <div className="stockPrice">
                  ₹{symbol === stock ? price.toFixed(2) : info.price.toFixed(2)}
                  <span className={info.positive ? "positive" : "negative"}>{info.change}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="profileCard">
            <div className="profileHead"><ProfileIcon size={18}/><b>{profileInfo.label}</b></div>
            <p>{profileInfo.description}</p>
            <div className="riskLine"><span>Portfolio Risk Score</span><b>{profileInfo.risk}%</b></div>
            <div className="progress"><div style={{width: `${profileInfo.risk}%`}}/></div>
            <small>Objective: {profileInfo.objective}</small>
          </div>
        </aside>

        <section className="panel center">
          <PanelTitle title="Market Telemetry & Signals" badge={stock}/>
          <div className="kpis">
            <Kpi title="Synthesized Sentiment" value={degraded ? "MODERATE BULL" : "BULLISH"} good/>
            <Kpi title="Signal Confidence" value={`${overallConfidence}%`}/>
          </div>

          <div className="chartBox">
            <ResponsiveContainer width="100%" height="100%">
              <RLineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3545"/>
                <XAxis dataKey="time" tick={{fill:"#94a3b8",fontSize:11}}/>
                <YAxis domain={["auto","auto"]} tick={{fill:"#94a3b8",fontSize:11}}/>
                <Tooltip contentStyle={{background:"#151921",border:"1px solid #2e3545"}}/>
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false}/>
              </RLineChart>
            </ResponsiveContainer>
          </div>

          <PanelTitle title="Analysis Agents" compact/>
          <div className="agentGrid">
            {agents.map(a => <AgentCard key={a.id} agent={a} analyzing={analyzing} onCitation={() => setCitation(a)}/>)}
          </div>

          <PanelTitle title="Investor Perspective Agents" compact/>
          <div className="investorGrid">
            {investorAgents.map(a => {
              const I = a.icon;
              return <div className="investorCard" key={a.name}>
                <div className="investorIcon"><I size={17}/></div>
                <div className="investorText"><b>{a.name}</b><small>{a.view}</small></div>
                <div className="investorDecision"><strong>{a.decision}</strong><small>{a.confidence}%</small></div>
              </div>
            })}
          </div>
        </section>

        <aside className="panel right">
          <PanelTitle title="Autonomous Synthesis Engine" icon={<Zap size={16}/>}/>
          <div className="synthesis">
            <small>Target Position Decision</small>
            <div className="decision">{analyzing ? "SYNTHESIZING" : decision}</div>
            <span>Optimized for: {profileInfo.objective}</span>
          </div>

          <PanelTitle title="Transparent Reasoning Trace" compact/>
          <div className="trace">
            <Trace icon={<Sparkles/>} title="System" text={`Ingesting telemetry for ${stock}.`} />
            {agents.map(a => <Trace key={a.id} icon={<a.icon/>} title={a.name} text={a.reasoning}/>)}
            <Trace icon={<CheckCircle2/>} title="Decision Agent" text={`${profileInfo.label} perspective weighted into final position sizing. Confidence: ${overallConfidence}%.`}/>
          </div>
        </aside>
      </main>

      <footer className="metrics">
        <span><Gauge/> Historical Signal Accuracy: <b>74.2%</b></span>
        <span><Activity/> Agent Pipeline Latency: <b>{analyzing ? "—" : "380 ms"}</b></span>
        <span><ShieldAlert/> Concentration Risk: <b>{profileInfo.risk > 60 ? "27%" : "18%"}</b></span>
        <span><Users/> Active Agents: <b>8</b></span>
      </footer>

      {citation && <div className="modalBackdrop" onClick={() => setCitation(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modalTitle"><b>{citation.name}</b><button onClick={() => setCitation(null)}><X size={17}/></button></div>
          <p>{citation.reasoning}</p>
          <div className="citation"><FileText size={15}/><span>Prototype evidence trace • simulated dataset</span></div>
        </div>
      </div>}
    </div>
  );
}

function PanelTitle({title, icon, badge, compact}) {
  return <div className={`panelTitle ${compact ? "compact" : ""}`}>
    <span>{title}</span>{badge ? <b className="badge">{badge}</b> : icon}
  </div>
}
function Kpi({title,value,good}) {
  return <div className="kpi"><small>{title}</small><strong className={good ? "positive" : ""}>{value}</strong></div>
}
function AgentCard({agent, analyzing, onCitation}) {
  const Icon = agent.icon;
  return <div className={`agentCard ${agent.status === "DEGRADED" ? "degraded" : ""}`}>
    <div className="agentMain"><Icon size={17}/><div><b>{agent.name}</b><small>{agent.desc}</small></div></div>
    <span className={`pill ${agent.status === "DEGRADED" ? "red" : "green"}`}>
      {analyzing ? "THINKING..." : `${agent.status} ${agent.confidence}%`}
    </span>
    <button className="citeBtn" onClick={onCitation}>Cite</button>
  </div>
}
function Trace({icon,title,text}) {
  return <div className="traceItem"><span>{React.cloneElement(icon,{size:14})}</span><div><b>{title}</b><p>{text}</p></div></div>
}

createRoot(document.getElementById("root")).render(<App/>);
