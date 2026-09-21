# SmritiSetu Architecture & System Design

## 1. System Overview

**SmritiSetu (স্মৃতিসেতু)** is a Progressive Web Application (PWA) designed to provide cognitive stimulation, memory care, and daily reminder management for Assamese and English-speaking elderly individuals, particularly those living with mild cognitive impairment (MCI) or dementia, alongside their caregivers.

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Device                         │
│   ┌─────────────────────────────────────────────────────┐   │
│   │               React 19 + Vite 8 PWA                 │   │
│   │  - RoleSelect (Patient vs Caregiver)                │   │
│   │  - LanguageContext (Assamese / English Toggle)      │   │
│   │  - PatientHome (Reminders & Games Panels)           │   │
│   │  - CaregiverHome (Game Selection & Reminder Config) │   │
│   │  - Service Worker (Workbox Offline Caching)         │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│              ┌───────────────┴───────────────┐              │
│              ▼                               ▼              │
│   ┌──────────────────────┐        ┌──────────────────────┐  │
│   │  In-App Game Runner  │        │   Reminder Engine    │  │
│   │  (Responsive Iframe) │        │  (SpeechSynthesis    │  │
│   │  - PostMessage API   │        │   + Audio Playback)  │  │
│   └──────────┬───────────┘        └──────────┬───────────┘  │
└──────────────┼───────────────────────────────┼──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐    ┌─────────────────────────┐
│     Static Game Modules      │    │  FastAPI Backend (REST) │
│  frontend/public/games/      │    │  - Lifespan DB Pooling  │
│  - 8 Interactive Games       │    │  - Config & Reminders   │
│  - 2 Staged Placeholders     │    │  - In-Memory Fallback   │
└──────────────────────────────┘    └────────────┬────────────┘
                                                 │
                                                 ▼
                                    ┌─────────────────────────┐
                                    │ PostgreSQL Database     │
                                    │ (patient_config table)  │
                                    └─────────────────────────┘
```

---

## 2. Core Architectural Components

### A. Frontend Client (React + Vite)
- **Framework**: React 19 with JSX and Vite 8 for fast build and HMR.
- **PWA Capabilities**: Service worker caching powered by `vite-plugin-pwa` (Workbox), manifest declarations, and asset offline storage.
- **Role Isolation**:
  - **Patient Mode**: High-contrast, gentle visual cues, culturally rooted Gamusa and Assam river scenery styling, simplified large touch targets, synthesized Assamese text-to-speech.
  - **Caregiver Mode**: Functional administrative dashboard allowing real-time selection of active games (3 to 10) and configuration of daily schedule times (medicine, food, doctor, walk).
- **Universal Localization**:
  - `LanguageContext` managing persistent language state (`'as'` default, toggleable to `'en'`).
  - Accessible `<LanguageToggle />` rendered across every screen.

### B. In-App Game Runner & Static Game Modules
- **Location**: `frontend/public/games/`
- **Execution Pattern**:
  - Embedded inside an in-app runner iframe (`gp-runner-viewport`) within `GamesPage.jsx`.
  - Avoids destructive full-page navigation, preserving PWA service worker session, background audio contexts, and user role.
- **Communication Protocol**:
  - Embedded games dispatch window message `{ type: 'EXIT_GAME' }` to parent window.
  - Games fallback to direct navigation if opened standalone.
  - Top header on the host app provides a persistent exit button (`← ঘৰলৈ উভতি যাওক / Back to Games`).

### C. Backend API Service (FastAPI)
- **Framework**: FastAPI (Python 3.12+) with Uvicorn ASGI server.
- **Data Persistence**:
  - Connection pooling via `asyncpg.create_pool` within async lifespan.
  - Automatic degradation to local development mock memory state if `DATABASE_URL` is omitted or PostgreSQL is unreachable.
- **Validation**: Strict Pydantic v2 validation models preventing out-of-bound game selections (< 3 or > 10 games) and unknown identifiers.
- **CORS Support**: Dynamic origin resolution configured via `CORS_ORIGINS` environment variable.

---

## 3. Data Flow & State Management

1. **Caregiver Configuration**:
   - Caregiver adjusts active games and reminder times.
   - `CaregiverHome` makes PATCH requests to `/patient-config/games` and `/patient-config/reminders`.
   - FastAPI validates payloads and commits changes to PostgreSQL `patient_config`.
2. **Patient Experience**:
   - `GamesPage` and `ReminderPage` query `GET /patient-config` on mount.
   - `GamesPage` filters the 10-game catalog to display only the games selected by the caregiver.
   - `ReminderPage` populates reminder times with live caregiver values, falling back to default schedules if offline.
