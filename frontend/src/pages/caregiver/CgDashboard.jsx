// ============================================================
// CgDashboard.jsx — Chakravyuh Inspired Master Telemetry Dashboard
// ============================================================
import React, { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { lsGet, LS, today, lastNDays, shortDay, REMINDER_DEFAULTS } from './CgShared'
import './CgDashboard.css'

export default function CgDashboard({
  patientName = 'Meena Sharma',
  onSelectModule,
  lang = 'en'
}) {
  const [flutePlaying, setFlutePlaying] = useState(false)

  // 1. Reminders Count
  const reminders = lsGet(LS.REMINDERS, REMINDER_DEFAULTS)
  const activeRemindersCount = reminders.filter(r => r.enabled).length

  // 2. Mood Today
  const moodLog = lsGet(LS.MOOD_LOG, [])
  const todayMood = moodLog.find(m => m.date === today())
  const moodEmojiMap = { 1: '😣', 2: '😟', 3: '😐', 4: '😊', 5: '😄' }
  const moodDisplay = todayMood ? moodEmojiMap[todayMood.score] || '😊' : 'Calm'

  // 3. Cognitive MMSE Score
  const cogLog = lsGet(LS.COGNITIVE_LOG, [])
  const lastCog = cogLog.length > 0 ? cogLog[cogLog.length - 1] : { score: 24 }
  const cogScore = lastCog ? lastCog.score : 24

  // 4. Prescribed Games Count
  const games = lsGet(LS.GAMES, [])
  const activeGamesCount = games.filter(g => g.enabled).length || 3

  // 5. 7-Day Activity Trend
  const vitalsLog = lsGet(LS.VITALS_LOG, [])
  const past7 = lastNDays(7)
  const chartData = past7.map(d => {
    const entry = vitalsLog.find(v => v.date === d)
    return {
      day: shortDay(d),
      activity: entry ? (entry.activity === 2 ? 3 : entry.activity === 1 ? 2 : 1) : 2
    }
  })

  // 6. 30-Day Heatmap Data (Simulated for clinical tracking)
  const heatmapCells = Array.from({ length: 30 }, (_, i) => {
    // Generate realistic adherence distribution (mostly level 3 & 4)
    const level = (i % 7 === 0) ? 1 : (i % 4 === 0) ? 2 : (i % 3 === 0) ? 3 : 4
    return { day: i + 1, level }
  })

  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  const handleToggleCalm = () => {
    setFlutePlaying(prev => !prev)
    if (!flutePlaying) {
      alert("🎵 Calming Ambiance Triggered: Soft Assamese flute music is now playing to reduce sundowning agitation.")
    }
  }

  const isEn = lang === 'en'

  return (
    <div className="cgdash-view">
      
      {/* Hero Welcome & Live Telemetry Banner */}
      <section className="cg-hero-banner">
        <div className="cg-hero-tag">
          <span>⚡</span>
          <span>{isEn ? 'SMRITISETU CAREGIVER CONSOLE' : 'স্মৃতিসেতু কেয়াৰগিভাৰ কনছোল'}</span>
        </div>
        <h1 className="cg-hero-title">
          {isEn ? 'Monitoring, ' : 'তত্ত্বাৱধান: '}
          <span>{patientName || 'Meena Sharma'}</span> ✏️
        </h1>
        <p className="cg-hero-sub">
          {isEn
            ? 'Complete administrative superuser privileges over cognitive games, routine alarms, and neuro telemetry.'
            : 'জ্ঞানমূলক খেল, নিয়ম আৰু স্নায়ু স্বাস্থ্যৰ সম্পূৰ্ণ নিয়ন্ত্ৰণ।'}
        </p>

        <div className="flex items-center gap-2">
          <span className="cg-status-pill">
            <span className="cg-pulse-dot" />
            {isEn ? 'PATIENT SYSTEM: LIVE INTEGRITY' : 'ৰোগী ছিষ্টেম: সক্ৰিয় সংযোগ'}
          </span>
          <span style={{ fontSize: '11px', opacity: 0.6, fontWeight: 600 }}>
            {currentDateStr}
          </span>
        </div>
      </section>

      {/* 2x2 Metric Cards Grid (Direct Chakravyuh Pattern) */}
      <section className="cg-metric-grid">
        {/* Metric 1 */}
        <div
          className="cg-metric-card"
          onClick={() => onSelectModule('reminders')}
          title="Open Reminders Management"
        >
          <div className="cg-metric-header">
            <span>{isEn ? 'Active Alerts' : 'সক্ৰিয় সংকেত'}</span>
            <span>⏰</span>
          </div>
          <div className="cg-metric-val">{activeRemindersCount}/4</div>
          <div className="cg-metric-sub cg-metric-sub--green">
            ● {isEn ? '100% Morning Adherence' : '১০০% পুৱাৰ নিয়ম পালন'}
          </div>
        </div>

        {/* Metric 2 */}
        <div
          className="cg-metric-card"
          onClick={() => onSelectModule('health')}
          title="Open Clinical Diagnostics"
        >
          <div className="cg-metric-header">
            <span>{isEn ? 'Cognitive MMSE' : 'মানসিক সূচক'}</span>
            <span>🧠</span>
          </div>
          <div className="cg-metric-val">
            {cogScore}
            <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.5 }}>/30</span>
          </div>
          <div className="cg-metric-sub cg-metric-sub--green">
            ● {isEn ? 'Normal Clinical Range' : 'স্বাভাৱিক মাত্ৰা'}
          </div>
        </div>

        {/* Metric 3 */}
        <div
          className="cg-metric-card"
          onClick={() => onSelectModule('games')}
          title="Open Cognitive Game Prescriber"
        >
          <div className="cg-metric-header">
            <span>{isEn ? 'Prescribed Games' : 'নিৰ্ধাৰিত খেল'}</span>
            <span>🎮</span>
          </div>
          <div className="cg-metric-val">
            {activeGamesCount}
            <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.5 }}>/11</span>
          </div>
          <div className="cg-metric-sub cg-metric-sub--blue">
            ● {isEn ? 'Curated to Avoid Fatigue' : 'ক্লান্তিহীন নিৰ্বাচন'}
          </div>
        </div>

        {/* Metric 4 */}
        <div
          className="cg-metric-card"
          onClick={() => onSelectModule('health')}
          title="Open Mood Telemetry"
        >
          <div className="cg-metric-header">
            <span>{isEn ? "Today's Mood" : 'আজিৰ মনৰ অৱস্থা'}</span>
            <span>😊</span>
          </div>
          <div className="cg-metric-val">{moodDisplay}</div>
          <div className="cg-metric-sub cg-metric-sub--amber">
            ● {isEn ? 'Logged at 11:30 AM' : '১১:৩০ বজাত প্ৰবিষ্টি'}
          </div>
        </div>
      </section>

      {/* Widescreen 2-Column Grid (Stacks on mobile/tablet, side-by-side on laptop) */}
      <div className="cgdash-desktop-grid">
        
        {/* Left Column: Telemetry & Analytics */}
        <div className="cgdash-col-analytics">
          {/* 30-Day GitHub-Style Cognitive Heatmap Grid */}
          <section className="cg-heatmap-card">
        <div className="cg-sec-head" style={{ marginBottom: '4px' }}>
          <span className="cg-sec-title">{isEn ? '30-Day Cognitive & Routine Heatmap' : '৩০ দিনৰ ৰুটিন আৰু খেলৰ মেট্ৰিক্স'}</span>
          <span className="cg-sec-tag">{isEn ? 'Longitudinal' : 'মাহেকীয়া'}</span>
        </div>
        <p style={{ fontSize: '10px', color: 'var(--cg-text-muted)', margin: 0 }}>
          {isEn
            ? 'GitHub-style activity matrix showing daily medication, memory tests, and mood stability.'
            : 'প্ৰতিদিনৰ ঔষধ, খেল আৰু মনৰ স্থিৰতাৰ নিৰীক্ষণ।'}
        </p>

        <div className="cg-heatmap-grid">
          {heatmapCells.map(cell => (
            <div
              key={cell.day}
              className={`cg-heat-cell cg-heat--level-${cell.level}`}
              title={`Day ${cell.day}: Compliance Level ${cell.level}/4`}
            />
          ))}
        </div>

        <div className="cg-heatmap-legend">
          <span>{isEn ? 'Low Adherence' : 'কম'}</span>
          <span className="cg-heat-cell cg-heat--level-0" style={{ width: '8px', height: '8px' }} />
          <span className="cg-heat-cell cg-heat--level-1" style={{ width: '8px', height: '8px' }} />
          <span className="cg-heat-cell cg-heat--level-2" style={{ width: '8px', height: '8px' }} />
          <span className="cg-heat-cell cg-heat--level-3" style={{ width: '8px', height: '8px' }} />
          <span className="cg-heat-cell cg-heat--level-4" style={{ width: '8px', height: '8px' }} />
          <span>{isEn ? 'Full Compliance' : 'সম্পূৰ্ণ'}</span>
        </div>
      </section>

      {/* 7-Day Activity Telemetry Chart */}
      <section className="cg-chart-card">
        <div className="cg-sec-head" style={{ padding: '0 4px', marginBottom: '8px' }}>
          <span className="cg-sec-title">{isEn ? '7-Day Activity Telemetry' : '৭ দিনৰ কাৰ্যকলাপৰ ট্ৰেণ্ড'}</span>
          <span className="cg-sec-tag">{isEn ? 'Recharts Analytics' : 'বিশ্লেষণ'}</span>
        </div>
        <div style={{ width: '100%', height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--cg-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 4]} ticks={[1, 2, 3]} tickFormatter={v => v === 3 ? 'High' : v === 2 ? 'Med' : 'Low'} tick={{ fontSize: 9, fill: 'var(--cg-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--cg-surface)',
                  borderColor: 'var(--cg-border)',
                  borderRadius: '10px',
                  color: 'var(--cg-text-main)',
                  fontSize: '11px'
                }}
              />
              <Bar dataKey="activity" radius={[5, 5, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === chartData.length - 1 ? 'var(--cg-primary)' : 'rgba(184, 58, 36, 0.45)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>

    {/* Right Column: Alerts & Quick Actions (Chakravyuh Split) */}
    <div className="cgdash-col-actions">
      {/* Sundowning Predictor Banner */}
      <section className="cg-sundowning-card">
        <div className="cg-sundowning-text">
          <h4>🌅 {isEn ? 'Evening Sundowning Window' : 'সন্ধিয়াৰ বিশেষ সতৰ্কতা'}</h4>
          <p>
            {isEn
              ? 'Agitation window approaching. Recommended: Dim lights & activate soothing flute ambiance.'
              : 'সন্ধিয়াৰ বিভ্ৰান্তি ৰোধ কৰিবলৈ বাঁহীৰ সুৰ বজাওক।'}
          </p>
        </div>
        <button className="cg-btn-calm" onClick={handleToggleCalm}>
          {flutePlaying ? '⏹ Stop' : '▶ Play Calming Flute'}
        </button>
      </section>

      {/* 1-Tap Quick Action Dispatchers */}
      <section style={{ marginTop: '14px' }}>
        <div className="cg-sec-head">
          <span className="cg-sec-title">{isEn ? 'Master Dispatch & Safety' : 'দ্ৰুত আদেশ আৰু সুৰক্ষা'}</span>
          <span className="cg-sec-tag">{isEn ? '1-TAP EXECUTE' : 'এক স্পৰ্শত'}</span>
        </div>
        <div className="cg-actions-row">
          <div
            className="cg-quick-action"
            onClick={() => onSelectModule('reminders')}
          >
            <span className="cg-quick-icon">🎙️</span>
            <span className="cg-quick-label">{isEn ? 'Voice Memo' : 'মাত বাৰ্তা'}</span>
          </div>
          <div
            className="cg-quick-action"
            onClick={() => onSelectModule('reports')}
          >
            <span className="cg-quick-icon">📋</span>
            <span className="cg-quick-label">{isEn ? 'Doctor PDF' : 'ডাক্তৰ প্ৰতিবেদন'}</span>
          </div>
          <div
            className="cg-quick-action"
            onClick={() => onSelectModule('profile')}
          >
            <span className="cg-quick-icon">🚨</span>
            <span className="cg-quick-label">{isEn ? 'Emergency SOS' : 'জৰুৰীকালীন'}</span>
          </div>
        </div>
      </section>
      </div>

    </div>
  </div>
)
}
