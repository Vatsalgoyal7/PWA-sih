# SmritiSetu Games Ecosystem

SmritiSetu features 10 specialized games designed around evidence-based cognitive stimulation therapy (CST) principles, culturally contextualized for Assam.

---

## 1. Master Game Catalog

| ID | Title (Assamese) | Title (English) | Cognitive Domain | Path | Status |
|---|---|---|---|---|---|
| `game1` | কি উৎসৱ? | Which festival? | Episodic & Semantic Memory | `/games/game_1/index.html` | Active |
| `game2` | কি কি আছিল? | What were they? | Working Memory & Immediate Recall | `/games/game_2/index.html` | Active |
| `game3` | ক'ত গ'ল? | Where did it go? | Spatial Working Memory & Navigation | `/games/game_3/index.html` | Active |
| `game4` | এইটো চাওঁ | Look at this | Sustained Attention & Vigilance | `/games/game_4/index.html` | Active |
| `game5` | ভিন্ন কোন? | Which is different? | Selective Attention & Categorization | `/games/game_5/index.html` | Active |
| `game6` | লগা লৈ যাও | Take along / Match | Functional Association & Daily Tools | `/games/game_6/index.html` | Active |
| `game7` | বসাৰত কি লাগে? | What's needed here? | Practical Reasoning & Daily Context | `/games/game_7/index.html` | Active |
| `game8` | মিলাই দিয়া | Match them | Visual Matching & Pattern Recognition | `/games/game_8/index.html` | Active |
| `game9` | বাকি ক'তটা? | How many are left? | Numerical Cognition & Counting | `/games/game_9/index.html` | Staged / Placeholder |
| `game10` | কি কৰিব? | What should be done? | Executive Function & Decision Making | `/games/game_10/index.html` | Staged / Placeholder |

---

## 2. Directory Layout & Rules

Every game resides inside `frontend/public/games/game_<N>/`.
- **Vite Serving Rule**: Any asset located in `frontend/public/games/game_<N>/` is served statically at `/games/game_<N>/`.
- **Root Entrypoint**: Every game folder must have an `index.html` directly at its root (e.g. `frontend/public/games/game_2/index.html`). Intermediate nested subfolders (such as `GAME2_CODE/`) are prohibited.
- **Git Repository Hygiene**: Game folders must NEVER contain nested `.git` repositories.

---

## 3. In-App Runner & PostMessage Protocol

The React client renders games inside a responsive full-screen iframe overlay:

### Communication Protocol
When an embedded game reaches completion or the user clicks the in-game Home button, the game script executes:

```javascript
function exitToDashboard() {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'EXIT_GAME' }, '*');
      return;
    }
  } catch (e) {}
  window.location.href = '/';
}
```

The host React application listens to the `message` event:

```javascript
useEffect(() => {
  const handleMessage = (e) => {
    if (e.data && e.data.type === "EXIT_GAME") {
      setActiveGame(null);
    }
  };
  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);
```

Additionally, the host runner header displays an always-visible **← খেল বন্ধ কৰি উভতি যাওক / Exit Game** button.

---

## 4. Staging New Games (Game 9 & Game 10)

To replace the staged placeholders with complete game implementations:
1. Place the game's assets inside `frontend/public/games/game_9/` or `game_10/`.
2. Ensure the main HTML file is named `index.html`.
3. Include the `exitToDashboard()` function in the game's primary JavaScript file.
4. No changes to the backend or React frontend are required; the game will immediately work with the caregiver selector and patient launcher!
