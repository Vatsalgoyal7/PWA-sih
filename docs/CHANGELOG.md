# SmritiSetu Comprehensive Changelog

This changelog records all audit findings, modernization work, bug fixes, architecture updates, and cleanups performed on the SmritiSetu project.

---

## 1. Critical Fixes

### Fix 1: Flatten Game 2 Directory Structure
- **File**: `frontend/public/games/game_2/`
- **Problem**: Game 2 assets were located inside `frontend/public/games/game_2/GAME2_CODE/` rather than at the root of `game_2/`.
- **Root Cause**: Inconsistent directory extraction during game asset staging.
- **Fix**: Moved all assets (`Assets/`, `index.html`, `script.js`, `style.css`) to `frontend/public/games/game_2/` and deleted the intermediate folder.
- **Reason**: Enabled the patient dashboard to resolve `/games/game_2/index.html` directly without 404 errors.
- **Validation**: Confirmed presence of `frontend/public/games/game_2/index.html`.

### Fix 2: Flatten Game 3 Directory Structure
- **File**: `frontend/public/games/game_3/`
- **Problem**: Game 3 assets were located inside `frontend/public/games/game_3/GAME3_CODE/`.
- **Root Cause**: Inconsistent directory extraction during game asset staging.
- **Fix**: Moved all assets to `frontend/public/games/game_3/` and deleted `GAME3_CODE/`.
- **Reason**: Enabled `/games/game_3/index.html` to be served statically.
- **Validation**: Confirmed presence of `frontend/public/games/game_3/index.html`.

### Fix 3: Game 1, 2, 3 Home Navigation & PostMessage Protocol
- **Files**:
  - `frontend/public/games/game_1/js/script.js`
  - `frontend/public/games/game_2/script.js`
  - `frontend/public/games/game_3/script.js`
- **Problem**: Clicking the Home icon trapped the user in the game's internal welcome screen.
- **Root Cause**: Event listener was mapped to `showScreen('home')` rather than returning to the host application.
- **Fix**: Added `exitToDashboard()` checking `window.parent.postMessage({ type: 'EXIT_GAME' })` with fallback to `window.location.href = '/'`.
- **Reason**: Enables smooth exit from the game whether loaded in an iframe or opened standalone.
- **Validation**: Verified click handler invocations.

---

## 2. Configuration & Encoding Fixes

### Fix 4: Convert `backend/requirements.txt` to UTF-8
- **File**: `backend/requirements.txt`
- **Problem**: `requirements.txt` was encoded in UTF-16LE with BOM.
- **Root Cause**: Saved via Windows PowerShell redirection defaults.
- **Fix**: Re-encoded in clean standard UTF-8 without BOM.
- **Reason**: UTF-16 causes `pip install` to fail on Linux and Docker build environments.
- **Validation**: Python decoding check confirmed standard UTF-8 format.

### Fix 5: Backend Startup Entrypoint & Lifespan Fallback
- **File**: `backend/main.py`
- **Problem**: Crash on startup if `DATABASE_URL` is omitted, and `python main.py` failed to execute Uvicorn.
- **Root Cause**: Direct subscript of `os.environ["DATABASE_URL"]` and absence of `if __name__ == "__main__":`.
- **Fix**: Implemented safe `os.environ.get("DATABASE_URL")` with an automatic in-memory fallback dictionary for local development, added `health` endpoint, and added `uvicorn.run("main:app")` block.
- **Reason**: Allows local frontend development and API testing without requiring an external PostgreSQL instance.
- **Validation**: Verified Python compile syntax and startup pathways.

### Fix 6: Exclude Public Assets from ESLint
- **File**: `frontend/eslint.config.js`
- **Problem**: `eslint .` checked all legacy game scripts in `frontend/public/games/`.
- **Root Cause**: ESLint flat config only ignored `dist`.
- **Fix**: Added `'public'` to `globalIgnores`.
- **Reason**: Legacy vanilla JS scripts in third-party games should not be parsed under modern React JSX lint rules.
- **Validation**: Verified ESLint ignores public assets.

---

## 3. Architecture & Feature Additions

### Feature 1: Universal Localization System
- **Files**:
  - `frontend/src/context/LanguageContext.jsx`
  - `frontend/src/components/LanguageToggle.jsx`
  - `frontend/src/components/LanguageToggle.css`
  - `frontend/src/App.jsx`
- **Description**: Added a centralized, persistent bilingual context (`as` / `en`) and a reusable accessible `<LanguageToggle />` button placed on all screens (`RoleSelect`, `PatientHome`, `ReminderPage`, `GamesPage`, `CaregiverHome`).
- **Validation**: Verified state changes and translation coverage.

### Feature 2: In-App Seamless Game Runner
- **Files**:
  - `frontend/src/pages/GamesPage.jsx`
  - `frontend/src/pages/GamesPage.css`
- **Description**: Integrated an in-app runner iframe overlay with an accessible header bar and exit button (`← খেল বন্ধ কৰি উভতি যাওক / Exit Game`), listening to `EXIT_GAME` message events.
- **Validation**: Verified runner state rendering and close event handling.

### Feature 3: Live Reminders Integration
- **File**: `frontend/src/pages/ReminderPage.jsx`
- **Description**: Connected patient reminders view to live backend `/patient-config` data with automatic fallback to defaults when offline.
- **Validation**: Verified API call and schedule mapping.

### Feature 4: Games 9 and 10 Cultural Staging Placeholders
- **Files**:
  - `frontend/public/games/game_9/index.html`
  - `frontend/public/games/game_10/index.html`
- **Description**: Created styled Assamese/English "Coming Soon" interfaces with Gamusa aesthetic and exit buttons for Game 9 and Game 10.
- **Validation**: Verified files render with back buttons.

---

## 4. Repository Cleanup

### Cleanup 1: Remove Embedded Git Folders
- **Directories**:
  - `frontend/public/games/game_4/.git`
  - `frontend/public/games/game_5/.git`
  - `frontend/public/games/game_5/.vscode`
- **Reason**: Nested git repositories create gitlink pointer corruptions and prevent tracking of game assets.

### Cleanup 2: Delete Temporary Fix Scripts
- **Files**:
  - `fix_games.py`
  - `fix_game1.py`
- **Reason**: Temporary scratch files removed from repository root.
