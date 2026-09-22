import { useState, useEffect } from "react"
import topStripImg  from "../assets/role-gamusa-strip.png"
import leftBrooch   from "../assets/upper-left-gamosa.png"
import rightBrooch  from "../assets/upper-right-gamosa.png"
import grannyImg    from "../assets/granny_gamer.png"
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
  { id: "game11", labelAs: "দিনটো কওক",           labelEn: "Describe Your Day",        img: game11, color: "blue"   },
]

const GAME_MAP = Object.fromEntries(ALL_GAMES.map(g => [g.id, g]))

// Map game id (e.g. "game1") to the public folder path (e.g. "/games/game_1/index.html")
// game11 has no public HTML — excluded from launch
const GAME_URL_MAP = {
  game1:  "/games/game_1/index.html",
  game2:  "/games/game_2/index.html",
  game3:  "/games/game_3/index.html",
  game4:  "/games/game_4/index.html",
  game5:  "/games/game_5/index.html",
  game6:  "/games/game_6/index.html",
  game7:  "/games/game_7/index.html",
  game8:  "/games/game_8/index.html",
  game9:  "/games/game_9/index.html",
  game10: "/games/game_10/index.html",
}

// Only show games that have an actual HTML file
const PLAYABLE_GAMES = ALL_GAMES.filter(g => !!GAME_URL_MAP[g.id])

function GamesPage({ onBack }) {
  const [games, setGames]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [activeGame, setActiveGame] = useState(null)  // game object when iframe is open

  // Fetch which games are active from backend (or localStorage fallback)
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
        // Filter to only playable games that are enabled by caregiver
        const active = PLAYABLE_GAMES.filter(g => ids.includes(g.id))
        setGames(active.length >= 3 ? active : PLAYABLE_GAMES)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        console.error("GamesPage fetch failed:", err)
        // Offline fallback: try localStorage saved games config
        try {
          const saved = JSON.parse(localStorage.getItem("setu_games") || "[]")
          const active = PLAYABLE_GAMES.filter(g => {
            const cfg = saved.find(s => s.id === g.id)
            return cfg ? cfg.enabled : true
          })
          setGames(active.length >= 2 ? active : PLAYABLE_GAMES)
        } catch {
          setGames(PLAYABLE_GAMES)
        }
        setLoading(false)
        setError("Offline mode — caregiver config loaded from device")
      })
    return () => { cancelled = true }
  }, [])

  const speak = (e, game) => {
    e.stopPropagation()
    if (!("speechSynthesis" in window)) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(game.labelAs)
    utter.lang = "as-IN"
    window.speechSynthesis.speak(utter)
  }

  const launch = (game) => {
    const url = GAME_URL_MAP[game.id]
    if (!url) return
    setActiveGame(game)
  }

  const closeGame = () => {
    setActiveGame(null)
    window.speechSynthesis?.cancel()
  }

  // ── Full-Screen Game iframe Overlay ──
  if (activeGame) {
    const gameUrl = GAME_URL_MAP[activeGame.id]
    return (
      <div className="gp-game-overlay">
        {/* Floating back button */}
        <button
          className="gp-overlay-back"
          onClick={closeGame}
          aria-label="Back to game list"
        >
          ← {activeGame.labelAs}
        </button>
        <iframe
          src={gameUrl}
          title={activeGame.labelEn}
          className="gp-game-iframe"
          allow="autoplay; microphone"
        />
      </div>
    )
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
        <button className="gp-home-btn" onClick={onBack} aria-label="Back to home">
          <span aria-hidden="true">←</span>
        </button>

        {/* Scrollable centre */}
        <div className="gp-center">
          <h1 className="gp-title">মোৰ খেলা</h1>

          {/* Avatar + dialogue */}
          <div className="gp-avatar-wrap">
            <img src={grannyImg} alt="Granny gamer" className="gp-avatar" />
            <div className="gp-dialogue" aria-live="polite">
              মনে ৰাখোঁ, আনন্দৰে খেলোঁ!
            </div>
          </div>

          {error && <p className="gp-error" style={{ color: '#f59e0b', fontSize: '11px', textAlign: 'center', margin: '4px 0' }}>{error}</p>}

          {loading ? (
            <p className="gp-loading">Loading…</p>
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
                    aria-label={`${game.labelEn} — tap to play`}
                  >
                    {/* Speaker button */}
                    <button
                      className={`gp-speak-btn gp-speak-btn--${game.color}`}
                      onClick={e => speak(e, game)}
                      aria-label={`Read name of ${game.labelEn}`}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M4 9v6h4l5 5V4L8 9H4z"/>
                        <path d="M16.5 8.5a4.5 4.5 0 0 1 0 7"  stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                        <path d="M18.5 6a7.5 7.5 0 0 1 0 12"   stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                      </svg>
                    </button>

                    {/* Game image fills the tile */}
                    <img src={game.img} alt={game.labelEn} className="gp-tile-img" />

                    {/* Label below image */}
                    <span className="gp-tile-label">{game.labelAs}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Lower Gamusa Border Strip */}
        <div className="gp-top-border" aria-hidden="true" style={{ marginTop: 'auto' }}>
          <img src={topStripImg} alt="" className="gp-top-strip" />
        </div>
      </div>
    </div>
  )
}

export default GamesPage

