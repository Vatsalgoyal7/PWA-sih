import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'
import topStripImg from '../assets/role-gamusa-strip.png'
import topLeftBrooch from '../assets/upper-left-gamosa.png'
import topRightBrooch from '../assets/upper-right-gamosa.png'
import grandmaImg from '../assets/namaskar-grandma.png'
import reminderPanelImg from '../assets/reminder-panel.png'
import gamesPanelImg from '../assets/games-panel.png'
import ReminderPage from './ReminderPage'
import GamesPage from './GamesPage'
import './PatientHome.css'

function PatientHome({ onChangeRole }) {
  const [page, setPage] = useState('home') // 'home' | 'reminders' | 'games'
  const { t } = useLanguage()

  if (page === 'reminders') {
    return <ReminderPage onBack={() => setPage('home')} />
  }

  if (page === 'games') {
    return <GamesPage onBack={() => setPage('home')} />
  }

  return (
    <div className="patient-home-viewport">
      <div className="patient-home-card">
        {/* Upper Gamusa Border Strip */}
        <div className="patient-top-border-wrapper" aria-hidden="true">
          <img src={topStripImg} alt="" className="patient-top-strip-img" />
        </div>

        {/* Back button — top-left, above the strip */}
        <button
          type="button"
          className="patient-back-btn"
          onClick={onChangeRole}
          aria-label={t('patientBackAria')}
        >
          &#8592;
        </button>

        {/* Language Toggle — top-right */}
        <LanguageToggle className="patient-lang-toggle" />

        {/* Left brooch — above strip */}
        <img
          src={topLeftBrooch}
          alt=""
          aria-hidden="true"
          className="patient-corner-brooch patient-corner-left"
        />
        {/* Right brooch — behind grandma (z-index 1) */}
        <img
          src={topRightBrooch}
          alt=""
          aria-hidden="true"
          className="patient-corner-brooch patient-corner-right patient-corner-right--behind"
        />

        {/* Center: Grandma Avatar & Panel Buttons */}
        <div className="patient-center-content">
          <header className="patient-avatar-section">
            <img
              src={grandmaImg}
              alt={t('patientGrandmaAlt')}
              className="patient-avatar-img"
            />
          </header>

          <main className="patient-panels-grid" role="group" aria-label="Patient options">
            <button
              type="button"
              className="patient-panel-btn"
              onClick={() => setPage('reminders')}
              aria-label={t('patientReminders')}
            >
              <img
                src={reminderPanelImg}
                alt={t('patientReminders')}
                className="patient-panel-img"
              />
            </button>

            <button
              type="button"
              className="patient-panel-btn"
              onClick={() => setPage('games')}
              aria-label={t('patientGames')}
            >
              <img
                src={gamesPanelImg}
                alt={t('patientGames')}
                className="patient-panel-img"
              />
            </button>
          </main>
        </div>

        {/* Lower Gamusa Border Strip */}
        <div className="patient-top-border-wrapper" aria-hidden="true" style={{ marginTop: 'auto' }}>
          <img src={topStripImg} alt="" className="patient-top-strip-img" />
        </div>
      </div>
    </div>
  )
}

export default PatientHome