# SmritiSetu Game 6: Milai Diya (Loga Loi Jua)

## Overview
"Milai Diya" is a cognitive care sequencing game designed for Assamese elderly users. The game helps users practice sequencing daily routines (e.g., making tea, welcoming a guest, morning routine, Bihu preparation) by arranging cards in the correct order.

## Architecture
- **Vanilla HTML5 / CSS3 / JavaScript (ES6)**
- **No external dependencies**, build steps, or frameworks.
- **Single Page Application (SPA)** routing via DOM toggling (`app.js`).
- **State Management:** Handled locally within `App` and `Game` objects.
- **Localization:** Bilingual support (Assamese/English) managed by `i18n.js`.
- **Text-to-Speech:** Uses a hybrid approach in `tts.js` — plays local MP3 files if available, and falls back to Web Speech API.

## Project Structure
- `/assets`: Contains all images, backgrounds, and audio files.
  - `/bg`: Background images (specifically `bg_final.png` containing the baked UI frame).
  - `/cards`: Scenario-specific step images.
  - `/avatars`: Avatar states (idle, gentle, happy).
  - `/audio`: TTS audio recordings.
- `/css`: `style.css` containing all responsive styling and animations.
- `/js`:
  - `app.js`: Main application controller and UI event routing.
  - `game.js`: Drag-and-drop game logic, validation, and caregiver logging.
  - `i18n.js`: Dictionary containing all UI text and scenario configurations.
  - `tts.js`: Audio playback engine.
- `index.html`: Main entry point.

## Recent Modernization & Fixes
- Removed deprecated Progressive Web App (PWA) configuration (Service Workers and Manifests).
- Refactored background rendering to use a single baked background (`bg_final.png`) on the `body` tag, removing redundant CSS layers from `.app-container` that caused visual glitches.
- Fixed a state-management bug in `app.js` where repeating audio on the setup screen would fail due to uninitialized scenario data.
- Removed unused and obsolete background assets.

## Deployment
Simply host the root directory on any static web server (e.g., GitHub Pages, Vercel, Netlify, Nginx, or Apache). No build step is required.
