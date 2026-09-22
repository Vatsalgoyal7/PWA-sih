// ============================================================
// CgCognitive.jsx — MMSE Cognitive Assessment Module
// Animated SVG Speedometer + Domain Breakdown + 30-day Trend
// ============================================================
import React, { useState, useEffect, useRef } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import { lsGet, lsSet, today, lastNDays, shortDay, LS } from './CgShared'
import './CgCognitive.css'

// ── MMSE Domains (total = 30) ──────────────────────────────
const DOMAINS = [
  { id: 'orientation',  label: 'Orientation',           max: 10, icon: '🗺️', desc: 'Time & place awareness' },
  { id: 'memory',       label: 'Short-term Memory',     max: 3,  icon: '🧩', desc: 'Recall 3 words' },
  { id: 'attention',    label: 'Attention & Calculation',max: 5,  icon: '🔢', desc: 'Serial 7s or spelling' },
  { id: 'recall',       label: 'Delayed Recall',        max: 3,  icon: '💬', desc: 'Recall earlier words' },
  { id: 'language',     label: 'Language',              max: 8,  icon: '📝', desc: 'Naming, repeating, commands' },
  { id: 'visuospatial', label: 'Visuospatial',          max: 1,  icon: '🔷', desc: 'Copying a design' },
]

// ── Helpers ────────────────────────────────────────────────
function scoreColor(s) {
  if (s >= 24) return '#27ae60'
  if (s >= 18) return '#f39c12'
  return '#b83a24'
}
function scoreLabel(s) {
  if (s >= 24) return 'Normal'
  if (s >= 18) return 'Mild Impairment'
  return 'Significant Impairment'
}
function scoreDesc(s) {
  if (s >= 24) return 'Cognitive function is within normal range for age. Continue current activities and monitoring.'
  if (s >= 18) return 'Some cognitive decline detected. Consider adjusting game difficulty and increasing mental stimulation.'
  return 'Significant cognitive impairment detected. Consult doctor immediately and increase supervision.'
}

