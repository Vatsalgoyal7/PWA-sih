// ============================================================
// CgGames.jsx — Game Control Panel + Presentation Analytics
// Static mock engine for video; swap MOCK_* for API later.
// ============================================================
import React, { useState, useCallback, useEffect, useMemo } from "react"
import { LS, ALL_GAMES, lsGet, lsSet, API_BASE } from "./CgShared"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area,
  ScatterChart, Scatter, ZAxis,
} from "recharts"
import "./CgGames.css"

const DIFFICULTIES = ["easy", "medium", "hard"]
const EXPECTED_TIME = { easy: 25, medium: 35, hard: 45 }

const GAME_DOMAINS = {
  game1:  ["Memory", "Language"],
  game2:  ["Memory", "Attention"],
  game3:  ["Visuospatial", "Memory"],
  game4:  ["Attention", "Visuospatial"],
  game5:  ["Attention", "Executive"],
  game6:  ["Memory", "Language"],
  game7:  ["Executive", "Language"],
  game8:  ["Visuospatial", "Attention"],
  game9:  ["Attention", "Memory"],
  game10: ["Executive", "Language"],
  game11: ["Language", "Memory"],
}

const ALL_DOMAINS = ["Memory", "Attention", "Language", "Visuospatial", "Executive"]
const DOMAIN_COLORS = {
  Memory: "#6366f1",
  Attention: "#0ea5e9",
  Language: "#10b981",
  Visuospatial: "#f59e0b",
  Executive: "#b83a24",
}

const MOCK_TREND_BASE = [
  { day: "Sep 1",  score: 61, sessions: 2 },
  { day: "Sep 2",  score: 64, sessions: 3 },
  { day: "Sep 3",  score: 59, sessions: 1 },
  { day: "Sep 4",  score: 68, sessions: 3 },
  { day: "Sep 5",  score: 71, sessions: 4 },
  { day: "Sep 6",  score: 66, sessions: 2 },
  { day: "Sep 7",  score: 70, sessions: 3 },
  { day: "Sep 8",  score: 74, sessions: 4 },
  { day: "Sep 9",  score: 72, sessions: 2 },
  { day: "Sep 10", score: 75, sessions: 3 },
  { day: "Sep 11", score: 69, sessions: 2 },
  { day: "Sep 12", score: 78, sessions: 4 },
  { day: "Sep 13", score: 76, sessions: 3 },
  { day: "Sep 14", score: 80, sessions: 5 },
  { day: "Sep 15", score: 77, sessions: 3 },
  { day: "Sep 16", score: 82, sessions: 4 },
  { day: "Sep 17", score: 79, sessions: 3 },
  { day: "Sep 18", score: 84, sessions: 5 },
  { day: "Sep 19", score: 81, sessions: 4 },
  { day: "Sep 20", score: 85, sessions: 5 },
  { day: "Sep 21", score: 83, sessions: 3 },
  { day: "Sep 22", score: 87, sessions: 4 },
  { day: "Sep 23", score: 84, sessions: 4 },
  { day: "Sep 24", score: 89, sessions: 5 },
]

