// ============================================================
// CgSafeZone.jsx — Safe Zone Monitor
// Home location + safe radius + simulated location log
// ============================================================
import React, { useState } from 'react'
import { lsGet, lsSet, LS } from './CgShared'
import './CgSafeZone.css'

const RADIUS_OPTIONS = [
  { label: '50m', value: 50, icon: '🏠' },
  { label: '100m', value: 100, icon: '🏘️' },
  { label: '200m', value: 200, icon: '🏙️' },
  { label: '500m', value: 500, icon: '🗺️' },
]

// Simulated location events for demo
const SIMULATED_EVENTS = [
  { id: 1, time: '08:23 AM', location: 'Home — Living Room', status: 'safe',    icon: '🏠', distance: '0m' },
  { id: 2, time: '10:11 AM', location: 'Garden — Front Yard', status: 'safe',   icon: '🌿', distance: '18m' },
  { id: 3, time: '11:45 AM', location: 'Neighborhood — Near Gate', status: 'warn', icon: '🚪', distance: '45m' },
  { id: 4, time: '02:30 PM', location: 'Home — Bedroom', status: 'safe',        icon: '🛏️', distance: '0m' },
  { id: 5, time: '05:15 PM', location: 'Home — Kitchen', status: 'safe',        icon: '🍳', distance: '0m' },
]

export default function CgSafeZone() {
  const saved = lsGet(LS.SAFEZONE, { address: '', radius: 100, enabled: false })
  const [config, setConfig] = useState(saved)
  const [saveMsg, setSaveMsg] = useState('')

  const handleSave = () => {
    lsSet(LS.SAFEZONE, config)
    setSaveMsg('✓ Safe zone settings saved!')
    setTimeout(() => setSaveMsg(''), 2500)
  }

  const currentStatus = 'safe' // would come from device GPS in production

  return (
    <div className="cgdash-view">
      {/* Hero */}
      <div className="cg-hero-banner">
        <div className="cg-hero-tag"><span>📍</span><span>Patient Location Safety</span></div>
        <h1 className="cg-hero-title">Safe Zone <span>Monitor</span></h1>
        <p className="cg-hero-sub">
          Set a safe zone around the patient's home. Get alerted if they wander beyond the boundary.
          Uses device GPS (requires PWA install and location permission).
        </p>
      </div>

      {/* Live Status Banner */}
      <div className={`safezone-status-banner ${currentStatus}`}>
        <div className="safezone-status-left">
          <div className={`safezone-pulse-dot ${currentStatus}`}/>
          <div>
            <div className="safezone-status-title">
              {currentStatus === 'safe' ? '✅ Patient is Within Safe Zone' : '🚨 Patient Outside Safe Zone!'}
            </div>
            <div className="safezone-status-sub">
              Last checked: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · Today
            </div>
          </div>
        </div>
        {currentStatus !== 'safe' && (
          <a href="tel:108" className="safezone-sos-btn">🆘 Call 108</a>
        )}
      </div>

      <div className="safezone-layout">
        {/* Config Card */}
        <div className="safezone-config-card">
          <h3 className="mood-card-title">⚙️ Zone Configuration</h3>

          <div className="handover-field-group">
            <label className="handover-label">Home Address</label>
            <input
              className="handover-input"
              placeholder="e.g. Guwahati, Assam — House No. 12"
              value={config.address}
              onChange={e => setConfig(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div className="handover-field-group">
            <label className="handover-label">Safe Radius</label>
            <div className="safezone-radius-grid">
              {RADIUS_OPTIONS.map(r => (
                <button
                  key={r.value}
                  className={`safezone-radius-btn ${config.radius === r.value ? 'radius-active' : ''}`}
                  onClick={() => setConfig(prev => ({ ...prev, radius: r.value }))}
                >
                  <span className="radius-icon">{r.icon}</span>
                  <span className="radius-label">{r.label}</span>
                </button>
              ))}
            </div>
            <div className="safezone-radius-desc">
              Patient can move up to <strong>{config.radius}m</strong> from home without triggering an alert.
            </div>
          </div>

          <div className="safezone-toggle-row">
            <div>
              <div className="safezone-toggle-label">Enable Safe Zone Alerts</div>
              <div className="safezone-toggle-sub">Receive browser notification if patient wanders</div>
            </div>
            <label className="toggle-switch" aria-label="Enable alerts">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
              />
              <span className="toggle-track"><span className="toggle-thumb"/></span>
            </label>
          </div>

          <button className="cog-save-btn" onClick={handleSave}>
            {saveMsg || '💾 Save Zone Settings'}
          </button>

          {/* Visual Zone Diagram */}
          <div className="safezone-diagram">
            <div className="safezone-outer-ring"/>
            <div className="safezone-inner-ring"/>
            <div className="safezone-home-marker">🏠</div>
            <div className="safezone-patient-dot"/>
            <div className="safezone-radius-label-visual">{config.radius}m safe zone</div>
          </div>
        </div>

        {/* Location Log */}
        <div className="safezone-log-card">
          <h3 className="mood-card-title">📍 Today's Location Log</h3>
          <p className="cog-card-sub">Simulated demo — real GPS requires PWA install + location permission</p>
          <div className="safezone-events-list">
            {SIMULATED_EVENTS.map(ev => (
              <div key={ev.id} className={`safezone-event-row ${ev.status}`}>
                <span className="safezone-event-icon">{ev.icon}</span>
                <div className="safezone-event-info">
                  <div className="safezone-event-location">{ev.location}</div>
                  <div className="safezone-event-time">{ev.time} · {ev.distance} from home</div>
                </div>
                <span className={`safezone-event-badge ${ev.status}`}>
                  {ev.status === 'safe' ? 'Safe' : '⚠️ Alert'}
                </span>
              </div>
            ))}
          </div>

          <div className="safezone-contacts-quick">
            <h4 className="handover-label" style={{ marginBottom: 10 }}>Quick Emergency Contacts</h4>
            {[
              { label: 'Doctor', icon: '👨‍⚕️', phone: lsGet(LS.PROFILE, {})?.doctor_phone || '—' },
              { label: 'Family', icon: '👨‍👩‍👧', phone: '—' },
              { label: 'Ambulance', icon: '🚑', phone: '108' },
            ].map(c => (
              <div key={c.label} className="safezone-contact-row">
                <span className="safezone-contact-icon">{c.icon}</span>
                <div className="safezone-contact-info">
                  <span className="safezone-contact-label">{c.label}</span>
                  <span className="safezone-contact-phone">{c.phone}</span>
                </div>
                {c.phone !== '—' && (
                  <a href={`tel:${c.phone}`} className="safezone-call-btn">📞 Call</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
