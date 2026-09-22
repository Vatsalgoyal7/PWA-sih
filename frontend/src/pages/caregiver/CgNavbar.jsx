// ============================================================
// CgNavbar.jsx — Bottom Navigation Bar (Mobile/Tablet only)
// 5 tabs mapped to most-used modules
// ============================================================
import React from 'react'
import './CgNavbar.css'

const NAV_ITEMS = [
  { id: 'dashboard',  icon: '🏠', label: 'Home'     },
  { id: 'pillbox',    icon: '💊', label: 'Pillbox'  },
  { id: 'games',      icon: '🎮', label: 'Games'    },
  { id: 'cognitive',  icon: '🧠', label: 'MMSE'     },
  { id: 'reports',    icon: '📊', label: 'Reports'  },
]

export default function CgNavbar({ activeModule, onSelectModule }) {
  return (
    <nav className="cg-navbar" aria-label="Caregiver navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = activeModule === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={`cg-navbar__tab ${isActive ? 'cg-navbar__tab--active' : ''}`}
            onClick={() => onSelectModule(item.id)}
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
