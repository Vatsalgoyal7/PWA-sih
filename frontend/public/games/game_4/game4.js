/* ============================================================
   Etu Cabo! (Look at This!) — Game 4, SmritiSetu
   Sustained Attention / Vigilance Task
   Vanilla JavaScript (No TypeScript)
   Designed strictly per SmritiSetu UI/UX doc & Friend Game:
   - No timers, no speed pressure, no penalty for misses
   - Gentle, warm positive reinforcement
   - Persistent Avatar (gentle during play, happy on complete)
   - ElevenLabs "Zara" voice cues with graceful audio fallback
   - Silent caregiver telemetry
   ============================================================ */

const IMG_DIR = 'Assets/';
const AUD_DIR = 'Assets/Audios/';

/* ---------- Voice cues (ElevenLabs Zara voice) ---------- */
const CUES = {
  intro:         { as: 'g4_intro_welcome.mp3',      en: 'g4_intro_welcome_en.mp3' },
  gamePrompt:    { as: 'g4_prompt_start.mp3',       en: 'g4_prompt_start_en.mp3' },
  spotted1:      { as: 'g4_spotted_1.mp3',          en: 'g4_spotted_1_en.mp3' },
  spotted2:      { as: 'g4_spotted_2.mp3',          en: 'g4_spotted_2_en.mp3' },
  nudge:         { as: 'g4_nudge_gentle.mp3',       en: 'g4_nudge_gentle_en.mp3' },
  levelComplete: { as: 'g4_level_complete.mp3',     en: 'g4_level_complete_en.mp3' },
  helpPrompt:    { as: 'g4_help_prompt.mp3',        en: 'g4_help_prompt_en.mp3' },
};

/* Avatar assets */
const AVATAR = {
  gentle: { img: 'avatar_gentle.webp', as: 'অৱতাৰ' },
  happy:  { img: 'avatar_happy.webp',  as: 'অৱতাৰ' }
};

