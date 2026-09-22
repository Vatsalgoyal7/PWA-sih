// ============================================================
// CgProfile.jsx — Dedicated Dual-Profile Console
// 1. Patient Profile (Medical history, emergency contacts)
// 2. Caregiver Team & ASHA Network (Multi-caregiver management)
// ============================================================
import React, { useState, useRef } from 'react'
import {
  lsGet, lsSet, LS, PROFILE_DEFAULT, CONTACTS_DEFAULT, CAREGIVERS_DEFAULT
} from './CgShared'
import './CgProfile.css'

export default function CgProfile() {
  const [activeTab, setActiveTab] = useState('patient') // 'patient' | 'caregivers'

  // Patient Profile State
  const [profile, setProfile] = useState(() => lsGet(LS.PROFILE, PROFILE_DEFAULT))
  const [profileSaved, setProfileSaved] = useState(false)
  const fileInputRef = useRef(null)

  // Emergency Contacts
  const [contacts, setContacts] = useState(() => lsGet(LS.CONTACTS, CONTACTS_DEFAULT))
  const [contactsSaved, setContactsSaved] = useState(false)

  // Caregivers Team State (Multiple caregivers assigned to 1 patient)
  const [caregivers, setCaregivers] = useState(() => lsGet(LS.CAREGIVERS, CAREGIVERS_DEFAULT))
  const [showAddCaregiver, setShowAddCaregiver] = useState(false)
  const [newCgName, setNewCgName] = useState('')
  const [newCgRole, setNewCgRole] = useState('')
  const [newCgCategory, setNewCgCategory] = useState('family') // 'family' | 'asha' | 'nurse' | 'doctor'
  const [newCgPhone, setNewCgPhone] = useState('')
  const [newCgEmail, setNewCgEmail] = useState('')
  const [newCgHealthCenter, setNewCgHealthCenter] = useState('')
  const [newCgAccess, setNewCgAccess] = useState('Full Administrative Access')

  // Photo handlers
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const b64 = event.target.result
      const updated = { ...profile, photo_b64: b64 }
      setProfile(updated)
      lsSet(LS.PROFILE, updated)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2200)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    const updated = { ...profile, photo_b64: null }
    setProfile(updated)
    lsSet(LS.PROFILE, updated)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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

  // Caregiver Team handlers
  const handleAddCaregiver = (e) => {
    e.preventDefault()
    if (!newCgName.trim() || !newCgPhone.trim()) return

    const emojiMap = {
      family: '👨',
      asha: '👩‍⚕️',
      nurse: '👨‍⚕️',
      doctor: '🩺'
    }

    const newCaregiver = {
      id: `cg_${Date.now()}`,
      name: newCgName.trim(),
      role: newCgRole.trim() || (newCgCategory === 'asha' ? 'ASHA Community Worker' : 'Family Member'),
      category: newCgCategory,
      phone: newCgPhone.trim(),
      email: newCgEmail.trim(),
      healthCenter: newCgHealthCenter.trim(),
      accessLevel: newCgAccess,
      active: true,
      addedDate: new Date().toISOString().slice(0, 10),
      avatar: emojiMap[newCgCategory] || '👤'
    }

    const updatedTeam = [...caregivers, newCaregiver]
    setCaregivers(updatedTeam)
    lsSet(LS.CAREGIVERS, updatedTeam)

    // Reset Form
    setNewCgName('')
    setNewCgRole('')
    setNewCgPhone('')
    setNewCgEmail('')
    setNewCgHealthCenter('')
    setShowAddCaregiver(false)
  }

  const handleToggleCaregiverStatus = (id) => {
    const updated = caregivers.map(cg => cg.id === id ? { ...cg, active: !cg.active } : cg)
    setCaregivers(updated)
    lsSet(LS.CAREGIVERS, updated)
  }

  const handleRemoveCaregiver = (id) => {
    if (confirm('Are you sure you want to unassign this caregiver?')) {
      const updated = caregivers.filter(cg => cg.id !== id)
      setCaregivers(updated)
      lsSet(LS.CAREGIVERS, updated)
    }
  }

  return (
    <div className="cgdash-view">
      
      {/* ── Top Dual-Profile Switcher Banner ── */}
      <div className="cg-profile-header-card">
        <div className="profile-hero-top">
          <div
            className="profile-avatar-wrap"
            onClick={() => fileInputRef.current?.click()}
            title="Click to update photo"
          >
            {profile.photo_b64 ? (
              <img src={profile.photo_b64} alt={profile.name} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-circle">
                <span>{activeTab === 'patient' ? '👵' : '👥'}</span>
              </div>
            )}
            <span className="profile-photo-badge">📷</span>
            <span className="profile-online-dot" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />

          <div className="profile-hero-info">
            <div className="profile-name-row">
              <h1 className="profile-name">{profile.name || 'Meena Sharma'}</h1>
              <span className="profile-verified-badge">✓ Active Monitoring</span>
            </div>
            <p className="profile-handle">
              {activeTab === 'patient'
                ? 'Clinical Health Record & Emergency Directory'
                : 'Assigned Caregivers, ASHA Workers & Healthcare Team'}
            </p>
            <div className="profile-chips-row">
              <span className="profile-stat-chip">👵 Age: {profile.age || 72}</span>
              <span className="profile-stat-chip">🩸 Blood: {profile.blood_group || 'B+'}</span>
              <span className="profile-stat-chip chip-blue">👥 {caregivers.length} Assigned Caregivers</span>
              {profile.photo_b64 && (
                <button type="button" className="profile-remove-photo-btn" onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}>
                  ✕ Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Two Primary Tabs: Patient Profile vs Caregivers Team ── */}
        <div className="profile-subtabs">
          <button
            type="button"
            className={`subtab-btn ${activeTab === 'patient' ? 'active' : ''}`}
            onClick={() => setActiveTab('patient')}
          >
            <span>👵</span>
            <span>Patient Profile &amp; Medical Record</span>
          </button>
          <button
            type="button"
            className={`subtab-btn ${activeTab === 'caregivers' ? 'active' : ''}`}
            onClick={() => setActiveTab('caregivers')}
          >
            <span>👥</span>
            <span>Caregivers Team &amp; ASHA Network ({caregivers.length})</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          TAB 1: PATIENT PROFILE & EMERGENCY DIRECTORY
          ────────────────────────────────────────────────────────── */}
      {activeTab === 'patient' && (
        <>
          <form className="profile-form-card" onSubmit={handleSaveProfile}>
            <div className="section-title-wrap">
              <h3 className="section-title">Clinical Demographics &amp; Health Identification</h3>
              <p className="section-sub">Standardized clinical identity synchronized with Assam Health Mission / ABHA ID.</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Patient Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Meena Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">ABHA Health ID / National Health Record</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.health_id || 'ABHA-AS-2026-8891'}
                  onChange={(e) => setProfile({ ...profile, health_id: e.target.value })}
                  placeholder="ABHA-XX-XXXX-XXXX"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Age (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  min="40"
                  max="120"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-input form-select"
                  value={profile.gender || 'Female'}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-input form-select"
                  value={profile.blood_group || 'B+'}
                  onChange={(e) => setProfile({ ...profile, blood_group: e.target.value })}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cognitive Dementia Staging</label>
                <select
                  className="form-input form-select"
                  value={profile.stage}
                  onChange={(e) => setProfile({ ...profile, stage: e.target.value })}
                >
                  <option value="early">Stage 1: Early Stage MCI (Mild Cognitive Impairment)</option>
                  <option value="moderate">Stage 2: Moderate Cognitive Decline</option>
                  <option value="advanced">Stage 3: Advanced Full Assistance Required</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Known Allergies &amp; Precautions</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.allergies || 'Penicillin, Dust'}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Lactose, Peanuts"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Primary Attending Doctor</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.doctor_name}
                  onChange={(e) => setProfile({ ...profile, doctor_name: e.target.value })}
                  placeholder="e.g. Dr. Bhupen Hazarika (Neurology)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Doctor Emergency Hotline</label>
                <input
                  type="tel"
                  className="form-input"
                  value={profile.doctor_phone}
                  onChange={(e) => setProfile({ ...profile, doctor_phone: e.target.value })}
                  placeholder="+91 94350 99887"
                />
              </div>
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn-save-primary">
                {profileSaved ? '✓ Patient Record Saved!' : '💾 Save Patient Clinical Profile'}
              </button>
            </div>
          </form>

          {/* Emergency SOS Directory */}
          <form className="profile-form-card" onSubmit={handleSaveContacts}>
            <div className="section-title-wrap">
              <h3 className="section-title">Emergency SOS Directory (1-Tap Dispatch)</h3>
              <p className="section-sub">Configured emergency speed-dial numbers accessible during wandering or acute sundowning crises.</p>
            </div>

            <div className="contacts-grid">
              {contacts.map((contact, idx) => (
                <div key={contact.id || idx} className="contact-card">
                  <div className="contact-card-top">
                    <span className="contact-type-badge">
                      {contact.type === 'doctor' && '🩺 Physician'}
                      {contact.type === 'family' && '👨‍👩‍👧 Family'}
                      {contact.type === 'asha' && '👩‍⚕️ ASHA Worker'}
                      {contact.type === 'emergency' && '🚨 Ambulance'}
                    </span>
                    <span className="contact-num-badge">#{idx + 1}</span>
                  </div>

                  <div className="contact-fields">
                    <input
                      type="text"
                      className="form-input"
                      value={contact.name}
                      onChange={(e) => handleContactChange(idx, 'name', e.target.value)}
                      placeholder="Contact name"
                    />
                    <input
                      type="tel"
                      className="form-input"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(idx, 'phone', e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>

                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} className="btn-call-direct" title={`Call ${contact.name}`}>
                      📞 Call Now
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions-row" style={{ marginTop: '16px' }}>
              <button type="submit" className="btn-save-primary">
                {contactsSaved ? '✓ SOS Directory Saved!' : '💾 Save Emergency SOS Directory'}
              </button>
            </div>
          </form>
        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 2: CAREGIVER TEAM & ASSIGNED ASHA WORKERS
          ────────────────────────────────────────────────────────── */}
      {activeTab === 'caregivers' && (
        <div className="profile-form-card">
          <div className="caregivers-header-row">
            <div>
              <h3 className="section-title">Assigned Caregivers &amp; Healthcare Network</h3>
              <p className="section-sub">
                Multiple family members, ASHA workers, and healthcare attendants can be assigned to coordinate care for <strong>{profile.name}</strong>.
              </p>
            </div>
            <button
              type="button"
              className="btn-add-caregiver"
              onClick={() => setShowAddCaregiver(!showAddCaregiver)}
            >
              {showAddCaregiver ? '✕ Cancel' : '➕ Assign New Caregiver / ASHA'}
            </button>
          </div>

          {/* Add New Caregiver Form Modal / Section */}
          {showAddCaregiver && (
            <form className="add-caregiver-card" onSubmit={handleAddCaregiver}>
              <h4 className="add-caregiver-title">➕ Assign New Care Team Member</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ananya Baruah"
                    value={newCgName}
                    onChange={(e) => setNewCgName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Caregiver Category *</label>
                  <select
                    className="form-input form-select"
                    value={newCgCategory}
                    onChange={(e) => setNewCgCategory(e.target.value)}
                  >
                    <option value="family">Family Member (Son, Daughter, Spouse)</option>
                    <option value="asha">ASHA Community Health Worker (Govt)</option>
                    <option value="nurse">Home Care Attendant / Private Nurse</option>
                    <option value="doctor">Visiting Physician / Specialist</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Specific Role / Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Primary Caregiver or Ward 4 ASHA Worker"
                    value={newCgRole}
                    onChange={(e) => setNewCgRole(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={newCgPhone}
                    onChange={(e) => setNewCgPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email (Optional)</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="caregiver@email.com"
                    value={newCgEmail}
                    onChange={(e) => setNewCgEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Health Center / Affiliation (if ASHA/Nurse)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Guwahati Urban Health Post"
                    value={newCgHealthCenter}
                    onChange={(e) => setNewCgHealthCenter(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Console Access Privileges</label>
                <select
                  className="form-input form-select"
                  value={newCgAccess}
                  onChange={(e) => setNewCgAccess(e.target.value)}
                >
                  <option value="Full Administrative Access">Full Superuser (Games, Alarms, MMSE &amp; PIN)</option>
                  <option value="Vitals & Routine Monitoring">Clinical Only (Vitals, MMSE &amp; Handover Notes)</option>
                  <option value="View Only">Read Only (Observer Mode)</option>
                </select>
              </div>

              <div className="form-actions-row">
                <button type="submit" className="btn-save-primary">
                  ✓ Confirm &amp; Assign to Care Team
                </button>
              </div>
            </form>
          )}

          {/* Assigned Caregivers List */}
          <div className="caregiver-cards-list">
            {caregivers.map((cg) => (
              <div key={cg.id} className={`caregiver-card ${cg.active ? 'active' : 'inactive'}`}>
                <div className="cg-card-left">
                  <div className="cg-avatar-box">
                    <span>{cg.avatar || '👤'}</span>
                    <span className={`cg-status-dot ${cg.active ? 'online' : 'offline'}`} />
                  </div>

                  <div className="cg-card-info">
                    <div className="cg-card-name-row">
                      <h4 className="cg-card-name">{cg.name}</h4>
                      <span className={`cg-category-tag tag-${cg.category}`}>
                        {cg.category === 'family' && 'Family Admin'}
                        {cg.category === 'asha' && 'ASHA Worker'}
                        {cg.category === 'nurse' && 'Nurse / Aide'}
                        {cg.category === 'doctor' && 'Clinician'}
                      </span>
                    </div>

                    <p className="cg-card-role">{cg.role}</p>

                    <div className="cg-card-meta-row">
                      <span>📞 {cg.phone}</span>
                      {cg.healthCenter && <span>🏥 {cg.healthCenter}</span>}
                      {cg.shift && <span>⏰ {cg.shift}</span>}
                      <span className="cg-access-badge">🔑 {cg.accessLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="cg-card-actions">
                  <button
                    type="button"
                    className={`btn-cg-toggle ${cg.active ? 'btn-deactivate' : 'btn-activate'}`}
                    onClick={() => handleToggleCaregiverStatus(cg.id)}
                    title={cg.active ? 'Deactivate access' : 'Activate access'}
                  >
                    {cg.active ? 'Active' : 'Disabled'}
                  </button>
                  <button
                    type="button"
                    className="btn-cg-delete"
                    onClick={() => handleRemoveCaregiver(cg.id)}
                    title="Remove Caregiver"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Co-Caregiver Handover Advisory */}
          <div className="care-team-advisory">
            <div className="advisory-icon">💡</div>
            <div className="advisory-text">
              <strong>Collaborative Dementia Care:</strong>
              <p>
                When multiple caregivers are assigned, all daily logs (Medication Pillbox, Cognitive MMSE scores, and Sundowning alerts) sync seamlessly across their connected devices.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
