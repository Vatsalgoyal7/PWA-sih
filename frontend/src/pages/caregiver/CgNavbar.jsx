// ============================================================
// CgNavbar.jsx — Bottom Navigation Bar for Caregiver Dashboard
// ============================================================
import React from 'react'
import './CgNavbar.css'

const NAV_ITEMS = [
  { id: 'home',      icon: '🏠', label: 'Home' },
  { id: 'reminders', icon: '⏰', label: 'Alerts' },
  { id: 'games',     icon: '🎮', label: 'Games' },
  { id: 'health',    icon: '🧠', label: 'Health' },
  { id: 'reports',   icon: '📊', label: 'Reports' },
]

export default function CgNavbar({ activeTab, onTab }) {
  return (
    <nav className="cg-navbar" aria-label="Caregiver navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={`cg-navbar__tab ${isActive ? 'cg-navbar__tab--active' : ''}`}
            onClick={() => onTab(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="cg-navbar__dot" />
            <span className="cg-navbar__icon">{item.icon}</span>
            <span className="cg-navbar__label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