const MOCK_GAME_STATS = [
  { id: "game1",  name: "কি উৎসৱ?",        labelEn: "Which Festival?",      accuracy: 88, avgTime: 24, attempts: 14, trend: 6,  difficulty: "easy"   },
  { id: "game2",  name: "কি কি আছিল?",     labelEn: "What Were They?",      accuracy: 74, avgTime: 31, attempts: 11, trend: 3,  difficulty: "easy"   },
  { id: "game3",  name: "ক'ত গ'ল?",        labelEn: "Where Did It Go?",     accuracy: 65, avgTime: 38, attempts: 9,  trend: 8,  difficulty: "medium" },
  { id: "game4",  name: "এইটো চাওঁ",       labelEn: "Look at This",         accuracy: 91, avgTime: 19, attempts: 17, trend: 2,  difficulty: "easy"   },
  { id: "game5",  name: "ভিন্ন কোন?",       labelEn: "Which is Different?",  accuracy: 70, avgTime: 35, attempts: 10, trend: 11, difficulty: "medium" },
  { id: "game6",  name: "লগা লৈ যাও",      labelEn: "Take Along / Match",   accuracy: 62, avgTime: 42, attempts: 8,  trend: 5,  difficulty: "medium" },
  { id: "game7",  name: "বসাৰত কি লাগে?",  labelEn: "What's Needed?",       accuracy: 55, avgTime: 48, attempts: 7,  trend: 14, difficulty: "hard"   },
  { id: "game8",  name: "মিলাই দিয়া",      labelEn: "Match Them",           accuracy: 83, avgTime: 27, attempts: 13, trend: 4,  difficulty: "easy"   },
  { id: "game9",  name: "বাকি ক'তটা?",     labelEn: "How Many Left?",       accuracy: 77, avgTime: 33, attempts: 12, trend: 7,  difficulty: "medium" },
  { id: "game10", name: "কি কৰিব?",        labelEn: "What Should Be Done?", accuracy: 60, avgTime: 45, attempts: 8,  trend: 9,  difficulty: "hard"   },
  { id: "game11", name: "বিশেষ খেলা",      labelEn: "Describe Your Day",    accuracy: 72, avgTime: 36, attempts: 9,  trend: 5,  difficulty: "easy"   },
]

const FEED_POOL = [
  { game: "Which Festival?", score: 92, domain: "Memory" },
  { game: "Look at This", score: 88, domain: "Attention" },
  { game: "Match Them", score: 81, domain: "Visuospatial" },
  { game: "How Many Left?", score: 76, domain: "Attention" },
  { game: "What Were They?", score: 71, domain: "Memory" },
  { game: "Which is Different?", score: 68, domain: "Executive" },
  { game: "What's Needed?", score: 54, domain: "Executive" },
]

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function speedScore(avgTime, difficulty) {
  const expected = EXPECTED_TIME[difficulty] || 35
  return Math.round(clamp(100 - Math.max(0, avgTime - expected) * 2.2, 18, 100))
}

function consistencyScore(attempts) {
  return Math.round(clamp((attempts / 14) * 100, 20, 100))
}

function gameComposite(stat) {
  const speed = speedScore(stat.avgTime, stat.difficulty)
  const cons = consistencyScore(stat.attempts)
  return clamp(Math.round(stat.accuracy * 0.55 + speed * 0.25 + cons * 0.2), 0, 100)
}

function analyzePerformance(games, stats) {
  const enabledIds = new Set(games.filter((g) => g.enabled).map((g) => g.id))
  const scored = stats.map((s) => {
    const speed = speedScore(s.avgTime, s.difficulty)
    const cons = consistencyScore(s.attempts)
    const composite = gameComposite(s)
    return { ...s, speed, cons, composite, enabled: enabledIds.has(s.id) || enabledIds.size === 0 }
  })

  const pool = scored.filter((s) => s.enabled)
  const use = pool.length ? pool : scored

  const avgAccuracy = Math.round(use.reduce((a, s) => a + s.accuracy, 0) / use.length)
  const avgSpeed = Math.round(use.reduce((a, s) => a + s.speed, 0) / use.length)
  const avgCons = Math.round(use.reduce((a, s) => a + s.cons, 0) / use.length)
  const coverage = Math.round((games.filter((g) => g.enabled).length / Math.max(games.length, 1)) * 100)

  const overall = Math.round(avgAccuracy * 0.5 + avgSpeed * 0.2 + avgCons * 0.15 + coverage * 0.15)

  const domainScores = ALL_DOMAINS.map((domain) => {
    const related = scored.filter((s) => GAME_DOMAINS[s.id]?.includes(domain))
    const score = related.length
      ? Math.round(related.reduce((a, s) => a + s.composite, 0) / related.length)
      : 0
    const monthAgo = related.length
      ? Math.round(related.reduce((a, s) => a + Math.max(30, s.composite - s.trend), 0) / related.length)
      : 0
    const change = score - monthAgo
    const gameCount = games.filter((g) => g.enabled && GAME_DOMAINS[g.id]?.includes(domain)).length
    return {
      domain,
      score,
      games: gameCount || related.length,
      color: DOMAIN_COLORS[domain],
      change: `${change >= 0 ? "+" : ""}${change}pts`,
      changeNum: change,
    }
  })

  const weakest = [...domainScores].sort((a, b) => a.score - b.score)[0]
  const strongest = [...domainScores].sort((a, b) => b.score - a.score)[0]
  const totalSessions = scored.reduce((a, s) => a + s.attempts, 0)
  const avgPlayMin = Math.round(scored.reduce((a, s) => a + s.avgTime, 0) / scored.length)
  const bestDay = Math.max(...MOCK_TREND_BASE.map((d) => d.score))

  return {
    scored,
    overall: clamp(overall, 0, 100),
    avgAccuracy,
    avgSpeed,
    avgCons,
    coverage,
    domainScores,
    weakest,
    strongest,
    totalSessions,
    avgPlayMin,
    bestDay,
  }
}

