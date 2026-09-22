import { useLanguage } from '../context/LanguageContext'
import LanguageToggle from './LanguageToggle'
import claySeniorImg from '../assets/clay-senior.jpg'
import clayCaregiverImg from '../assets/clay-caregiver.jpg'
import './RoleSelect.css'

function RoleSelect({ onSelect }) {
  const { lang } = useLanguage()
  const isEn = lang === 'en'

  return (
    <div className="role-pastel-viewport">
      <div className="role-pastel-card">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="role-pastel-glow role-glow-top" aria-hidden="true" />
        <div className="role-pastel-glow role-glow-bottom" aria-hidden="true" />

        {/* ── Top Bar: Brand Pill + Language Switcher ── */}
        <header className="role-pastel-header">
          <div className="role-brand-pill">
            <span className="role-brand-icon">🧠</span>
            <span className="role-brand-title">SmritiSetu</span>
          </div>

          <LanguageToggle className="role-pastel-lang-btn" />
        </header>

        {/* ── Greeting Title ── */}
        <div className="role-hero-title-wrap">
          <h1 className="role-hero-title">
            {isEn ? 'Welcome / স্বাগতম' : 'স্বাগতম / Welcome'}
          </h1>
        </div>

        {/* ── Two Big Interactive Pastel Cards ── */}
        <main className="role-pastel-cards-grid">
          
          {/* Card 1: Senior Companion */}
          <button
            type="button"
            className="role-card-pastel role-card-pastel--senior"
            onClick={() => onSelect('patient')}
            aria-label={isEn ? 'Enter Senior Companion' : 'আইতাৰ সংগী খোলক'}
          >
            <div className="role-card-content-left">
              <h2 className="role-card-heading">
                {isEn ? 'Senior Companion' : 'আইতাৰ সংগী'}
              </h2>
              <p className="role-card-subheading">
                {isEn
                  ? 'Gentle games & daily memory routines'
                  : 'সহজ স্মৃতি খেল আৰু দৈনন্দিন নিয়ম'}
              </p>
            </div>

            <div className="role-card-art-wrap">
              <img
                src={claySeniorImg}
                alt="Senior companion 3D character"
                className="role-clay-img"
              />
            </div>

            <div className="role-card-btn-strip role-strip--senior">
              <span>{isEn ? 'Enter Companion' : 'প্ৰৱেশ কৰক'}</span>
            </div>
          </button>

          {/* Card 2: Caregiver Portal */}
          <button
            type="button"
            className="role-card-pastel role-card-pastel--caregiver"
            onClick={() => onSelect('caregiver')}
            aria-label={isEn ? 'Open Caregiver Desk' : 'তত্ত্বাৱধায়ক ডেস্ক খোলক'}
          >
            <div className="role-card-content-left">
              <h2 className="role-card-heading">
                {isEn ? 'Caregiver Portal' : 'তত্ত্বাৱধায়ক ডেস্ক'}
              </h2>
              <p className="role-card-subheading">
                {isEn
                  ? 'Medication schedule & clinical oversight'
                  : 'ঔষধ সময়সূচী আৰু চিকিৎসা পৰিদৰ্শন'}
              </p>
            </div>

            <div className="role-card-art-wrap">
              <img
                src={clayCaregiverImg}
                alt="Caregiver clinical monitor 3D character"
                className="role-clay-img"
              />
            </div>

            <div className="role-card-btn-strip role-strip--caregiver">
              <span>{isEn ? 'Open Care Desk' : 'ডেস্ক খোলক'}</span>
            </div>
          </button>

        </main>

      </div>
    </div>
  )
}

export default RoleSelect