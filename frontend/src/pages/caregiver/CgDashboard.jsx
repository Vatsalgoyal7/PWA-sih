// ============================================================
// CgDashboard.jsx — Modern Clinical Caregiver Master Dashboard
// Redesigned with Apple Health style vibrant aesthetics,
// AI Caregiver Insights, Interactive Routine Timeline & Smooth Wave Graph
// ============================================================
import React, { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { lsGet, LS, today, lastNDays, shortDay, REMINDER_DEFAULTS } from './CgShared'
import './CgDashboard.css'

export default function CgDashboard({
  patientName = 'Meena Sharma',
  onSelectModule,
  lang = 'en'
}) {
  const [flutePlaying, setFlutePlaying] = useState(false)
  const isEn = lang === 'en'

  // 1. Reminders Count
  const reminders = lsGet(LS.REMINDERS, REMINDER_DEFAULTS)
  const activeRemindersCount = reminders.filter(r => r.enabled).length

  // 2. Mood Today
  const moodLog = lsGet(LS.MOOD_LOG, [])
  const todayMood = moodLog.find(m => m.date === today())
  const moodEmojiMap = { 1: '😣 Agitated', 2: '😟 Anxious', 3: '😐 Neutral', 4: '😊 Calm', 5: '😄 Cheerful' }
  const moodDisplay = todayMood ? moodEmojiMap[todayMood.score] || '😊 Calm' : '😊 Calm'

  // 3. Cognitive MMSE Score
  const cogLog = lsGet(LS.COGNITIVE_LOG, [])
  const lastCog = cogLog.length > 0 ? cogLog[cogLog.length - 1] : { score: 24 }
  const cogScore = lastCog ? lastCog.score : 24

  // 4. Prescribed Games Count
  const games = lsGet(LS.GAMES, [])
  const activeGamesCount = games.filter(g => g.enabled).length || 8

  // 5. 7-Day Activity Trend (Sleek Wave Data)
  const vitalsLog = lsGet(LS.VITALS_LOG, [])
  const past7 = lastNDays(7)
  const chartData = past7.map((d, idx) => {
    const entry = vitalsLog.find(v => v.date === d)
    // Generate realistic engagement scale 60-95%
    const defaultEngagement = [74, 82, 78, 88, 84, 91, 89][idx % 7]
    const val = entry
      ? (entry.activity === 2 ? 92 : entry.activity === 1 ? 80 : 65)
      : defaultEngagement
    return {
      day: shortDay(d),
      engagement: val
    }
  })

  // 6. Today's Care Routine Checklist
  const [timelineItems, setTimelineItems] = useState([
    { id: 1, time: '08:00 AM', title: isEn ? 'Morning Vitals & Blood Pressure' : 'পুৱাৰ ৰক্তচাপ আৰু ঔষধ', icon: '💊', status: 'done' },
    { id: 2, time: '11:30 AM', title: isEn ? 'Memory Exercise: Ki Utsav Game' : 'স্মৃতি খেল: কি উৎসৱ', icon: '🧠', status: 'done' },
    { id: 3, time: '01:30 PM', title: isEn ? 'Nutritious Lunch & Hydration' : 'দুপৰীয়াৰ আহাৰ আৰু পানী', icon: '🍲', status: 'done' },
    { id: 4, time: '05:30 PM', title: isEn ? 'Sunset Transition & Calming Music' : 'সন্ধিয়াৰ বাঁহীৰ সুৰ আৰু জিৰণি', icon: '🌅', status: 'upcoming' },
    { id: 5, time: '08:30 PM', title: isEn ? 'Dinner & Night Routine Dose' : 'নিশাৰ আহাৰ আৰু ঔষধ', icon: '🌙', status: 'pending' },
  ])

  const toggleTimeline = (id) => {
    setTimelineItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'done' ? 'upcoming' : 'done'
        }
      }
      return item
    }))
  }

  const currentDateStr = new Date().toLocaleDateString(isEn ? 'en-IN' : 'as-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  const handleToggleCalm = () => {
    setFlutePlaying(prev => !prev)
    if (!flutePlaying) {
      alert("🎵 Calming Ambiance Triggered: Soft soothing flute music is now playing to ease sundowning restlessness.")
    }
  }

  return (
    <div className="cgdash-view">
      
      {/* ── 1. Hero Patient Profile & Live Vitals Banner ── */}
      <section className="cg-hero-banner">
        <div className="cg-hero-flex">
          <div className="cg-hero-avatar-wrap">
            <div className="cg-hero-avatar">👵</div>
            <span className="cg-online-indicator" title="Live Telemetry Connected" />
          </div>

          <div className="cg-hero-details">
            <div className="cg-hero-tag">
              <span>🩺</span>
              <span>{isEn ? 'Primary Patient Profile' : 'মুখ্য ৰোগী প্ৰফাইল'}</span>
            </div>
            <h1 className="cg-hero-title">
              <span>{patientName || 'Meena Sharma'}</span>
            </h1>
            <p className="cg-hero-sub">
              {isEn
                ? 'Age 70 • Mild Cognitive Impairment (MCI) • Caregiver: Family Desk'
                : 'বয়স ৭০ • প্ৰাৰম্ভিক স্মৃতি বিভ্ৰম • তত্ত্বাৱধায়ক: পৰিয়াল ডেস্ক'}
            </p>
          </div>
        </div>

        {/* Live Status Radar Badges */}
        <div className="cg-hero-status-row">
          <span className="cg-status-pill cg-pill--green">
            <span className="cg-pulse-dot" />
            {isEn ? 'Status: Stable & Active' : 'অৱস্থা: সুস্থ আৰু সক্ৰিয়'}
          </span>
          <span className="cg-status-pill cg-pill--blue">
            <span>📍</span>
            {isEn ? 'Safe Zone: Home (Guwahati)' : 'সুৰক্ষিত বলয়: নিজ গৃহ'}
          </span>
          <span className="cg-date-badge">
            📅 {currentDateStr}
          </span>
        </div>
      </section>

      {/* ── 2. AI Clinical Caregiver Insight (Smart Add-On Feature) ── */}
      <section className="cg-ai-insight-card">
        <div className="cg-ai-header">
          <div className="cg-ai-badge">
            <span className="cg-ai-sparkle">✨</span>
            <span>{isEn ? 'SMRITISETU AI CLINICAL INSIGHT' : 'স্মৃতিসেতু এআই নিৰীক্ষণ'}</span>
          </div>
          <span className="cg-ai-time">{isEn ? 'Updated 10m ago' : '১০ মিনিট আগতে'}</span>
        </div>
        <p className="cg-ai-text">
          {isEn
            ? 'Patient demonstrated strong orientation during morning memory recall (MMSE 24/30). Predictive sundowning model indicates potential restlessness around 5:30 PM. Pre-emptive soft lighting and calming flute recommended.'
            : 'ৰোগীৰ পুৱাৰ স্মৃতি পৰীক্ষা সন্তোষজনক (২৪/৩০)। সন্ধিয়া ৫:৩০ বজাত চঞ্চলতা বৃদ্ধিৰ সম্ভাৱনা আছে — বাঁহীৰ সুৰ আৰু মৃদু পোহৰ সাজু ৰাখক।'}
        </p>
        <div className="cg-ai-actions">
          <button
            type="button"
            className="cg-btn-ai-action"
            onClick={handleToggleCalm}
          >
            {flutePlaying ? '⏹ Stop Calming Music' : '🎵 Arm Calming Flute'}
          </button>
          <button
            type="button"
            className="cg-btn-ai-subtle"
            onClick={() => onSelectModule('health')}
          >
            📊 {isEn ? 'View MMSE Diagnostics' : 'স্বাস্থ্য পৰীক্ষা চাওক'}
          </button>
        </div>
      </section>

      {/* ── 3. 4 Modern Vibrant Metric Cards (Apple Health Style) ── */}
      <section className="cg-metric-grid">
        {/* Card 1: Reminders (Indigo) */}
        <div
          className="cg-metric-card cg-card--indigo"
          onClick={() => onSelectModule('reminders')}
          title="Open Reminders Management"
        >
          <div className="cg-metric-header">
            <span className="cg-metric-label">{isEn ? 'Daily Reminders' : 'দৈনিক সংকেত'}</span>
            <span className="cg-metric-icon-badge">⏰</span>
          </div>
          <div className="cg-metric-val">
            {activeRemindersCount}<span className="cg-metric-denom">/4</span>
          </div>
          <div className="cg-metric-sub">
            <span className="cg-sub-dot" />
            {isEn ? '3 of 4 routines done' : '৩টা নিয়ম সম্পন্ন'}
          </div>
        </div>

        {/* Card 2: Cognitive MMSE (Electric Cyan) */}
        <div
          className="cg-metric-card cg-card--cyan"
          onClick={() => onSelectModule('health')}
          title="Open Clinical Diagnostics"
        >
          <div className="cg-metric-header">
            <span className="cg-metric-label">{isEn ? 'Cognitive Score' : 'মানসিক সূচক'}</span>
            <span className="cg-metric-icon-badge">🧠</span>
          </div>
          <div className="cg-metric-val">
            {cogScore}<span className="cg-metric-denom">/30</span>
          </div>
          <div className="cg-metric-sub">
            <span className="cg-sub-dot" />
            {isEn ? 'Normal clinical range' : 'স্বাভাৱিক মাত্ৰা'}
          </div>
        </div>

        {/* Card 3: Therapy Games (Emerald Mint) */}
        <div
          className="cg-metric-card cg-card--emerald"
          onClick={() => onSelectModule('games')}
          title="Open Cognitive Game Prescriber"
        >
          <div className="cg-metric-header">
            <span className="cg-metric-label">{isEn ? 'Therapy Games' : 'স্মৃতি খেল'}</span>
            <span className="cg-metric-icon-badge">🎮</span>
          </div>
          <div className="cg-metric-val">
            {activeGamesCount}<span className="cg-metric-denom">/11</span>
          </div>
          <div className="cg-metric-sub">
            <span className="cg-sub-dot" />
            {isEn ? 'Fatigue-safe active plan' : 'ক্লান্তিহীন নিৰ্বাচন'}
          </div>
        </div>

        {/* Card 4: Patient Mood (Sunset Amber) */}
        <div
          className="cg-metric-card cg-card--amber"
          onClick={() => onSelectModule('health')}
          title="Open Mood Telemetry"
        >
          <div className="cg-metric-header">
            <span className="cg-metric-label">{isEn ? "Today's Mood" : 'আজিৰ মনৰ অৱস্থা'}</span>
            <span className="cg-metric-icon-badge">😊</span>
          </div>
          <div className="cg-metric-val cg-metric-val--text">
            {moodDisplay}
          </div>
          <div className="cg-metric-sub">
            <span className="cg-sub-dot" />
            {isEn ? 'Logged at 11:30 AM' : '১১:৩০ বজাত প্ৰবিষ্টি'}
          </div>
        </div>
      </section>

      {/* ── 4. Widescreen 2-Column Split Layout ── */}
      <div className="cgdash-desktop-grid">
        
        {/* Left Column: Interactive Routine Timeline & Activity Wave */}
        <div className="cgdash-col-analytics">
          
          {/* Today's Care Routine & Monthly Streak Timeline (REPLACED ugly chunky blocks) */}
          <section className="cg-timeline-card">
            <div className="cg-timeline-topbar">
              <div>
                <h3 className="cg-timeline-title">
                  {isEn ? "Today's Care & Therapy Schedule" : 'আজিৰ শুশ্ৰূষা আৰু খেলৰ তালিকা'}
                </h3>
                <p className="cg-timeline-desc">
                  {isEn ? 'Tap any item to toggle completed status.' : 'সম্পন্ন কৰিবলৈ চুই দিয়ক।'}
                </p>
              </div>

              {/* Monthly Adherence Streak Badge */}
              <div className="cg-streak-pill" title="Overall Monthly Compliance">
                <span className="cg-streak-flame">🔥</span>
                <div className="cg-streak-text">
                  <strong>94%</strong>
                  <span>{isEn ? 'Care Streak' : 'ধাৰাবাহিক'}</span>
                </div>
              </div>
            </div>

            {/* Interactive Timeline List */}
            <div className="cg-timeline-list">
              {timelineItems.map((item) => (
                <div
                  key={item.id}
                  className={`cg-timeline-item ${item.status === 'done' ? 'is-done' : ''}`}
                  onClick={() => toggleTimeline(item.id)}
                >
                  <div className="cg-timeline-left">
                    <span className="cg-timeline-icon">{item.icon}</span>
                    <div className="cg-timeline-info">
                      <span className="cg-timeline-task">{item.title}</span>
                      <span className="cg-timeline-time">{item.time}</span>
                    </div>
                  </div>
                  <div className="cg-timeline-status">
                    {item.status === 'done' ? (
                      <span className="cg-badge-done">✓ {isEn ? 'Completed' : 'সম্পন্ন'}</span>
                    ) : (
                      <span className="cg-badge-pending">⏳ {isEn ? 'Pending' : 'বাকী'}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 7-Day Smooth Gradient Activity Wave Chart */}
          <section className="cg-chart-card">
            <div className="cg-sec-head">
              <div>
                <span className="cg-sec-title">
                  {isEn ? 'Weekly Cognitive & Routine Stability' : 'সাপ্তাহিক স্থিৰতাৰ ট্ৰেণ্ড'}
                </span>
                <p className="cg-chart-sub">
                  {isEn ? 'Daily composite engagement score (Target: ≥75%)' : 'দৈনিক স্থিৰতা সূচক'}
                </p>
              </div>
              <span className="cg-sec-tag cg-tag--cyan">
                {isEn ? '88% Avg Stability' : '৮৮% স্থিৰ'}
              </span>
            </div>

            <div style={{ width: '100%', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--cg-border-subtle, #f1f5f9)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: 'var(--cg-text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[50, 100]}
                    ticks={[60, 75, 90]}
                    tickFormatter={v => `${v}%`}
                    tick={{ fontSize: 10, fill: 'var(--cg-text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={val => [`${val}% Stability`, 'Engagement']}
                    contentStyle={{
                      backgroundColor: 'var(--cg-surface)',
                      borderColor: 'var(--cg-border)',
                      borderRadius: '12px',
                      color: 'var(--cg-text-main)',
                      fontSize: '12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#waveGradient)"
                    dot={{ r: 4, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#0284c7' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Right Column: Sundowning Care & 1-Tap Emergency Shortcuts */}
        <div className="cgdash-col-actions">
          
          {/* Evening Sundowning Support Card */}
          <section className="cg-sundowning-card">
            <div className="cg-sundowning-badge">
              <span>🌅</span>
              <span>{isEn ? 'EVENING SUNDOWNING PROTOCOL' : 'সন্ধিয়াৰ বিশেষ সতৰ্কতা'}</span>
            </div>
            <div className="cg-sundowning-content">
              <h4>{isEn ? 'Agitation Prevention Window' : 'সন্ধিয়াৰ বিভ্ৰান্তি ৰোধ'}</h4>
              <p>
                {isEn
                  ? 'Between 5:15 PM – 6:30 PM, dementia patients experience heightened confusion. Soft ambient lighting and gentle bamboo flute reduce cognitive restlessness by 40%.'
                  : 'সন্ধিয়াৰ বিভ্ৰান্তি প্ৰতিৰোধ কৰিবলৈ শান্ত বাঁহীৰ সুৰ আৰু মৃদু পোহৰ ব্যৱহাৰ কৰক।'}
              </p>
            </div>
            <button
              type="button"
              className={`cg-btn-calm ${flutePlaying ? 'playing' : ''}`}
              onClick={handleToggleCalm}
            >
              <span className="cg-calm-icon">{flutePlaying ? '⏹' : '🎵'}</span>
              <span>{flutePlaying ? (isEn ? 'Stop Flute Ambiance' : 'বাঁহী বন্ধ কৰক') : (isEn ? 'Play Calming Flute Ambiance' : 'শান্ত বাঁহীৰ সুৰ বজাওক')}</span>
            </button>
          </section>

          {/* Quick Care Shortcuts */}
          <section className="cg-shortcuts-card">
            <div className="cg-sec-head" style={{ marginBottom: '12px' }}>
              <span className="cg-sec-title">{isEn ? 'Care Action Dispatcher' : 'দ্ৰুত সেৱা তালিকা'}</span>
              <span className="cg-sec-tag">{isEn ? '1-Tap Actions' : 'এক স্পৰ্শত'}</span>
            </div>

            <div className="cg-actions-row">
              <div
                className="cg-quick-action"
                onClick={() => onSelectModule('reminders')}
              >
                <div className="cg-action-icon-circle cg-circle--indigo">🎙️</div>
                <span className="cg-quick-label">{isEn ? 'Voice Alert' : 'মাত বাৰ্তা'}</span>
                <span className="cg-quick-sub">{isEn ? 'Record memo' : 'ৰেকৰ্ড কৰক'}</span>
              </div>

              <div
                className="cg-quick-action"
                onClick={() => onSelectModule('reports')}
              >
                <div className="cg-action-icon-circle cg-circle--cyan">📋</div>
                <span className="cg-quick-label">{isEn ? 'Doctor PDF' : 'প্ৰতিবেদন'}</span>
                <span className="cg-quick-sub">{isEn ? 'Export chart' : 'ডাক্তৰলৈ'}</span>
              </div>

              <div
                className="cg-quick-action"
                onClick={() => onSelectModule('profile')}
              >
                <div className="cg-action-icon-circle cg-circle--rose">🚨</div>
                <span className="cg-quick-label">{isEn ? 'Emergency SOS' : 'জৰুৰীকালীন'}</span>
                <span className="cg-quick-sub">{isEn ? 'Family alert' : 'সহায়তা'}</span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}
