// ============================================================
// CgHandover.jsx — Care Team Shift Handover Notes
// Log + Quick Templates + Copy to Clipboard
// ============================================================
import React, { useState } from 'react'
import { lsGet, lsSet, today, LS } from './CgShared'
import './CgHandover.css'

const SHIFTS_META = {
  morning:   { label: 'Morning',   icon: '🌅', color: '#f59e0b', time: '6AM–2PM' },
  afternoon: { label: 'Afternoon', icon: '☀️',  color: '#3b82f6', time: '2PM–10PM' },
  night:     { label: 'Night',     icon: '🌙', color: '#8b5cf6', time: '10PM–6AM' },
}

const QUICK_TEMPLATES = [
  '✅ Ate full meal',
  '⚠️ Refused food',
  '✅ Took all medications',
  '⚠️ Refused medications',
  '😊 Calm and cooperative',
  '😤 Agitated in the evening',
  '🚶 Wandering noticed',
  '😴 Slept well through the night',
  '😫 Restless sleep',
  '💬 Spoke clearly today',
  '🤫 Very withdrawn',
  '👨‍⚕️ Doctor visit done',
]

export default function CgHandover() {
  const notes = lsGet(LS.HANDOVER_NOTES, [])
  const [notesList, setNotesList] = useState(notes)
  const [form, setForm] = useState({
    caregiver: '',
    shift: 'morning',
    note: '',
  })
  const [copied, setCopied] = useState(false)
  const [filter, setFilter] = useState('all')

  const handleAddNote = () => {
    if (!form.note.trim()) return
    const newNote = {
      id: Date.now(),
      caregiver: form.caregiver || 'Caregiver',
      shift: form.shift,
      note: form.note.trim(),
      date: today(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }
    const updated = [newNote, ...notesList]
    setNotesList(updated)
    lsSet(LS.HANDOVER_NOTES, updated)
    setForm(prev => ({ ...prev, note: '' }))
  }

  const handleTemplate = (tpl) => {
    setForm(prev => ({ ...prev, note: prev.note ? prev.note + '\n' + tpl : tpl }))
  }

  const handleDelete = (id) => {
    const updated = notesList.filter(n => n.id !== id)
    setNotesList(updated)
    lsSet(LS.HANDOVER_NOTES, updated)
  }

  const handleCopyAll = () => {
    const text = notesList
      .slice(0, 10)
      .map(n => `[${n.date} ${n.time}] ${SHIFTS_META[n.shift].icon} ${n.shift.toUpperCase()} - ${n.caregiver}\n${n.note}`)
      .join('\n\n---\n\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const filtered = filter === 'all' ? notesList : notesList.filter(n => n.shift === filter)

  return (
    <div className="cgdash-view">
      {/* Hero */}
      <div className="cg-hero-banner">
        <div className="cg-hero-tag"><span>👥</span><span>Care Team Coordination</span></div>
        <h1 className="cg-hero-title">Shift Handover <span>Notes</span></h1>
        <p className="cg-hero-sub">
          Log patient observations at every shift change. Share with family, ASHA worker,
          or doctor via clipboard copy.
        </p>
      </div>

      <div className="handover-layout">
        {/* Left: Add Note Form */}
        <div className="handover-form-card">
          <h3 className="mood-card-title">📝 Add Handover Note</h3>

          <div className="handover-field-group">
            <label className="handover-label">Your Name</label>
            <input
              className="handover-input"
              placeholder="e.g. Priya (Daughter), ASHA Worker"
              value={form.caregiver}
              onChange={e => setForm(prev => ({ ...prev, caregiver: e.target.value }))}
            />
          </div>

          <div className="handover-field-group">
            <label className="handover-label">Shift</label>
            <div className="handover-shift-row">
              {Object.entries(SHIFTS_META).map(([k, s]) => (
                <button
                  key={k}
                  className={`handover-shift-btn ${form.shift === k ? 'shift-active' : ''}`}
                  style={form.shift === k ? { background: s.color, borderColor: s.color } : {}}
                  onClick={() => setForm(prev => ({ ...prev, shift: k }))}
                >
                  {s.icon} {s.label}
                  <span className="handover-shift-time">{s.time}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="handover-field-group">
            <label className="handover-label">Quick Templates</label>
            <div className="handover-templates-grid">
              {QUICK_TEMPLATES.map(t => (
                <button key={t} className="handover-tpl-chip" onClick={() => handleTemplate(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="handover-field-group">
            <label className="handover-label">Observation Note</label>
            <textarea
              className="mood-note-area"
              rows={4}
              placeholder="Describe patient's condition, behavior, medications given, incidents..."
              value={form.note}
              onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
            />
          </div>

          <button className="cog-save-btn" onClick={handleAddNote} disabled={!form.note.trim()}>
            ➕ Add Handover Note
          </button>
        </div>

        {/* Right: Notes Feed */}
        <div className="handover-feed-card">
          <div className="handover-feed-header">
            <h3 className="mood-card-title">📋 Handover Log</h3>
            <button className={`handover-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyAll}>
              {copied ? '✓ Copied!' : '📋 Copy for WhatsApp'}
            </button>
          </div>

          {/* Filter */}
          <div className="handover-filter-row">
            {[['all', '🗂️ All'], ['morning', '🌅 Morning'], ['afternoon', '☀️ Afternoon'], ['night', '🌙 Night']].map(([k, l]) => (
              <button key={k} className={`handover-filter-btn ${filter === k ? 'filter-active' : ''}`} onClick={() => setFilter(k)}>
                {l}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="cog-empty">No notes yet. Add your first handover note.</div>
          ) : (
            <div className="handover-notes-list">
              {filtered.map(n => {
                const meta = SHIFTS_META[n.shift]
                return (
                  <div key={n.id} className="handover-note-card" style={{ borderLeftColor: meta.color }}>
                    <div className="handover-note-header">
                      <span className="handover-note-shift" style={{ background: meta.color + '22', color: meta.color }}>
                        {meta.icon} {meta.label}
                      </span>
                      <span className="handover-note-caregiver">👤 {n.caregiver}</span>
                      <span className="handover-note-time">{n.date} · {n.time}</span>
                      <button className="handover-note-del" onClick={() => handleDelete(n.id)} title="Delete">✕</button>
                    </div>
                    <p className="handover-note-body">{n.note}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
