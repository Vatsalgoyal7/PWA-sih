import { useState, useEffect } from "react"
import "./CaregiverHome.css"

const API_BASE = import.meta.env.VITE_API_URL ?? "https://smritisetu-backend.onrender.com"

// ---------------------------------------------------------------------------
// Game catalog (English labels + IDs for the caregiver checklist)
// ---------------------------------------------------------------------------
const ALL_GAMES = [
  { id: "game1",  label: "কি উৎসৱ? — Which festival?"         },
  { id: "game2",  label: "কি কি আছিল? — What were they?"      },
  { id: "game3",  label: "ক'ত গ'ল? — Where did it go?"        },
  { id: "game4",  label: "এইটো চাওঁ — Look at this"           },
  { id: "game5",  label: "ভিন্ন কোন? — Which is different?"   },
  { id: "game6",  label: "লগা লৈ যাও — Take along / Match"    },
  { id: "game7",  label: "বসাৰত কি লাগে? — What's needed here?"},
  { id: "game8",  label: "মিলাই দিয়া — Match them"            },
  { id: "game9",  label: "বাকি ক'তটা? — How many are left?"   },
  { id: "game10", label: "কি কৰিব? — What should be done?"    },
  { id: "game11", label: "বিশেষ খেলা — Describe Your Day (online)" },
]

const REMINDER_FIELDS = [
  { key: "reminder_medicine", label: "💊 Medicine",  labelAs: "ঔষধ"  },
  { key: "reminder_food",     label: "🍽️ Food",      labelAs: "খাদ্য" },
  { key: "reminder_doctor",   label: "🩺 Doctor",    labelAs: "ডাক্তৰ" },
  { key: "reminder_walk",     label: "🚶 Walk",      labelAs: "হাঁটিব" },
]

// ---------------------------------------------------------------------------
// Shared hook — load full config once, expose sub-slices to each sub-page
// ---------------------------------------------------------------------------
function usePatientConfig() {
  const [config, setConfig]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/patient-config`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(data => { setConfig(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  return { config, setConfig, loading, error }
}

// ===========================================================================
// Sub-page: Game Selection
// ===========================================================================
function GameSelectionPage({ config, setConfig, onBack }) {
  const existing = config?.game_selection ?? []
  const [selected, setSelected] = useState(new Set(existing))
  const [saving,   setSaving]   = useState(false)
  const [saveMsg,  setSaveMsg]  = useState(null)

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < 11) {
        next.add(id)
      }
      return next
    })
    setSaveMsg(null)
  }

  const handleSave = async () => {
    if (selected.size < 3) {
      setSaveMsg({ type: "error", text: "Select at least 3 games before saving." })
      return
    }
    setSaving(true)
    setSaveMsg(null)
    try {
      // Preserve catalog order in the saved list
      const ordered = ALL_GAMES.filter(g => selected.has(g.id)).map(g => g.id)
      const res = await fetch(`${API_BASE}/patient-config/games`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_selection: ordered }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setConfig(prev => ({ ...prev, game_selection: ordered }))
      setSaveMsg({ type: "ok", text: "Saved successfully." })
    } catch (err) {
      setSaveMsg({ type: "error", text: `Save failed: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="cg-page">
      <div className="cg-header">
        <button className="cg-back-btn" onClick={onBack}>← Back</button>
        <h2 className="cg-page-title">Game Selection</h2>
      </div>

      <p className="cg-counter">
        <strong>{selected.size}</strong> of 11 selected
        {selected.size < 3  && <span className="cg-warn"> — minimum 3 required</span>}
        {selected.size === 11 && <span className="cg-info"> — maximum reached</span>}
      </p>

      <ul className="cg-checklist">
        {ALL_GAMES.map((game, idx) => {
          const checked    = selected.has(game.id)
          const maxReached = selected.size >= 11 && !checked
          return (
            <li key={game.id} className={`cg-check-item ${checked ? "cg-check-item--on" : ""}`}>
              <label className={`cg-check-label ${maxReached ? "cg-check-label--disabled" : ""}`}>
                <input
                  type="checkbox"
                  className="cg-checkbox"
                  checked={checked}
                  disabled={maxReached}
                  onChange={() => toggle(game.id)}
                />
                <span className="cg-game-num">{idx + 1}</span>
                <span className="cg-game-label">{game.label}</span>
              </label>
            </li>
          )
        })}
      </ul>

      {saveMsg && (
        <p className={`cg-save-msg cg-save-msg--${saveMsg.type}`}>{saveMsg.text}</p>
      )}

      <button
        className="cg-save-btn"
        onClick={handleSave}
        disabled={saving || selected.size < 3}
      >
        {saving ? "Saving…" : "Save Game Selection"}
      </button>
    </div>
  )
}

