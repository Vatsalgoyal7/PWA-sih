// ============================================================
// CgGames.jsx — Game Control Panel for Caregiver Dashboard
// ============================================================
import React, { useState, useCallback } from "react"
import { LS, ALL_GAMES, lsGet, lsSet, API_BASE } from "./CgShared"
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

// ── Main Component ─────────────────────────────────────────
export default function CgGames() {
  const [games, setGames] = useState(() => lsGet(LS.GAMES, ALL_GAMES))
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState("")

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

  return (
    <div className="cg-games">
      {/* Page header */}
      <div className="page-header">
        <h2 className="page-title">🎮 Cognitive Games</h2>
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
          <div
            className="summary-fill"
            style={{ width: `${(activeCount / games.length) * 100}%` }}
          />
        </div>
        <div className="summary-actions">
          <button className="btn-bulk btn-enable-all" onClick={handleEnableAll}>
            Enable All
          </button>
          <button className="btn-bulk btn-disable-all" onClick={handleDisableAll}>
            Disable All
          </button>
        </div>
      </div>

      <p className="page-subtitle">
        Control which cognitive games appear for your patient and set difficulty levels.
      </p>

      {/* Game cards */}
      <div className="games-list">
        {games.map((g, i) => (
          <GameCard key={g.id} game={g} index={i} onChange={handleChange} />
        ))}
      </div>
    </div>
  )
}
