// ============================================================
// CgHealth.jsx — SmritiSetu Caregiver Health Dashboard
// Tabs: Mood | Cognitive | Vitals | Log
// ============================================================

import React, { useState, useEffect, useRef } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Dot
} from 'recharts'
import { lsGet, lsSet, today, lastNDays, shortDay, LS } from './CgShared'
import './CgHealth.css'

// ── Constants ────────────────────────────────────────────────
const TABS = ['😊 Mood', '🧠 Cognitive', '💧 Vitals', '📋 Log']

const MOOD_EMOJIS = [
  { score: 1, emoji: '😣', label: 'Very Bad' },
  { score: 2, emoji: '😟', label: 'Bad' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '😊', label: 'Good' },
  { score: 5, emoji: '😄', label: 'Great' },
]

const RECALL_WORDS = ['Apple', 'Table', 'Chair']

const ATTENTION_OPTIONS = [89, 91, 93, 95]
const CORRECT_ATTENTION = 93

const SYMPTOM_OPTIONS = [
  'Confused', 'Agitated', 'Good day', 'Wandering', 'Refused meds', 'Calm'
]

const ACTIVITY_OPTIONS = [
  { label: 'None', value: 0, icon: '🛋️' },
  { label: 'Light', value: 1, icon: '🚶' },
  { label: 'Moderate', value: 2, icon: '🏃' },
]

// ── Helpers ──────────────────────────────────────────────────
function formatShortDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  } catch { return dateStr }
}

function scoreColor(score) {
  if (score >= 24) return '#27ae60'
  if (score >= 18) return '#f39c12'
  return '#b83a24'
}

function scoreLabel(score) {
  if (score >= 24) return 'Normal'
  if (score >= 18) return 'Mild Impairment'
  return 'Significant Impairment'
}

// ── Custom Dot for Mood LineChart ────────────────────────────
function MoodDot(props) {
  const { cx, cy, payload } = props
  if (!payload || payload.score == null) return null
  const em = MOOD_EMOJIS.find(m => m.score === payload.score)
  return (
    <text x={cx} y={cy - 6} textAnchor="middle" fontSize={16}>
      {em ? em.emoji : '·'}
    </text>
  )
}

// ── Glass Icon Component ─────────────────────────────────────
function GlassIcons({ count, onChange }) {
  return (
    <div className="cgh-glasses">
      {Array.from({ length: 8 }, (_, i) => (
        <button
          key={i}
          className={`cgh-glass-btn ${i < count ? 'filled' : ''}`}
          onClick={() => onChange(i + 1 === count ? i : i + 1)}
          aria-label={`${i + 1} glass${i > 0 ? 'es' : ''}`}
          title={`${i + 1} glass${i > 0 ? 'es' : ''}`}
        >
          💧
        </button>
      ))}
      <span className="cgh-glass-count">{count} / 8 glasses</span>
    </div>
  )
}