// ===========================================================================
// Sub-page: Reminder Times
// ===========================================================================
function ReminderSettingsPage({ config, setConfig, onBack }) {
  const [times, setTimes] = useState({
    reminder_medicine: config?.reminder_medicine ?? "",
    reminder_food:     config?.reminder_food     ?? "",
    reminder_doctor:   config?.reminder_doctor   ?? "",
    reminder_walk:     config?.reminder_walk     ?? "",
  })
  const [saving,  setSaving]  = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)

  const handleChange = (key, val) => {
    setTimes(prev => ({ ...prev, [key]: val }))
    setSaveMsg(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg(null)
    try {
      const payload = {
        reminder_medicine: times.reminder_medicine || null,
        reminder_food:     times.reminder_food     || null,
        reminder_doctor:   times.reminder_doctor   || null,
        reminder_walk:     times.reminder_walk     || null,
      }
      const res = await fetch(`${API_BASE}/patient-config/reminders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setConfig(prev => ({ ...prev, ...payload }))
      setSaveMsg({ type: "ok", text: "Reminder times saved." })
    } catch (err) {
      setSaveMsg({ type: "error", text: `Save failed: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="cg-page">
      <div className="cg-header">
        <button className="cg-back-btn" onClick={onBack}>← Back</button>
        <h2 className="cg-page-title">Reminder Times</h2>
      </div>

      <p className="cg-subtitle">Set the daily time for each reminder type.</p>

      <ul className="cg-reminder-list">
        {REMINDER_FIELDS.map(field => (
          <li key={field.key} className="cg-reminder-item">
            <label className="cg-reminder-label" htmlFor={field.key}>
              <span className="cg-rem-label-text">{field.label}</span>
              <span className="cg-rem-label-as">{field.labelAs}</span>
            </label>
            <input
              id={field.key}
              type="time"
              className="cg-time-input"
              value={times[field.key] ?? ""}
              onChange={e => handleChange(field.key, e.target.value)}
            />
          </li>
        ))}
      </ul>

      {saveMsg && (
        <p className={`cg-save-msg cg-save-msg--${saveMsg.type}`}>{saveMsg.text}</p>
      )}

      <button className="cg-save-btn" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save Reminder Times"}
      </button>
    </div>
  )
}

// ===========================================================================
// Root: CaregiverHome — home | games | reminders
// ===========================================================================
function CaregiverHome({ onChangeRole }) {
  const [page, setPage] = useState("home")   // "home" | "games" | "reminders"
  const { config, setConfig, loading, error } = usePatientConfig()

  if (page === "games") {
    return (
      <GameSelectionPage
        config={config}
        setConfig={setConfig}
        onBack={() => setPage("home")}
      />
    )
  }

  if (page === "reminders") {
    return (
      <ReminderSettingsPage
        config={config}
        setConfig={setConfig}
        onBack={() => setPage("home")}
      />
    )
  }

  // ---------- Home dashboard ----------
  return (
    <div className="cg-page cg-home">
      <div className="cg-home-header">
        <h1 className="cg-home-title">SmritiSetu</h1>
        <p className="cg-home-sub">Caregiver Dashboard</p>
      </div>

      {loading && <p className="cg-loading">Loading patient config…</p>}
      {error   && <p className="cg-save-msg cg-save-msg--error">Could not load config: {error}</p>}

      {!loading && (
        <div className="cg-home-grid">
          <button className="cg-nav-card" onClick={() => setPage("games")}>
            <span className="cg-nav-icon">🎮</span>
            <span className="cg-nav-title">Game Selection</span>
            <span className="cg-nav-desc">
              Choose which games the patient sees
              {config && (
                <em> ({config.game_selection?.length ?? 0} active)</em>
              )}
            </span>
          </button>

          <button className="cg-nav-card" onClick={() => setPage("reminders")}>
            <span className="cg-nav-icon">⏰</span>
            <span className="cg-nav-title">Reminder Times</span>
            <span className="cg-nav-desc">Set daily times for medicine, food, doctor & walk</span>
          </button>
        </div>
      )}

      <button className="cg-role-btn" onClick={onChangeRole}>
        ← Switch role
      </button>
    </div>
  )
}

export default CaregiverHome
