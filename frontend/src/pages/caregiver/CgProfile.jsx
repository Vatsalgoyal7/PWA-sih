// ============================================================
// CgProfile.jsx — Patient Profile, Emergency Contacts, PIN Security
// ============================================================
import React, { useState } from 'react'
import { lsGet, lsSet, LS, PROFILE_DEFAULT, CONTACTS_DEFAULT } from './CgShared'
import './CgProfile.css'

export default function CgProfile({ onChangeRole }) {
  const [activeSubTab, setActiveSubTab] = useState('profile') // 'profile' | 'contacts' | 'security'

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
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const handleSaveContacts = (e) => {
    e.preventDefault()
    lsSet(LS.CONTACTS, contacts)
    setContactsSaved(true)
    setTimeout(() => setContactsSaved(false), 2000)
  }

  const handleContactChange = (index, field, value) => {
    const updated = [...contacts]
    updated[index] = { ...updated[index], [field]: value }
    setContacts(updated)
  }

  const handleSetPin = () => {
    if (pinInput.length !== 4 || isNaN(pinInput)) {
      setPinMsg('PIN must be exactly 4 digits.')
      return
    }
    lsSet(LS.PIN, pinInput)
    setCurrentPin(pinInput)
    setPinInput('')
    setPinMsg('PIN set successfully!')
    setTimeout(() => setPinMsg(''), 2500)
  }

  const handleRemovePin = () => {
    lsSet(LS.PIN, '')
    setCurrentPin('')
    setPinMsg('PIN removed.')
    setTimeout(() => setPinMsg(''), 2500)
  }

  return (
    <div className="cgdash-view">
      {/* Hero Banner */}
      <div className="cg-hero-banner">
        <div className="cg-hero-tag">
          <span>👤</span>
          <span>Security &amp; Administrative Setup</span>
        </div>
        <h1 className="cg-hero-title">Patient Profile <span>&amp; Care Security</span></h1>
        <p className="cg-hero-sub">Manage elder demographics, configure emergency contacts, and set up 4-digit PIN security.</p>

        {/* Sub Tabs */}
        <div className="profile-subtabs">
          <button
            type="button"
            className={`subtab-btn ${activeSubTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('profile')}
          >
            👤 Patient Profile
          </button>
          <button
            type="button"
            className={`subtab-btn ${activeSubTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('contacts')}
          >
            ☎️ Emergency SOS
          </button>
          <button
            type="button"
            className={`subtab-btn ${activeSubTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('security')}
          >
            🔒 PIN Lock Security
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Profile */}
      {activeSubTab === 'profile' && (
        <form className="profile-form-card" onSubmit={handleSaveProfile}>
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
              <label>Age</label>
              <input
                type="number"
                value={profile.age || ''}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                placeholder="Years"
              />
            </div>
            <div className="form-group half">
              <label>Care Stage</label>
              <select
                value={profile.stage || 'early'}
                onChange={(e) => setProfile({ ...profile, stage: e.target.value })}
              >
                <option value="early">Early Stage</option>
                <option value="moderate">Moderate Stage</option>
                <option value="advanced">Advanced Stage</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Supervising Doctor / Neurologist</label>
            <input
              type="text"
              value={profile.doctor_name || ''}
              onChange={(e) => setProfile({ ...profile, doctor_name: e.target.value })}
              placeholder="Dr. Name"
            />
          </div>

          <button type="submit" className="btn-save-primary">
            {profileSaved ? '✓ Profile Saved' : 'Save Profile'}
          </button>
        </form>
      )}

      {/* SUBTAB 2: Emergency Contacts */}
      {activeSubTab === 'contacts' && (
        <form className="profile-form-card" onSubmit={handleSaveContacts}>
          <p className="contact-helper-text">
            Quick-dial emergency team. Tap call to dial directly.
          </p>

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
                <a href={`tel:${contact.phone}`} className="btn-call-direct" aria-label="Call">
                  📞
                </a>
              )}
            </div>
          ))}

          <button type="submit" className="btn-save-primary" style={{ marginTop: '12px' }}>
            {contactsSaved ? '✓ Contacts Saved' : 'Save Contacts'}
          </button>
        </form>
      )}

      {/* SUBTAB 3: Security & PIN */}
      {activeSubTab === 'security' && (
        <div className="profile-form-card">
          <h3>Caregiver PIN Lock</h3>
          <p className="security-desc">
            Protect Caregiver controls with a 4-digit PIN so patients cannot accidentally modify medication or game settings.
          </p>

          <div className="pin-status-box">
            <span>Status:</span>
            <strong>{currentPin ? '🔒 PIN Protection Enabled' : '🔓 No PIN Set (Direct Access)'}</strong>
          </div>

          <div className="form-group" style={{ marginTop: '14px' }}>
            <label>{currentPin ? 'Change PIN (4 Digits)' : 'Set New 4-Digit PIN'}</label>
            <input
              type="password"
              maxLength="4"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="e.g. 1234"
              className="pin-text-input"
            />
          </div>

          {pinMsg && <p className="pin-msg-alert">{pinMsg}</p>}

          <div className="pin-btn-row">
            <button type="button" className="btn-save-primary" onClick={handleSetPin}>
              Save PIN
            </button>
            {currentPin && (
              <button type="button" className="btn-remove-pin" onClick={handleRemovePin}>
                Remove PIN
              </button>
            )}
          </div>
        </div>
      )}

      {/* Switch Role Button */}
      <div className="switch-role-footer">
        <button type="button" className="btn-switch-role" onClick={onChangeRole}>
          ← Switch Role to Patient
        </button>
      </div>
    </div>
  )
}
