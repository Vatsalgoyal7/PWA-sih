// ============================================================
// CgGames.jsx — Game Control Panel + Analytics
// ============================================================
import React, { useState, useCallback } from "react"
import { LS, ALL_GAMES, lsGet, lsSet, API_BASE } from "./CgShared"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts"
import "./CgGames.css"

const DIFFICULTIES = ["easy", "medium", "hard"]

// ── Sync to backend (fire-and-forget) ─────────────────────
async function syncGamesToBackend(games) {
  try {
    const activeGameIds = games.filter((g) => g.enabled).map((g) => g.id)
    await fetch(`${API_BASE}/patient-config/games`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_selection: activeGameIds }),
    })
  } catch (err) {
    // Silent fail — offline-first, localStorage is source of truth
    console.warn("Backend sync failed (offline?):", err)
  }
}

// ── DifficultyButton ───────────────────────────────────────
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

// ── GameCard ───────────────────────────────────────────────
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
        {/* Toggle */}
        <label className="toggle-switch" aria-label={`Toggle ${game.labelEn}`}>
          <input
            type="checkbox"
            checked={game.enabled}
            onChange={handleToggle}
          />
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

// ── Domain Mapping for Radar ───────────────────────────────
const GAME_DOMAINS = {
  game1:  ['Memory', 'Language'],
  game2:  ['Memory', 'Attention'],
  game3:  ['Visuospatial', 'Memory'],
  game4:  ['Attention', 'Visuospatial'],
  game5:  ['Attention', 'Executive'],
  game6:  ['Memory', 'Language'],
  game7:  ['Executive', 'Language'],
  game8:  ['Visuospatial', 'Attention'],
  game9:  ['Attention', 'Memory'],
  game10: ['Executive', 'Language'],
  game11: ['Language', 'Memory'],
}

const ALL_DOMAINS = ['Memory', 'Attention', 'Language', 'Visuospatial', 'Executive']

// ── Main Component ─────────────────────────────────────────
export default function CgGames() {
  const [games, setGames] = useState(() => lsGet(LS.GAMES, ALL_GAMES))
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState("")
  const [activeTab, setActiveTab] = useState("manage")

  const activeCount = games.filter((g) => g.enabled).length

  const handleChange = useCallback(
    (updated) => {
      setGames((prev) => {
        const next = prev.map((g) => (g.id === updated.id ? updated : g))
        lsSet(LS.GAMES, next)
        // Fire-and-forget backend sync
        setSyncing(true)
        syncGamesToBackend(next).finally(() => {
          setSyncing(false)
          setSyncMsg("✓ Synced")
          setTimeout(() => setSyncMsg(""), 1500)
        })
        return next
      })
    },
    []
  )

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

  // Analytics: domain coverage from active games
  const domainCoverage = ALL_DOMAINS.map(domain => {
    const count = games.filter(g => g.enabled && GAME_DOMAINS[g.id]?.includes(domain)).length
    return { domain, count, fullMark: 6 }
  })

  // Bar chart: sessions per game (simulated for demo)
  const sessionData = games.slice(0, 8).map((g, i) => ({
    name: `G${i + 1}`,
    fullName: g.labelEn,
    sessions: g.enabled ? [3,5,2,7,4,6,2,5][i % 8] : 0,
  }))

  return (
    <div className="cgdash-view">
      {/* Hero Banner */}
      <div className="cg-hero-banner">
        <div className="cg-hero-tag">
          <span>🎮</span>
          <span>Cognitive Stimulation Therapy</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="cg-hero-title">Cognitive <span>Game Prescriber</span></h1>
            <p className="cg-hero-sub">Control which cognitive games appear for your patient. Track analytics and domain coverage.</p>
          </div>
          <span className={`sync-indicator ${syncing ? "syncing" : ""}`}>
            {syncing ? "Syncing…" : syncMsg}
          </span>
        </div>

        {/* Summary bar */}
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

      {/* Tabs */}
      <div className="cog-tab-row">
        {[['manage', '📋 Manage Games'], ['analytics', '📈 Analytics & Coverage']].map(([k, l]) => (
          <button key={k} className={`cog-tab-btn ${activeTab === k ? 'active' : ''}`} onClick={() => setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {/* MANAGE TAB */}
      {activeTab === 'manage' && (
        <div className="games-list">
          {games.map((g, i) => (
            <GameCard key={g.id} game={g} index={i} onChange={handleChange} />
          ))}
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="games-analytics-layout">
          {/* Sessions Bar Chart */}
          <div className="games-analytics-card">
            <div className="cog-card-header">
              <h3>📊 Weekly Game Sessions</h3>
              <span className="cog-card-sub">Simulated data — integrate with patient app for real tracking</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sessionData} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cg-border)" vertical={false}/>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--cg-text-dim)' }}/>
                <YAxis tick={{ fontSize: 11, fill: 'var(--cg-text-dim)' }}/>
                <Tooltip
                  contentStyle={{ background: 'var(--cg-surface)', border: '1px solid var(--cg-border)', borderRadius: 8 }}
                  formatter={(v, n, props) => [v + ' sessions', props.payload.fullName]}
                />
                <Bar dataKey="sessions" radius={[6,6,0,0]}>
                  {sessionData.map((entry, i) => (
                    <Cell key={i} fill={entry.sessions > 0 ? 'var(--cg-primary)' : 'var(--cg-border)'}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Domain Coverage Radar */}
          <div className="games-analytics-card">
            <div className="cog-card-header">
              <h3>🧠 Cognitive Domain Coverage</h3>
              <span className="cog-card-sub">Active games across 5 cognitive domains</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={domainCoverage}>
                <PolarGrid stroke="var(--cg-border)"/>
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: 'var(--cg-text-dim)' }}/>
                <PolarRadiusAxis angle={30} domain={[0, 6]} tick={{ fontSize: 10 }}/>
                <Radar dataKey="count" stroke="var(--cg-primary)" fill="var(--cg-primary)" fillOpacity={0.25}/>
              </RadarChart>
            </ResponsiveContainer>
            <div className="games-domain-list">
              {domainCoverage.map(d => (
                <div key={d.domain} className="games-domain-row">
                  <span className="games-domain-name">{d.domain}</span>
                  <div className="games-domain-bar-track">
                    <div className="games-domain-bar-fill" style={{ width: `${(d.count/6)*100}%` }}/>
                  </div>
                  <span className="games-domain-count">{d.count} games</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