/* ---------- Cultural River Targets (Clean inline SVGs for instant crisp display) ---------- */
const TARGETS = [
  {
    id: 'duck',
    as: 'হাঁহ',
    en: 'Duck',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#FFFBF2" stroke="#D8C79E" stroke-width="3"/>
      <!-- Body -->
      <path d="M22 62C22 48 38 42 56 46C70 49 80 58 76 68C72 76 40 78 26 72C23 70 22 66 22 62Z" fill="#F4E8D0" stroke="#7A5835" stroke-width="2.5"/>
      <!-- Wing -->
      <path d="M35 55C42 48 56 50 62 58C56 64 45 66 38 64Z" fill="#E2CEA6" stroke="#7A5835" stroke-width="2"/>
      <!-- Neck & Head -->
      <path d="M52 48C52 38 56 28 66 28C74 28 78 34 76 40C73 45 68 48 64 52" fill="#F4E8D0" stroke="#7A5835" stroke-width="2.5"/>
      <!-- Eye -->
      <circle cx="70" cy="34" r="2.5" fill="#3A2A1D"/>
      <!-- Beak -->
      <path d="M76 35L88 38L77 43Z" fill="#D9A441" stroke="#9F6E1D" stroke-width="1.5"/>
      <!-- Water ripple around duck -->
      <path d="M18 74C30 72 70 72 82 74" stroke="#7C9473" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'boat',
    as: 'নাও',
    en: 'Wooden Boat',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#FFFBF2" stroke="#D8C79E" stroke-width="3"/>
      <!-- Traditional Assamese Dinghy Boat Hull -->
      <path d="M14 54C26 68 74 68 86 54C80 58 65 62 50 62C35 62 20 58 14 54Z" fill="#9F3F22" stroke="#5C2413" stroke-width="2.5"/>
      <path d="M16 54C30 50 70 50 84 54" stroke="#D9A441" stroke-width="2" stroke-linecap="round"/>
      <!-- Boat Roof / Chhoi -->
      <path d="M34 52C34 38 66 38 66 52" fill="#EFE4C6" stroke="#7A5835" stroke-width="2.5"/>
      <path d="M40 39V52M50 38V52M60 39V52" stroke="#7A5835" stroke-width="1.5"/>
      <!-- Oar / Boitha -->
      <line x1="68" y1="46" x2="88" y2="70" stroke="#3A2A1D" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="88" cy="70" rx="4" ry="7" transform="rotate(-30 88 70)" fill="#7A5835"/>
      <!-- Water ripples -->
      <path d="M22 68C38 72 62 72 78 68" stroke="#7C9473" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'fish',
    as: 'মাছ',
    en: 'Golden Fish',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#FFFBF2" stroke="#D8C79E" stroke-width="3"/>
      <!-- Fish Body -->
      <path d="M26 50C38 34 65 38 74 50C65 62 38 66 26 50Z" fill="#D9A441" stroke="#9F6E1D" stroke-width="2.5"/>
      <!-- Tail fin -->
      <path d="M28 50L14 36V64L28 50Z" fill="#C1522F" stroke="#9F3F22" stroke-width="2"/>
      <!-- Dorsal and belly fins -->
      <path d="M48 37C52 30 60 32 64 39" fill="#C1522F" stroke="#9F3F22" stroke-width="1.5"/>
      <path d="M50 63C54 70 60 68 62 61" fill="#C1522F" stroke="#9F3F22" stroke-width="1.5"/>
      <!-- Fish eye -->
      <circle cx="68" cy="46" r="3" fill="#3A2A1D"/>
      <circle cx="69" cy="45" r="1" fill="#FFF"/>
      <!-- Scales pattern -->
      <path d="M42 45C45 48 45 52 42 55M50 44C53 48 53 52 50 56M58 45C61 48 61 52 58 55" stroke="#9F6E1D" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Water splash -->
      <circle cx="82" cy="42" r="2.5" fill="#7C9473"/>
      <circle cx="85" cy="52" r="2" fill="#7C9473"/>
    </svg>`
  },
  {
    id: 'lotus',
    as: 'পদুম',
    en: 'Lotus Flower',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#FFFBF2" stroke="#D8C79E" stroke-width="3"/>
      <!-- Lily Leaf at base -->
      <ellipse cx="50" cy="68" rx="36" ry="10" fill="#7C9473" stroke="#5E7A57" stroke-width="2.5"/>
      <!-- Outer Petals -->
      <path d="M25 64C22 52 34 46 42 58Z" fill="#E89B84" stroke="#C1522F" stroke-width="2"/>
      <path d="M75 64C78 52 66 46 58 58Z" fill="#E89B84" stroke="#C1522F" stroke-width="2"/>
      <!-- Mid Petals -->
      <path d="M34 60C32 44 48 38 50 58Z" fill="#F4B8A6" stroke="#C1522F" stroke-width="2"/>
      <path d="M66 60C68 44 52 38 50 58Z" fill="#F4B8A6" stroke="#C1522F" stroke-width="2"/>
      <!-- Center Petal -->
      <path d="M50 30C43 40 45 55 50 60C55 55 57 40 50 30Z" fill="#FFF0ED" stroke="#C1522F" stroke-width="2.5"/>
      <!-- Yellow carpel center -->
      <ellipse cx="50" cy="55" rx="6" ry="4" fill="#D9A441"/>
    </svg>`
  },
  {
    id: 'butterfly',
    as: 'পখিলা',
    en: 'Butterfly',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#FFFBF2" stroke="#D8C79E" stroke-width="3"/>
      <!-- Wings Top -->
      <path d="M50 48C42 28 20 28 24 50C26 56 46 54 50 48Z" fill="#D9A441" stroke="#9F6E1D" stroke-width="2"/>
      <path d="M50 48C58 28 80 28 76 50C74 56 54 54 50 48Z" fill="#D9A441" stroke="#9F6E1D" stroke-width="2"/>
      <!-- Wings Bottom -->
      <path d="M49 52C42 56 28 64 34 74C40 78 48 64 49 52Z" fill="#C1522F" stroke="#9F3F22" stroke-width="2"/>
      <path d="M51 52C58 56 72 64 66 74C60 78 52 64 51 52Z" fill="#C1522F" stroke="#9F3F22" stroke-width="2"/>
      <!-- Butterfly Body -->
      <ellipse cx="50" cy="50" rx="3" ry="16" fill="#3A2A1D"/>
      <!-- Antennae -->
      <path d="M48 36C44 28 40 30 42 26M52 36C56 28 60 30 58 26" stroke="#3A2A1D" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`
  }
];

/* ============ Game State ============ */
const TOTAL_TARGETS_TO_COMPLETE = 10;
let spottedCount = 0;
let missedConsecutive = 0;
let activeTargetEl = null;
let spawnTimer = null;
let dismissTimer = null;
let currentTargetStartTime = 0;
let lastScreenCue = null;
let translationOn = false;
let audioUnlocked = false;

/* ============ Helpers ============ */
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const targetScreen = document.getElementById(id);
  if(targetScreen) targetScreen.classList.add('active');

  const onHome = (id === 'screen-home');
  document.getElementById('btnHome').style.display = onHome ? 'none' : '';
  document.getElementById('btnHelp').style.display = onHome ? 'none' : '';
}

function playCue(cue){
  if(!cue) return;
  lastScreenCue = cue;
  const filename = (translationOn && cue.en) ? cue.en : cue.as;
  const player = document.getElementById('player');
  player.src = AUD_DIR + filename;

  player.onerror = () => {
    // If translation toggle is on but English clip is missing, fallback to Assamese audio clip
    if(translationOn && filename !== cue.as && cue.as){
      player.src = AUD_DIR + cue.as;
      player.play().catch(() => {});
    }
  };

  const p = player.play();
  if(p && p.then){
    p.then(() => { audioUnlocked = true; })
     .catch(() => {
       /* Handled by unlockAudioOnFirstTouch */
     });
  }
}

function setAvatar(el, item){
  if(!el) return;
  el.innerHTML = '';
  const img = document.createElement('img');
  img.className = 'avatar-img';
  img.alt = item.as;
  img.src = IMG_DIR + item.img;
  img.onerror = () => {
    el.innerHTML = `<div style="font-size:22px; font-weight:800; color:var(--terracotta);">${item.as}</div>`;
  };
  el.appendChild(img);
}

function applyTranslation(){
  document.querySelectorAll('.translatable').forEach(el => {
    if(el.dataset.as && el.dataset.en){
      el.textContent = translationOn ? el.dataset.en : el.dataset.as;
    }
  });
}

function updateStatusDots(){
  const dots = document.querySelectorAll('#statusDots .status-dot');
  dots.forEach((dot, idx) => {
    if(idx < spottedCount){
      dot.classList.add('completed');
    } else {
      dot.classList.remove('completed');
    }
  });
}

function showToast(asMsg, enMsg){
  const toast = document.getElementById('gentleToast');
  toast.dataset.as = asMsg;
  toast.dataset.en = enMsg;
  toast.textContent = translationOn ? enMsg : asMsg;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2400);
}

/* Caregiver background telemetry */
function logToCaregiver(entry){
  console.log('[SmritiSetu-Game4 Caregiver Telemetry]:', entry);
}

/* ============ Sustained Attention Spawning Engine ============ */

function stopSpawning(){
  if(spawnTimer) clearTimeout(spawnTimer);
  if(dismissTimer) clearTimeout(dismissTimer);
  spawnTimer = null;
  dismissTimer = null;
  const container = document.getElementById('targetContainer');
  if(container) container.innerHTML = '';
  activeTargetEl = null;
}

function scheduleNextTarget(delayMs = 3000){
  if(spottedCount >= TOTAL_TARGETS_TO_COMPLETE) return;
  spawnTimer = setTimeout(() => {
    spawnTarget();
  }, delayMs);
}

function spawnTarget(){
  if(spottedCount >= TOTAL_TARGETS_TO_COMPLETE) return;

  const container = document.getElementById('targetContainer');
  container.innerHTML = '';

  const item = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const sceneEl = document.getElementById('riverScene');
  const sceneRect = sceneEl.getBoundingClientRect();

  // Safe coordinate boundaries inside the river area (staying clear of top bank & edges)
  const targetSize = 100;
  const minX = 20;
  const maxX = Math.max(minX + 20, sceneRect.width - targetSize - 20);
  const minY = 90;  // below the top bank
  const maxY = Math.max(minY + 20, sceneRect.height - targetSize - 35);

  const posX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const posY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

  const targetEl = document.createElement('div');
  targetEl.className = 'scene-target';
  targetEl.setAttribute('role', 'button');
  targetEl.setAttribute('tabindex', '0');
  targetEl.setAttribute('aria-label', (translationOn ? item.en : item.as) + ' - Tap to spot');
  targetEl.style.left = posX + 'px';
  targetEl.style.top = posY + 'px';
  targetEl.innerHTML = item.svg;

  currentTargetStartTime = Date.now();
  activeTargetEl = targetEl;

  // Tap handler (touch / click / key)
  const handleTap = (e) => {
    e.stopPropagation();
    onTargetTapped(item, targetEl, posX, posY);
  };

  targetEl.addEventListener('pointerdown', handleTap);
  targetEl.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      handleTap(e);
    }
  });

  container.appendChild(targetEl);

  // Dementia-friendly timing: target stays visible calmly for 8 seconds
  // No countdown shown, no rushing
  dismissTimer = setTimeout(() => {
    onTargetMissed(item);
  }, 8500);
}

function onTargetTapped(item, targetEl, posX, posY){
  if(!activeTargetEl) return;
  if(dismissTimer) clearTimeout(dismissTimer);
  activeTargetEl = null;

  const reactionTimeMs = Date.now() - currentTargetStartTime;
  spottedCount++;
  missedConsecutive = 0;
  updateStatusDots();

  // Ripple effect at tap location
  const scene = document.getElementById('riverScene');
  const ripple = document.createElement('div');
  ripple.className = 'tap-ripple';
  ripple.style.left = (posX + 50) + 'px';
  ripple.style.top = (posY + 50) + 'px';
  scene.appendChild(ripple);
  setTimeout(() => { if(scene.contains(ripple)) scene.removeChild(ripple); }, 650);

  // Target animation
  targetEl.classList.add('tapped');

  // Caregiver silent telemetry
  logToCaregiver({
    action: 'target_spotted',
    targetId: item.id,
    reactionTimeMs,
    totalSpotted: spottedCount,
    timestamp: new Date().toISOString()
  });

  // Alternating positive feedback cue
  const cue = (spottedCount % 2 === 1) ? CUES.spotted1 : CUES.spotted2;
  playCue(cue);

  const asMsg = `বৰ ধুনীয়া! আপুনি ${item.as} দেখা পালে।`;
  const enMsg = `Wonderful! You spotted the ${item.en}.`;
  showToast(asMsg, enMsg);

  // Check completion
  if(spottedCount >= TOTAL_TARGETS_TO_COMPLETE){
    setTimeout(() => {
      finishGame();
    }, 1200);
  } else {
    // Next target appears peacefully after a calm 3-4s gap
    scheduleNextTarget(3500);
  }
}

function onTargetMissed(item){
  if(!activeTargetEl) return;
  activeTargetEl = null;
  missedConsecutive++;

  // Caregiver silent log (no player-facing negative indicator!)
  logToCaregiver({
    action: 'target_lapsed',
    targetId: item.id,
    missedConsecutive,
    timestamp: new Date().toISOString()
  });

  // Soft fade out
  const container = document.getElementById('targetContainer');
  if(container) container.innerHTML = '';

  // If 2 targets pass without tap, avatar gives a warm reassuring voice nudge
  if(missedConsecutive >= 2){
    playCue(CUES.nudge);
    showToast('একো চিন্তা নকৰিব, শান্তভাৱে চাওক...', 'Take your time, look calmly at the water...');
    missedConsecutive = 0;
  }

  // Next target calmly appears
  scheduleNextTarget(4000);
}

function startGame(){
  spottedCount = 0;
  missedConsecutive = 0;
  updateStatusDots();
  showScreen('screen-game');
  playCue(CUES.gamePrompt);
  scheduleNextTarget(2500);
}

function finishGame(){
  stopSpawning();
  setAvatar(document.getElementById('heroImageComplete'), AVATAR.happy);
  showScreen('screen-complete');
  playCue(CUES.levelComplete);

  logToCaregiver({
    action: 'session_complete',
    totalSpotted: spottedCount,
    timestamp: new Date().toISOString()
  });
}

function resetToHome(){
  stopSpawning();
  spottedCount = 0;
  missedConsecutive = 0;
  showScreen('screen-home');
  setAvatar(document.getElementById('heroImage'), AVATAR.gentle);
  playCue(CUES.intro);
}

/* ============ Event Wiring ============ */

document.getElementById('btnPlay').addEventListener('click', () => {
  startGame();
});

document.getElementById('btnPlayAgain').addEventListener('click', () => {
  startGame();
});

document.getElementById('btnGoHome').addEventListener('click', () => {
  resetToHome();
});

document.getElementById('btnHome').addEventListener('click', () => { window.location.href = '/'; });

document.getElementById('btnRepeat').addEventListener('click', () => {
  if(lastScreenCue) playCue(lastScreenCue);
});

document.getElementById('btnHelp').addEventListener('click', () => {
  document.getElementById('helpModal').classList.add('open');
  playCue(CUES.helpPrompt);
});

document.getElementById('btnCloseHelp').addEventListener('click', () => {
  document.getElementById('helpModal').classList.remove('open');
  // Restore screen prompt as active cue
  const isGameActive = document.getElementById('screen-game').classList.contains('active');
  const isComplete = document.getElementById('screen-complete').classList.contains('active');
  lastScreenCue = isComplete ? CUES.levelComplete : (isGameActive ? CUES.gamePrompt : CUES.intro);
});

document.getElementById('btnSpeakHelp').addEventListener('click', () => {
  playCue(CUES.helpPrompt);
});

/* Translation Toggle (EN / AS) */
document.getElementById('btnTranslate').addEventListener('click', () => {
  translationOn = !translationOn;
  const btn = document.getElementById('btnTranslate');
  btn.textContent = translationOn ? 'AS' : 'EN';
  btn.classList.toggle('translation-on', translationOn);
  applyTranslation();

  // Instantly replay narration in the newly toggled language
  const isHelpOpen = document.getElementById('helpModal').classList.contains('open');
  if (isHelpOpen) {
    playCue(CUES.helpPrompt);
  } else if (lastScreenCue) {
    playCue(lastScreenCue);
  }
});

/* Audio Autoplay unlock on first touch */
function unlockAudioOnFirstTouch(){
  if(audioUnlocked) return;
  const player = document.getElementById('player');
  if(player.src){
    player.play().then(() => { audioUnlocked = true; }).catch(() => {});
  }
}
document.addEventListener('pointerdown', unlockAudioOnFirstTouch, { once: true });
document.addEventListener('keydown', unlockAudioOnFirstTouch, { once: true });

/* Init */
window.addEventListener('load', () => {
  resetToHome();
});
