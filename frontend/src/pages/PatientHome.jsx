import { useState } from 'react'
import topStripImg from '../assets/role-gamusa-strip.png'
import topLeftBrooch from '../assets/upper-left-gamosa.png'
import topRightBrooch from '../assets/upper-right-gamosa.png'
import grandmaImg from '../assets/namaskar-grandma.png'
import reminderPanelImg from '../assets/reminder-panel.png'
import gamesPanelImg from '../assets/games-panel.png'
import sceneryImg from '../assets/role-scenery-full.png'
import ReminderPage from './ReminderPage'
import GamesPage from './GamesPage'
import './PatientHome.css'

function PatientHome({ onChangeRole }) {
  const [page, setPage] = useState('home') // 'home' | 'reminders' | 'games'

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
          aria-label="Back to role selection"
        >
          &#8592;
        </button>

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
              alt="Namaskar Grandma welcoming the patient"
              className="patient-avatar-img"
            />
          </header>

          <main className="patient-panels-grid" role="group" aria-label="Patient options">
            <button
              type="button"
              className="patient-panel-btn"
              onClick={() => setPage('reminders')}
              aria-label="Open Reminders"
            >
              <img
                src={reminderPanelImg}
                alt="Reminder Panel"
                className="patient-panel-img"
              />
            </button>

            <button
              type="button"
              className="patient-panel-btn"
              onClick={() => setPage('games')}
              aria-label="Open Games"
            >
              <img
                src={gamesPanelImg}
                alt="Games Panel"
                className="patient-panel-img"
              />
            </button>
          </main>
        </div>

        {/* Bottom: River Scenery */}
        <footer className="patient-scenery-section">
          <img
            src={sceneryImg}
            alt="Assam scenery with river, boat, and Gamusa border"
            aria-hidden="true"
            className="patient-scenery-img"
          />
        </footer>
      </div>
    </div>
  )
}

export default PatientHome