async function syncGamesToBackend(games) {
  try {
    const activeGameIds = games.filter((g) => g.enabled).map((g) => g.id)
    await fetch(`${API_BASE}/patient-config/games`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_selection: activeGameIds }),
    })
  } catch (err) {
    console.warn("Backend sync failed (offline?):", err)
  }
}

function DifficultyButton({ level, current, disabled, onClick }) {
  const active = level === current
  return (
    <button
      className={`diff-btn diff-${level} ${active ? "diff-active" : ""}`}
      onClick={() => onClick(level)}
      disabled={disabled}
      aria-pressed={active}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </button>
  )
}

function GameCard({ game, index, onChange }) {
  const handleToggle = () => onChange({ ...game, enabled: !game.enabled })
  const handleDiff = (level) => onChange({ ...game, difficulty: level })

  return (
    <div className={`game-card ${game.enabled ? "game-on" : "game-off"}`}>
      <div className="game-card-header">
        <div className="game-number-badge">{index + 1}</div>
        <div className="game-names">
          <span className="game-name-as">{game.labelAs}</span>
          <span className="game-name-en">{game.labelEn}</span>
        </div>
        <label className="toggle-switch" aria-label={`Toggle ${game.labelEn}`}>
          <input type="checkbox" checked={game.enabled} onChange={handleToggle} />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
        </label>
      </div>

      <div className="game-diff-row">
        <span className="diff-label">Difficulty:</span>
        <div className="diff-buttons">
          {DIFFICULTIES.map((level) => (
            <DifficultyButton
              key={level}
              level={level}
              current={game.difficulty}
              disabled={!game.enabled}
              onClick={handleDiff}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CgGames() {
  const [games, setGames] = useState(() => lsGet(LS.GAMES, ALL_GAMES))
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState("")
  const [activeTab, setActiveTab] = useState("manage")
  const [clock, setClock] = useState(() => new Date())
  const [liveDrift, setLiveDrift] = useState(0)
  const [feed, setFeed] = useState(() =>
    FEED_POOL.slice(0, 4).map((row, i) => ({
      ...row,
      id: `seed-${i}`,
      ago: `${(i + 1) * 2}m ago`,
    }))
  )

  const activeCount = games.filter((g) => g.enabled).length
  const analysis = useMemo(() => analyzePerformance(games, MOCK_GAME_STATS), [games])

  useEffect(() => {
    if (activeTab !== "analytics") return undefined
    const t = setInterval(() => {
      setClock(new Date())
      setLiveDrift((d) => {
        const next = d + (Math.random() > 0.55 ? 1 : -1)
        return clamp(next, -2, 2)
      })
      setFeed((prev) => {
        const pick = FEED_POOL[Math.floor(Math.random() * FEED_POOL.length)]
        const next = {
          ...pick,
          id: `${Date.now()}`,
          ago: "just now",
        }
        return [next, ...prev.map((p, i) => ({ ...p, ago: i === 0 ? "2m ago" : `${(i + 1) * 2}m ago` }))].slice(0, 5)
      })
    }, 4500)
    return () => clearInterval(t)
  }, [activeTab])

  const handleChange = useCallback((updated) => {
    setGames((prev) => {
      const next = prev.map((g) => (g.id === updated.id ? updated : g))
      lsSet(LS.GAMES, next)
      setSyncing(true)
      syncGamesToBackend(next).finally(() => {
        setSyncing(false)
        setSyncMsg("✓ Synced")
        setTimeout(() => setSyncMsg(""), 1500)
      })
      return next
    })
  }, [])

  const handleEnableAll = () => {
    const next = games.map((g) => ({ ...g, enabled: true }))
    setGames(next)
    lsSet(LS.GAMES, next)
    syncGamesToBackend(next)
  }

  const handleDisableAll = () => {
    const next = games.map((g) => ({ ...g, enabled: false }))
    setGames(next)
    lsSet(LS.GAMES, next)
    syncGamesToBackend(next)
  }

  const trendData = MOCK_TREND_BASE.map((row, i, arr) =>
    i === arr.length - 1 ? { ...row, score: clamp(row.score + liveDrift, 40, 100) } : row
  )

  const sessionData = games.filter((g) => g.enabled).slice(0, 8).map((g, i) => {
    const stat = analysis.scored.find((s) => s.id === g.id)
    return {
      name: `G${i + 1}`,
      fullName: g.labelEn,
      sessions: stat?.attempts ?? [4, 6, 3, 8, 5, 7, 3, 6][i % 8],
      accuracy: stat?.accuracy ?? 70,
    }
  })

  const domainCoverage = ALL_DOMAINS.map((domain) => {
    const count = games.filter((g) => g.enabled && GAME_DOMAINS[g.id]?.includes(domain)).length
    return { domain, count, fullMark: 6 }
  })

  const scatterData = analysis.scored.map((s) => ({
    x: s.avgTime,
    y: s.accuracy,
    z: s.attempts,
    name: s.labelEn,
    fill: s.accuracy >= 80 ? "#10b981" : s.accuracy >= 65 ? "#f59e0b" : "#b83a24",
  }))

  const overallScore = analysis.overall
  const clockLabel = clock.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  const monthDelta = overallScore - MOCK_TREND_BASE[0].score

  return (
    <div className="cgdash-view">
      <div className="cg-hero-banner">
        <div className="cg-hero-tag">
          <span>🎮</span>
          <span>Cognitive Stimulation Therapy</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 className="cg-hero-title">Cognitive <span>Game Prescriber</span></h1>
            <p className="cg-hero-sub">Control which cognitive games appear for your patient. Track analytics and domain coverage.</p>
          </div>
          <span className={`sync-indicator ${syncing ? "syncing" : ""}`}>
            {syncing ? "Syncing…" : syncMsg}
          </span>
        </div>

        <div className="games-summary-bar">
          <div className="summary-count">
            <span className="count-num">{activeCount}</span>
            <span className="count-of"> of {games.length} games active</span>
          </div>
          <div className="summary-progress">
            <div className="summary-fill" style={{ width: `${(activeCount / games.length) * 100}%` }} />
          </div>
          <div className="summary-actions">
            <button className="btn-bulk btn-enable-all" onClick={handleEnableAll}>Enable All</button>
            <button className="btn-bulk btn-disable-all" onClick={handleDisableAll}>Disable All</button>
          </div>
        </div>
      </div>

      <div className="cog-tab-row">
        {[["manage", "📋 Manage Games"], ["analytics", "📈 Analytics & Performance"]].map(([k, l]) => (
          <button key={k} className={`cog-tab-btn ${activeTab === k ? "active" : ""}`} onClick={() => setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {activeTab === "manage" && (
        <div className="games-list">
          {games.map((g, i) => (
            <GameCard key={g.id} game={g} index={i} onChange={handleChange} />
          ))}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="pa-analytics-root">
          <div className="pa-live-strip">
            <span className="pa-live-badge"><span className="pa-live-dot" /> LIVE</span>
            <span className="pa-live-meta">Patient telemetry · Meena Sharma · last tick {clockLabel}</span>
            <span className="pa-live-note">Presentation feed — swap mock engine for patient-app events later</span>
          </div>

          <div className="pa-clinician-strip">
            <div className="pa-cli-cell">
              <span className="pa-cli-k">CST composite</span>
              <span className="pa-cli-v">{overallScore}<small>/100</small></span>
            </div>
            <div className="pa-cli-cell">
              <span className="pa-cli-k">Accuracy 50%</span>
              <span className="pa-cli-v">{analysis.avgAccuracy}%</span>
            </div>
            <div className="pa-cli-cell">
              <span className="pa-cli-k">Speed 20%</span>
              <span className="pa-cli-v">{analysis.avgSpeed}</span>
            </div>
            <div className="pa-cli-cell">
              <span className="pa-cli-k">Consistency 15%</span>
              <span className="pa-cli-v">{analysis.avgCons}</span>
            </div>
            <div className="pa-cli-cell">
              <span className="pa-cli-k">Coverage 15%</span>
              <span className="pa-cli-v">{analysis.coverage}%</span>
            </div>
            <div className="pa-cli-cell">
              <span className="pa-cli-k">MMSE (clinic)</span>
              <span className="pa-cli-v">24<small>/30</small></span>
            </div>
          </div>

          <div className="pa-row pa-row-top">
            <div className="pa-card pa-score-card">
              <div className="pa-card-head">
                <h3>Overall Cognitive Performance</h3>
                <span className="pa-sub">Weighted 30-day composite</span>
              </div>
              <div className="pa-score-display">
                <div className="pa-score-ring-wrap">
                  <svg viewBox="0 0 120 120" className="pa-score-svg" aria-label={`Score: ${overallScore}`}>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                    <circle
                      cx="60" cy="60" r="52"
                      fill="none"
                      stroke="url(#scoreGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray="327"
                      strokeDashoffset={327 - (327 * overallScore / 100)}
                      transform="rotate(-90 60 60)"
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#b83a24" />
                      </linearGradient>
                    </defs>
                    <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="900" fill="#0f172a">{overallScore}</text>
                    <text x="60" y="71" textAnchor="middle" fontSize="10" fill="#64748b">/100</text>
                  </svg>
                  <div className="pa-score-label">
                    <span className="pa-score-grade">
                      {overallScore >= 85 ? "Excellent" : overallScore >= 70 ? "Good Progress" : "Needs Attention"}
                    </span>
                    <span className="pa-score-change">↑ +{monthDelta} pts since Sep 1</span>
                  </div>
                </div>

                <div className="pa-score-stats">
                  <div className="pa-stat-chip">
                    <span className="pa-stat-value">{analysis.bestDay}</span>
                    <span className="pa-stat-label">Best Day Score</span>
                  </div>
                  <div className="pa-stat-chip">
                    <span className="pa-stat-value">{analysis.totalSessions}</span>
                    <span className="pa-stat-label">Total Sessions</span>
                  </div>
                  <div className="pa-stat-chip">
                    <span className="pa-stat-value">{analysis.avgAccuracy}%</span>
                    <span className="pa-stat-label">Avg Accuracy</span>
                  </div>
                  <div className="pa-stat-chip">
                    <span className="pa-stat-value">{analysis.avgPlayMin}m</span>
                    <span className="pa-stat-label">Avg Play Time</span>
                  </div>
                </div>
              </div>

              <div className="pa-ai-insight">
                <span className="pa-ai-badge">Insight</span>
                <p>
                  Strongest domain is <strong>{analysis.strongest.domain}</strong> ({analysis.strongest.score}%).
                  Weakest is <strong>{analysis.weakest.domain}</strong> ({analysis.weakest.score}%) —
                  increase daily frequency of Game 7 &amp; 10 from 1× to 2×. Memory and language still lead month-on-month gains.
                </p>
              </div>
            </div>

            <div className="pa-card pa-domain-card">
              <div className="pa-card-head">
                <h3>Cognitive Domain Scores</h3>
                <span className="pa-sub">Generated from per-game composites</span>
              </div>

              <div className="pa-domains-list">
                {analysis.domainScores.map((d) => (
                  <div key={d.domain} className="pa-domain-row">
                    <div className="pa-domain-info">
                      <span className="pa-domain-name" style={{ color: d.color }}>{d.domain}</span>
                      <span className="pa-domain-change" style={{ color: d.changeNum >= 0 ? "#10b981" : "#b83a24" }}>{d.change}</span>
                    </div>
                    <div className="pa-domain-bar-wrap">
                      <div className="pa-domain-bar-bg">
                        <div className="pa-domain-bar-fill" style={{ width: `${d.score}%`, background: d.color }} />
                      </div>
                      <span className="pa-domain-pct">{d.score}%</span>
                    </div>
                    <span className="pa-domain-games">{d.games} games</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 8 }}>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={domainCoverage}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="domain" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 6]} tick={{ fontSize: 9 }} />
                    <Radar dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.20} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="pa-card pa-full-card">
            <div className="pa-card-head">
              <div>
                <h3>30-Day Performance Trend</h3>
                <span className="pa-sub">Daily composite cognitive score — Patient: Meena Sharma</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="pa-legend-chip" style={{ background: "#ede9fe", color: "#6366f1" }}>Score / 100</span>
                <span className="pa-trend-badge">↑ +{monthDelta} pts since Sep 1</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickFormatter={(v) => v.replace("Sep ", "S")}
                  interval={3}
                />
                <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }}
                  formatter={(v, n) => [n === "score" ? `${v} / 100` : `${v} sessions`, n === "score" ? "Cognitive Score" : "Game Sessions"]}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fill="url(#trendGrad)" dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pa-row pa-row-mid">
            <div className="pa-card">
              <div className="pa-card-head">
                <h3>Weekly Game Session Frequency</h3>
                <span className="pa-sub">Total plays per active game</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sessionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }}
                    formatter={(v, n, p) => [`${v} sessions`, p.payload.fullName]}
                  />
                  <Bar dataKey="sessions" radius={[6, 6, 0, 0]}>
                    {sessionData.map((entry, i) => (
                      <Cell key={i} fill={entry.sessions >= 12 ? "#b83a24" : entry.sessions >= 9 ? "#f59e0b" : "#6366f1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                <span className="pa-legend-chip" style={{ background: "#fee2e2", color: "#b83a24" }}>High (12+)</span>
                <span className="pa-legend-chip" style={{ background: "#fef3c7", color: "#b45309" }}>Medium (9–11)</span>
                <span className="pa-legend-chip" style={{ background: "#e0e7ff", color: "#6366f1" }}>Lower</span>
              </div>
            </div>

            <div className="pa-card">
              <div className="pa-card-head">
                <h3>Per-Game Accuracy Scores</h3>
                <span className="pa-sub">Correct responses / total attempts (%)</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={analysis.scored.slice(0, 8)}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis type="category" dataKey="labelEn" tick={{ fontSize: 9.5, fill: "#64748b" }} width={90} />
                  <Tooltip
                    contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }}
                    formatter={(v) => [`${v}%`, "Accuracy"]}
                  />
                  <Bar dataKey="accuracy" radius={[0, 6, 6, 0]}>
                    {analysis.scored.slice(0, 8).map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.accuracy >= 80 ? "#10b981" : entry.accuracy >= 65 ? "#f59e0b" : "#b83a24"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                <span className="pa-legend-chip" style={{ background: "#d1fae5", color: "#065f46" }}>Good (≥80%)</span>
                <span className="pa-legend-chip" style={{ background: "#fef3c7", color: "#b45309" }}>Average (65–79%)</span>
                <span className="pa-legend-chip" style={{ background: "#fee2e2", color: "#b91c1c" }}>Needs work (&lt;65%)</span>
              </div>
            </div>
          </div>

          <div className="pa-row pa-row-mid">
            <div className="pa-card">
              <div className="pa-card-head">
                <h3>Accuracy vs Response Time</h3>
                <span className="pa-sub">Slow + low accuracy = risk games (bottom-right)</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <ScatterChart margin={{ top: 12, right: 12, left: -10, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="x" name="Avg time" unit="s" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis type="number" dataKey="y" name="Accuracy" unit="%" domain={[40, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <ZAxis type="number" dataKey="z" range={[60, 180]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 12 }}
                    formatter={(v, n) => [n === "y" ? `${v}%` : n === "x" ? `${v}s` : v, n === "y" ? "Accuracy" : n === "x" ? "Avg time" : "Attempts"]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.name || ""}
                  />
                  <Scatter data={scatterData} fill="#6366f1">
                    {scatterData.map((e, i) => (
                      <Cell key={i} fill={e.fill} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="pa-card pa-feed-card">
              <div className="pa-card-head">
                <h3>Today&apos;s session feed</h3>
                <span className="pa-sub">Live-looking mock events for demo</span>
              </div>
              <ul className="pa-feed-list">
                {feed.map((row) => (
                  <li key={row.id} className="pa-feed-item">
                    <span className={`pa-feed-score ${row.score >= 80 ? "good" : row.score >= 65 ? "avg" : "low"}`}>{row.score}</span>
                    <div className="pa-feed-body">
                      <strong>{row.game}</strong>
                      <span>{row.domain} · {row.ago}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pa-card pa-full-card">
            <div className="pa-card-head">
              <h3>Detailed Per-Game Performance Report</h3>
              <span className="pa-sub">Accuracy, speed score, attempts, composite, 30-day trend</span>
            </div>
            <div className="pa-table-wrap">
              <table className="pa-perf-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Game (Assamese / English)</th>
                    <th>Accuracy</th>
                    <th>Accuracy Bar</th>
                    <th>Avg Time</th>
                    <th>Speed</th>
                    <th>Attempts</th>
                    <th>Composite</th>
                    <th>30d Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.scored.map((g, i) => (
                    <tr key={g.id} className={i % 2 === 0 ? "pa-row-even" : ""}>
                      <td className="pa-td-num">{i + 1}</td>
                      <td>
                        <div className="pa-td-name">{g.name}</div>
                        <div className="pa-td-sub">{g.labelEn}</div>
                      </td>
                      <td>
                        <span className={`pa-acc-badge ${g.accuracy >= 80 ? "acc-good" : g.accuracy >= 65 ? "acc-avg" : "acc-low"}`}>
                          {g.accuracy}%
                        </span>
                      </td>
                      <td>
                        <div className="pa-mini-bar-bg">
                          <div
                            className="pa-mini-bar-fill"
                            style={{
                              width: `${g.accuracy}%`,
                              background: g.accuracy >= 80 ? "#10b981" : g.accuracy >= 65 ? "#f59e0b" : "#b83a24",
                            }}
                          />
                        </div>
                      </td>
                      <td className="pa-td-meta">{g.avgTime}s</td>
                      <td className="pa-td-meta">{g.speed}</td>
                      <td className="pa-td-meta">{g.attempts}×</td>
                      <td className="pa-td-meta"><strong>{g.composite}</strong></td>
                      <td>
                        <span className="pa-trend-up">+{g.trend}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
