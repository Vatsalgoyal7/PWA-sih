// ============================================================
// CgMood.jsx — Mood Tracker Module
// Weekly mood chart + 30-day heatmap + Behavioral log
// ============================================================
import React, { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { lsGet, lsSet, today, lastNDays, shortDay, LS } from './CgShared'
import './CgMood.css'

const MOOD_EMOJIS = [
  { score: 1, emoji: '😣', label: 'Very Bad',  color: '#b83a24' },
  { score: 2, emoji: '😟', label: 'Bad',        color: '#e07b53' },
  { score: 3, emoji: '😐', label: 'Okay',       color: '#f39c12' },
  { score: 4, emoji: '😊', label: 'Good',       color: '#27ae60' },
  { score: 5, emoji: '😄', label: 'Great',      color: '#16a34a' },
]

const BEHAVIOR_TAGS = [
  '😤 Agitated', '🚶 Wandering', '😴 Lethargic', '😊 Calm',
  '🍽️ Ate Well', '🍽️ Refused Food', '💊 Took Meds', '💊 Refused Meds',
  '😴 Good Sleep', '😫 Poor Sleep', '🗣️ Talkative', '🤫 Withdrawn',
]

function moodColor(s) {
  return MOOD_EMOJIS.find(m => m.score === s)?.color ?? '#ccc'
}
function moodEmoji(s) {
  return MOOD_EMOJIS.find(m => m.score === s)?.emoji ?? '·'
}

// ── Custom tooltip ─────────────────────────────────────────
function MoodTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { score, date } = payload[0].payload
  return (
    <div className="mood-tooltip">
      <div className="mood-tooltip-emoji">{moodEmoji(score)}</div>
      <div className="mood-tooltip-label">{MOOD_EMOJIS.find(m => m.score === score)?.label}</div>
      <div className="mood-tooltip-date">{date}</div>
    </div>
  )
}