// ── SECTION 1: Mood Tracker ──────────────────────────────────
function MoodTab() {
  const todayStr = today()
  const moodLog = lsGet(LS.MOOD_LOG, [])
  const alreadyLogged = moodLog.some(e => e.date === todayStr)
  const [selected, setSelected] = useState(null)
  const [saved, setSaved] = useState(alreadyLogged)

  const last7 = lastNDays(7)
  const chartData = last7.map(d => {
    const entry = moodLog.find(e => e.date === d)
    return {
      day: shortDay(d),
      date: d,
      score: entry ? entry.score : null,
    }
  })

  function handleLog(score) {
    if (saved) return
    setSelected(score)
  }

  function handleSave() {
    if (!selected || saved) return
    const existing = lsGet(LS.MOOD_LOG, [])
    const filtered = existing.filter(e => e.date !== todayStr)
    lsSet(LS.MOOD_LOG, [...filtered, { date: todayStr, score: selected }])
    setSaved(true)
  }

  return (
    <div className="cgh-section">
      <div className="cgh-card">
        <h3 className="cgh-card-title">Today's Mood</h3>
        <p className="cgh-card-sub">How is the patient feeling today?</p>
        {saved ? (
          <div className="cgh-already-logged">
            ✅ Already logged today's mood
          </div>
        ) : (
          <>
            <div className="cgh-emoji-row">
              {MOOD_EMOJIS.map(m => (
                <button
                  key={m.score}
                  className={`cgh-emoji-btn ${selected === m.score ? 'selected' : ''}`}
                  onClick={() => handleLog(m.score)}
                  title={m.label}
                >
                  <span className="cgh-emoji">{m.emoji}</span>
                  <span className="cgh-emoji-label">{m.label}</span>
                </button>
              ))}
            </div>
            {selected && (
              <button className="cgh-save-btn" onClick={handleSave}>
                Save Today's Mood
              </button>
            )}
          </>
        )}
      </div>

      <div className="cgh-card">
        <h3 className="cgh-card-title">Weekly Mood Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 20, right: 16, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e8" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(val) => {
                const em = MOOD_EMOJIS.find(m => m.score === val)
                return em ? [`${em.emoji} ${em.label}`, 'Mood'] : [val, 'Mood']
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#b83a24"
              strokeWidth={2.5}
              dot={<MoodDot />}
              activeDot={{ r: 5, fill: '#b83a24' }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
        {chartData.every(d => d.score === null) && (
          <p className="cgh-empty-hint">No mood data yet — start logging daily!</p>
        )}
      </div>
    </div>
  )
}

// ── SECTION 2: Cognitive Assessment ─────────────────────────
const MMSE_INITIAL = {
  orientation: null,   // 0 | 1 | 2
  recall: null,        // 0-3
  attention: null,     // 0 | 2
  language: null,      // 0 | 2
  memory: null,        // 0 | 1 | 2
}

function CognitiveTab() {
  const todayStr = today()
  const cogLog = lsGet(LS.COGNITIVE_LOG, [])
  const [answers, setAnswers] = useState(MMSE_INITIAL)
  const [step, setStep] = useState(0)           // 0-4: questions, 5: result
  const [timerDone, setTimerDone] = useState(false)
  const [recallTimer, setRecallTimer] = useState(60)
  const timerRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)

  // Timer for recall question
  useEffect(() => {
    if (step === 1 && !timerDone) {
      setRecallTimer(60)
      timerRef.current = setInterval(() => {
        setRecallTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setTimerDone(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [step])

  function setAns(key, val) {
    setAnswers(prev => ({ ...prev, [key]: val }))
  }

  function totalScore() {
    const { orientation, recall, attention, language, memory } = answers
    // Each question max 2pts, 5 questions = 10 max, scale to 30
    const raw = (orientation ?? 0) + (recall ?? 0) + (attention ?? 0) + (language ?? 0) + (memory ?? 0)
    // raw max = 2+3+2+2+2 = 11, but we scale to /30 using 3x multiplier
    return Math.round((raw / 11) * 30)
  }

  function handleSubmit() {
    const score = totalScore()
    const existing = lsGet(LS.COGNITIVE_LOG, [])
    lsSet(LS.COGNITIVE_LOG, [...existing, { date: todayStr, score }])
    setSubmitted(true)
    setStep(5)
  }

  function handleReset() {
    setAnswers(MMSE_INITIAL)
    setStep(0)
    setTimerDone(false)
    setSubmitted(false)
  }

  function canProceed() {
    if (step === 0) return answers.orientation !== null
    if (step === 1) return timerDone && answers.recall !== null
    if (step === 2) return answers.attention !== null
    if (step === 3) return answers.language !== null
    if (step === 4) return answers.memory !== null
    return false
  }

  // History chart — last 10 assessments
  const historyData = cogLog.slice(-10).map(e => ({
    date: formatShortDate(e.date),
    score: e.score,
  }))

  const finalScore = step === 5 ? totalScore() : 0

  return (
    <div className="cgh-section">
      {/* Progress bar */}
      {step < 5 && (
        <div className="cgh-progress-wrap">
          <div className="cgh-progress-bar">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`cgh-progress-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}
              />
            ))}
          </div>
          <span className="cgh-progress-label">Question {step + 1} of 5</span>
        </div>
      )}

      {/* Q1: Orientation */}
      {step === 0 && (
        <div className="cgh-card">
          <div className="cgh-q-badge">Q1 · Orientation</div>
          <h3 className="cgh-card-title">Date & Day of Week</h3>
          <p className="cgh-card-sub">Ask the patient: <em>"What is today's date?"</em> and <em>"What day of the week is it?"</em></p>
          <div className="cgh-q-group">
            <p className="cgh-q-label">Date response:</p>
            <div className="cgh-btn-group">
              <button className={`cgh-opt-btn ${answers.orientation === 2 || answers.orientation === 1 ? 'active-green' : ''}`}
                onClick={() => setAns('orientation', Math.max(answers.orientation ?? 0, 1))}>
                ✅ Correct date
              </button>
              <button className={`cgh-opt-btn ${answers.orientation === 0 ? 'active-red' : ''}`}
                onClick={() => setAns('orientation', 0)}>
                ❌ Incorrect
              </button>
            </div>
            <p className="cgh-q-label">Day of week:</p>
            <div className="cgh-btn-group">
              <button className={`cgh-opt-btn ${answers.orientation === 2 ? 'active-green' : ''}`}
                onClick={() => setAns('orientation', answers.orientation >= 1 ? 2 : 1)}>
                ✅ Correct day
              </button>
              <button className={`cgh-opt-btn ${answers.orientation === 1 ? 'active-yellow' : ''}`}
                onClick={() => setAns('orientation', answers.orientation === 2 ? 1 : answers.orientation ?? 0)}>
                ❌ Incorrect day
              </button>
            </div>
            <p className="cgh-pts">Points scored: {answers.orientation ?? '—'} / 2</p>
          </div>
        </div>
      )}

      {/* Q2: Object Recall */}
      {step === 1 && (
        <div className="cgh-card">
          <div className="cgh-q-badge">Q2 · Object Recall</div>
          <h3 className="cgh-card-title">Word Memory</h3>
          <p className="cgh-card-sub">Show the patient these 3 words, then ask them to recall after 1 minute:</p>
          <div className="cgh-word-chips">
            {RECALL_WORDS.map(w => <span key={w} className="cgh-word-chip">{w}</span>)}
          </div>
          {!timerDone ? (
            <div className="cgh-timer-block">
              <div className="cgh-timer-ring">
                <span>{recallTimer}s</span>
              </div>
              <p className="cgh-timer-label">Waiting for 1 minute before asking recall…</p>
            </div>
          ) : (
            <div className="cgh-q-group">
              <p className="cgh-q-label">How many words did the patient recall?</p>
              <div className="cgh-btn-group">
                {[0, 1, 2, 3].map(n => (
                  <button
                    key={n}
                    className={`cgh-opt-btn ${answers.recall === n ? 'active-green' : ''}`}
                    onClick={() => setAns('recall', n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="cgh-pts">Points scored: {answers.recall ?? '—'} / 3</p>
            </div>
          )}
        </div>
      )}

      {/* Q3: Attention */}
      {step === 2 && (
        <div className="cgh-card">
          <div className="cgh-q-badge">Q3 · Attention &amp; Calculation</div>
          <h3 className="cgh-card-title">100 Minus 7</h3>
          <p className="cgh-card-sub">Ask the patient: <em>"What is 100 minus 7?"</em></p>
          <div className="cgh-q-group">
            <p className="cgh-q-label">Patient's answer:</p>
            <div className="cgh-btn-group">
              {ATTENTION_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`cgh-opt-btn ${answers.attention === (opt === CORRECT_ATTENTION ? 2 : 0) && answers.attention !== null ? (opt === CORRECT_ATTENTION ? 'active-green' : 'active-red') : ''} ${answers.attention === 2 && opt !== CORRECT_ATTENTION ? 'dimmed' : ''}`}
                  onClick={() => setAns('attention', opt === CORRECT_ATTENTION ? 2 : 0)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {answers.attention !== null && (
              <p className="cgh-pts">
                {answers.attention === 2 ? '✅ Correct! ' : '❌ Incorrect. Correct answer: 93. '}
                Points: {answers.attention} / 2
              </p>
            )}
          </div>
        </div>
      )}

      {/* Q4: Language */}
      {step === 3 && (
        <div className="cgh-card">
          <div className="cgh-q-badge">Q4 · Language Comprehension</div>
          <h3 className="cgh-card-title">Follow Command</h3>
          <div className="cgh-instruction-box">
            📄 Show the patient a card that reads: <strong>"Close your eyes"</strong>
          </div>
          <div className="cgh-q-group">
            <p className="cgh-q-label">Did the patient close their eyes?</p>
            <div className="cgh-btn-group">
              <button className={`cgh-opt-btn ${answers.language === 2 ? 'active-green' : ''}`}
                onClick={() => setAns('language', 2)}>
                ✅ Yes
              </button>
              <button className={`cgh-opt-btn ${answers.language === 0 ? 'active-red' : ''}`}
                onClick={() => setAns('language', 0)}>
                ❌ No
              </button>
            </div>
            <p className="cgh-pts">Points scored: {answers.language ?? '—'} / 2</p>
          </div>
        </div>
      )}

      {/* Q5: Memory Repeat */}
      {step === 4 && (
        <div className="cgh-card">
          <div className="cgh-q-badge">Q5 · Repetition / Memory</div>
          <h3 className="cgh-card-title">Phrase Repetition</h3>
          <div className="cgh-instruction-box">
            🗣️ Ask the patient to repeat: <strong>"No ifs, ands, or buts"</strong>
          </div>
          <div className="cgh-q-group">
            <p className="cgh-q-label">How well did they repeat it?</p>
            <div className="cgh-btn-group">
              <button className={`cgh-opt-btn ${answers.memory === 2 ? 'active-green' : ''}`}
                onClick={() => setAns('memory', 2)}>
                ✅ Perfect
              </button>
              <button className={`cgh-opt-btn ${answers.memory === 1 ? 'active-yellow' : ''}`}
                onClick={() => setAns('memory', 1)}>
                🟡 Partial
              </button>
              <button className={`cgh-opt-btn ${answers.memory === 0 ? 'active-red' : ''}`}
                onClick={() => setAns('memory', 0)}>
                ❌ Could not
              </button>
            </div>
            <p className="cgh-pts">Points scored: {answers.memory ?? '—'} / 2</p>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      {step < 5 && (
        <div className="cgh-nav-btns">
          {step > 0 && (
            <button className="cgh-back-btn" onClick={() => setStep(s => s - 1)}>
              ← Back
            </button>
          )}
          {step < 4 && (
            <button
              className="cgh-next-btn"
              disabled={!canProceed()}
              onClick={() => setStep(s => s + 1)}
            >
              Next →
            </button>
          )}
          {step === 4 && (
            <button
              className="cgh-save-btn"
              disabled={!canProceed()}
              onClick={handleSubmit}
            >
              Submit Assessment
            </button>
          )}
        </div>
      )}

      {/* Result */}
      {step === 5 && (
        <div className="cgh-card cgh-result-card" style={{ borderColor: scoreColor(finalScore) }}>
          <div className="cgh-result-score" style={{ color: scoreColor(finalScore) }}>
            {finalScore}<span style={{ fontSize: '1.2rem', color: '#666' }}>/30</span>
          </div>
          <div className="cgh-result-label" style={{ color: scoreColor(finalScore) }}>
            {scoreLabel(finalScore)}
          </div>
          <p className="cgh-result-note">
            Score ≥24 = Normal &nbsp;|&nbsp; 18–23 = Mild &nbsp;|&nbsp; &lt;18 = Significant impairment
          </p>
          <button className="cgh-back-btn" onClick={handleReset} style={{ marginTop: 16 }}>
            🔄 New Assessment
          </button>
        </div>
      )}

      {/* History Chart */}
      <div className="cgh-card">
        <h3 className="cgh-card-title">Assessment History</h3>
        {historyData.length === 0 ? (
          <p className="cgh-empty-hint">No assessments recorded yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={historyData} margin={{ top: 20, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e8" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 30]} ticks={[0, 6, 12, 18, 24, 30]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => [`${val}/30`, 'Score']} />
              <ReferenceLine y={24} stroke="#27ae60" strokeDasharray="5 5" label={{ value: 'Normal', fill: '#27ae60', fontSize: 11 }} />
              <ReferenceLine y={18} stroke="#f39c12" strokeDasharray="5 5" label={{ value: 'Mild', fill: '#f39c12', fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#b83a24"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#b83a24' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

// ── SECTION 3: Daily Vitals ──────────────────────────────────
function VitalsTab() {
  const todayStr = today()
  const vitalsLog = lsGet(LS.VITALS_LOG, [])
  const todayVitals = vitalsLog.find(v => v.date === todayStr)

  const [water, setWater] = useState(todayVitals?.water ?? 0)
  const [sleep, setSleep] = useState(todayVitals?.sleep ?? 7)
  const [activity, setActivity] = useState(todayVitals?.activity ?? -1)
  const [saved, setSaved] = useState(!!todayVitals)
  const [flash, setFlash] = useState(false)

  function handleSave() {
    if (activity === -1) return
    const existing = lsGet(LS.VITALS_LOG, [])
    const filtered = existing.filter(v => v.date !== todayStr)
    lsSet(LS.VITALS_LOG, [...filtered, { date: todayStr, water, sleep, activity }])
    setSaved(true)
    setFlash(true)
    setTimeout(() => setFlash(false), 2000)
  }

  const last7 = lastNDays(7)
  const refreshed = lsGet(LS.VITALS_LOG, [])

  const waterData = last7.map(d => {
    const e = refreshed.find(v => v.date === d)
    return { day: shortDay(d), value: e?.water ?? 0 }
  })
  const sleepData = last7.map(d => {
    const e = refreshed.find(v => v.date === d)
    return { day: shortDay(d), value: e?.sleep ?? 0 }
  })
  const activityData = last7.map(d => {
    const e = refreshed.find(v => v.date === d)
    return { day: shortDay(d), value: e?.activity ?? 0 }
  })

  return (
    <div className="cgh-section">
      <div className="cgh-card">
        <h3 className="cgh-card-title">Log Today's Vitals</h3>
        <p className="cgh-card-sub">{todayStr}</p>

        {/* Water */}
        <div className="cgh-vital-row">
          <label className="cgh-vital-label">💧 Water Intake</label>
          <GlassIcons count={water} onChange={setWater} />
        </div>

        {/* Sleep */}
        <div className="cgh-vital-row">
          <label className="cgh-vital-label">😴 Sleep Hours</label>
          <div className="cgh-slider-wrap">
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={sleep}
              onChange={e => setSleep(parseFloat(e.target.value))}
              className="cgh-slider"
            />
            <span className="cgh-slider-val">{sleep} hrs</span>
          </div>
        </div>

        {/* Activity */}
        <div className="cgh-vital-row">
          <label className="cgh-vital-label">🏃 Activity Level</label>
          <div className="cgh-btn-group">
            {ACTIVITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`cgh-opt-btn ${activity === opt.value ? 'active-green' : ''}`}
                onClick={() => setActivity(opt.value)}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className={`cgh-save-btn ${flash ? 'flash' : ''}`}
          onClick={handleSave}
          disabled={activity === -1}
        >
          {flash ? '✅ Saved!' : saved ? '🔄 Update Vitals' : '💾 Save Vitals'}
        </button>
      </div>

      {/* Mini Charts */}
      <div className="cgh-card">
        <h3 className="cgh-card-title">Weekly Overview</h3>

        <p className="cgh-chart-label">💧 Water (glasses/day)</p>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={waterData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e8" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 8]} ticks={[0, 4, 8]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => [`${v} glasses`, 'Water']} />
            <Bar dataKey="value" fill="#4db6e8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <p className="cgh-chart-label" style={{ marginTop: 16 }}>😴 Sleep (hours)</p>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={sleepData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e8" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 12]} ticks={[0, 4, 8, 12]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => [`${v} hrs`, 'Sleep']} />
            <Bar dataKey="value" fill="#9b59b6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <p className="cgh-chart-label" style={{ marginTop: 16 }}>🏃 Activity (0=None, 1=Light, 2=Moderate)</p>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={activityData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e8" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 2]} ticks={[0, 1, 2]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => [['None', 'Light', 'Moderate'][v] ?? v, 'Activity']} />
            <Bar dataKey="value" fill="#27ae60" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ── SECTION 4: Health Log ────────────────────────────────────
function LogTab() {
  const todayStr = today()
  const [note, setNote] = useState('')
  const [symptoms, setSymptoms] = useState([])
  const [medTaken, setMedTaken] = useState(null)   // null | 'yes' | 'no'
  const [entries, setEntries] = useState(() => lsGet(LS.HEALTH_LOG, []))
  const [saveFlash, setSaveFlash] = useState(false)
  const [error, setError] = useState('')

  function toggleSymptom(s) {
    setSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  function handleSave() {
    if (medTaken === null) {
      setError('Please select whether medicine was taken.')
      return
    }
    setError('')
    const newEntry = {
      id: Date.now(),
      date: todayStr,
      note: note.trim(),
      symptoms,
      med_taken: medTaken,
    }
    const existing = lsGet(LS.HEALTH_LOG, [])
    const updated = [newEntry, ...existing]
    lsSet(LS.HEALTH_LOG, updated)
    setEntries(updated)
    setNote('')
    setSymptoms([])
    setMedTaken(null)
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 2000)
  }

  function handleDelete(id) {
    const updated = entries.filter(e => e.id !== id)
    lsSet(LS.HEALTH_LOG, updated)
    setEntries(updated)
  }

  const recent = entries.slice(0, 7)

  return (
    <div className="cgh-section">
      {/* Add Note Form */}
      <div className="cgh-card">
        <h3 className="cgh-card-title">Add Health Note</h3>
        <p className="cgh-card-sub">{todayStr}</p>

        <label className="cgh-field-label">📝 Note / Observation</label>
        <textarea
          className="cgh-textarea"
          placeholder="Describe how the patient is doing today…"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
        />

        <label className="cgh-field-label">🏷️ Symptoms / Behaviour</label>
        <div className="cgh-symptom-grid">
          {SYMPTOM_OPTIONS.map(s => (
            <button
              key={s}
              className={`cgh-symptom-chip ${symptoms.includes(s) ? 'selected' : ''}`}
              onClick={() => toggleSymptom(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <label className="cgh-field-label">💊 Medicine Taken?</label>
        <div className="cgh-toggle-row">
          <button
            className={`cgh-toggle-btn ${medTaken === 'yes' ? 'active-green' : ''}`}
            onClick={() => setMedTaken('yes')}
          >
            ✅ Yes
          </button>
          <button
            className={`cgh-toggle-btn ${medTaken === 'no' ? 'active-red' : ''}`}
            onClick={() => setMedTaken('no')}
          >
            ❌ No
          </button>
        </div>

        {error && <p className="cgh-error">{error}</p>}

        <button
          className={`cgh-save-btn ${saveFlash ? 'flash' : ''}`}
          onClick={handleSave}
        >
          {saveFlash ? '✅ Saved!' : '💾 Save Entry'}
        </button>
      </div>

      {/* Recent Entries */}
      <div className="cgh-card">
        <h3 className="cgh-card-title">Recent Entries <span className="cgh-badge-count">{recent.length}</span></h3>
        {recent.length === 0 ? (
          <p className="cgh-empty-hint">No health logs yet. Add your first entry above!</p>
        ) : (
          <div className="cgh-log-list">
            {recent.map(entry => (
              <div key={entry.id} className="cgh-log-item">
                <div className="cgh-log-header">
                  <span className="cgh-log-date">{formatShortDate(entry.date)}</span>
                  <span className={`cgh-log-med ${entry.med_taken === 'yes' ? 'med-yes' : 'med-no'}`}>
                    💊 {entry.med_taken === 'yes' ? 'Meds taken' : 'Meds missed'}
                  </span>
                  <button className="cgh-delete-btn" onClick={() => handleDelete(entry.id)} title="Delete entry">
                    🗑️
                  </button>
                </div>
                {entry.symptoms.length > 0 && (
                  <div className="cgh-log-symptoms">
                    {entry.symptoms.map(s => (
                      <span key={s} className="cgh-symptom-chip selected small">{s}</span>
                    ))}
                  </div>
                )}
                {entry.note && (
                  <p className="cgh-log-note">{entry.note.length > 120 ? entry.note.slice(0, 120) + '…' : entry.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Root CgHealth Component ──────────────────────────────────
export default function CgHealth() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="cgh-root">
      {/* Header */}
      <div className="cgh-header">
        <h2 className="cgh-header-title">Health Dashboard</h2>
        <p className="cgh-header-sub">Track mood, cognition, vitals &amp; daily notes</p>
      </div>

      {/* Tab Pills */}
      <div className="cgh-tabs-wrap">
        <div className="cgh-tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`cgh-tab-pill ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="cgh-content">
        {activeTab === 0 && <MoodTab />}
        {activeTab === 1 && <CognitiveTab />}
        {activeTab === 2 && <VitalsTab />}
        {activeTab === 3 && <LogTab />}
      </div>
    </div>
  )
}
