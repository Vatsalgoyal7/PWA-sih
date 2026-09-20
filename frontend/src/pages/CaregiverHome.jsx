// ============================================================
// CaregiverHome.jsx — Root Caregiver Dashboard View
// ============================================================
import React, { useState } from 'react'
import CgNavbar from './caregiver/CgNavbar'
import CgDashboard from './caregiver/CgDashboard'
import CgReminders from './caregiver/CgReminders'
import CgGames from './caregiver/CgGames'
import CgHealth from './caregiver/CgHealth'
import CgReports from './caregiver/CgReports'
import CgProfile from './caregiver/CgProfile'
import { lsGet, LS, PROFILE_DEFAULT } from './caregiver/CgShared'
import './CaregiverHome.css'

export default function CaregiverHome({ onChangeRole }) {
  // Check if PIN lock is enabled
  const storedPin = lsGet(LS.PIN, '')
  const [unlocked, setUnlocked] = useState(!storedPin)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  // Active Tab state
  const [activeTab, setActiveTab] = useState('home')

  // Patient Profile
  const profile = lsGet(LS.PROFILE, PROFILE_DEFAULT)
  const patientName = profile.name || 'Patient'

  // Handle PIN entry
  const handlePinSubmit = (e) => {
    e.preventDefault()
    if (pinInput === storedPin) {
      setUnlocked(true)
      setPinError(false)
    } else {
      setPinError(true)
      setPinInput('')
    }
  }

  // If locked, render PIN screen
  if (!unlocked && storedPin) {
    return (
      <div className="cg-pin-screen">
        <div className="cg-pin-logo">🧠</div>
        <h1 className="cg-pin-app-name">SmritiSetu</h1>
        <p className="cg-pin-subtitle">Caregiver Master Portal</p>

        <form className="cg-pin-card" onSubmit={handlePinSubmit}>
          <h2 className="cg-pin-title">Security PIN Required</h2>
          <p className="cg-pin-desc">Enter the 4-digit caregiver PIN to access settings.</p>

          <div className="cg-pin-dots">
            {[0, 1, 2, 3].map((idx) => (
              <span
                key={idx}
                className={`cg-pin-dot ${pinInput.length > idx ? 'cg-pin-dot--filled' : ''}`}
              />
            ))}
          </div>

          <input
            type="password"
            maxLength={4}
            className={`cg-pin-input ${pinError ? 'cg-pin-input--error' : ''}`}
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value)
              if (pinError) setPinError(false)
            }}
            autoFocus
            placeholder="••••"
          />

          {pinError && <p className="cg-pin-error">Incorrect PIN. Please try again.</p>}

          <button
            type="submit"
            className="cg-pin-unlock-btn"
            disabled={pinInput.length !== 4}
          >
            Unlock Dashboard
          </button>

          <button
            type="button"
            className="btn-switch-role"
            onClick={onChangeRole}
            style={{ marginTop: '8px' }}
          >
            ← Back to Role Select
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="cg-shell">
      <main className="cg-content">
        {activeTab === 'home' && (
          <CgDashboard
            patientName={patientName}
            onTab={(tab) => setActiveTab(tab)}
            onChangeRole={onChangeRole}
          />
        )}
        {activeTab === 'reminders' && <CgReminders />}
        {activeTab === 'games' && <CgGames />}
        {activeTab === 'health' && <CgHealth />}
        {activeTab === 'reports' && <CgReports />}
        {activeTab === 'profile' && (
          <CgProfile onChangeRole={onChangeRole} />
        )}
      </main>

      {/* Bottom 6-tab Navigation Bar */}
      <CgNavbar activeTab={activeTab} onTab={(tab) => setActiveTab(tab)} />
    </div>
  )
}
