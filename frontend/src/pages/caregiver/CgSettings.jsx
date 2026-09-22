// ============================================================
// CgSettings.jsx — Dedicated Settings & Audit Console
// Features: Internal Settings Hamburger Menu, Appearance Mode,
// Security PIN, Clinical Audit Log, Notifications & Cloud Sync
// ============================================================
import React, { useState } from 'react'
import { lsGet, lsSet, LS, AUDIT_LOG_DEFAULT } from './CgShared'
import './CgSettings.css'

export default function CgSettings({
  theme = 'light',
  onToggleTheme,
  onChangeRole,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('appearance') // 'appearance' | 'security' | 'audit' | 'notifications' | 'data' | 'account'
  const [menuOpen, setMenuOpen] = useState(false) // Settings internal hamburger menu

  // Security / PIN State
  const [currentPin, setCurrentPin] = useState(() => lsGet(LS.PIN, ''))
  const [pinInput, setPinInput] = useState('')
  const [pinMsg, setPinMsg] = useState('')

  // Appearance State
  const [fontSize, setFontSize] = useState('normal') // 'normal' | 'large' | 'xlarge'
  const [highContrast, setHighContrast] = useState(false)
  const [accentColor, setAccentColor] = useState('terracotta') // 'terracotta' | 'indigo' | 'emerald'

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState(() => lsGet(LS.AUDIT_LOG, AUDIT_LOG_DEFAULT))
  const [auditFilter, setAuditFilter] = useState('all')

  // Notification Toggles
  const [notifMeds, setNotifMeds] = useState(true)
  const [notifSundowning, setNotifSundowning] = useState(true)
  const [notifWandering, setNotifWandering] = useState(true)
  const [fluteVolume, setFluteVolume] = useState(80)

  // Current session
  const currentCaregiver = lsGet('setu_caregiver_session', {
    name: 'Vatsal Goyal',
    email: 'caregiver@smritisetu.org',
    relationship: 'Son (Primary Caregiver)'
  })

  // PIN Handlers
  const handleSetPin = (e) => {
    e.preventDefault()
    if (pinInput.length !== 4 || isNaN(pinInput)) {
      setPinMsg('⚠️ PIN must be exactly 4 digits.')
      return
    }
    lsSet(LS.PIN, pinInput)
    setCurrentPin(pinInput)
    setPinInput('')
    setPinMsg('✅ 4-Digit Security PIN saved successfully!')

    // Add to audit log
    const newAudit = {
      id: `aud_${Date.now()}`,
      actor: currentCaregiver.name,
      action: 'Updated Caregiver Security PIN code',
      time: 'Just now',
      type: 'security',
      badge: 'Security'
    }
    const updated = [newAudit, ...auditLogs]
    setAuditLogs(updated)
    lsSet(LS.AUDIT_LOG, updated)

    setTimeout(() => setPinMsg(''), 2500)
  }

  const handleRemovePin = () => {
    lsSet(LS.PIN, '')
    setCurrentPin('')
    setPinMsg('🔓 Security PIN removed. Direct console access enabled.')

    const newAudit = {
      id: `aud_${Date.now()}`,
      actor: currentCaregiver.name,
      action: 'Removed Caregiver Security PIN code',
      time: 'Just now',
      type: 'security',
      badge: 'Security'
    }
    const updated = [newAudit, ...auditLogs]
    setAuditLogs(updated)
    lsSet(LS.AUDIT_LOG, updated)

    setTimeout(() => setPinMsg(''), 2500)
  }

  // Backup Data Download
  const handleExportBackup = () => {
    const backupData = {
      profile: lsGet(LS.PROFILE, null),
      caregivers: lsGet(LS.CAREGIVERS, null),
      reminders: lsGet(LS.REMINDERS, null),
      games: lsGet(LS.GAMES, null),
      auditLogs,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SmritiSetu_Backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredLogs = auditFilter === 'all'
    ? auditLogs
    : auditLogs.filter(log => log.type === auditFilter)

  const settingsMenuItems = [
    { id: 'appearance', icon: '🌙', label: 'Appearance & Display', badge: theme === 'dark' ? 'Dark' : 'Light' },
    { id: 'security',   icon: '🔒', label: 'Security & PIN Lock',  badge: currentPin ? 'Active' : 'Off' },
    { id: 'audit',      icon: '📜', label: 'Clinical Audit Log',   badge: `${auditLogs.length} Events` },
    { id: 'notifications', icon: '🔔', label: 'Alerts & Sounds',   badge: 'Active' },
    { id: 'data',       icon: '📶', label: 'Data & Supabase Sync', badge: 'Cloud' },
    { id: 'account',    icon: '👤', label: 'Caregiver Session',    badge: 'Sign Out' },
  ]

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId)
    setMenuOpen(false) // Close mobile drawer when an item is selected
  }

  return (
    <div className="cgdash-view cg-settings-view">
      
      {/* ── Settings Header with Internal Hamburger ── */}
      <div className="cg-settings-header-card">
        <div className="settings-header-left">
          {/* Internal Hamburger for Settings */}
          <button
            type="button"
            className="btn-settings-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open Settings Menu"
            title="Toggle Settings Menu"
          >
            ☰
          </button>
          <div className="settings-title-group">
            <div className="settings-badge-row">
              <span className="settings-tag">SYSTEM CONSOLE</span>
              <span className="settings-active-chip">
                {settingsMenuItems.find(m => m.id === activeTab)?.label}
              </span>
            </div>
            <h1 className="settings-main-title">Settings &amp; Audit Console</h1>
          </div>
        </div>

        <div className="settings-header-right">
          <button
            type="button"
            className="btn-quick-theme-toggle"
            onClick={onToggleTheme}
            title="Toggle Light / Dark Theme"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="theme-toggle-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* ── Main Layout: Sidebar Submenu + Active Tab Content ── */}
      <div className="settings-layout-grid">
        
        {/* Settings Navigation Sidebar (Desktop persistent, Mobile sliding drawer) */}
        <aside className={`settings-sidebar ${menuOpen ? 'menu-open' : ''}`}>
          <div className="settings-sidebar-header">
            <span>⚙️ SETTINGS DIRECTORY</span>
            <button
              type="button"
              className="btn-close-settings-menu"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="settings-nav-list">
            {settingsMenuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`settings-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleSelectTab(item.id)}
              >
                <span className="settings-nav-icon">{item.icon}</span>
                <span className="settings-nav-label">{item.label}</span>
                <span className="settings-nav-badge">{item.badge}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Backdrop for mobile drawer */}
        {menuOpen && (
          <div className="settings-menu-backdrop" onClick={() => setMenuOpen(false)} />
        )}

        {/* Active Settings Panel */}
        <main className="settings-panel-content">
          
          {/* ──────────────────────────────────────────────────────────
              SECTION 1: APPEARANCE MODE & DISPLAY
              ────────────────────────────────────────────────────────── */}
          {activeTab === 'appearance' && (
            <div className="settings-card">
              <div className="settings-section-head">
                <h3 className="section-title">🌙 Appearance Mode &amp; Accessibility</h3>
                <p className="section-sub">Customize the visual theme, contrast, and typography scaling for senior readability.</p>
              </div>

              {/* Theme Toggle Card */}
              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>Theme Mode (Light / Dark)</h4>
                  <p>Current theme: <strong>{theme === 'dark' ? '🌙 High-Contrast Dark Theme' : '☀️ Eye-Comfort Warm Light Theme'}</strong>.</p>
                </div>
                <button
                  type="button"
                  className="btn-theme-switch-large"
                  onClick={onToggleTheme}
                >
                  {theme === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
                </button>
              </div>

              {/* Text Scaler for Elder Accessibility */}
              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>Elder Accessibility Text Scale</h4>
                  <p>Scale fonts across the caregiver dashboard for maximum optical comfort.</p>
                </div>
                <div className="btn-group-toggle">
                  <button
                    type="button"
                    className={`btn-toggle-option ${fontSize === 'normal' ? 'active' : ''}`}
                    onClick={() => setFontSize('normal')}
                  >
                    100% Standard
                  </button>
                  <button
                    type="button"
                    className={`btn-toggle-option ${fontSize === 'large' ? 'active' : ''}`}
                    onClick={() => setFontSize('large')}
                  >
                    120% Large
                  </button>
                  <button
                    type="button"
                    className={`btn-toggle-option ${fontSize === 'xlarge' ? 'active' : ''}`}
                    onClick={() => setFontSize('xlarge')}
                  >
                    140% Senior
                  </button>
                </div>
              </div>

              {/* Contrast Mode */}
              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>High Contrast Mode</h4>
                  <p>Enhance border weights and color separation for clinical environments.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                  />
                  <span className="toggle-track">
                    <span className="toggle-thumb" />
                  </span>
                </label>
              </div>

              {/* Color Accents */}
              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>Accent Color Branding</h4>
                  <p>Primary theme accent for buttons and telemetry highlights.</p>
                </div>
                <div className="accent-pickers">
                  <button
                    type="button"
                    className={`accent-dot terracotta ${accentColor === 'terracotta' ? 'selected' : ''}`}
                    onClick={() => setAccentColor('terracotta')}
                    title="Assam Terracotta (#b83a24)"
                  />
                  <button
                    type="button"
                    className={`accent-dot indigo ${accentColor === 'indigo' ? 'selected' : ''}`}
                    onClick={() => setAccentColor('indigo')}
                    title="Modern Indigo (#6366f1)"
                  />
                  <button
                    type="button"
                    className={`accent-dot emerald ${accentColor === 'emerald' ? 'selected' : ''}`}
                    onClick={() => setAccentColor('emerald')}
                    title="Clinical Emerald (#10b981)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              SECTION 2: SECURITY & CAREGIVER PIN
              ────────────────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div className="settings-card">
              <div className="settings-section-head">
                <h3 className="section-title">🔒 Caregiver Security PIN Protection</h3>
                <p className="section-sub">Require a 4-digit PIN code whenever entering the Caregiver Management Portal.</p>
              </div>

              <div className="security-status-banner">
                <div className="sec-banner-icon">{currentPin ? '🛡️' : '🔓'}</div>
                <div>
                  <strong>{currentPin ? 'Caregiver Console is PIN Protected' : 'PIN Lock Currently Disabled'}</strong>
                  <p>{currentPin ? 'Superusers must enter the 4-digit code to access routines and diagnostics.' : 'Anyone selecting the Caregiver role has immediate direct access.'}</p>
                </div>
              </div>

              {pinMsg && <div className="pin-alert-feedback">{pinMsg}</div>}

              <form className="pin-setup-form" onSubmit={handleSetPin}>
                <label className="form-label">Set 4-Digit Security PIN</label>
                <div className="pin-input-row">
                  <input
                    type="password"
                    maxLength={4}
                    className="pin-box-input"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="••••"
                  />
                  <button type="submit" className="btn-set-pin" disabled={pinInput.length !== 4}>
                    💾 Save PIN
                  </button>
                  {currentPin && (
                    <button type="button" className="btn-remove-pin" onClick={handleRemovePin}>
                      ✕ Remove PIN
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              SECTION 3: CLINICAL AUDIT LOG & ACTIVITY TRAIL
              ────────────────────────────────────────────────────────── */}
          {activeTab === 'audit' && (
            <div className="settings-card">
              <div className="settings-section-head">
                <div className="audit-header-split">
                  <div>
                    <h3 className="section-title">📜 Clinical Audit Log &amp; Activity Trail</h3>
                    <p className="section-sub">Immutable, timestamped record of all caregiver, ASHA worker, and AI diagnostic events.</p>
                  </div>
                  <button type="button" className="btn-export-audit" onClick={handleExportBackup}>
                    📥 Export Audit Trail
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="audit-filter-row">
                <button
                  type="button"
                  className={`audit-filter-btn ${auditFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setAuditFilter('all')}
                >
                  All Events ({auditLogs.length})
                </button>
                <button
                  type="button"
                  className={`audit-filter-btn ${auditFilter === 'meds' ? 'active' : ''}`}
                  onClick={() => setAuditFilter('meds')}
                >
                  💊 Pillbox &amp; Meds
                </button>
                <button
                  type="button"
                  className={`audit-filter-btn ${auditFilter === 'clinical' ? 'active' : ''}`}
                  onClick={() => setAuditFilter('clinical')}
                >
                  🧠 Clinical MMSE
                </button>
                <button
                  type="button"
                  className={`audit-filter-btn ${auditFilter === 'ai' ? 'active' : ''}`}
                  onClick={() => setAuditFilter('ai')}
                >
                  🤖 AI Advisories
                </button>
              </div>

              {/* Audit Log Timeline */}
              <div className="audit-timeline-list">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="audit-item-row">
                    <div className="audit-item-left">
                      <span className={`audit-badge badge-${log.type}`}>
                        {log.badge}
                      </span>
                      <div className="audit-details">
                        <span className="audit-action">{log.action}</span>
                        <span className="audit-actor">Actor: <strong>{log.actor}</strong></span>
                      </div>
                    </div>
                    <span className="audit-time">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              SECTION 4: NOTIFICATIONS & SOUND SETTINGS
              ────────────────────────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div className="settings-card">
              <div className="settings-section-head">
                <h3 className="section-title">🔔 Alerts, Push Notifications &amp; Sounds</h3>
                <p className="section-sub">Configure real-time caregiver alerts for medication adherence and sundowning windows.</p>
              </div>

              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>Medication Pillbox Due Alerts</h4>
                  <p>Send chime alert when patient has not opened morning or evening dose within 30 minutes.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifMeds}
                    onChange={(e) => setNotifMeds(e.target.checked)}
                  />
                  <span className="toggle-track"><span className="toggle-thumb" /></span>
                </label>
              </div>

              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>Evening Sundowning Window Warning</h4>
                  <p>Proactive prompt at 05:00 PM recommending dimming lights and activating soothing flute music.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifSundowning}
                    onChange={(e) => setNotifSundowning(e.target.checked)}
                  />
                  <span className="toggle-track"><span className="toggle-thumb" /></span>
                </label>
              </div>

              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>Safe-Zone Geofence Perimeter Alert</h4>
                  <p>Immediate push alert if GPS radar detects patient moving outside home boundaries.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifWandering}
                    onChange={(e) => setNotifWandering(e.target.checked)}
                  />
                  <span className="toggle-track"><span className="toggle-thumb" /></span>
                </label>
              </div>

              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>Assamese Flute Ambiance Volume ({fluteVolume}%)</h4>
                  <p>Default playback volume for the calming sundowning music generator.</p>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fluteVolume}
                  onChange={(e) => setFluteVolume(Number(e.target.value))}
                  style={{ width: '160px', accentColor: '#b83a24' }}
                />
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              SECTION 5: DATA, BACKUP & SUPABASE SYNC
              ────────────────────────────────────────────────────────── */}
          {activeTab === 'data' && (
            <div className="settings-card">
              <div className="settings-section-head">
                <h3 className="section-title">📶 Offline Storage &amp; Supabase Cloud Sync</h3>
                <p className="section-sub">Monitor PWA offline cache quotas and cloud synchronization status.</p>
              </div>

              <div className="sync-status-card">
                <div className="sync-dot-live" />
                <div className="sync-details">
                  <strong>Supabase Cloud Connectivity: Ready</strong>
                  <p>Local state is cached offline. Prepared for real-time cloud synchronisation with PostgreSQL / Supabase.</p>
                </div>
              </div>

              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>Export Full Patient Care Backup</h4>
                  <p>Download all cognitive logs, medication schedules, and caregiver records as JSON.</p>
                </div>
                <button type="button" className="btn-export-backup" onClick={handleExportBackup}>
                  💾 Download Backup (.json)
                </button>
              </div>

              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>Local Storage Cache Status</h4>
                  <p>Active device cache holding 30-day telemetry, games prescriber, and voice memos.</p>
                </div>
                <span className="cache-pill">100% Offline-Capable</span>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              SECTION 6: CAREGIVER SESSION & SWITCH ROLE
              ────────────────────────────────────────────────────────── */}
          {activeTab === 'account' && (
            <div className="settings-card">
              <div className="settings-section-head">
                <h3 className="section-title">👤 Caregiver Session &amp; Role Management</h3>
                <p className="section-sub">Manage active caregiver session, switch between Patient and Caregiver modes, or sign out.</p>
              </div>

              <div className="active-user-card">
                <span className="user-avatar-circle">👨</span>
                <div className="user-details">
                  <h4>{currentCaregiver.name}</h4>
                  <p>{currentCaregiver.role} &bull; {currentCaregiver.email}</p>
                </div>
              </div>

              <div className="setting-row-box">
                <div className="setting-info">
                  <h4>Switch to Patient Interactive View</h4>
                  <p>Exit the administrative console and launch grandmother's tactile games and reminder companion.</p>
                </div>
                <button type="button" className="btn-switch-primary" onClick={onChangeRole}>
                  ↪ Switch to Patient
                </button>
              </div>

              <div className="setting-row-box" style={{ borderColor: '#fee2e2' }}>
                <div className="setting-info">
                  <h4 style={{ color: '#dc2626' }}>Sign Out Caregiver Account</h4>
                  <p>Terminate current caregiver session and return to the Caregiver Login &amp; Register screen.</p>
                </div>
                <button type="button" className="btn-signout-danger" onClick={onLogout}>
                  🚪 Sign Out Caregiver
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  )
}
