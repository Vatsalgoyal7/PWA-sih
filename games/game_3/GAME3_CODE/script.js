/* ==========================================================================
   SmritiSetu — Game 3 "কʼত গʼল?" (Where Did It Go?)
   Screen flow, narration, animation, feedback, and silent telemetry.
   No timers. No score shown to the patient. Home always escapes to 1 level.
   ========================================================================== */

const AUDIO_DIR = "Assets/Audios/";

const AUDIO = {
  introWelcome:        "snd_intro_welcome.mp3",
  riverStart:           "snd_scene_river_start.mp3",
  riverTurnLeft:        "snd_scene_river_turn_left.mp3",
  riverQuestion:        "snd_prompt_river_question.mp3",
  riverRepeat:          "snd_prompt_repeat_river.mp3",
  villageStart:         "snd_scene_village_start.mp3",
  villageTurnRight:     "snd_scene_village_turn_right.mp3",
  villageQuestion:      "snd_prompt_village_question.mp3",
  feedbackCorrect:      "snd_feedback_correct.mp3",
  feedbackIncorrect:    "snd_feedback_incorrect.mp3",
  gameComplete:         "snd_game_complete.mp3",
};

// Correct answers per scenario, matched against the narrated animation.
const CORRECT_ANSWER = { river: "left", village: "right" };

// Current UI language ("as" | "en"). Every [data-i18n-as]/[data-i18n-en]
// element is fully replaced on switch — the two languages never mix.
let lang = "as";
const lastOutcome = { river: null, village: null }; // true/false/null per scenario
let currentCaption = null; // { scenario, phase } — re-rendered on language switch

const SCENE_CAPTIONS = {
  river: {
    start: {
      as: "চাওক চোন, আমাৰ সৰু নাওখন নদীয়েদি আগবাঢ়ি গৈ আছে... কেতিয়াবা বাওঁফালে, কেতিয়াবা সোঁফালে।",
      en: "Look, our little boat is moving along the river... sometimes to the left, sometimes to the right.",
    },
    turn: {
      as: "চাওক, এইয়া তামোল গছজোপাৰ ওচৰত গৈ... নাওখন বাওঁফালে ঘূৰি গ'ল। ভাল ধৰণে মনত ৰাখিব দেই।",
      en: "See, right near the betel nut tree... the boat turned to the left. Keep that in mind!",
    },
  },
  village: {
    start: {
      as: "এইবাৰ আমি আমাৰ গাঁৱৰ আলিয়েদি থম থম কৈ আগবাঢ়ি গৈ আছোঁ... আলিখন আগেয়েদি দুফালে ভাগ হৈছে।",
      en: "This time we are strolling down our village path... up ahead, the path splits in two.",
    },
    turn: {
      as: "চাওক, এইয়া চাং ঘৰখনৰ ওচৰ পাইয়েই... সোঁফালৰ আলিয়েদি আগবাঢ়ি গ'ল।",
      en: "Look, right as the stilt house came into view... they turned down the path on the right.",
    },
  },
};

function setCaption(scenario, phase) {
  currentCaption = { scenario, phase };
  applyCaption();
}

function applyCaption() {
  if (!currentCaption) return;
  const { scenario, phase } = currentCaption;
  const el = document.getElementById(`caption-${scenario}`);
  if (el) el.textContent = SCENE_CAPTIONS[scenario][phase][lang];
}

const FEEDBACK_TEXT = {
  correct: {
    as: "বাহ্! বৰ ধুনীয়া হৈছে! একেবাৰে সঠিক উত্তৰ!",
    en: "Wonderful! You remembered it perfectly!",
  },
  incorrect: {
    river: {
      as: "কোনো কথা নাই... নাওখন কিন্তু বাওঁফালৰ ৰাস্তায়েদিহে গৈছিল।",
      en: "No worries — the boat actually turned left.",
    },
    village: {
      as: "কোনো কথা নাই... আলিখন কিন্তু সোঁফালৰ ৰাস্তায়েদিহে গৈছিল।",
      en: "No worries — the path actually turned right.",
    },
  },
};

function applyFeedbackText(scenario) {
  const isCorrect = lastOutcome[scenario];
  if (isCorrect === null) return;
  const text = document.getElementById(`feedback-text-${scenario}`);
  text.textContent = isCorrect
    ? FEEDBACK_TEXT.correct[lang]
    : FEEDBACK_TEXT.incorrect[scenario][lang];
}

