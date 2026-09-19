import { useState, useEffect } from "react"
import { useLanguage } from "../context/LanguageContext"
import LanguageToggle from "../components/LanguageToggle"
import "./CaregiverHome.css"

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "http://localhost:8000"
    : "https://smritisetu-backend.onrender.com")

// ---------------------------------------------------------------------------
// Game catalog (English labels + IDs for the caregiver checklist)
// ---------------------------------------------------------------------------
const ALL_GAMES = [
  { id: "game1",  labelAs: "কি উৎসৱ?",          labelEn: "Which festival?"          },
  { id: "game2",  labelAs: "কি কি আছিল?",        labelEn: "What were they?"          },
  { id: "game3",  labelAs: "ক'ত গ'ল?",            labelEn: "Where did it go?"         },
  { id: "game4",  labelAs: "এইটো চাওঁ",           labelEn: "Look at this"             },
  { id: "game5",  labelAs: "ভিন্ন কোন?",          labelEn: "Which is different?"      },
  { id: "game6",  labelAs: "লগা লৈ যাও",          labelEn: "Take along / Match"       },
  { id: "game7",  labelAs: "বসাৰত কি লাগে?",      labelEn: "What's needed here?"      },
  { id: "game8",  labelAs: "মিলাই দিয়া",          labelEn: "Match them"               },
  { id: "game9",  labelAs: "বাকি ক'তটা?",         labelEn: "How many are left?"       },
  { id: "game10", labelAs: "কি কৰিব?",            labelEn: "What should be done?"     },
]

const REMINDER_FIELDS = [
  { key: "reminder_medicine", labelEn: "💊 Medicine", labelAs: "💊 ঔষধ"  },
  { key: "reminder_food",     labelEn: "🍽️ Food",     labelAs: "🍽️ খাদ্য" },
  { key: "reminder_doctor",   labelEn: "🩺 Doctor",   labelAs: "🩺 ডাক্তৰ" },
  { key: "reminder_walk",     labelEn: "🚶 Walk",     labelAs: "🚶টিব" },
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
  const { lang, t } = useLanguage()
  const existing = config?.game_selection ?? []
  const [selected, setSelected] = useState(new Set(existing))
  const [saving,   setSaving]   = useState(false)
  const [saveMsg,  setSaveMsg]  = useState(null)

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < 10) {
        next.add(id)
      }
      return next
    })
    setSaveMsg(null)
  }

  const handleSave = async () => {
    if (selected.size < 3) {
      setSaveMsg({ type: "error", text: lang === 'as' ? "সংৰক্ষণৰ আগতে নিম্নতম ৩ টা খেল বাছক।" : "Select at least 3 games before saving." })
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
      setSaveMsg({ type: "ok", text: t("cgSavedOk") })
    } catch (err) {
      setSaveMsg({ type: "error", text: `${t("cgSaveFailed")}${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="cg-page">
      <div className="cg-header">
        <button className="cg-back-btn" onClick={onBack}>{t("cgBack")}</button>
        <h2 className="cg-page-title">{t("cgGamesTitle")}</h2>
        <LanguageToggle className="cg-header-lang" />
      </div>

      <p className="cg-counter">
        <strong>{selected.size}</strong> {t("cgSelectedOf")} 10
        {selected.size < 3  && <span className="cg-warn"> {t("cgMinRequired")}</span>}
        {selected.size === 10 && <span className="cg-info"> {t("cgMaxReached")}</span>}
      </p>

      <ul className="cg-checklist">
        {ALL_GAMES.map((game, idx) => {
          const checked    = selected.has(game.id)
          const maxReached = selected.size >= 10 && !checked
          const label = `${game.labelAs} — ${game.labelEn}`
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
                <span className="cg-game-label">{label}</span>
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
        {saving ? t("cgSaving") : t("cgSaveGames")}
      </button>
    </div>
  )
}

// ===========================================================================
// Sub-page: Reminder Times
// ===========================================================================
function ReminderSettingsPage({ config, setConfig, onBack }) {
  const { lang, t } = useLanguage()
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
      setSaveMsg({ type: "ok", text: t("cgSavedOk") })
    } catch (err) {
      setSaveMsg({ type: "error", text: `${t("cgSaveFailed")}${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="cg-page">
      <div className="cg-header">
        <button className="cg-back-btn" onClick={onBack}>{t("cgBack")}</button>
        <h2 className="cg-page-title">{t("cgRemTitle")}</h2>
        <LanguageToggle className="cg-header-lang" />
      </div>

      <p className="cg-subtitle">{t("cgDailyTimePrompt")}</p>

      <ul className="cg-reminder-list">
        {REMINDER_FIELDS.map(field => (
          <li key={field.key} className="cg-reminder-item">
            <label className="cg-reminder-label" htmlFor={field.key}>
              <span className="cg-rem-label-text">{lang === 'as' ? field.labelAs : field.labelEn}</span>
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
        {saving ? t("cgSaving") : t("cgSaveReminders")}
      </button>
    </div>
  )
}

// ===========================================================================
// Root: CaregiverHome — home | games | reminders
// ===========================================================================
function CaregiverHome({ onChangeRole }) {
  const { t } = useLanguage()
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
        <div className="cg-home-header-top">
          <div>
            <h1 className="cg-home-title">{t("cgTitle")}</h1>
            <p className="cg-home-sub">{t("cgSubtitle")}</p>
          </div>
          <LanguageToggle className="cg-home-lang" />
        </div>
      </div>

      {loading && <p className="cg-loading">Loading patient config…</p>}
      {error   && <p className="cg-save-msg cg-save-msg--error">Could not load config: {error}</p>}

      {!loading && (
        <div className="cg-home-grid">
          <button className="cg-nav-card" onClick={() => setPage("games")}>
            <span className="cg-nav-icon">🎮</span>
            <span className="cg-nav-title">{t("cgGamesTitle")}</span>
            <span className="cg-nav-desc">
              {t("cgGamesDesc")}
              {config && (
                <em> ({config.game_selection?.length ?? 0} active)</em>
              )}
            </span>
          </button>

          <button className="cg-nav-card" onClick={() => setPage("reminders")}>
            <span className="cg-nav-icon">⏰</span>
            <span className="cg-nav-title">{t("cgRemTitle")}</span>
            <span className="cg-nav-desc">{t("cgRemDesc")}</span>
          </button>
        </div>
      )}

      <button className="cg-role-btn" onClick={onChangeRole}>
        {t("cgSwitchRole")}
      </button>
    </div>
  )
}

export default CaregiverHome
