// ============================================================
// CgAuth.jsx — Caregiver Login & Registration Portal
// Ready for Supabase Auth Integration
// ============================================================
import React, { useState } from 'react'
import { lsGet, lsSet, LS, PROFILE_DEFAULT } from './CgShared'
import './CgAuth.css'

export default function CgAuth({ onLoginSuccess, onBackToRoles }) {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  // Registration Form State
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regRelationship, setRegRelationship] = useState('Son / Daughter')
  const [regPatientName, setRegPatientName] = useState('Meena Sharma')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regError, setRegError] = useState('')

  // ── Handle Login ──
  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both email/phone and password.')
      return
    }

    setLoading(true)

    // TODO: Connect to Supabase Auth here:
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: loginEmail,
    //   password: loginPassword,
    // })
    setTimeout(() => {
      const userSession = {
        name: loginEmail.split('@')[0] || 'Caregiver',
        email: loginEmail,
        relationship: 'Family Caregiver',
        patientName: lsGet(LS.PROFILE, PROFILE_DEFAULT).name || 'Meena Sharma',
        loggedInAt: new Date().toISOString(),
      }

      if (rememberMe) {
        localStorage.setItem('setu_caregiver_session', JSON.stringify(userSession))
      }
      setLoading(false)
      onLoginSuccess(userSession)
    }, 400)
  }

  // ── Handle Quick 1-Tap Demo Login ──
  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      const demoUser = {
        name: 'Vatsal Goyal',
        email: 'caregiver@smritisetu.org',
        relationship: 'Son (Primary Caregiver)',
        patientName: 'Meena Sharma',
        isDemo: true,
        loggedInAt: new Date().toISOString(),
      }
      localStorage.setItem('setu_caregiver_session', JSON.stringify(demoUser))
      setLoading(false)
      onLoginSuccess(demoUser)
    }, 300)
  }

  // ── Handle Registration ──
  const handleRegister = (e) => {
    e.preventDefault()
    setRegError('')

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Please fill in all required fields.')
      return
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.')
      return
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.')
      return
    }

    setLoading(true)

    // TODO: Connect to Supabase Auth Registration here:
    // const { data, error } = await supabase.auth.signUp({
    //   email: regEmail,
    //   password: regPassword,
    //   options: {
    //     data: {
    //       full_name: regName,
    //       phone: regPhone,
    //       relationship: regRelationship,
    //       patient_name: regPatientName,
    //     }
    //   }
    // })
    setTimeout(() => {
      // Save updated patient name to shared profile
      if (regPatientName.trim()) {
        const currentProfile = lsGet(LS.PROFILE, PROFILE_DEFAULT)
        lsSet(LS.PROFILE, { ...currentProfile, name: regPatientName.trim() })
      }

      const newUser = {
        name: regName,
        email: regEmail,
        phone: regPhone,
        relationship: regRelationship,
        patientName: regPatientName || 'Meena Sharma',
        registeredAt: new Date().toISOString(),
      }

      localStorage.setItem('setu_caregiver_session', JSON.stringify(newUser))
      setLoading(false)
      onLoginSuccess(newUser)
    }, 450)
  }

  return (
    <div className="cg-auth-viewport">
      <div className="cg-auth-card">
        
        {/* Top Header & Branding */}
        <div className="cg-auth-header">
          <div className="cg-auth-brand-row">
            <span className="cg-auth-logo">🧠</span>
            <div className="cg-auth-brand-text">
              <span className="cg-auth-brand-title">SMRITISETU</span>
              <span className="cg-auth-portal-badge">CAREGIVER ACCESS</span>
            </div>
          </div>
          <p className="cg-auth-sub">
            Administrative supervision, memory stimulation analytics & cognitive care console.
          </p>
        </div>

        {/* Tab Switcher (Login vs Register) */}
        <div className="cg-auth-tabs">
          <button
            type="button"
            className={`cg-auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setLoginError(''); setRegError('') }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`cg-auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setLoginError(''); setRegError('') }}
          >
            Create Account
          </button>
        </div>

        {/* ── Tab 1: Login Form ── */}
        {tab === 'login' && (
          <form className="cg-auth-form" onSubmit={handleLogin}>
            {loginError && <div className="cg-auth-alert-error">⚠️ {loginError}</div>}

            <div className="cg-input-group">
              <label className="cg-input-label">Email or Mobile Number</label>
              <div className="cg-input-box">
                <span className="cg-input-icon">✉️</span>
                <input
                  type="text"
                  className="cg-input-field"
                  placeholder="caregiver@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="cg-input-group">
              <label className="cg-input-label">Password</label>
              <div className="cg-input-box">
                <span className="cg-input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="cg-input-field"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="cg-pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="cg-auth-row-options">
              <label className="cg-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Keep me signed in</span>
              </label>
              <span className="cg-forgot-link" onClick={() => alert('Password reset will be handled via Supabase Auth email link.')}>
                Forgot?
              </span>
            </div>

            <button type="submit" className="cg-btn-auth-primary" disabled={loading}>
              {loading ? 'Signing In…' : 'Sign In to Caregiver Desk →'}
            </button>

            {/* Quick Demo Login Divider */}
            <div className="cg-auth-divider">
              <span>OR TEST INSTANTLY</span>
            </div>

            <button
              type="button"
              className="cg-btn-demo"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <span>⚡</span>
              <span>1-Tap Demo Login (Meena Sharma's Caregiver)</span>
            </button>
          </form>
        )}

        {/* ── Tab 2: Register Form ── */}
        {tab === 'register' && (
          <form className="cg-auth-form" onSubmit={handleRegister}>
            {regError && <div className="cg-auth-alert-error">⚠️ {regError}</div>}

            <div className="cg-input-group">
              <label className="cg-input-label">Caregiver Full Name *</label>
              <div className="cg-input-box">
                <span className="cg-input-icon">👤</span>
                <input
                  type="text"
                  className="cg-input-field"
                  placeholder="e.g. Vatsal Goyal"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="cg-input-group">
              <label className="cg-input-label">Email Address *</label>
              <div className="cg-input-box">
                <span className="cg-input-icon">✉️</span>
                <input
                  type="email"
                  className="cg-input-field"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="cg-form-two-col">
              <div className="cg-input-group">
                <label className="cg-input-label">Phone Number</label>
                <div className="cg-input-box">
                  <span className="cg-input-icon">📱</span>
                  <input
                    type="tel"
                    className="cg-input-field"
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="cg-input-group">
                <label className="cg-input-label">Relationship *</label>
                <div className="cg-input-box">
                  <span className="cg-input-icon">🤝</span>
                  <select
                    className="cg-input-field cg-select-field"
                    value={regRelationship}
                    onChange={(e) => setRegRelationship(e.target.value)}
                  >
                    <option value="Son / Daughter">Son / Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="Family Relative">Family Relative</option>
                    <option value="Professional Nurse / Aide">Professional Nurse</option>
                    <option value="Doctor / Clinician">Doctor / Clinician</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="cg-input-group">
              <label className="cg-input-label">Patient Name (Elderly) *</label>
              <div className="cg-input-box">
                <span className="cg-input-icon">👵</span>
                <input
                  type="text"
                  className="cg-input-field"
                  placeholder="e.g. Meena Sharma"
                  value={regPatientName}
                  onChange={(e) => setRegPatientName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="cg-form-two-col">
              <div className="cg-input-group">
                <label className="cg-input-label">Create Password *</label>
                <div className="cg-input-box">
                  <span className="cg-input-icon">🔒</span>
                  <input
                    type="password"
                    className="cg-input-field"
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="cg-input-group">
                <label className="cg-input-label">Confirm Password *</label>
                <div className="cg-input-box">
                  <span className="cg-input-icon">🔒</span>
                  <input
                    type="password"
                    className="cg-input-field"
                    placeholder="Repeat"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="cg-btn-auth-primary" disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account & Enter Console →'}
            </button>
          </form>
        )}

        {/* Back to Role Selection Button */}
        <div className="cg-auth-footer">
          <button
            type="button"
            className="cg-btn-back-role"
            onClick={onBackToRoles}
          >
            ← Back to Role Select (Patient / Caregiver)
          </button>
        </div>

      </div>
    </div>
  )
}
