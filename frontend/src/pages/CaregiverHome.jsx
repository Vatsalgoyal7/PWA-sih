// ============================================================
// CaregiverHome.jsx — Chakravyuh-Inspired Master Console
// 3-Section Sidebar (12 modules) + All New Feature Modules
// ============================================================
import React, { useState } from 'react'
import CgDashboard    from './caregiver/CgDashboard'
import CgCognitive    from './caregiver/CgCognitive'
import CgMood         from './caregiver/CgMood'
import CgPillbox      from './caregiver/CgPillbox'
import CgReminders    from './caregiver/CgReminders'
import CgGames        from './caregiver/CgGames'
import CgSafeZone     from './caregiver/CgSafeZone'
import CgHandover     from './caregiver/CgHandover'
import CgHealth       from './caregiver/CgHealth'
import CgReports      from './caregiver/CgReports'
import CgMemoryBoard  from './caregiver/CgMemoryBoard'
import CgProfile      from './caregiver/CgProfile'
import CgSettings     from './caregiver/CgSettings'
import CgNavbar       from './caregiver/CgNavbar'
import CgAuth         from './caregiver/CgAuth'
import { lsGet, lsSet, LS, PROFILE_DEFAULT } from './caregiver/CgShared'
import './CaregiverHome.css'

// ── Sidebar Nav Structure (4 sections) ────────────────────
const NAV_SECTIONS = [
  {
    section: 'PATIENT MONITORING',
    items: [
      { id: 'dashboard',  icon: '📊', label: 'Live Dashboard',       badge: 'LIVE',   badgeClass: 'badge-live'    },
      { id: 'cognitive',  icon: '🧠', label: 'MMSE Cognitive Score', badge: '/30',    badgeClass: 'badge-neutral' },
      { id: 'mood',       icon: '😊', label: 'Mood Tracker',         badge: 'Daily',  badgeClass: 'badge-neutral' },
    ]
  },
  {
    section: 'CARE MANAGEMENT',
    items: [
      { id: 'pillbox',   icon: '💊', label: 'Medication Pillbox',  badge: '3× Day', badgeClass: 'badge-warn'    },
      { id: 'reminders', icon: '⏰', label: 'Routines & Alarms',   badge: 'Voice',  badgeClass: 'badge-neutral' },
      { id: 'games',     icon: '🎮', label: 'Game Prescriber',     badge: 'CST',    badgeClass: 'badge-neutral' },
      { id: 'safezone',  icon: '📍', label: 'Safe Zone Monitor',   badge: 'GPS',    badgeClass: 'badge-neutral' },
      { id: 'handover',  icon: '👥', label: 'Handover Notes',      badge: 'Shifts', badgeClass: 'badge-neutral' },
    ]
  },
  {
    section: 'CLINICAL TOOLS',
    items: [
      { id: 'health',   icon: '📋', label: 'Health Log & Vitals',  badge: 'Log',    badgeClass: 'badge-neutral' },
      { id: 'reports',  icon: '📑', label: 'Doctor Reports & PDF', badge: 'Export', badgeClass: 'badge-neutral' },
      { id: 'memory',   icon: '🖼️', label: 'Memory Photo Board',   badge: 'Photos', badgeClass: 'badge-neutral' },
    ]
  },
  {
    section: 'PROFILES & SYSTEM',
    items: [
      { id: 'profile',  icon: '👥', label: 'Patient & Caregivers Team', badge: 'Team',   badgeClass: 'badge-live' },
      { id: 'settings', icon: '⚙️', label: 'System Settings & Audit',    badge: 'Config', badgeClass: 'badge-warn' },
    ]
  }
]

