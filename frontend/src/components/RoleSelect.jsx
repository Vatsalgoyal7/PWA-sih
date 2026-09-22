import { useLanguage } from '../context/LanguageContext'
import LanguageToggle from './LanguageToggle'
import topStripImg from '../assets/role-gamusa-strip.png'
import topLeftBrooch from '../assets/upper-left-gamosa.png'
import topRightBrooch from '../assets/upper-right-gamosa.png'
import headerImg from '../assets/role-select-header.png'
import patientBtn from '../assets/role-patient-btn.png'
import caregiverBtn from '../assets/role-caregiver-btn.png'
import './RoleSelect.css'

function RoleSelect({ onSelect }) {
  const { t, language } = useLanguage()

  return (
    <div className="role-select-viewport">
      <div className="role-select-card">
        {/* Upper Gamusa Border Strip */}
        <div className="role-top-border-wrapper" aria-hidden="true">
          <img
            src={topStripImg}
            alt=""
            className="role-top-strip-img"
          />
        </div>

        {/* Extreme Top Corner Decorative Brooches */}
        <img
          src={topLeftBrooch}
          alt=""
          aria-hidden="true"
          className="role-corner-brooch role-corner-left"
        />
        <img
          src={topRightBrooch}
          alt=""
          aria-hidden="true"
          className="role-corner-brooch role-corner-right"
        />

        {/* Language Toggle Button — top-most z-index */}
        <LanguageToggle className="role-lang-toggle" />

        {/* Center: AI Avatar & Selection Cards aligned together with even spacing */}
        <div className="role-center-content">
          <header className="role-avatar-section">
            <img
              src={headerImg}
              alt={t('rolePrompt')}
              className="role-avatar-img"
            />
            {/* English Overlay for Speech Bubble */}
            {language === 'en' && (
              <div className="role-speech-bubble-overlay">
                Who are you using this as?
              </div>
            )}
          </header>

          <main className="role-cards-grid" role="group" aria-label={t('rolePrompt')}>
            <button
              type="button"
              className="role-card-btn"
              onClick={() => onSelect('patient')}
              aria-label={t('rolePatientAria')}
            >
              <img
                src={patientBtn}
                alt={t('rolePatient')}
                className="role-card-img"
              />
              {/* English Overlay for Card Bar */}
              {language === 'en' && (
                <div className="role-card-bar-overlay">
                  Patient
                </div>
              )}
            </button>

            <button
              type="button"
              className="role-card-btn"
              onClick={() => onSelect('caregiver')}
              aria-label={t('roleCaregiverAria')}
            >
              <img
                src={caregiverBtn}
                alt={t('roleCaregiver')}
                className="role-card-img"
              />
              {/* English Overlay for Card Bar */}
              {language === 'en' && (
                <div className="role-card-bar-overlay">
                  Caregiver
                </div>
              )}
            </button>
          </main>
        </div>

        {/* Lower Gamusa Border Strip */}
        <div className="role-top-border-wrapper" aria-hidden="true" style={{ marginTop: 'auto' }}>
          <img
            src={topStripImg}
            alt=""
            className="role-top-strip-img"
          />
        </div>
      </div>
    </div>
  )
}

export default RoleSelect