// ── SVG Speedometer ────────────────────────────────────────
function MMSEGauge({ score, maxScore = 30, animated = true }) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)
  const animRef = useRef(null)

  useEffect(() => {
    if (!animated) { setDisplayScore(score); return }
    let current = 0
    const step = score / 40
    animRef.current = setInterval(() => {
      current += step
      if (current >= score) { current = score; clearInterval(animRef.current) }
      setDisplayScore(Math.round(current))
    }, 30)
    return () => clearInterval(animRef.current)
  }, [score, animated])

  // SVG arc math
  const cx = 160, cy = 135, r = 95
  const startAngle = 180
  const totalAngle = 180
  const pct = Math.min(Math.max(displayScore / maxScore, 0), 1)
  const needleAngle = startAngle + pct * totalAngle

  function polarToXY(angle, radius = r) {
    const rad = (angle * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  function arc(start, end, radius = r) {
    const s = polarToXY(start, radius)
    const e = polarToXY(end, radius)
    const large = end - start > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`
  }

  const needle = polarToXY(needleAngle, r - 12)
  const needleBase1 = polarToXY(needleAngle - 90, 8)
  const needleBase2 = polarToXY(needleAngle + 90, 8)
  const color = scoreColor(displayScore)

  // Zone boundaries: red 0-17, yellow 18-23, green 24-30
  const redEnd    = 180 + (17/30) * 180
  const yellowEnd = 180 + (23/30) * 180

  return (
    <div className="mmse-gauge-wrap">
      <svg viewBox="0 0 320 200" className="mmse-gauge-svg">
        {/* Track background */}
        <path d={arc(180, 360, r + 10)} fill="none" stroke="var(--cg-border)" strokeWidth="22" strokeLinecap="round"/>

        {/* Colored zones */}
        <path d={arc(180, redEnd, r + 10)} fill="none" stroke="#fecaca" strokeWidth="22"/>
        <path d={arc(redEnd, yellowEnd, r + 10)} fill="none" stroke="#fef08a" strokeWidth="22"/>
        <path d={arc(yellowEnd, 360, r + 10)} fill="none" stroke="#bbf7d0" strokeWidth="22"/>

        {/* Zone descriptive text */}
        <text x="32" y="160" fontSize="10" fill="#b83a24" textAnchor="start" fontWeight="700">Impaired (&lt;18)</text>
        <text x="160" y="32" fontSize="10" fill="#d97706" textAnchor="middle" fontWeight="700">Mild (18-23)</text>
        <text x="288" y="160" fontSize="10" fill="#16a34a" textAnchor="end" fontWeight="700">Normal (≥24)</text>

        {/* Dynamic colored progress arc */}
        <path
          d={arc(180, 180 + pct * 180, r + 10)}
          fill="none"
          stroke={color}
          strokeWidth="22"
          strokeLinecap="round"
          className="mmse-progress-arc"
        />

        {/* Tick marks & Numbers */}
        {[0, 6, 12, 18, 24, 30].map(v => {
          const ang = 180 + (v / 30) * 180
          const outer = polarToXY(ang, r + 24)
          const inner = polarToXY(ang, r - 3)
          const lbl = polarToXY(ang, r + 35)
          return (
            <g key={v}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="var(--cg-text-dim)" strokeWidth="1.5"/>
              <text x={lbl.x} y={lbl.y} fontSize="10" fill="var(--cg-text-dim)" textAnchor="middle" dominantBaseline="middle" fontWeight="600">{v}</text>
            </g>
          )
        })}

        {/* Needle pointing outward from hub */}
        <polygon
          points={`${needle.x},${needle.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
          fill={color}
          className="mmse-needle"
        />
        <circle cx={cx} cy={cy} r={9} fill={color}/>
        <circle cx={cx} cy={cy} r={4} fill="#ffffff"/>

        {/* Center Score readout situated clearly below hub */}
        <text x={cx} y={cy + 38} textAnchor="middle" fontSize="30" fontWeight="900" fill={color} className="mmse-score-text">
          {displayScore}
        </text>
        <text x={cx} y={cy + 54} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--cg-text-dim)">
          out of 30 points
        </text>
      </svg>

      <div className="mmse-label" style={{ color }}>
        {scoreLabel(displayScore)}
      </div>
    </div>
  )
}

// ── Domain Bar ─────────────────────────────────────────────
function DomainBar({ domain, value, onChange }) {
  const pct = (value / domain.max) * 100
  const color = pct >= 80 ? '#27ae60' : pct >= 50 ? '#f39c12' : '#b83a24'
  return (
    <div className="cog-domain-row">
      <div className="cog-domain-header">
        <span className="cog-domain-icon">{domain.icon}</span>
        <div className="cog-domain-info">
          <span className="cog-domain-name">{domain.label}</span>
          <span className="cog-domain-desc">{domain.desc}</span>
        </div>
        <div className="cog-domain-score">
          <input
            type="number"
            min={0}
            max={domain.max}
            value={value}
            onChange={e => onChange(Math.min(domain.max, Math.max(0, +e.target.value)))}
            className="cog-domain-input"
          />
          <span className="cog-domain-max">/{domain.max}</span>
        </div>
      </div>
      <div className="cog-domain-bar-track">
        <div className="cog-domain-bar-fill" style={{ width: `${pct}%`, background: color }}/>
      </div>
    </div>
  )
}

// ── Trend Chart ────────────────────────────────────────────
function CognitiveTrend({ log }) {
  const days = lastNDays(30)
  const data = days.map(d => {
    const entry = log.find(e => e.date === d)
    return { day: shortDay(d), date: d, score: entry?.total ?? null }
  })
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--cg-border)" vertical={false}/>
        <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--cg-text-dim)' }} interval={4}/>
        <YAxis domain={[0, 30]} tick={{ fontSize: 10, fill: 'var(--cg-text-dim)' }}/>
        <Tooltip
          contentStyle={{ background: 'var(--cg-surface)', border: '1px solid var(--cg-border)', borderRadius: 8 }}
          formatter={(v) => [v != null ? `${v}/30` : 'No data', 'MMSE Score']}
        />
        <ReferenceLine y={24} stroke="#27ae60" strokeDasharray="4 2" label={{ value: 'Normal ≥24', fontSize: 9, fill: '#27ae60' }}/>
        <ReferenceLine y={18} stroke="#f39c12" strokeDasharray="4 2" label={{ value: 'Mild ≥18', fontSize: 9, fill: '#f39c12' }}/>
        <Line
          type="monotone"
          dataKey="score"
          stroke="var(--cg-primary)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--cg-primary)' }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ── Default realistic clinical baseline (Total = 24/30 - Early stage MCI) ──
const REALISTIC_DEFAULT_DOMAINS = {
  orientation: 8,  // 8/10 (occasional date/time confusion)
  memory: 3,       // 3/3 (immediate registration intact)
  attention: 4,    // 4/5 (slight serial calculation slip)
  recall: 2,       // 2/3 (short-term recall delays)
  language: 6,     // 6/8 (word-finding hesitation)
  visuospatial: 1, // 1/1 (figure copying intact)
}