function setLanguage(next) {
  lang = next;
  document.querySelectorAll("[data-i18n-as]").forEach((el) => {
    el.textContent = lang === "as" ? el.dataset.i18nAs : el.dataset.i18nEn;
  });
  // The toggle always shows the *other* language's name, so tapping it
  // switches away from whatever is currently on screen.
  document.getElementById("lang-toggle-label").textContent =
    lang === "as" ? "EN" : "AS";
  document.getElementById("btn-translate").setAttribute("aria-pressed", lang === "en");
  applyFeedbackText("river");
  applyFeedbackText("village");
  applyCaption();
}

const player = document.getElementById("audio-player");

// Tracks what the Repeat button should re-play on the current screen.
let currentNarration = null;

// Tracks how many times the person has asked to repeat on the active prompt —
// logged silently for the caregiver dashboard, never shown to the patient.
let repeatCount = 0;

let state = { screen: "home", promptsNeeded: { river: 0, village: 0 } };

/* ------------------------------- Audio ------------------------------- */

function playAudio(fileKeyOrName, onEnded) {
  const file = AUDIO[fileKeyOrName] || fileKeyOrName;
  currentNarration = file;
  player.pause();
  player.currentTime = 0;
  player.src = AUDIO_DIR + file;
  player.onended = onEnded || null;
  // Autoplay can be blocked before any user gesture; the person always has
  // a tap-driven path forward regardless (choice cards, Play, Repeat).
  player.play().catch(() => {});
}

function repeatCurrentNarration() {
  repeatCount += 1;
  if (state.screen === "prompt-river") {
    playAudio("riverRepeat");
  } else if (currentNarration) {
    playAudio(currentNarration);
  }
}

/* ------------------------------ Screens ------------------------------- */

function goTo(screenName) {
  state.screen = screenName;
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.toggle("active", el.dataset.screen === screenName);
  });
  updateHeaderVisibility(screenName);
  enterScreen(screenName);
}

// On the home screen only, show just the language toggle and Listen —
// Home and Help are hidden there since there's nowhere "back" to go yet
// and no gameplay to explain. Both return on every other screen.
function updateHeaderVisibility(screenName) {
  const isHome = screenName === "home";
  document.getElementById("btn-home").hidden = isHome;
  document.getElementById("btn-help").hidden = isHome;
}

function enterScreen(screenName) {
  switch (screenName) {
    case "home":
      resetScene("boat");
      resetScene("walker");
      currentCaption = null;
      playAudio("introWelcome");
      break;

    case "scene-river":
      repeatCount = 0;
      runRiverScene();
      break;

    case "prompt-river":
      setChoicesEnabled("river", true);
      playAudio("riverQuestion");
      break;

    case "scene-village":
      repeatCount = 0;
      runVillageScene();
      break;

    case "prompt-village":
      setChoicesEnabled("village", true);
      playAudio("villageQuestion");
      break;

    case "complete":
      playAudio("gameComplete");
      break;
  }
}

/* --------------------------- Scene animation --------------------------- */

function resetScene(id) {
  const el = document.getElementById(id);
  el.classList.remove("at-marker", "turned");
}

function runRiverScene() {
  resetScene("boat");
  const boat = document.getElementById("boat");

  setCaption("river", "start");
  playAudio("riverStart", () => {
    boat.classList.add("at-marker");
    window.setTimeout(() => {
      setCaption("river", "turn");
      playAudio("riverTurnLeft", () => {
        boat.classList.add("turned");
        window.setTimeout(() => goTo("prompt-river"), 2200);
      });
    }, 2600);
  });
}

function runVillageScene() {
  resetScene("walker");
  const walker = document.getElementById("walker");

  setCaption("village", "start");
  playAudio("villageStart", () => {
    walker.classList.add("at-marker");
    window.setTimeout(() => {
      setCaption("village", "turn");
      playAudio("villageTurnRight", () => {
        walker.classList.add("turned");
        window.setTimeout(() => goTo("prompt-village"), 2200);
      });
    }, 2600);
  });
}

/* ------------------------------- Choices ------------------------------- */

function setChoicesEnabled(scenario, enabled) {
  document
    .querySelectorAll(`.choices[data-scenario="${scenario}"] .choice-card`)
    .forEach((btn) => {
      btn.disabled = !enabled;
      btn.classList.remove("chosen-correct", "chosen-incorrect");
    });
}