// ── Module Renderer ────────────────────────────────────────
function renderModule(activeModule, patientName, handleSelectModule, onChangeRole, handleLogout, lang, theme, toggleTheme) {
  switch (activeModule) {
    case 'dashboard': return <CgDashboard patientName={patientName} onSelectModule={handleSelectModule} lang={lang}/>
    case 'cognitive': return <CgCognitive/>
    case 'mood':      return <CgMood/>
    case 'pillbox':   return <CgPillbox/>
    case 'reminders': return <CgReminders/>
    case 'games':     return <CgGames/>
    case 'safezone':  return <CgSafeZone/>
    case 'handover':  return <CgHandover/>
    case 'health':    return <CgHealth/>
    case 'reports':   return <CgReports/>
    case 'memory':    return <CgMemoryBoard/>
    case 'profile':   return <CgProfile/>
    case 'settings':  return <CgSettings theme={theme} onToggleTheme={toggleTheme} onChangeRole={onChangeRole} onLogout={handleLogout}/>
    default:          return <CgDashboard patientName={patientName} onSelectModule={handleSelectModule} lang={lang}/>
  }
}

// ── Main Component ─────────────────────────────────────────
export default function CaregiverHome({ onChangeRole }) {
  // Caregiver Authentication Session State (Ready for Supabase Auth)
  const [caregiverUser, setCaregiverUser] = useState(() => {
    try {
      const saved = localStorage.getItem('setu_caregiver_session')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [theme, setTheme]           = useState(() => lsGet(LS.THEME, 'light'))
  const [lang, setLang]             = useState(() => lsGet(LS.LANG, 'en'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeModule, setActiveModule] = useState('dashboard')

  // Handle Caregiver Sign Out
  const handleLogout = () => {
    try {
      localStorage.removeItem('setu_caregiver_session')
    } catch (e) {
      console.warn(e)
    }
    setCaregiverUser(null)
  }

  // PIN lock
  const storedPin = lsGet(LS.PIN, '')
  const [unlocked, setUnlocked]   = useState(!storedPin)
  const [pinInput, setPinInput]   = useState('')
  const [pinError, setPinError]   = useState(false)

  const profile     = lsGet(LS.PROFILE, PROFILE_DEFAULT)
  const patientName = profile.name || caregiverUser?.patientName || 'Meena Sharma'

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
    if (pinInput === storedPin) { setUnlocked(true); setPinError(false) }
    else { setPinError(true); setPinInput('') }
  }

  // ── 1. Auth Screen: Login / Register (if not authenticated) ──
  if (!caregiverUser) {
    return (
      <CgAuth
        onLoginSuccess={(user) => setCaregiverUser(user)}
        onBackToRoles={onChangeRole}
      />
    )
  }

  // ── 2. PIN Screen (if PIN is set in settings) ─────────────
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
            {[0,1,2,3].map((idx) => (
              <span key={idx} className={`cg-pin-dot ${pinInput.length > idx ? 'cg-pin-dot--filled' : ''}`}/>
            ))}
          </div>
          <input
            type="password" maxLength={4}
            className={`cg-pin-input ${pinError ? 'cg-pin-input--error' : ''}`}
            value={pinInput}
            onChange={(e) => { setPinInput(e.target.value); if (pinError) setPinError(false) }}
            autoFocus placeholder="••••"
          />
          {pinError && <p className="cg-pin-error">Incorrect PIN. Please try again.</p>}
          <button type="submit" className="cg-pin-unlock-btn" disabled={pinInput.length !== 4}>
            Unlock Dashboard
          </button>
          <button type="button" className="btn-switch-role" onClick={handleLogout} style={{ marginTop: '8px' }}>
            ← Sign Out / Switch Account
          </button>
        </form>
      </div>
    )
  }

  const isEn = lang === 'en'

  // ── Sidebar Nav Renderer ───────────────────────────────────
  const renderSidebarNav = () => (
    <div className="cg-sidebar-nav">
      {NAV_SECTIONS.map((sec) => (
        <div key={sec.section} className="cg-nav-section">
          <div className="cg-nav-section-label">{sec.section}</div>
          {sec.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`cg-nav-item ${activeModule === item.id ? 'active' : ''}`}
              onClick={() => handleSelectModule(item.id)}
            >
              <span className="cg-nav-item-icon">{item.icon}</span>
              <span className="cg-nav-item-label">{item.label}</span>
              <span className={`cg-nav-badge ${item.badgeClass}`}>{item.badge}</span>
            </button>
          ))}
        </div>
      ))}

      {/* Caregiver Session Sign Out */}
      <div className="cg-nav-section" style={{ marginTop: '10px', borderTop: '1px solid var(--cg-border-subtle, #f1f5f9)', paddingTop: '8px' }}>
        <div className="cg-nav-section-label">CAREGIVER SESSION</div>
        <button
          type="button"
          className="cg-nav-item"
          onClick={handleLogout}
          style={{ color: '#dc2626' }}
          title="Sign Out of Caregiver Portal"
        >
          <span className="cg-nav-item-icon">🚪</span>
          <span className="cg-nav-item-label">Sign Out Caregiver</span>
          <span className="cg-nav-badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Exit</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className={`cg-shell cg-theme-${theme}`}>

      {/* ── Topbar ──────────────────────────────────────────── */}
      <header className="cg-topbar">
        <div className="cg-topbar-left">
          <button type="button" className="cg-btn-hamburger"
            onClick={() => setDrawerOpen(true)} aria-label="Open navigation">
            ☰
          </button>
          <div className="cg-brand">
            <span>🧠</span>
            <span className="cg-brand-text">SMRITISETU</span>
            <span className="cg-portal-tag">CAREGIVER DESK</span>
          </div>
        </div>

        <div className="cg-topbar-right">
          {/* Quick Settings Shortcut */}
          <button
            type="button"
            className={`cg-icon-btn ${activeModule === 'settings' ? 'active' : ''}`}
            onClick={() => handleSelectModule('settings')}
            title="System Settings & Audit"
          >
            <span>⚙️</span>
          </button>

          {/* Language Switcher */}
          <button type="button" className="cg-icon-btn" onClick={toggleLang} title="Toggle English / Assamese">
            <span>🌐</span>
            <span>{isEn ? 'EN' : 'অ'}</span>
          </button>
        </div>
      </header>

      {/* ── Body Layout ─────────────────────────────────────── */}
      <div className="cg-body-wrapper">

        {/* Permanent Desktop Sidebar (≥ 1024px) */}
        <aside className="cg-desktop-sidebar">
          <div className="cg-desktop-sidebar-inner">
            {renderSidebarNav()}
          </div>
          <div className="cg-desktop-sidebar-footer">
            <span>Caregiver Desk v3.0</span>
            <span>Patient UI: Frozen 🔒</span>
          </div>
        </aside>

        {/* Scrollable Content */}
        <main className="cg-content">
          <div className="cg-content-inner">
            {renderModule(activeModule, patientName, handleSelectModule, onChangeRole, handleLogout, lang, theme, toggleTheme)}
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Nav (hidden ≥ 1024px) ─────────────── */}
      <div className="cg-mobile-bottom-nav">
        <CgNavbar
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
        />
      </div>

      {/* ── Mobile Sliding Drawer (< 1024px) ────────────────── */}
      {drawerOpen && (
        <div className="cg-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="cg-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cg-drawer-header">
              <div className="cg-drawer-brand">
                <span>🧠</span>
                <span>SMRITISETU 2026</span>
              </div>
              <button type="button" className="cg-drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
            </div>

            {/* Patient Info Strip */}
            <div className="cg-drawer-patient-strip">
              {profile.photo_b64 ? (
                <img src={profile.photo_b64} alt={patientName} className="cg-drawer-patient-img" />
              ) : (
                <span className="cg-drawer-patient-avatar">👵</span>
              )}
              <div>
                <div className="cg-drawer-patient-name">{patientName}</div>
                <div className="cg-drawer-patient-sub">
                  {profile.age || 72} yrs · {profile.stage || 'Early Stage MCI'}
                </div>
              </div>
            </div>

            <div className="cg-drawer-menu">
              {renderSidebarNav()}
            </div>

            <div className="cg-drawer-footer">
              <span>SmritiSetu v3.0</span>
              <span>SIH26003 · DoNER</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
