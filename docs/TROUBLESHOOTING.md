# SmritiSetu Troubleshooting Guide

This guide describes common errors, root causes, and verified fixes across the SmritiSetu codebase and deployment pipeline.

---

## 1. Frontend Issues

### Problem: Game links return 404 or show the React home screen instead of the game
- **Symptom**: Tapping a game tile loads the root app or gives a blank page.
- **Root Cause**: The static game files were placed inside an intermediate subfolder (e.g. `frontend/public/games/game_2/GAME2_CODE/index.html`), causing `/games/game_2/index.html` to not exist on disk.
- **Fix**: Flatten the game folder so `index.html` resides directly inside `frontend/public/games/game_<N>/index.html`.

### Problem: ESLint fails with parsing errors on game JavaScript files
- **Symptom**: `npm run lint` fails with unexpected token or global variable errors in `public/games/**/*.js`.
- **Root Cause**: ESLint 9+ flat configuration checked all files in the project root by default.
- **Fix**: Add `'public'` to `globalIgnores` in `frontend/eslint.config.js`.

### Problem: Audio fails to auto-play when entering a game
- **Symptom**: Browser console logs `NotAllowedError: play() failed because the user didn't interact with the document first`.
- **Root Cause**: Modern browser security policies prevent programmatic audio playback before the user performs an initial tap or keypress on the page.
- **Fix**: All SmritiSetu games include an `unlockAudioOnFirstTouch()` pointer listener to unlock audio on the very first touch anywhere on the card.

---

## 2. Backend Issues

### Problem: `pip install -r requirements.txt` fails with UnicodeDecodeError
- **Symptom**: `UnicodeDecodeError: 'charmap' codec can't decode byte 0xff in position 0`.
- **Root Cause**: `backend/requirements.txt` was saved with UTF-16LE encoding and a Byte Order Mark (BOM).
- **Fix**: Convert `requirements.txt` to standard UTF-8 without BOM.

### Problem: Backend crashes with `KeyError: 'DATABASE_URL'` on startup
- **Symptom**: `os.environ["DATABASE_URL"]` throws `KeyError` during lifespan setup.
- **Root Cause**: Direct dictionary subscript without fallback when running in local development without `.env`.
- **Fix**: Use `os.environ.get("DATABASE_URL")` with an automatic fallback to an in-memory dictionary for development.

### Problem: `Save failed: HTTP 404` on Caregiver Dashboard
- **Symptom**: Clicking "Save Game Selection" or "Save Reminder Times" displays `Save failed: HTTP 404`.
- **Root Cause**: In local development, `API_BASE` previously defaulted to `https://smritisetu-backend.onrender.com` instead of the local server.
- **Fix**: Added smart environment resolution in `CaregiverHome.jsx`, `ReminderPage.jsx`, and `GamesPage.jsx` to fallback to `http://localhost:8000` when running locally on localhost, and added `frontend/.env.development`.

---

## 3. Git & Version Control Issues

### Problem: `warning: adding embedded git repository: frontend/public/games/game_4`
- **Symptom**: Git refuses to stage or commit assets inside game folders.
- **Root Cause**: A nested `.git/` folder was present inside `game_4` and `game_5`.
- **Fix**: Remove the nested `.git` folders so the root repository tracks all game assets cleanly.