// ── Main Component ─────────────────────────────────────────
export default function CgCognitive() {
  const log = lsGet(LS.COGNITIVE_LOG, [])
  const todayEntry = log.find(e => e.date === today())

  const [domains, setDomains] = useState(() => todayEntry?.domains ?? REALISTIC_DEFAULT_DOMAINS)
  const [saved, setSaved] = useState(!!todayEntry)
  const [activeTab, setActiveTab] = useState('score')

  const total = DOMAINS.reduce((sum, d) => sum + (domains[d.id] ?? 0), 0)

  const handleSave = () => {
    const entry = { date: today(), total, domains }
    const filtered = log.filter(e => e.date !== today())
    lsSet(LS.COGNITIVE_LOG, [...filtered, entry])
    setSaved(true)
  }

  return (
    <div className="cgdash-view">
      {/* Hero Banner */}
      <div className="cg-hero-banner">
        <div className="cg-hero-tag">
          <span>🧠</span>
          <span>Mini-Mental State Examination (MMSE)</span>
        </div>
        <h1 className="cg-hero-title">Cognitive <span>Assessment</span></h1>
        <p className="cg-hero-sub">
          MMSE is a 30-point questionnaire used to measure cognitive impairment.
          Score ≥24 = Normal · 18–23 = Mild · &lt;18 = Significant Impairment.
        </p>
      </div>

      {/* Tab Row */}
      <div className="cog-tab-row">
        {[['score', '🎯 Today\'s Score'], ['trend', '📈 30-Day Trend'], ['log', '📋 Session Log']].map(([k, l]) => (
          <button key={k} className={`cog-tab-btn ${activeTab === k ? 'active' : ''}`} onClick={() => setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {/* TODAY'S SCORE TAB */}
      {activeTab === 'score' && (
        <div className="cog-score-layout">
          {/* Gauge */}
          <div className="cog-gauge-card">
            <MMSEGauge score={total} animated={true}/>
            <div className="cog-gauge-desc" style={{ borderLeftColor: scoreColor(total) }}>
              {scoreDesc(total)}
            </div>
            {saved && (
              <div className="cog-saved-badge">✓ Score saved for today</div>
            )}
          </div>

          {/* Domain Breakdown */}
          <div className="cog-domains-card">
            <div className="cog-domains-header">
              <h3>Domain Breakdown</h3>
              <span className="cog-total-pill" style={{ background: scoreColor(total) }}>
                Total: {total}/30
              </span>
            </div>
            <div className="cog-domains-list">
              {DOMAINS.map(d => (
                <DomainBar
                  key={d.id}
                  domain={d}
                  value={domains[d.id] ?? 0}
                  onChange={v => setDomains(prev => ({ ...prev, [d.id]: v }))}
                />
              ))}
            </div>
            <button className="cog-save-btn" onClick={handleSave}>
              {saved ? '✓ Update Score' : '💾 Save Today\'s Score'}
            </button>
          </div>
        </div>
      )}

      {/* TREND TAB */}
      {activeTab === 'trend' && (
        <div className="cog-card">
          <div className="cog-card-header">
            <h3>30-Day Cognitive Trend</h3>
            <span className="cog-card-sub">MMSE score over last 30 days</span>
          </div>
          {log.length === 0 ? (
            <div className="cog-empty">No assessment data yet. Log today's score first.</div>
          ) : (
            <CognitiveTrend log={log}/>
          )}
          <div className="cog-trend-legend">
            <span className="cog-legend-dot" style={{ background: '#27ae60'}}/> Normal (≥24)
            <span className="cog-legend-dot" style={{ background: '#f39c12'}}/> Mild (18–23)
            <span className="cog-legend-dot" style={{ background: '#b83a24'}}/> Impaired (&lt;18)
          </div>
        </div>
      )}

      {/* SESSION LOG TAB */}
      {activeTab === 'log' && (
        <div className="cog-card">
          <div className="cog-card-header">
            <h3>Assessment History</h3>
            <span className="cog-card-sub">{log.length} sessions recorded</span>
          </div>
          {log.length === 0 ? (
            <div className="cog-empty">No sessions logged yet.</div>
          ) : (
            <div className="cog-log-table">
              <div className="cog-log-thead">
                <span>Date</span><span>Score</span><span>Status</span><span>Best Domain</span>
              </div>
              {[...log].reverse().map((entry, i) => {
                const best = DOMAINS.reduce((b, d) =>
                  (entry.domains[d.id]/d.max) > (entry.domains[b.id]/b.max) ? d : b, DOMAINS[0])
                return (
                  <div key={i} className="cog-log-row">
                    <span>{entry.date}</span>
                    <span style={{ color: scoreColor(entry.total), fontWeight: 700 }}>{entry.total}/30</span>
                    <span className="cog-status-chip" style={{ background: scoreColor(entry.total)+'22', color: scoreColor(entry.total) }}>
                      {scoreLabel(entry.total)}
                    </span>
                    <span>{best.icon} {best.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
