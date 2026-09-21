# SmritiSetu (স্মৃতিসেতু) — Cognitive Care & Memory Stimulation Platform

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB.svg)](https://www.python.org/)
[![PWA](https://img.shields.io/badge/PWA-Workbox-orange.svg)](https://web.dev/progressive-web-apps/)

**SmritiSetu (স্মৃতিসেতু)** is a culturally-grounded Progressive Web Application (PWA) designed for elder individuals experiencing mild cognitive impairment (MCI) or early-stage dementia in Assam, and their caregivers. It combines Assamese and English cognitive stimulation therapy (CST) games with a daily reminder manager and caregiver configuration portal.

## Structure
- `frontend/` - React + Vite PWA application
- `backend/` - FastAPI backend application
- `games/` - 10 Cognitive CST Mini Games (game_1 to game_10)

---

## 🌟 Key Features

1. **Dual Role Architecture**:
   - **Patient Mode**: Large tactile touch targets, warm Gamusa embroidery accents, Assam scenery, voice-assisted reminders, and 10 interactive cognitive games.
   - **Caregiver Mode**: Administration dashboard to configure active games (3 to 10) and manage daily reminder schedules.
2. **Universal English & Assamese Language Toggle**:
   - A dedicated, accessible `<LanguageToggle />` button (`EN` / `অ`) available across every single page.
   - Preserves language selection in `localStorage`.
3. **In-App Seamless Game Runner**:
   - Embeds all games within a responsive runner view, preventing disruptive full-page navigation and maintaining audio context and PWA state.
   - Bidirectional communication via `postMessage` protocol for immediate exit.
4. **10-Game Cognitive Stimulation Suite**:
   - 8 fully active interactive games mapped to distinct cognitive domains (episodic memory, working memory, attention, executive function).
   - 2 staged placeholders (`game9` & `game10`) ready for plug-and-play game drops.
5. **Resilient Offline Backend Fallback**:
   - FastAPI server with asynchronous PostgreSQL connection pooling.
   - Automatically degrades to local in-memory mock configuration if running offline or without database configuration.

---

## 📁 Repository Structure

```
SIH_SmritiSetu/
├── backend/
│   ├── main.py              # FastAPI application & REST endpoints
│   ├── requirements.txt     # Python dependencies (UTF-8 clean)
│   ├── .env.example         # Template configuration
│   └── .gitignore           # Python virtualenv & cache ignores
├── frontend/
│   ├── public/
│   │   ├── _redirects       # Netlify SPA routing rules
│   │   └── games/           # 10 Static HTML5/JS Cognitive Games (game_1 to game_10)
│   ├── src/
│   │   ├── components/      # RoleSelect, LanguageToggle
│   │   ├── context/         # LanguageContext (bilingual dictionary & hook)
│   │   ├── pages/           # PatientHome, ReminderPage, GamesPage, CaregiverHome
│   │   ├── assets/          # Cultural artwork, avatars, and audio
│   │   ├── App.jsx          # Main application root
│   │   └── main.jsx         # React DOM entrypoint
│   ├── eslint.config.js     # ESLint configuration (ignores public & dist)
│   ├── vite.config.js       # Vite + PWA Workbox configuration
│   └── package.json         # Frontend dependencies & scripts
├── docs/                    # Comprehensive Structured Documentation Suite
│   ├── ARCHITECTURE.md      # System design, data flow, component interactions
│   ├── API_REFERENCE.md     # Full REST API endpoint reference
│   ├── GAMES_ECOSYSTEM.md   # Catalog of all 10 games, cognitive domains, runner API
│   ├── DEPLOYMENT_GUIDE.md  # Production deployment for Netlify, Render, and Docker
│   ├── DEVELOPMENT_AND_TESTING.md # Local setup and testing guide
│   ├── TROUBLESHOOTING.md   # Common errors, root causes, and fixes
│   ├── CHANGELOG.md         # Detailed chronological record of all changes
│   └── AUDIT_REPORT.md      # Comprehensive audit matrix and verification report
└── README.md                # Project overview and quick start guide
```

---

## 🚀 Quick Start Guide

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS / Linux:
# source venv/bin/activate

pip install -r requirements.txt
python main.py
```
API runs at [http://localhost:8000](http://localhost:8000). Health probe: [http://localhost:8000/health](http://localhost:8000/health).

---

## 📚 Complete Documentation Suite

For full architectural blueprints, API documentation, and deployment guides, refer to the documentation suite in `docs/`:

- [Architecture & Design](docs/ARCHITECTURE.md)
- [REST API Reference](docs/API_REFERENCE.md)
- [Games Ecosystem](docs/GAMES_ECOSYSTEM.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Development & Testing Guide](docs/DEVELOPMENT_AND_TESTING.md)
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- [Comprehensive Changelog](docs/CHANGELOG.md)
- [Audit & Modernization Final Report](docs/AUDIT_REPORT.md)
