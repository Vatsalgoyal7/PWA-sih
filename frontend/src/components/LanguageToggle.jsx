import { useLanguage } from '../context/LanguageContext'
import './LanguageToggle.css'

function LanguageToggle({ className = '' }) {
  const { lang, toggleLang, t } = useLanguage()

  return (
    <button
      type="button"
      className={`lang-toggle-btn ${className}`}
      onClick={toggleLang}
      aria-label={t('langToggleAria')}
      title={lang === 'as' ? 'Switch to English' : 'অসমীয়ালৈ সলনি কৰক'}
    >
      <span className="lang-toggle-text">{t('langBtn')}</span>
    </button>
  )
}

export default LanguageToggle