function handleChoice(scenario, chosen, btnEl) {
  setChoicesEnabled(scenario, false);
  const isCorrect = chosen === CORRECT_ANSWER[scenario];
  btnEl.classList.add(isCorrect ? "chosen-correct" : "chosen-incorrect");

  logTelemetry(scenario, isCorrect);

  const panel = document.getElementById(`feedback-panel-${scenario}`);
  const avatar = document.getElementById(`feedback-avatar-${scenario}`);

  panel.classList.remove("is-correct", "is-incorrect");
  panel.classList.add(isCorrect ? "is-correct" : "is-incorrect");
  avatar.src = isCorrect ? "Assets/avatar_happy.png" : "Assets/avatar_gentle.png";
  lastOutcome[scenario] = isCorrect;
  applyFeedbackText(scenario);

  goTo(`feedback-${scenario}`);

  playAudio(isCorrect ? "feedbackCorrect" : "feedbackIncorrect", () => {
    goTo(scenario === "river" ? "scene-village" : "complete");
  });
}

document.querySelectorAll(".choice-card").forEach((btn) => {
  btn.addEventListener("click", () => {
    const scenario = btn.closest(".choices").dataset.scenario;
    handleChoice(scenario, btn.dataset.answer, btn);
  });
});

/* ------------------------------ Telemetry ------------------------------
   Silent logging only — never surfaced to the patient (no score, no
   streak, no visible accuracy). Stored locally as a stand-in for the
   caregiver dashboard sync. */

function logTelemetry(scenario, correct) {
  state.promptsNeeded[scenario] += 1;
  const entry = {
    game: "kot-gol",
    scenario,
    correct,
    repeatsUsed: repeatCount,
    timestamp: new Date().toISOString(),
  };
  try {
    const log = JSON.parse(localStorage.getItem("smritisetu_telemetry") || "[]");
    log.push(entry);
    localStorage.setItem("smritisetu_telemetry", JSON.stringify(log));
  } catch (e) {
    /* telemetry is best-effort only; never blocks the patient experience */
  }
}

/* --------------------------- Persistent controls ------------------------ */

document.getElementById("btn-home").addEventListener("click", () => goTo("home"));
document.getElementById("btn-repeat").addEventListener("click", repeatCurrentNarration);
document.getElementById("btn-play").addEventListener("click", () => goTo("scene-river"));
document.getElementById("btn-again").addEventListener("click", () => goTo("home"));
document.getElementById("btn-translate").addEventListener("click", () => {
  setLanguage(lang === "as" ? "en" : "as");
});

const helpModal = document.getElementById("help-modal");
document.getElementById("btn-help").addEventListener("click", () => {
  helpModal.hidden = false;
});
document.getElementById("btn-help-close").addEventListener("click", () => {
  helpModal.hidden = true;
});
helpModal.addEventListener("click", (e) => {
  if (e.target === helpModal) helpModal.hidden = true; // tap outside the card closes it
});

/* ------------------------ Runtime background cleanup ---------------------
   Several source PNGs (avatar, tree/chang-ghar markers, boat/walker,
   speaker icon) were exported with a baked-in white/checkerboard backdrop
   instead of real alpha transparency. This can't be fixed with CSS alone,
   so this pass reads each image's pixels on load and makes near-white,
   low-saturation pixels transparent, then swaps the cleaned result back in.
   It only touches foreground artwork images, never the full backgrounds.
   NOTE: reading pixel data from a file:// image is blocked by some browsers
   (canvas "tainted" security restriction). If that happens here, the
   original image is left untouched and a console warning is logged — the
   real fix is a properly exported transparent PNG, or serving this folder
   over http://localhost instead of opening index.html directly. */

function stripLightBackground(img) {
  const clean = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = frame.data;
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i], g = px[i + 1], b = px[i + 2];
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const isGrayish = max - min <= 22;   // white/gray checker squares, not real color (widened from 14 to also catch the faint tint on the direction-card icons)
        const isLight = max >= 190;          // both checker tones are light
        if (isGrayish && isLight) px[i + 3] = 0;
      }
      ctx.putImageData(frame, 0, 0);
      img.src = canvas.toDataURL("image/png");
    } catch (e) {
      console.warn(
        "Background auto-clean skipped for " + img.src +
        " — likely blocked by file:// security. Serve over http://localhost, " +
        "or re-export this asset with real transparency.",
        e
      );
    }
  };
  if (img.complete && img.naturalWidth) clean();
  else img.addEventListener("load", clean, { once: true });
}

document
  .querySelectorAll(".avatar, .marker, .focal-obj, .choice-card img, .icon-circle img")
  .forEach(stripLightBackground);

/* --------------------------------- Init --------------------------------- */

setLanguage("as");
goTo("home");
