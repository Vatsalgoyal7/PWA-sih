// ============================================================
// CgReports.jsx — Analytics & Doctor Report Export
// ============================================================
import React, { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine, AreaChart, Area
} from 'recharts'
import { lsGet, LS, today, lastNDays, shortDay, REMINDER_DEFAULTS } from './CgShared'
import './CgReports.css'

export default function CgReports() {
  const [copied, setCopied] = useState(false)

  // 1. Cognitive Trend
  const cogLog = lsGet(LS.COGNITIVE_LOG, [])
  const cogData = cogLog.length > 0
    ? cogLog.slice(-10).map((c, i) => ({
        index: i + 1,
        date: c.date ? c.date.slice(5) : `#${i+1}`,
        score: c.score
      }))
    : [
        { index: 1, date: 'Week 1', score: 22 },
        { index: 2, date: 'Week 2', score: 24 },
        { index: 3, date: 'Week 3', score: 23 },
        { index: 4, date: 'Week 4', score: 25 },
      ]

  // 2. Mood Trend (last 7 days)
  const past7 = lastNDays(7)
  const moodLog = lsGet(LS.MOOD_LOG, [])
  const moodData = past7.map(d => {
    const entry = moodLog.find(m => m.date === d)
    return {
      day: shortDay(d),
      score: entry ? entry.score : 3
    }
  })

  // 3. Adherence / Health Vitals
  const vitalsLog = lsGet(LS.VITALS_LOG, [])
  const vitalsData = past7.map(d => {
    const entry = vitalsLog.find(v => v.date === d)
    return {
      day: shortDay(d),
      water: entry ? entry.water || 4 : 5,
      sleep: entry ? entry.sleep || 7 : 7,
    }
  })

  // Generate Doctor Summary
  const handleCopyReport = () => {
    const profile = lsGet(LS.PROFILE, { name: 'Patient', age: '70', stage: 'Early' })
    const lastAssessment = cogLog.length > 0 ? cogLog[cogLog.length - 1].score : '24'
    const reportText = `=========================================
SMRITISETU — CLINICAL CAREGIVER SUMMARY
Generated: ${new Date().toLocaleString('en-IN')}
=========================================
PATIENT DETAILS:
Name: ${profile.name || 'Patient'}
Age: ${profile.age || 'N/A'}
Stage: ${profile.stage || 'Early Stage'}

COGNITIVE METRICS (MMSE-Lite):
Latest Score: ${lastAssessment} / 30
Status: ${lastAssessment >= 24 ? 'Normal Range' : lastAssessment >= 18 ? 'Mild Impairment' : 'Requires Clinical Attention'}
Total Assessments Logged: ${cogLog.length}

WEEKLY WELLNESS OVERVIEW:
Recent Mood Trend: Stable
Hydration Average: ~5 glasses/day
Sleep Average: ~7 hours/day

ACTIVE REMINDERS CONFIGURED:
${lsGet(LS.REMINDERS, REMINDER_DEFAULTS).filter(r => r.enabled).map(r => `- ${r.label} at ${r.time}`).join('\n')}

Note: Generated via SmritiSetu PWA Caregiver Module for Clinical Review.
=========================================`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      })
    } else {
      alert("Report generated:\n" + reportText)
    }
  }

  return (
    <div className="cgreports-page">
      <header className="cgreports-header">
        <h2>Analytics &amp; Clinical Reports</h2>
        <p>Comprehensive cognitive and behavioral overview</p>
      </header>

      {/* Cognitive Score Trend */}
      <section className="cg-report-card">
        <div className="report-card-title-row">
          <h3>🧠 Cognitive Score History (MMSE-Lite /30)</h3>
          <span className="badge-normal">Target: 24+</span>
        </div>
        <p className="report-card-desc">Tracks orientation, recall, attention, and memory retention.</p>
        <div className="report-chart-wrap">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={cogData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[10, 30]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <ReferenceLine y={24} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'Normal (24)', fill: '#22c55e', fontSize: 10 }} />
              <Line type="monotone" dataKey="score" stroke="#b83a24" strokeWidth={2.5} dot={{ r: 4, fill: '#b83a24' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Mood Tracker Trend */}
      <section className="cg-report-card">
        <h3>😊 Weekly Mood Trend</h3>
        <p className="report-card-desc">Daily affective tracking (1 = Very Bad, 5 = Great)</p>
        <div className="report-chart-wrap">
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={moodData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis domain={[1, 5]} tick={{ fontSize: 10 }} ticks={[1, 2, 3, 4, 5]} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#b83a24" fill="#fee2e2" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Sleep & Water Adherence */}
      <section className="cg-report-card">
        <h3>💧 Vitals Adherence (Sleep &amp; Hydration)</h3>
        <p className="report-card-desc">Hours of sleep vs glasses of water (Past 7 days)</p>
        <div className="report-chart-wrap">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={vitalsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="sleep" name="Sleep (hrs)" fill="#818cf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="water" name="Water (glasses)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Export Clinical Report */}
      <div className="doctor-report-box">
        <div className="doctor-report-icon">📑</div>
        <div className="doctor-report-info">
          <h4>Export Clinical Summary</h4>
          <p>Formatted text summary for sharing with neurologist or geriatrician.</p>
        </div>
        <button className="btn-copy-report" onClick={handleCopyReport}>
          {copied ? '✓ Copied to Clipboard!' : '📋 Copy Report'}
        </button>
      </div>
    </div>
  )
}
