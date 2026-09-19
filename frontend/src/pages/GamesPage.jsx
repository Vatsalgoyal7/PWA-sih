import { useState, useEffect } from "react"
import topStripImg  from "../assets/role-gamusa-strip.png"
import leftBrooch   from "../assets/upper-left-gamosa.png"
import rightBrooch  from "../assets/upper-right-gamosa.png"
import grannyImg    from "../assets/granny_gamer.png"
import sceneryImg   from "../assets/role-scenery-full.png"
import game1  from "../assets/game1-ki-utsav.png"
import game2  from "../assets/game2-ki-ki-silo.png"
import game3  from "../assets/game3-kot-gol.png"
import game4  from "../assets/game4-etu-cabo.png"
import game5  from "../assets/game5-bhinno-ke.png"
import game6  from "../assets/game6-loga-loi-jua.png"
import game7  from "../assets/game7-bosarot-ki-lage.png"
import game8  from "../assets/game8-milai-diya.png"
import game9  from "../assets/game9-bak-kotota.png"
import game10 from "../assets/game10-ki-koribo.png"
import game11 from "../assets/game11-describe-day.png"
import { useLanguage } from "../context/LanguageContext"
import "./GamesPage.css"

const API_BASE = import.meta.env.VITE_API_URL ?? "https://smritisetu-backend.onrender.com"

// ---------------------------------------------------------------------------
// Master game catalog — order here defines grid position when all are active
// ---------------------------------------------------------------------------
const ALL_GAMES = [
  { id: "game1",  labelAs: "কি উৎসৱ?",          labelEn: "Which festival?",          img: game1,  color: "pink"   },
  { id: "game2",  labelAs: "কি কি আছিল?",        labelEn: "What were they?",          img: game2,  color: "yellow" },
  { id: "game3",  labelAs: "ক'ত গ'ল?",            labelEn: "Where did it go?",         img: game3,  color: "green"  },
  { id: "game4",  labelAs: "এইটো চাওঁ",           labelEn: "Look at this",             img: game4,  color: "blue"   },
  { id: "game5",  labelAs: "ভিন্ন কোন?",          labelEn: "Which is different?",      img: game5,  color: "orange" },
  { id: "game6",  labelAs: "লগা লৈ যাও",          labelEn: "Take along / Match",       img: game6,  color: "purple" },
  { id: "game7",  labelAs: "বসাৰত কি লাগে?",      labelEn: "What's needed here?",      img: game7,  color: "red"    },
  { id: "game8",  labelAs: "মিলাই দিয়া",          labelEn: "Match them",               img: game8,  color: "teal"   },
  { id: "game9",  labelAs: "বাকি ক'তটা?",         labelEn: "How many are left?",       img: game9,  color: "pink"   },
  { id: "game10", labelAs: "কি কৰিব?",            labelEn: "What should be done?",     img: game10, color: "yellow" },
  { id: "game11", labelAs: "বিশেষ খেলা",           labelEn: "Describe Your Day",        img: game11, color: "blue"   },
]

const GAME_MAP = Object.fromEntries(ALL_GAMES.map(g => [g.id, g]))

function GamesPage({ onBack }) {
  const [games, setGames]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const { lang, t } = useLanguage()

  // Fetch which games are active from the backend
  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE}/patient-config`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (cancelled) return
        const ids = Array.isArray(data.game_selection) ? data.game_selection : []
        // Preserve catalog order: filter ALL_GAMES to only active ids
        const active = ALL_GAMES.filter(g => ids.includes(g.id))
        setGames(active.length >= 3 ? active : ALL_GAMES)   // fallback: show all if config is empty/invalid
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        console.error("GamesPage fetch failed:", err)
        setGames(ALL_GAMES)   // offline fallback: show all games
        setLoading(false)
        setError("config unavailable — showing all games")
      })
    return () => { cancelled = true }
  }, [])

  const speak = (e, game) => {
    e.stopPropagation()
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const text = lang === 'en' ? game.labelEn : game.labelAs
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang === 'en' ? "en-IN" : "as-IN"
    window.speechSynthesis.speak(utter)
  }

  const launch = (game) => {
    // Placeholder — route into the actual game when game components exist
    console.log("Launching game:", game.id)
    alert(`${lang === 'en' ? 'Coming soon' : 'খেলা মাতি আনি আছে'}: ${lang === 'en' ? game.labelEn : game.labelAs}`)
  }

  return (
    <div className="gp-viewport">
      <div className="gp-card">

        {/* Gamusa top strip */}
        <div className="gp-top-border" aria-hidden="true">
          <img src={topStripImg} alt="" className="gp-top-strip" />
        </div>

        {/* Left brooch */}
        <img src={leftBrooch}  alt="" aria-hidden="true" className="gp-brooch gp-brooch--left"  />
        {/* Right brooch — behind avatar (z-index 1) */}
        <img src={rightBrooch} alt="" aria-hidden="true" className="gp-brooch gp-brooch--right" />

        {/* Home / back button */}
        <button className="gp-home-btn" onClick={onBack} aria-label={t('home')}>
          <span aria-hidden="true">⌂</span>
        </button>

        {/* Scrollable centre */}
        <div className="gp-center">
          <h1 className="gp-title">{t('gameTitle')}</h1>

          {/* Avatar + dialogue */}
          <div className="gp-avatar-wrap">
            <img src={grannyImg} alt="Granny gamer" className="gp-avatar" />
            <div className="gp-dialogue" aria-live="polite">
              {t('gameDialogue')}
            </div>
          </div>

          {error && <p className="gp-error">{error}</p>}

          {loading ? (
            <p className="gp-loading">{t('loading')}</p>
          ) : (
            <ul className="gp-grid" role="list">
              {games.map(game => (
                <li key={game.id} className="gp-grid-item">
                  <div
                    className={`gp-tile gp-tile--${game.color}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => launch(game)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); launch(game) } }}
                    aria-label={`${lang === 'en' ? game.labelEn : game.labelAs} — ${t('tapToPlay')}`}
                  >
                    {/* Speaker button */}
                    <button
                      className={`gp-speak-btn gp-speak-btn--${game.color}`}
                      onClick={e => speak(e, game)}
                      aria-label={`${t('speak')} ${lang === 'en' ? game.labelEn : game.labelAs}`}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M4 9v6h4l5 5V4L8 9H4z"/>
                        <path d="M16.5 8.5a4.5 4.5 0 0 1 0 7"  stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                        <path d="M18.5 6a7.5 7.5 0 0 1 0 12"   stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      </svg>
                    </button>

                    {/* Game image fills the tile */}
                    <img src={game.img} alt={lang === 'en' ? game.labelEn : game.labelAs} className="gp-tile-img" />

                    {/* Label below image — switches with lang */}
                    <span className="gp-tile-label">
                      {lang === 'en' ? game.labelEn : game.labelAs}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom scenery */}
        <footer className="gp-scenery" aria-hidden="true">
          <img src={sceneryImg} alt="" className="gp-scenery-img" />
        </footer>
      </div>
    </div>
  )
}

export default GamesPage
