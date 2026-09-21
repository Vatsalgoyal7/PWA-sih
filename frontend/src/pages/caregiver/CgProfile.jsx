// ============================================================
// CgProfile.jsx — Caregiver Profile, Security & Account Settings
// (Instagram & Snapchat Inspired Account Console)
// ============================================================
import React, { useState } from 'react'
import { lsGet, lsSet, LS, PROFILE_DEFAULT, CONTACTS_DEFAULT } from './CgShared'
import './CgProfile.css'

export default function CgProfile({ onChangeRole }) {
  const [activeSubTab, setActiveSubTab] = useState('profile') // 'profile' | 'security' | 'contacts' | 'account'

  // Profile State
  const [profile, setProfile] = useState(() => lsGet(LS.PROFILE, PROFILE_DEFAULT))
  const [profileSaved, setProfileSaved] = useState(false)

  // Contacts State
  const [contacts, setContacts] = useState(() => lsGet(LS.CONTACTS, CONTACTS_DEFAULT))
  const [contactsSaved, setContactsSaved] = useState(false)

  // Security / PIN State
  const [currentPin, setCurrentPin] = useState(() => lsGet(LS.PIN, ''))
  const [pinInput, setPinInput] = useState('')
  const [pinMsg, setPinMsg] = useState('')

  const handleSaveProfile = (e) => {
    e.preventDefault()
    lsSet(LS.PROFILE, profile)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2200)
  }

  const handleSaveContacts = (e) => {
    e.preventDefault()
    lsSet(LS.CONTACTS, contacts)
    setContactsSaved(true)
    setTimeout(() => setContactsSaved(false), 2200)
  }

  const handleContactChange = (index, field, value) => {
    const updated = [...contacts]
    updated[index] = { ...updated[index], [field]: value }
    setContacts(updated)
  }

  const handleSetPin = () => {
    if (pinInput.length !== 4 || isNaN(pinInput)) {
      setPinMsg('⚠️ PIN must be exactly 4 digits.')
      return
    }
    lsSet(LS.PIN, pinInput)
    setCurrentPin(pinInput)
    setPinInput('')
    setPinMsg('✅ 4-Digit Security PIN saved successfully!')
    setTimeout(() => setPinMsg(''), 2500)
  }

  const handleRemovePin = () => {
    lsSet(LS.PIN, '')
    setCurrentPin('')
    setPinMsg('🔓 Security PIN removed. Direct access enabled.')
    setTimeout(() => setPinMsg(''), 2500)
  }

  return (
    <div className="cgdash-view">
      {/* ── 1. Instagram/Snapchat Inspired Profile Header ── */}
      <div className="cg-profile-header-card">
        <div className="profile-hero-top">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-circle">
              <span>👤</span>
            </div>
            <span className="profile-online-dot" title="Authenticated Caregiver" />
          </div>

          <div className="profile-hero-info">
            <div className="profile-name-row">
              <h1 className="profile-name">{profile.name || 'Meena Sharma'}</h1>
              <span className="profile-verified-badge" title="Superuser Privileges">✓ Superuser</span>
            </div>
            <p className="profile-handle">Caregiver Administration Desk &bull; SmritiSetu PWA</p>
            <div className="profile-chips-row">
              <span className="profile-stat-chip">👵 Age: {profile.age || 70} yrs</span>
              <span className="profile-stat-chip">🧠 Stage: {profile.stage || 'Early'}</span>
              <span className={`profile-stat-chip ${currentPin ? 'chip-green' : 'chip-amber'}`}>
                {currentPin ? '🔒 PIN Active' : '🔓 No PIN'}
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. Settings Nav Pills (Snapchat/Instagram Style) ── */}
        <div className="profile-subtabs">
          <button
            type="button"
            className={`subtab-btn ${activeSubTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('profile')}
          >
            <span>👤</span>
            <span>Profile Details</span>
          </button>
          <button
            type="button"
            className={`subtab-btn ${activeSubTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('security')}
          >
            <span>🔒</span>
            <span>PIN &amp; Security</span>
          </button>
          <button
            type="button"
            className={`subtab-btn ${activeSubTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('contacts')}
          >
            <span>🚨</span>
            <span>Emergency SOS</span>
          </button>
          <button
            type="button"
            className={`subtab-btn ${activeSubTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('account')}
          >
            <span>🚪</span>
            <span>Log Out / Switch</span>
          </button>
        </div>
      </div>

      {/* ── 3. Content Sections ── */}

      {/* SECTION 1: Profile Details Form */}
      {activeSubTab === 'profile' && (
        <form className="profile-form-card" onSubmit={handleSaveProfile}>
          <div className="section-title-wrap">
            <h3 className="section-title">Patient Demographics &amp; Care Record</h3>
            <p className="section-sub">Update patient details for AI baseline personalization and caregiver logs.</p>
          </div>

          <div className="form-group">
            <label>Patient Full Name</label>
            <input
              type="text"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g. Meena Sharma"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Age (Years)</label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                placeholder="Years"
              />
            </div>
            <div className="form-group half">
              <label>Cognitive Impairment Stage</label>
              <select
                value={profile.stage || 'early'}
                onChange={(e) => setProfile({ ...profile, stage: e.target.value })}
              >
                <option value="early">Early Stage MCI</option>
                <option value="moderate">Moderate Impairment</option>
                <option value="advanced">Advanced Dementia</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Supervising Neurologist / Geriatrician</label>
            <input
              type="text"
              value={profile.doctor_name || ''}
              onChange={(e) => setProfile({ ...profile, doctor_name: e.target.value })}
              placeholder="Dr. Rajesh Baruah, MD Neuro"
            />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="btn-save-primary">
              {profileSaved ? '✓ Profile Saved Successfully!' : '💾 Save Profile Details'}
            </button>
          </div>
        </form>
      )}

      {/* SECTION 2: Security & PIN */}
      {activeSubTab === 'security' && (
        <div className="profile-form-card">
          <div className="section-title-wrap">
            <h3 className="section-title">Caregiver Access PIN Security</h3>
            <p className="section-sub">
              Lock down caregiver medication schedules and game prescriptions with a 4-digit PIN to prevent accidental patient changes.
            </p>
          </div>

          <div className={`pin-status-banner ${currentPin ? 'pin-status--locked' : 'pin-status--unlocked'}`}>
            <div className="pin-status-icon">{currentPin ? '🛡️' : '⚠️'}</div>
            <div>
              <strong>{currentPin ? 'Caregiver Console PIN Protected' : 'Direct Access (No PIN Protection)'}</strong>
              <p>{currentPin ? 'PIN is required every time the Caregiver Portal is opened.' : 'Anyone can switch roles without entering a PIN.'}</p>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label>{currentPin ? 'Update 4-Digit PIN' : 'Create 4-Digit Security PIN'}</label>
            <input
              type="password"
              maxLength="4"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="pin-text-input"
            />
          </div>

          {pinMsg && <p className="pin-msg-alert">{pinMsg}</p>}

          <div className="pin-btn-row">
            <button type="button" className="btn-save-primary" onClick={handleSetPin} disabled={pinInput.length !== 4}>
              {currentPin ? 'Update PIN' : 'Enable 4-Digit PIN'}
            </button>
            {currentPin && (
              <button type="button" className="btn-danger-outline" onClick={handleRemovePin}>
                Disable PIN Protection
              </button>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: Emergency Contacts */}
      {activeSubTab === 'contacts' && (
        <form className="profile-form-card" onSubmit={handleSaveContacts}>
          <div className="section-title-wrap">
            <h3 className="section-title">Emergency SOS Quick Dial Directory</h3>
            <p className="section-sub">
              One-tap direct calling for caregivers and clinicians during emergencies or acute sundowning episodes.
            </p>
          </div>

          <div className="contacts-list">
            {contacts.map((contact, idx) => (
              <div key={contact.id || idx} className="contact-item-row">
                <div className="contact-icon">
                  {contact.type === 'doctor' ? '🩺' : contact.type === 'emergency' ? '🚨' : '👨‍👩‍👧'}
                </div>
                <div className="contact-inputs">
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => handleContactChange(idx, 'name', e.target.value)}
                    placeholder="Contact Name"
                    disabled={contact.type === 'emergency'}
                  />
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => handleContactChange(idx, 'phone', e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="btn-call-direct" title={`Call ${contact.name}`}>
                    📞
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="form-actions-row" style={{ marginTop: '16px' }}>
            <button type="submit" className="btn-save-primary">
              {contactsSaved ? '✓ SOS Directory Saved!' : '💾 Save Emergency Contacts'}
            </button>
          </div>
        </form>
      )}

      {/* SECTION 4: Instagram/Snapchat Style Account Actions & Logout */}
      {activeSubTab === 'account' && (
        <div className="profile-form-card">
          <div className="section-title-wrap">
            <h3 className="section-title">Session &amp; Role Management</h3>
            <p className="section-sub">Switch between Patient Interactive Mode and Caregiver Administrative Mode.</p>
          </div>

          <div className="account-action-card">
            <div className="account-action-info">
              <h4>Switch to Patient View</h4>
              <p>Exit administrative console and return to grandmother's tactile games and reminder companion.</p>
            </div>
            <button type="button" className="btn-switch-primary" onClick={onChangeRole}>
              ↪ Switch to Patient
            </button>
          </div>

          <div className="account-action-card" style={{ borderColor: '#fee2e2' }}>
            <div className="account-action-info">
              <h4 style={{ color: '#b83a24' }}>Log Out &amp; Clear Active Role</h4>
              <p>Clear current device role session and return to the main Role Selection welcome screen.</p>
            </div>
            <button type="button" className="btn-danger-outline" onClick={onChangeRole}>
              🚪 Log Out / Change Role
            </button>
          </div>

          <div className="account-footer-meta">
            <span>SmritiSetu Progressive Web App</span>
            <span>Build: SIH 2026 Enterprise Release</span>
          </div>
        </div>
      )}
    </div>
  )
}
