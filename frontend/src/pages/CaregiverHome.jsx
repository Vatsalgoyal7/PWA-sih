// ============================================================
// CaregiverHome.jsx — Chakravyuh Inspired Master Console Root
// Responsive for Mobile, Tablet & Laptop (Patient Side Stays Frozen)
// Light Theme (Default Eye-Comfort) & Dark Mode Toggle
// English (Default) & Assamese Toggle
// ============================================================
import React, { useState } from 'react'
import CgDashboard from './caregiver/CgDashboard'
import CgReminders from './caregiver/CgReminders'
import CgGames from './caregiver/CgGames'
import CgHealth from './caregiver/CgHealth'
import CgReports from './caregiver/CgReports'
import CgProfile from './caregiver/CgProfile'
import CgNavbar from './caregiver/CgNavbar'
import { lsGet, lsSet, LS, PROFILE_DEFAULT } from './caregiver/CgShared'
import './CaregiverHome.css'

export default function CaregiverHome({ onChangeRole }) {
  // Theme State: Default = 'light' (Eye Comfort)
  const [theme, setTheme] = useState(() => lsGet(LS.THEME, 'light'))

  // Language State: Default = 'en' (English)
  const [lang, setLang] = useState(() => lsGet(LS.LANG, 'en'))

  // Mobile Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Active module
  const [activeModule, setActiveModule] = useState('dashboard')

  // Check if PIN lock is enabled
  const storedPin = lsGet(LS.PIN, '')
  const [unlocked, setUnlocked] = useState(!storedPin)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  // Profile data
  const profile = lsGet(LS.PROFILE, PROFILE_DEFAULT)
  const patientName = profile.name || 'Meena Sharma'

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    lsSet(LS.THEME, next)
  }

  const toggleLang = () => {
    const next = lang === 'en' ? 'as' : 'en'
    setLang(next)
    lsSet(LS.LANG, next)
  }

  const handleSelectModule = (mod) => {
    setActiveModule(mod)
    setDrawerOpen(false)
  }

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

  const isEn = lang === 'en'

  // Common Nav Menu items for both Drawer & Desktop Sidebar
  const renderNavItems = () => (
    <>
      <div className="cg-drawer-section-label">
        {isEn ? 'Master Management Controls' : 'মাষ্টাৰ নিয়ন্ত্ৰণ তালিকা'}
      </div>

      <button
        type="button"
        className={`cg-drawer-item ${activeModule === 'dashboard' ? 'active' : ''}`}
        onClick={() => handleSelectModule('dashboard')}
      >
        <div className="cg-drawer-item-left">
          <span>📊</span>
          <span>{isEn ? 'Master Dashboard' : 'মুখ্য ডেচবৰ্ড'}</span>
        </div>
        <span className="cg-drawer-badge">LIVE</span>
      </button>

      <button
        type="button"
        className={`cg-drawer-item ${activeModule === 'games' ? 'active' : ''}`}
        onClick={() => handleSelectModule('games')}
      >
        <div className="cg-drawer-item-left">
          <span>🎮</span>
          <span>{isEn ? 'Cognitive Game Prescriber' : 'স্মৃতি খেল নিৰ্বাচন'}</span>
        </div>
        <span className="cg-drawer-badge">Curate</span>
      </button>

      <button
        type="button"
        className={`cg-drawer-item ${activeModule === 'reminders' ? 'active' : ''}`}
        onClick={() => handleSelectModule('reminders')}
      >
        <div className="cg-drawer-item-left">
          <span>⏰</span>
          <span>{isEn ? 'Routines & Voice Alarms' : 'দৈনিক নিয়ম আৰু মাত'}</span>
        </div>
        <span className="cg-drawer-badge">Voice</span>
      </button>

      <button
        type="button"
        className={`cg-drawer-item ${activeModule === 'health' ? 'active' : ''}`}
        onClick={() => handleSelectModule('health')}
      >
        <div className="cg-drawer-item-left">
          <span>🧠</span>
          <span>{isEn ? 'MMSE & Clinical Vitals' : 'স্নায়ু পৰীক্ষা আৰু স্বাস্থ্য'}</span>
        </div>
        <span className="cg-drawer-badge">/30</span>
      </button>

      <button
        type="button"
        className={`cg-drawer-item ${activeModule === 'reports' ? 'active' : ''}`}
        onClick={() => handleSelectModule('reports')}
      >
        <div className="cg-drawer-item-left">
          <span>📑</span>
          <span>{isEn ? 'Doctor Reports & PDF' : 'ডাক্তৰ প্ৰতিবেদন'}</span>
        </div>
        <span className="cg-drawer-badge">Export</span>
      </button>

      <button
        type="button"
        className={`cg-drawer-item ${activeModule === 'profile' ? 'active' : ''}`}
        onClick={() => handleSelectModule('profile')}
      >
        <div className="cg-drawer-item-left">
          <span>👤</span>
          <span>{isEn ? 'Safety, SOS & PIN Lock' : 'সুৰক্ষা আৰু পিন লক'}</span>
        </div>
        <span className="cg-drawer-badge">Shield</span>
      </button>
    </>
  )

  return (
    <div className={`cg-shell cg-theme-${theme}`}>
      
      {/* Top Header Bar (Chakravyuh Inspired) */}
      <header className="cg-topbar">
        <div className="cg-topbar-left">
          <button
            type="button"
            className="cg-btn-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Master Controls Drawer"
          >
            ☰
          </button>
          <div className="cg-brand">
            <span>🧠</span>
            <span className="cg-brand-text">SMRITISETU</span>
            <span className="cg-portal-tag">CAREGIVER DESK</span>
          </div>
        </div>

        <div className="cg-topbar-right">
          {/* Theme Switcher */}
          <button
            type="button"
            className="cg-icon-btn"
            onClick={toggleTheme}
            title="Toggle Light / Dark Mode"
          >
            <span>{theme === 'light' ? '🌙' : '☀️'}</span>
            <span className="cg-btn-text-desktop">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            className="cg-icon-btn"
            onClick={toggleLang}
            title="Toggle English / Assamese"
          >
            <span>🌐</span>
            <span>{isEn ? 'EN' : 'অ'}</span>
          </button>

          {/* Caregiver Initial Avatar */}
          <div className="cg-avatar-badge" title="Caregiver Superuser">
            C
          </div>

          {/* Switch Role Back */}
          <button
            type="button"
            className="cg-switch-role-btn"
            onClick={onChangeRole}
            title="Switch to Patient View"
          >
            ↪ <span className="cg-switch-text-desktop">Role</span>
          </button>
        </div>
      </header>

      {/* Main Responsive Body Layout */}
      <div className="cg-body-wrapper">
        
        {/* Permanent Desktop Sidebar (Chakravyuh Admin Desk - Laptop >= 1024px) */}
        <aside className="cg-desktop-sidebar">
          <div className="cg-desktop-sidebar-inner">
            {renderNavItems()}
          </div>
          <div className="cg-desktop-sidebar-footer">
            <span>Caregiver Desk v2.8</span>
            <span>Patient UI: Frozen</span>
          </div>
        </aside>

        {/* Scrollable Content Viewport (Centered, Responsive) */}
        <main className="cg-content">
          <div className="cg-content-inner">
            {activeModule === 'dashboard' && (
              <CgDashboard
                patientName={patientName}
                onSelectModule={handleSelectModule}
                lang={lang}
              />
            )}
            {activeModule === 'reminders' && <CgReminders />}
            {activeModule === 'games' && <CgGames />}
            {activeModule === 'health' && <CgHealth />}
            {activeModule === 'reports' && <CgReports />}
            {activeModule === 'profile' && (
              <CgProfile onChangeRole={onChangeRole} />
            )}
          </div>
        </main>
      </div>

      {/* Mobile/Tablet Bottom 6-Tab Navigation (Hidden on Laptop >= 1024px) */}
      <div className="cg-mobile-bottom-nav">
        <CgNavbar
          activeTab={activeModule === 'dashboard' ? 'home' : activeModule}
          onTab={(tab) => setActiveModule(tab === 'home' ? 'dashboard' : tab)}
        />
      </div>

      {/* Mobile/Tablet Sliding Drawer (< 1024px) */}
      {drawerOpen && (
        <div className="cg-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="cg-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cg-drawer-header">
              <div className="cg-drawer-brand">
                <span>🧠</span>
                <span>SMRITISETU 2026</span>
              </div>
              <button
                type="button"
                className="cg-drawer-close"
                onClick={() => setDrawerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="cg-drawer-menu">
              {renderNavItems()}
            </div>

            <div className="cg-drawer-footer">
              <span>Caregiver v2.8</span>
              <span>Patient UI: Frozen</span>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
