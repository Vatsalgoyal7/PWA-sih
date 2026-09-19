import { useLanguage } from '../context/LanguageContext'
import './LanguageToggle.css'

function LanguageToggle() {
  const { lang, toggleLang } = useLanguage()

  const isAs = lang === 'as'

  return (
    <button
      type="button"
      className="lang-fab-circle"
      onClick={toggleLang}
      title={isAs ? 'Switch to English' : 'অসমীয়ালৈ সলনি কৰক'}
      aria-label={isAs ? 'Switch to English' : 'Switch to Assamese'}
    >
      <div className="lang-fab-inner">
        <span className="lang-fab-main">{isAs ? 'অ' : 'EN'}</span>
        <span className="lang-fab-sub">
          <span className="lang-fab-arrow">⇄</span> {isAs ? 'EN' : 'অ'}
        </span>
      </div>
    </button>
  )
}

export default LanguageToggle
