// ============================================================
// CgPillbox.jsx — Visual Medication Pillbox
// Morning / Afternoon / Evening pill compartments
// Double-dose shield + 7-day compliance chart
// ============================================================
import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { lsGet, lsSet, today, lastNDays, shortDay, LS } from './CgShared'
import './CgPillbox.css'

const SHIFTS = [
  { id: 'morning',   label: 'Morning',   icon: '🌅', time: '8:00 AM',  color: '#f59e0b' },
  { id: 'afternoon', label: 'Afternoon', icon: '☀️', time: '1:00 PM',  color: '#3b82f6' },
  { id: 'evening',   label: 'Evening',   icon: '🌙', time: '8:00 PM',  color: '#8b5cf6' },
]

const DEFAULT_MEDS = [
  { id: 'm1', name: 'Aricept (Donepezil)', dose: '10mg', shift: 'morning' },
  { id: 'm2', name: 'Vitamin B12',          dose: '500mcg', shift: 'morning' },
  { id: 'm3', name: 'Omega-3',              dose: '1 capsule', shift: 'afternoon' },
  { id: 'm4', name: 'Melatonin',            dose: '3mg', shift: 'evening' },
]

export default function CgPillbox() {
  const pillLog = lsGet(LS.PILLBOX_LOG, {})
  const todayStr = today()
  const todayLog = pillLog[todayStr] || {}

  const [log, setLog] = useState(todayLog)
  const [meds] = useState(() => lsGet('setu_med_list', DEFAULT_MEDS))
  const [activeTab, setActiveTab] = useState('today')
  const [confirmModal, setConfirmModal] = useState(null)

  const handleCheck = (medId) => {
    if (log[medId]) {
      // Already checked — show double-dose warning
      setConfirmModal(medId)
      return
    }
    const updated = { ...log, [medId]: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
    setLog(updated)
    const newPillLog = { ...pillLog, [todayStr]: updated }
    lsSet(LS.PILLBOX_LOG, newPillLog)
  }

  const handleUncheck = (medId) => {
    const updated = { ...log }
    delete updated[medId]
    setLog(updated)
    const newPillLog = { ...pillLog, [todayStr]: updated }
    lsSet(LS.PILLBOX_LOG, newPillLog)
    setConfirmModal(null)
  }

  // Compliance data for last 7 days
  const last7 = lastNDays(7)
  const complianceData = last7.map(d => {
    const dayLog = pillLog[d] || {}
    const taken = Object.keys(dayLog).length
    const pct = meds.length > 0 ? Math.round((taken / meds.length) * 100) : 0
    return { day: shortDay(d), pct }
  })

  const totalTakenToday = Object.keys(log).length
  const totalMeds = meds.length
  const compliancePct = totalMeds > 0 ? Math.round((totalTakenToday / totalMeds) * 100) : 0

  return (
    <div className="cgdash-view">
      {/* Hero */}
      <div className="cg-hero-banner">
        <div className="cg-hero-tag"><span>💊</span><span>Medication Management</span></div>
        <h1 className="cg-hero-title">Visual <span>Pillbox</span></h1>
        <p className="cg-hero-sub">
          Track daily medication intake with double-dose protection.
          Check off each pill as it's given.
        </p>
      </div>

      {/* Today's Progress Bar */}
      <div className="pillbox-progress-card">
        <div className="pillbox-progress-header">
          <div>
            <div className="pillbox-progress-title">Today's Compliance</div>
            <div className="pillbox-progress-sub">{totalTakenToday} of {totalMeds} medications given</div>
          </div>
          <div className="pillbox-pct-badge" style={{
            background: compliancePct === 100 ? '#d1fae5' : compliancePct >= 50 ? '#fef3c7' : '#fde8e8',
            color: compliancePct === 100 ? '#065f46' : compliancePct >= 50 ? '#92400e' : '#991b1b',
          }}>
            {compliancePct}%
          </div>
        </div>
        <div className="pillbox-progress-track">
          <div
            className="pillbox-progress-fill"
            style={{
              width: `${compliancePct}%`,
              background: compliancePct === 100 ? '#27ae60' : compliancePct >= 50 ? '#f39c12' : '#b83a24',
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="cog-tab-row">
        {[['today', '💊 Today\'s Pillbox'], ['history', '📈 7-Day Compliance']].map(([k, l]) => (
          <button key={k} className={`cog-tab-btn ${activeTab === k ? 'active' : ''}`} onClick={() => setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {/* TODAY TAB */}
      {activeTab === 'today' && (
        <div className="pillbox-shifts-grid">
          {SHIFTS.map(shift => {
            const shiftMeds = meds.filter(m => m.shift === shift.id)
            return (
              <div key={shift.id} className="pillbox-shift-card" style={{ '--shift-color': shift.color }}>
                <div className="pillbox-shift-header">
                  <span className="pillbox-shift-icon">{shift.icon}</span>
                  <div>
                    <div className="pillbox-shift-name">{shift.label}</div>
                    <div className="pillbox-shift-time">{shift.time}</div>
                  </div>
                  <div className="pillbox-shift-count">
                    {shiftMeds.filter(m => log[m.id]).length}/{shiftMeds.length}
                  </div>
                </div>

                <div className="pillbox-meds-list">
                  {shiftMeds.length === 0 ? (
                    <div className="pillbox-empty-shift">No meds for this time</div>
                  ) : shiftMeds.map(med => {
                    const taken = !!log[med.id]
                    return (
                      <div key={med.id} className={`pillbox-med-row ${taken ? 'med-taken' : ''}`}>
                        <div className="pillbox-med-info">
                          <div className="pillbox-med-name">{med.name}</div>
                          <div className="pillbox-med-dose">{med.dose}</div>
                        </div>
                        <button
                          className={`pillbox-check-btn ${taken ? 'checked' : ''}`}
                          onClick={() => handleCheck(med.id)}
                          style={taken ? { background: shift.color } : {}}
                        >
                          {taken ? (
                            <>
                              <span>✓</span>
                              <span className="pill-time">{log[med.id]}</span>
                            </>
                          ) : (
                            <span>Give</span>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* COMPLIANCE CHART TAB */}
      {activeTab === 'history' && (
        <div className="pillbox-chart-card">
          <h3 className="mood-card-title">7-Day Medication Compliance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={complianceData} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--cg-border)" vertical={false}/>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--cg-text-dim)' }}/>
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: 'var(--cg-text-dim)' }}/>
              <Tooltip formatter={v => [`${v}%`, 'Compliance']}
                contentStyle={{ background: 'var(--cg-surface)', border: '1px solid var(--cg-border)', borderRadius: 8 }}/>
              <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                {complianceData.map((entry, i) => (
                  <Cell key={i} fill={entry.pct >= 80 ? '#27ae60' : entry.pct >= 50 ? '#f39c12' : '#b83a24'}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="pillbox-compliance-legend">
            <span><span className="pill-legend-dot" style={{ background: '#27ae60' }}/> ≥80% Good</span>
            <span><span className="pill-legend-dot" style={{ background: '#f39c12' }}/> 50–80% Moderate</span>
            <span><span className="pill-legend-dot" style={{ background: '#b83a24' }}/> &lt;50% Missed</span>
          </div>
        </div>
      )}

      {/* Double-dose Warning Modal */}
      {confirmModal && (
        <div className="pillbox-modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="pillbox-modal" onClick={e => e.stopPropagation()}>
            <div className="pillbox-modal-icon">⚠️</div>
            <h3>Double-Dose Warning!</h3>
            <p>
              <strong>{meds.find(m => m.id === confirmModal)?.name}</strong> was already
              given at <strong>{log[confirmModal]}</strong> today.
            </p>
            <p className="pillbox-modal-sub">Are you sure you want to unmark this as given?</p>
            <div className="pillbox-modal-actions">
              <button className="pillbox-modal-cancel" onClick={() => setConfirmModal(null)}>
                Cancel
              </button>
              <button className="pillbox-modal-confirm" onClick={() => handleUncheck(confirmModal)}>
                Unmark as Given
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
