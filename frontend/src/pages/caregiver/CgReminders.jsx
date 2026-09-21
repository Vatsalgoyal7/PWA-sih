// ============================================================
// CgReminders.jsx — Reminder Manager for Caregiver Dashboard
// ============================================================
import React, { useState, useRef, useEffect, useCallback } from "react"
import { LS, DAYS, REMINDER_DEFAULTS, lsGet, lsSet } from "./CgShared"
import "./CgReminders.css"

// ── Constants ──────────────────────────────────────────────
const MAX_RECORD_SECONDS = 10

// ── Helper: blobToBase64 ───────────────────────────────────
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ── ReminderCard ───────────────────────────────────────────
function ReminderCard({ reminder, onChange }) {
  const [recording, setRecording] = useState(false)
  const [countdown, setCountdown] = useState(MAX_RECORD_SECONDS)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const countRef = useRef(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      clearInterval(countRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const handleToggle = () => onChange({ ...reminder, enabled: !reminder.enabled })

  const handleTime = (e) => onChange({ ...reminder, time: e.target.value })

  const handleDay = (i) => {
    const days = [...reminder.days]
    days[i] = !days[i]
    onChange({ ...reminder, days })
  }

  // ── Voice Recording ─────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        const b64 = await blobToBase64(blob)
        onChange({ ...reminder, voiceB64: b64 })
        setRecording(false)
        setCountdown(MAX_RECORD_SECONDS)
        clearInterval(timerRef.current)
        clearInterval(countRef.current)
      }

      mr.start()
      setRecording(true)
      setCountdown(MAX_RECORD_SECONDS)

      let secs = MAX_RECORD_SECONDS
      countRef.current = setInterval(() => {
        secs -= 1
        setCountdown(secs)
        if (secs <= 0) stopRecording()
      }, 1000)

      timerRef.current = setTimeout(() => stopRecording(), MAX_RECORD_SECONDS * 1000)
    } catch (err) {
      alert("Microphone access denied. Please allow microphone to record voice reminders.")
      console.error(err)
    }
  }

  const stopRecording = () => {
    clearTimeout(timerRef.current)
    clearInterval(countRef.current)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
  }

  const playVoice = () => {
    const audio = new Audio(reminder.voiceB64)
    audio.play()
  }

  const deleteVoice = () => onChange({ ...reminder, voiceB64: null })

  return (
    <div className={`reminder-card ${reminder.enabled ? "active" : "inactive"}`}>
      {/* Header row */}
      <div className="reminder-header">
        <div className="reminder-identity">
          <span className="reminder-icon">{reminder.icon}</span>
          <div className="reminder-names">
            <span className="reminder-label-en">{reminder.label}</span>
            <span className="reminder-label-as">{reminder.labelAs}</span>
          </div>
        </div>
        {/* Toggle switch */}
        <label className="toggle-switch" aria-label={`Toggle ${reminder.label}`}>
          <input
            type="checkbox"
            checked={reminder.enabled}
            onChange={handleToggle}
          />
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
        </label>
      </div>

      {/* Time picker */}
      <div className="reminder-time-row">
        <span className="field-label">⏰ Time</span>
        <input
          type="time"
          className="time-input"
          value={reminder.time}
          onChange={handleTime}
          disabled={!reminder.enabled}
        />
      </div>

      {/* Day pills */}
      <div className="reminder-days-row">
        <span className="field-label">📅 Days</span>
        <div className="day-pills">
          {DAYS.map((d, i) => (
            <button
              key={d}
              className={`day-pill ${reminder.days[i] ? "day-active" : ""}`}
              onClick={() => handleDay(i)}
              disabled={!reminder.enabled}
              aria-label={`${d} ${reminder.days[i] ? "active" : "inactive"}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Voice section */}
      <div className="reminder-voice-row">
        <span className="field-label">🎙️ Voice Reminder</span>
        <div className="voice-controls">
          {recording ? (
            <div className="recording-state">
              <span className="recording-dot" />
              <span className="recording-label">Recording… {countdown}s</span>
              <button className="btn-stop-record" onClick={stopRecording}>
                ⏹ Stop
              </button>
            </div>
          ) : (
            <>
              {reminder.voiceB64 ? (
                <div className="voice-saved">
                  <button className="btn-play" onClick={playVoice}>▶ Play</button>
                  <button className="btn-delete-voice" onClick={deleteVoice}>🗑️ Delete</button>
                  <button className="btn-record secondary" onClick={startRecording}>🎤 Re-record</button>
                </div>
              ) : (
                <button className="btn-record" onClick={startRecording}>
                  🎤 Record (10s)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────
export default function CgReminders() {
  const [reminders, setReminders] = useState(() =>
    lsGet(LS.REMINDERS, REMINDER_DEFAULTS)
  )
  const [saved, setSaved] = useState(false)

  const handleChange = useCallback((updated) => {
    setReminders((prev) => {
      const next = prev.map((r) => (r.id === updated.id ? updated : r))
      lsSet(LS.REMINDERS, next)
      return next
    })
    // Show brief "saved" indicator
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }, [])

  const enabledCount = reminders.filter((r) => r.enabled).length

  return (
    <div className="cgdash-view">
      {/* Hero Banner */}
      <div className="cg-hero-banner">
        <div className="cg-hero-tag">
          <span>⏰</span>
          <span>Routines & Voice Alarms</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="cg-hero-title">Daily <span>Routines & Voice Alarms</span></h1>
            <p className="cg-hero-sub">Schedule medicine, nutrition, doctor visits and personalized voice memos for patient orientation.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="enabled-badge">{enabledCount}/{reminders.length} Active</span>
            {saved && <span className="save-toast">✓ Saved</span>}
          </div>
        </div>
      </div>

      {/* Reminder cards (2-column responsive grid) */}
      <div className="reminders-list">
        {reminders.map((r) => (
          <ReminderCard key={r.id} reminder={r} onChange={handleChange} />
        ))}
      </div>
    </div>
  )
}
