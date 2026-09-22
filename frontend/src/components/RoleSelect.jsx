import { useLanguage } from '../context/LanguageContext'
import LanguageToggle from './LanguageToggle'
import './RoleSelect.css'

function RoleSelect({ onSelect }) {
  const { lang, t } = useLanguage()
  const isEn = lang === 'en'

  return (
    <div className="role-modern-viewport">
      <div className="role-modern-card">
        
        {/* Subtle Ambient Glow Elements */}
        <div className="role-ambient-glow role-glow-top" aria-hidden="true" />
        <div className="role-ambient-glow role-glow-bottom" aria-hidden="true" />

        {/* ── Top Bar: Brand + Language Switcher ── */}
        <header className="role-modern-header">
          <div className="role-brand-pill">
            <span className="role-brand-icon">🧠</span>
            <div className="role-brand-text">
              <span className="role-app-title">SmritiSetu</span>
              <span className="role-app-tag">{isEn ? 'Dementia Care' : 'স্মৃতিসেতু'}</span>
            </div>
          </div>

          <LanguageToggle className="role-modern-lang-btn" />
        </header>

        {/* ── Welcome Heading ── */}
        <div className="role-welcome-block">
          <h1 className="role-welcome-title">
            {isEn ? 'Welcome' : 'স্বাগতম'}
            <span className="role-title-dot">.</span>
          </h1>
          <p className="role-welcome-sub">
            {isEn
              ? 'Choose your interface to continue'
              : 'আপোনাৰ সুবিধা অনুসৰি বিকল্প বাছক'}
          </p>
        </div>

        {/* ── Selection Cards (Senior Companion vs Caregiver Desk) ── */}
        <main className="role-cards-container">
          
          {/* Card 1: Senior Citizen / Grandmother Mode */}
          <button
            type="button"
            className="role-selection-card role-card--senior"
            onClick={() => onSelect('patient')}
            aria-label={isEn ? 'Continue as Senior Companion' : 'আইতাৰ বাবে প্ৰৱেশ কৰক'}
          >
            <div className="role-card-inner">
              <div className="role-card-badge-row">
                <span className="role-card-pill role-pill--warm">
                  {isEn ? 'Gentle & Simple' : 'সহজ আৰু আনন্দময়'}
                </span>
                <span className="role-card-arrow">→</span>
              </div>

              <div className="role-card-main-content">
                <div className="role-card-avatar-wrap">
                  <div className="role-card-avatar-circle">👵</div>
                </div>
                
                <div className="role-card-text">
                  <h2 className="role-card-name">
                    {isEn ? 'Senior Companion' : 'আইতাৰ সংগী'}
                  </h2>
                  <p className="role-card-caption">
                    {isEn
                      ? 'Tactile memory games, vocal daily routines & family memories'
                      : 'স্মৃতি খেল, দৈনন্দিন নিয়ম আৰু আনন্দদায়ক অনুভৱ'}
                  </p>
                </div>
              </div>

              <div className="role-card-action-bar role-action--senior">
                <span>{isEn ? 'Tap to open Senior Mode' : 'আইতাৰ সংগী খোলক'}</span>
                <span className="role-action-chevron">›</span>
              </div>
            </div>
          </button>

          {/* Card 2: Caregiver / Family Portal */}
          <button
            type="button"
            className="role-selection-card role-card--caregiver"
            onClick={() => onSelect('caregiver')}
            aria-label={isEn ? 'Continue to Caregiver Portal' : 'কেয়াৰগিভাৰ ডেস্কলৈ যাওক'}
          >
            <div className="role-card-inner">
              <div className="role-card-badge-row">
                <span className="role-card-pill role-pill--clinical">
                  {isEn ? 'Clinical & Supervision' : 'তত্ত্বাৱধায়ক পৰিদৰ্শন'}
                </span>
                <span className="role-card-arrow">→</span>
              </div>

              <div className="role-card-main-content">
                <div className="role-card-avatar-wrap">
                  <div className="role-card-avatar-circle role-avatar--caregiver">🩺</div>
                </div>

                <div className="role-card-text">
                  <h2 className="role-card-name">
                    {isEn ? 'Caregiver Portal' : 'তত্ত্বাৱধায়ক ডেস্ক'}
                  </h2>
                  <p className="role-card-caption">
                    {isEn
                      ? 'Medication pillbox, MMSE cognitive gauge, safe zone & clinical PDF'
                      : 'ঔষধ সময়সূচী, স্নায়ু পৰীক্ষা আৰু পৰিয়ালৰ নিৰাপত্তা'}
                  </p>
                </div>
              </div>

              <div className="role-card-action-bar role-action--caregiver">
                <span>{isEn ? 'Enter Caregiver Console' : 'তত্ত্বাৱধায়ক ডেস্ক খোলক'}</span>
                <span className="role-action-chevron">›</span>
              </div>
            </div>
          </button>

        </main>

        {/* ── Modern Minimalist Footer (No extra buttons) ── */}
        <footer className="role-modern-footer">
          <span className="role-footer-dot" />
          <span className="role-footer-text">
            {isEn ? 'Voice-enabled AI Cognitive Support' : 'AI আধাৰিত জ্ঞানমূলক সেৱা'}
          </span>
        </footer>

      </div>
    </div>
  )
}

export default RoleSelect