// ============================================================
// CgDashboard.jsx — Home Dashboard for Caregiver
// ============================================================
import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { lsGet, LS, today, lastNDays, shortDay, REMINDER_DEFAULTS } from './CgShared'
import './CgDashboard.css'

export default function CgDashboard({ patientName = 'Patient', onTab }) {
  // 1. Reminders Count
  const reminders = lsGet(LS.REMINDERS, REMINDER_DEFAULTS)
  const activeRemindersCount = reminders.filter(r => r.enabled).length

  // 2. Mood Today
  const moodLog = lsGet(LS.MOOD_LOG, [])
  const todayMood = moodLog.find(m => m.date === today())
  const moodEmojiMap = { 1: '😣', 2: '😟', 3: '😐', 4: '😊', 5: '😄' }
  const moodDisplay = todayMood ? moodEmojiMap[todayMood.score] || '😊' : '—'

  // 3. Cognitive Score
  const cogLog = lsGet(LS.COGNITIVE_LOG, [])
  const lastCog = cogLog.length > 0 ? cogLog[cogLog.length - 1] : null
  const cogDisplay = lastCog ? `${lastCog.score}/30` : '—'

  // 4. Weekly Activity Data
  const vitalsLog = lsGet(LS.VITALS_LOG, [])
  const past7 = lastNDays(7)
  const chartData = past7.map(d => {
    const entry = vitalsLog.find(v => v.date === d)
    return {
      day: shortDay(d),
      activity: entry ? (entry.activity === 2 ? 3 : entry.activity === 1 ? 2 : 1) : 1
    }
  })

  // 5. Recent Health Notes
  const healthLog = lsGet(LS.HEALTH_LOG, [])
  const recentHealth = healthLog.slice(0, 2)

  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="cgdash">
      {/* Header */}
      <header className="cgdash__header">
        <p className="cgdash__greeting">Caring for</p>
        <h1 className="cgdash__patient-name">{patientName}</h1>
        <p className="cgdash__date">📅 {currentDateStr}</p>
      </header>

      {/* Stats Cards */}
      <div className="cgdash__stats">
        <div className="cgdash__stat-card" onClick={() => onTab('reminders')} style={{ cursor: 'pointer' }}>
          <span className="cgdash__stat-icon">⏰</span>
          <span className="cgdash__stat-value">{activeRemindersCount}</span>
          <span className="cgdash__stat-label">Active Alerts</span>
        </div>

        <div className="cgdash__stat-card" onClick={() => onTab('health')} style={{ cursor: 'pointer' }}>
          <span className="cgdash__stat-icon">😊</span>
          <span className="cgdash__stat-value">{moodDisplay}</span>
          <span className="cgdash__stat-label">Today Mood</span>
        </div>

        <div className="cgdash__stat-card" onClick={() => onTab('health')} style={{ cursor: 'pointer' }}>
          <span className="cgdash__stat-icon">🧠</span>
          <span className="cgdash__stat-value">{cogDisplay}</span>
          <span className="cgdash__stat-label">Cognitive</span>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="cgdash__section">
        <h2 className="cgdash__section-title">⚡ Quick Actions</h2>
        <div className="cgdash__actions">
          <button className="cgdash__action-btn" onClick={() => onTab('health')}>
            <span className="cgdash__action-icon">😊</span>
            <span className="cgdash__action-label">Log Mood</span>
          </button>
          <button className="cgdash__action-btn" onClick={() => onTab('reminders')}>
            <span className="cgdash__action-icon">🎙️</span>
            <span className="cgdash__action-label">Voice Alert</span>
          </button>
          <button className="cgdash__action-btn" onClick={() => onTab('reports')}>
            <span className="cgdash__action-icon">📑</span>
            <span className="cgdash__action-label">Doctor Summary</span>
          </button>
        </div>
      </section>

      {/* Activity Chart */}
      <section className="cgdash__section">
        <h2 className="cgdash__section-title">📈 7-Day Activity Trend</h2>
        <div className="cgdash__chart-card">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 4]} ticks={[1, 2, 3]} tickFormatter={v => v === 3 ? 'High' : v === 2 ? 'Med' : 'Low'} tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => [value === 3 ? 'Moderate / High' : value === 2 ? 'Light' : 'Resting', 'Activity']} />
              <Bar dataKey="activity" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#b83a24' : '#e0a49a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Health Notes */}
      <section className="cgdash__section">
        <h2 className="cgdash__section-title">📝 Recent Observations</h2>
        <div className="cgdash__health-list">
          {recentHealth.length === 0 ? (
            <p className="cgdash__empty">No observations logged yet. Tap "Log Mood" or Health tab to add one.</p>
          ) : (
            recentHealth.map((item, idx) => (
              <div key={idx} className="cgdash__health-item">
                <span className="cgdash__health-dot" />
                <div className="cgdash__health-body">
                  <p className="cgdash__health-date">📅 {item.date}</p>
                  <p className="cgdash__health-note">{item.note || (item.symptoms && item.symptoms.join(', ')) || 'Daily check recorded'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
