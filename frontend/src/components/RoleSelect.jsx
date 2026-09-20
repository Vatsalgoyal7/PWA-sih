import topStripImg from '../assets/role-gamusa-strip.png'
import topLeftBrooch from '../assets/upper-left-gamosa.png'
import topRightBrooch from '../assets/upper-right-gamosa.png'
import headerImg from '../assets/role-select-header.png'
import patientBtn from '../assets/role-patient-btn.png'
import caregiverBtn from '../assets/role-caregiver-btn.png'
import sceneryImg from '../assets/role-scenery-full.png'
import { useLanguage } from '../context/LanguageContext'
import './RoleSelect.css'

function RoleSelect({ onSelect }) {
  const { lang, t } = useLanguage()

  return (
    <div className="role-select-viewport">
      <div className="role-select-card">
        {/* Upper Gamusa Border Strip */}
        <div className="role-top-border-wrapper" aria-hidden="true">
          <img src={topStripImg} alt="" className="role-top-strip-img" />
        </div>

        {/* Extreme Top Corner Decorative Brooches */}
        <img src={topLeftBrooch} alt="" aria-hidden="true" className="role-corner-brooch role-corner-left" />
        <img src={topRightBrooch} alt="" aria-hidden="true" className="role-corner-brooch role-corner-right" />

        {/* Center: AI Avatar & Selection Cards */}
        <div className="role-center-content">
          <header className="role-avatar-section">
            <img
              src={headerImg}
              alt={t('roleSelectTitle')}
              className="role-avatar-img"
            />
            {/* English title — shown only in EN mode, below the image not over it */}
            {lang === 'en' && (
              <p className="role-en-title">Which role will you use as?</p>
            )}
          </header>

          <main className="role-cards-grid" role="group" aria-label={t('roleSelectTitle')}>
            {/* Patient card */}
            <div className="role-card-wrap">
              <button
                type="button"
                className="role-card-btn"
                onClick={() => onSelect('patient')}
                aria-label={t('patient')}
              >
                <img src={patientBtn} alt={t('patient')} className="role-card-img" />
              </button>
              {lang === 'en' && (
                <span className="role-card-en-label">Patient</span>
              )}
            </div>

            {/* Caregiver card */}
            <div className="role-card-wrap">
              <button
                type="button"
                className="role-card-btn"
                onClick={() => onSelect('caregiver')}
                aria-label={t('caregiver')}
              >
                <img src={caregiverBtn} alt={t('caregiver')} className="role-card-img" />
              </button>
              {lang === 'en' && (
                <span className="role-card-en-label">Caregiver</span>
              )}
            </div>
          </main>
        </div>

        {/* Bottom: River Scenery */}
        <footer className="role-scenery-section">
          <img
            src={sceneryImg}
            alt="Assam scenery with river, boat, and Gamusa border"
            aria-hidden="true"
            className="role-scenery-img"
          />
        </footer>
      </div>
    </div>
  )
}

export default RoleSelect