export default function CgMood() {
  const moodLog = lsGet(LS.MOOD_LOG, [])
  const todayStr = today()
  const alreadyLogged = moodLog.some(e => e.date === todayStr)

  const [selected, setSelected] = useState(null)
  const [saved, setSaved] = useState(alreadyLogged)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState([])
  const [activeTab, setActiveTab] = useState('log')

  // Chart data — last 30 days
  const last30 = lastNDays(30)
  const chartData = last30.map(d => {
    const entry = moodLog.find(e => e.date === d)
    return { day: shortDay(d), date: d, score: entry?.mood ?? null }
  })

  const last7 = chartData.slice(-7)

  const handleSave = () => {
    if (!selected) return
    const entry = { date: todayStr, mood: selected, tags, note }
    const filtered = moodLog.filter(e => e.date !== todayStr)
    lsSet(LS.MOOD_LOG, [...filtered, entry])
    setSaved(true)
  }

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  // Sundowning analysis: group moods by hour (simulated from tags)
  const avgMood = moodLog.length
    ? Math.round(moodLog.reduce((s, e) => s + e.mood, 0) / moodLog.length * 10) / 10
    : null

  const todayEntry = moodLog.find(e => e.date === todayStr)

  return (
    <div className="cgdash-view">
      {/* Hero */}
      <div className="cg-hero-banner">
        <div className="cg-hero-tag"><span>😊</span><span>Emotional Wellbeing Tracker</span></div>
        <h1 className="cg-hero-title">Mood <span>Tracker</span></h1>
        <p className="cg-hero-sub">Log daily emotional state, behavioral observations, and track mood patterns over time.</p>
      </div>

      {/* Today Status Bar */}
      <div className="mood-status-bar">
        <div className="mood-status-today">
          <span className="mood-status-label">Today's Mood</span>
          <span className="mood-status-emoji">
            {todayEntry ? moodEmoji(todayEntry.mood) : '—'}
          </span>
          {todayEntry && (
            <span className="mood-status-text" style={{ color: moodColor(todayEntry.mood) }}>
              {MOOD_EMOJIS.find(m => m.score === todayEntry.mood)?.label}
            </span>
          )}
        </div>
        {avgMood && (
          <div className="mood-status-avg">
            <span className="mood-status-label">30-day Average</span>
            <span className="mood-avg-value">{avgMood}/5</span>
          </div>
        )}
        <div className="mood-status-streak">
          <span className="mood-status-label">Days Logged</span>
          <span className="mood-avg-value">{moodLog.length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="cog-tab-row">
        {[['log', '✏️ Log Mood'], ['trend', '📈 7-Day Trend'], ['heatmap', '🗓️ 30-Day Heatmap']].map(([k, l]) => (
          <button key={k} className={`cog-tab-btn ${activeTab === k ? 'active' : ''}`} onClick={() => setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {/* LOG TAB */}
      {activeTab === 'log' && (
        <div className="mood-log-layout">
          <div className="mood-card">
            <h3 className="mood-card-title">How is {lsGet(LS.PROFILE, { name: 'Patient' }).name?.split(' ')[0]} feeling today?</h3>
            <div className="mood-emoji-row">
              {MOOD_EMOJIS.map(m => (
                <button
                  key={m.score}
                  className={`mood-emoji-btn ${selected === m.score ? 'mood-selected' : ''}`}
                  style={selected === m.score ? { borderColor: m.color, background: m.color + '18' } : {}}
                  onClick={() => { setSelected(m.score); setSaved(false) }}
                >
                  <span className="mood-big-emoji">{m.emoji}</span>
                  <span className="mood-emoji-label">{m.label}</span>
                </button>
              ))}
            </div>

            <h4 className="mood-section-label">Behavioral Observations</h4>
            <div className="mood-tags-grid">
              {BEHAVIOR_TAGS.map(tag => (
                <button
                  key={tag}
                  className={`mood-tag-chip ${tags.includes(tag) ? 'tag-active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <h4 className="mood-section-label">Caregiver Note (optional)</h4>
            <textarea
              className="mood-note-area"
              placeholder="Any additional observations about today's behavior..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
            />

            <button
              className="cog-save-btn"
              onClick={handleSave}
              disabled={!selected}
            >
              {saved ? '✓ Mood Saved for Today' : '💾 Save Today\'s Mood'}
            </button>
          </div>

          {/* Recent Log */}
          <div className="mood-card">
            <h3 className="mood-card-title">Recent Mood Log</h3>
            {moodLog.length === 0 ? (
              <div className="cog-empty">No mood entries yet.</div>
            ) : (
              <div className="mood-log-list">
                {[...moodLog].reverse().slice(0, 7).map((e, i) => (
                  <div key={i} className="mood-log-item">
                    <span className="mood-log-emoji">{moodEmoji(e.mood)}</span>
                    <div className="mood-log-info">
                      <span className="mood-log-date">{e.date}</span>
                      <span className="mood-log-label" style={{ color: moodColor(e.mood) }}>
                        {MOOD_EMOJIS.find(m => m.score === e.mood)?.label}
                      </span>
                      {e.tags?.length > 0 && (
                        <span className="mood-log-tags">{e.tags.slice(0, 2).join(' · ')}</span>
                      )}
                    </div>
                    {e.note && <span className="mood-log-note-dot" title={e.note}>📝</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TREND TAB */}
      {activeTab === 'trend' && (
        <div className="mood-card">
          <h3 className="mood-card-title">7-Day Mood Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={last7} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--cg-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--cg-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cg-border)" vertical={false}/>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--cg-text-dim)' }}/>
              <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 11, fill: 'var(--cg-text-dim)' }}
                tickFormatter={v => moodEmoji(v)}/>
              <Tooltip content={<MoodTooltip/>}/>
              <Area type="monotone" dataKey="score" stroke="var(--cg-primary)" strokeWidth={2.5}
                fill="url(#moodGrad)" dot={{ r: 5, fill: 'var(--cg-primary)' }} connectNulls={false}/>
            </AreaChart>
          </ResponsiveContainer>
          <div className="mood-trend-labels">
            {MOOD_EMOJIS.map(m => (
              <span key={m.score} className="mood-trend-lbl">
                {m.emoji} {m.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* HEATMAP TAB */}
      {activeTab === 'heatmap' && (
        <div className="mood-card">
          <h3 className="mood-card-title">30-Day Mood Heatmap</h3>
          <p className="mood-card-sub">Color shows emotional state — darker = better mood</p>
          <div className="mood-heatmap-grid">
            {last30.map(d => {
              const entry = moodLog.find(e => e.date === d)
              const score = entry?.mood
              const bg = score ? moodColor(score) : 'var(--cg-border)'
              return (
                <div
                  key={d}
                  className="mood-heatmap-cell"
                  style={{ background: bg, opacity: score ? 0.5 + score * 0.1 : 1 }}
                  title={`${d}: ${score ? MOOD_EMOJIS.find(m => m.score === score)?.label : 'No data'}`}
                />
              )
            })}
          </div>
          <div className="mood-heatmap-legend">
            <span style={{ color: '#b83a24' }}>😣 Bad</span>
            <div className="mood-heatmap-gradient"/>
            <span style={{ color: '#16a34a' }}>😄 Great</span>
          </div>
        </div>
      )}
    </div>
  )
}
