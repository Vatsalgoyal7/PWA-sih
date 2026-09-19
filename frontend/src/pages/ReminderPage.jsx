import { useState } from 'react'
import topStripImg  from '../assets/role-gamusa-strip.png'
import rightBrooch  from '../assets/upper-right-gamosa.png'
import grandmaImg   from '../assets/namaskar-grandma.png'
import remMedImg    from '../assets/rem-med.png'
import remFoodImg   from '../assets/rem-food.png'
import remDocImg    from '../assets/rem-doc.png'
import remWalkImg   from '../assets/rem-walk.png'
import sceneryImg   from '../assets/role-scenery-full.png'
import { useLanguage } from '../context/LanguageContext'
import './ReminderPage.css'

const INITIAL_REMINDERS = [
  { id: 'med',  labelAs: 'ঔষধ',   labelEn: 'Medicine', time: '08:00', img: remMedImg,  color: 'green'  },
  { id: 'food', labelAs: 'খাদ্য', labelEn: 'Food',     time: '10:00', img: remFoodImg, color: 'red'    },
  { id: 'doc',  labelAs: 'ডাক্তৰ', labelEn: 'Doctor',  time: '12:00', img: remDocImg,  color: 'orange' },
  { id: 'walk', labelAs: 'হাঁটিব', labelEn: 'Walk',    time: '18:00', img: remWalkImg, color: 'green'  },
]

function fmt(t) {
  const [h, m] = t.split(':')
  const hour = parseInt(h, 10)
  const display = hour % 12 || 12
  return display + ':' + m
}

function ReminderPage({ onBack }) {
  const [reminders, setReminders] = useState(INITIAL_REMINDERS)
  const [editId, setEditId]       = useState(null)
  const [draft,  setDraft]        = useState('')
  const { lang, t } = useLanguage()

  const openEdit = (rem) => { setEditId(rem.id); setDraft(rem.time) }
  const saveEdit = () => {
    setReminders(prev => prev.map(r => r.id === editId ? { ...r, time: draft } : r))
    setEditId(null)
  }

  const speak = (e, rem) => {
    e.stopPropagation()
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const label = lang === 'en' ? rem.labelEn : rem.labelAs
    const utter = new SpeechSynthesisUtterance(label + ', ' + fmt(rem.time))
    utter.lang = lang === 'en' ? 'en-IN' : 'as-IN'
    window.speechSynthesis.speak(utter)
  }

  const handleCardKey = (e, rem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openEdit(rem)
    }
  }

  const editing = reminders.find(r => r.id === editId)

  return (
    <div className="rem-viewport">
      <div className="rem-card">
        {/* Top Gamusa strip */}
        <div className="rem-top-border" aria-hidden="true">
          <img src={topStripImg} alt="" className="rem-top-strip" />
        </div>

        {/* Right brooch — behind centre content */}
        <img src={rightBrooch} alt="" aria-hidden="true" className="rem-right-brooch" />

        {/* Home button */}
        <button className="rem-home-btn" onClick={onBack} aria-label={t('home')}>
          <span aria-hidden="true">⌂</span>
        </button>

        {/* Scrollable centre */}
        <div className="rem-center">
          <h1 className="rem-title">{t('reminderTitle')}</h1>

          {/* Enlarged Avatar without redundant dialogue box */}
          <div className="rem-avatar-wrap">
            <img src={grandmaImg} alt="Grandma" className="rem-avatar" />
          </div>

          {/* Reminder cards */}
          <ul className="rem-list" role="list">
            {reminders.map(rem => (
              <li key={rem.id} className="rem-list-item">
                <div
                  className={'rem-card-btn rem-card-btn--' + rem.color}
                  role="button"
                  tabIndex={0}
                  onClick={() => openEdit(rem)}
                  onKeyDown={(e) => handleCardKey(e, rem)}
                  aria-label={(lang === 'en' ? rem.labelEn : rem.labelAs) + ' reminder at ' + fmt(rem.time) + ', tap to edit'}
                >
                  <button
                    className={'rem-speak-btn rem-speak-btn--' + rem.color}
                    onClick={(e) => speak(e, rem)}
                    aria-label={t('speak') + ' ' + (lang === 'en' ? rem.labelEn : rem.labelAs)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M4 9v6h4l5 5V4L8 9H4z"/>
                      <path d="M16.5 8.5a4.5 4.5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      <path d="M18.5 6a7.5 7.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                    </svg>
                  </button>

                  <div className={'rem-icon-wrap rem-icon-wrap--' + rem.color}>
                    <img src={rem.img} alt={lang === 'en' ? rem.labelEn : rem.labelAs} className="rem-icon-img" />
                  </div>
                  <div className="rem-card-text">
                    <span className="rem-card-label">
                      {lang === 'en' ? rem.labelEn : rem.labelAs}
                    </span>
                    <span className={'rem-card-time rem-card-time--' + rem.color}>
                      <svg className="rem-clock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {fmt(rem.time)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom scenery */}
        <footer className="rem-scenery" aria-hidden="true">
          <img src={sceneryImg} alt="" className="rem-scenery-img" />
        </footer>
      </div>

      {/* Time-edit modal */}
      {editId && (
        <div
          className="rem-overlay"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setEditId(null)}
        >
          <div className="rem-modal">
            <p className="rem-modal-name">{lang === 'en' ? editing?.labelEn : editing?.labelAs}</p>
            <p className="rem-modal-sub">{lang === 'en' ? editing?.labelAs : editing?.labelEn}</p>
            <input
              type="time"
              className="rem-time-input"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              autoFocus
            />
            <div className="rem-modal-actions">
              <button className="rem-modal-cancel" onClick={() => setEditId(null)}>{t('cancel')}</button>
              <button className="rem-modal-save"   onClick={saveEdit}>{t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReminderPage