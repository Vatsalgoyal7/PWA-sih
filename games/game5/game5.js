/* ============================================================
   Bhinno Ke? (Which Is Different?) — Game 5, SmritiSetu
   Selective Attention / Distractor Discrimination Task
   Vanilla JavaScript (No TypeScript)
   Strictly adheres to SmritiSetu UI/UX doc & Friend Game design:
   - No timers, no scores, no failure buzzers / red-X
   - Gentle, warm positive reinforcement
   - Persistent Avatar (gentle during play, happy on complete)
   - ElevenLabs "Zara" voice cues with audio fallback
   - Silent caregiver telemetry
   ============================================================ */

const IMG_DIR = 'Assets/';
const AUD_DIR = 'Assets/Audios/';

/* ---------- Voice Cues (ElevenLabs Zara voice) ---------- */
const CUES = {
  intro:         { as: 'g5_intro_welcome.mp3',   en: 'g5_intro_welcome_en.mp3' },
  roundPrompt:   { as: 'g5_round_prompt.mp3',    en: 'g5_round_prompt_en.mp3' },
  correct:       { as: 'g5_correct.mp3',         en: 'g5_correct_en.mp3' },
  retryGentle:   { as: 'g5_retry_gentle.mp3',    en: 'g5_retry_gentle_en.mp3' },
  levelComplete: { as: 'g5_level_complete.mp3',  en: 'g5_level_complete_en.mp3' },
  helpPrompt:    { as: 'g5_help_prompt.mp3',     en: 'g5_help_prompt_en.mp3' },
};

/* Avatar assets */
const AVATAR = {
  gentle: { img: 'avatar_gentle.webp', as: 'অৱতাৰ' },
  happy:  { img: 'avatar_happy.webp',  as: 'অৱতাৰ' }
};

/* ---------- Selective Attention Rounds Data ---------- */
const ROUNDS_DATA = [
  /* Round 1: Gamosa (Border Color Discrimination) */
  {
    categoryAs: 'গামোচা',
    categoryEn: 'Gamosa',
    items: [
      {
        id: 'gamosa_red_1',
        as: 'ৰঙা গামোচা',
        en: 'Red Gamosa',
        isDifferent: false,
        img: 'gamosa_red.webp'
      },
      {
        id: 'gamosa_green',
        as: 'সেউজীয়া গামোচা',
        en: 'Green Gamosa',
        isDifferent: true, /* THE ODD ONE OUT */
        img: 'gamosa_green.webp'
      },
      {
        id: 'gamosa_red_2',
        as: 'ৰঙা গামোচা',
        en: 'Red Gamosa',
        isDifferent: false,
        img: 'gamosa_red.webp'
      },
      {
        id: 'gamosa_red_3',
        as: 'ৰঙা গামোচা',
        en: 'Red Gamosa',
        isDifferent: false,
        img: 'gamosa_red.webp'
      }
    ]
  },

  /* Round 2: Jaapi (Traditional Conical Hat vs Decorated Jaapi) */
  {
    categoryAs: 'জাপি',
    categoryEn: 'Jaapi',
    items: [
      {
        id: 'jaapi_trad_1',
        as: 'পৰম্পৰাগত জাপি',
        en: 'Traditional Jaapi',
        isDifferent: false,
        img: 'jaapi_traditional.webp'
      },
      {
        id: 'jaapi_trad_2',
        as: 'পৰম্পৰাগত জাপি',
        en: 'Traditional Jaapi',
        isDifferent: false,
        img: 'jaapi_traditional.webp'
      },
      {
        id: 'jaapi_trad_3',
        as: 'পৰম্পৰাগত জাপি',
        en: 'Traditional Jaapi',
        isDifferent: false,
        img: 'jaapi_traditional.webp'
      },
      {
        id: 'jaapi_floral',
        as: 'ফুল বচা জাপি',
        en: 'Decorated Jaapi',
        isDifferent: true, /* THE ODD ONE OUT */
        img: 'jaapi_floral.webp'
      }
    ]
  },

  /* Round 3: Utensils (Brass Bowl vs Earthen Clay Pot) */
  {
    categoryAs: 'বাটি আৰু পাত্ৰ',
    categoryEn: 'Utensils',
    items: [
      {
        id: 'kahor_bati_1',
        as: 'কাঁহৰ বাটি',
        en: 'Brass Bowl',
        isDifferent: false,
        img: 'kahor_bati.webp'
      },
      {
        id: 'matir_koli',
        as: 'মাটিৰ পাত্ৰ',
        en: 'Clay Pot',
        isDifferent: true, /* THE ODD ONE OUT */
        img: 'matir_koli.webp'
      },
      {
        id: 'kahor_bati_2',
        as: 'কাঁহৰ বাটি',
        en: 'Brass Bowl',
        isDifferent: false,
        img: 'kahor_bati.webp'
      },
      {
        id: 'kahor_bati_3',
        as: 'কাঁহৰ বাটি',
        en: 'Brass Bowl',
        isDifferent: false,
        img: 'kahor_bati.webp'
      }
    ]
  },

  /* Round 4: Assamese Jolpan (Til Pitha vs Ghila Pitha) */
  {
    categoryAs: 'অসমীয়া পিঠা',
    categoryEn: 'Assamese Pitha',
    items: [
      {
        id: 'til_pitha_1',
        as: 'তিল পিঠা',
        en: 'Til Pitha',
        isDifferent: false,
        img: 'til_pitha.webp'
      },
      {
        id: 'ghila_pitha',
        as: 'ঘিলা পিঠা',
        en: 'Ghila Pitha',
        isDifferent: true, /* THE ODD ONE OUT */
        img: 'ghila_pitha.webp'
      },
      {
        id: 'til_pitha_2',
        as: 'তিল পিঠা',
        en: 'Til Pitha',
        isDifferent: false,
        img: 'til_pitha.webp'
      },
      {
        id: 'til_pitha_3',
        as: 'তিল পিঠা',
        en: 'Til Pitha',
        isDifferent: false,
        img: 'til_pitha.webp'
      }
    ]
  },

  /* Round 5: Traditional Crafts (Hand Fan vs Xorai) */
  {
    categoryAs: 'পৰম্পৰাগত সামগ্ৰী',
    categoryEn: 'Traditional Crafts',
    items: [
      {
        id: 'bishoni_1',
        as: 'বাঁহৰ বিচনী',
        en: 'Bamboo Hand Fan',
        isDifferent: false,
        img: 'bishoni.webp'
      },
      {
        id: 'bishoni_2',
        as: 'বাঁহৰ বিচনী',
        en: 'Bamboo Hand Fan',
        isDifferent: false,
        img: 'bishoni.webp'
      },
      {
        id: 'xorai_tray',
        as: 'কাঁহৰ শৰাই',
        en: 'Brass Xorai',
        isDifferent: true, /* THE ODD ONE OUT */
        img: 'xorai.webp'
      },
      {
        id: 'bishoni_3',
        as: 'বাঁহৰ বিচনী',
        en: 'Bamboo Hand Fan',
        isDifferent: false,
        img: 'bishoni.webp'
      }
    ]
  },

  /* Round 6: Bell Metal Ceremonial Artifacts (Xorai vs Kahor Bati) */
  {
    categoryAs: 'কাঁহৰ বাচন',
    categoryEn: 'Bell Metal Artifacts',
    items: [
      {
        id: 'xorai_1',
        as: 'কাঁহৰ শৰাই',
        en: 'Brass Xorai',
        isDifferent: false,
        img: 'xorai.webp'
      },
      {
        id: 'kahor_bati_alt',
        as: 'কাঁহৰ বাটি',
        en: 'Brass Bowl',
        isDifferent: true, /* THE ODD ONE OUT */
        img: 'kahor_bati.webp'
      },
      {
        id: 'xorai_2',
        as: 'কাঁহৰ শৰাই',
        en: 'Brass Xorai',
        isDifferent: false,
        img: 'xorai.webp'
      },
      {
        id: 'xorai_3',
        as: 'কাঁহৰ শৰাই',
        en: 'Brass Xorai',
        isDifferent: false,
        img: 'xorai.webp'
      }
    ]
  },

  /* Round 7: Cultural Symbols (Gamosa vs Jaapi) */
  {
    categoryAs: 'অসমীয়া গৌৰৱ',
    categoryEn: 'Assamese Cultural Symbols',
    items: [
      {
        id: 'gamosa_final_1',
        as: 'ৰঙা গামোচা',
        en: 'Red Gamosa',
        isDifferent: false,
        img: 'gamosa_red.webp'
      },
      {
        id: 'gamosa_final_2',
        as: 'ৰঙা গামোচা',
        en: 'Red Gamosa',
        isDifferent: false,
        img: 'gamosa_red.webp'
      },
      {
        id: 'jaapi_final',
        as: 'পৰম্পৰাগত জাপি',
        en: 'Traditional Jaapi',
        isDifferent: true, /* THE ODD ONE OUT */
        img: 'jaapi_traditional.webp'
      },
      {
        id: 'gamosa_final_3',
        as: 'ৰঙা গামোচা',
        en: 'Red Gamosa',
        isDifferent: false,
        img: 'gamosa_red.webp'
      }
    ]
  }
];

/* ============ Game State ============ */
let currentRoundIndex = 0;
let currentRoundItems = [];
let roundAttempts = 0;
let lastScreenCue = null;
let translationOn = false;
let audioUnlocked = false;

/* ============ Helpers ============ */
function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

  // Re-label active cards
  document.querySelectorAll('.odd-card').forEach(card => {
    const labelEl = card.querySelector('.card-label');
    if(labelEl){
      labelEl.textContent = translationOn ? labelEl.dataset.en : labelEl.dataset.as;
    }
  });
}

function updateRoundIndicator(){
  const roundText = document.getElementById('roundLabel');
  const asR = `পৰ্যায় ${currentRoundIndex + 1} / ${ROUNDS_DATA.length}`;
  const enR = `Round ${currentRoundIndex + 1} of ${ROUNDS_DATA.length}`;
  roundText.dataset.as = asR;
  roundText.dataset.en = enR;
  roundText.textContent = translationOn ? enR : asR;

  const dots = document.querySelectorAll('#roundDots .round-dot');
  dots.forEach((dot, idx) => {
    if(idx <= currentRoundIndex){
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
  }, 2600);
}



/* Caregiver background telemetry */
function logToCaregiver(entry){
  console.log('[SmritiSetu-Game5 Caregiver Telemetry]:', entry);
}

/* ============ Round Flow Engine ============ */

function startRound(index){
  currentRoundIndex = index;
  roundAttempts = 0;
  updateRoundIndicator();

  const roundData = ROUNDS_DATA[currentRoundIndex];
  // Shuffle cards so odd one isn't always in same position
  currentRoundItems = shuffle(roundData.items);

  const grid = document.getElementById('cardsGrid');
  grid.innerHTML = '';

  currentRoundItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'odd-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', translationOn ? item.en : item.as);

    // Badge for selected state
    const badge = document.createElement('div');
    badge.className = 'card-badge translatable';
    badge.dataset.as = 'বাছিলে';
    badge.dataset.en = 'Selected';
    badge.textContent = translationOn ? 'Selected' : 'বাছিলে';
    card.appendChild(badge);

    // Card Thumbnail (WebP image)
    const thumb = document.createElement('div');
    thumb.className = 'card-thumb';
    const img = document.createElement('img');
    img.src = IMG_DIR + item.img;
    img.alt = translationOn ? item.en : item.as;
    img.className = 'card-img';
    img.loading = 'lazy';
    thumb.appendChild(img);
    card.appendChild(thumb);

    // Card Label
    const label = document.createElement('div');
    label.className = 'card-label translatable';
    label.dataset.as = item.as;
    label.dataset.en = item.en;
    label.textContent = translationOn ? item.en : item.as;
    card.appendChild(label);

    // Tap Handler
    const handleTap = () => {
      onCardTapped(item, card);
    };

    card.addEventListener('click', handleTap);
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        handleTap();
      }
    });

    grid.appendChild(card);
  });

  showScreen('screen-game');
  playCue(CUES.roundPrompt);
}

function onCardTapped(item, cardEl){
  roundAttempts++;

  // Caregiver Telemetry
  logToCaregiver({
    action: 'card_selected',
    round: currentRoundIndex + 1,
    itemId: item.id,
    isDifferent: item.isDifferent,
    attempts: roundAttempts,
    timestamp: new Date().toISOString()
  });

  if(item.isDifferent){
    // CORRECT! (Found the odd one out)
    cardEl.classList.add('correct');
    
    // Disable other cards temporarily
    document.querySelectorAll('.odd-card').forEach(c => {
      c.style.pointerEvents = 'none';
    });

    playCue(CUES.correct);
    showToast('একদম শুদ্ধ! বৰ ধুনীয়া হৈছে, এইটোৱেই বেলেগ আছিল।', 'Exactly right! Very well done, this was the different one.');

    setTimeout(() => {
      if(currentRoundIndex + 1 < ROUNDS_DATA.length){
        startRound(currentRoundIndex + 1);
      } else {
        finishGame();
      }
    }, 1800);

  } else {
    // WRONG (Tapped one of the identical ones)
    // Dementia-Friendly Rule: NO RED X, NO BUZZER, NO PENALTY!
    cardEl.classList.add('gentle-retry');
    setTimeout(() => {
      cardEl.classList.remove('gentle-retry');
    }, 500);

    playCue(CUES.retryGentle);
    showToast('এইবোৰ একেই আছে, বাকী কেইটাও ভালদৰে চাওকচোন।', 'These are the same, take another close look at the rest.');
  }
}

function startGame(){
  currentRoundIndex = 0;
  startRound(0);
}

function finishGame(){
  setAvatar(document.getElementById('heroImageComplete'), AVATAR.happy);
  showScreen('screen-complete');
  playCue(CUES.levelComplete);

  logToCaregiver({
    action: 'game5_completed',
    totalRounds: ROUNDS_DATA.length,
    timestamp: new Date().toISOString()
  });
}

function resetToHome(){
  currentRoundIndex = 0;
  showScreen('screen-home');
  setAvatar(document.getElementById('heroImage'), AVATAR.gentle);
  playCue(CUES.intro);
}

/* ============ Wiring ============ */

document.getElementById('btnPlay').addEventListener('click', () => {
  startGame();
});

document.getElementById('btnPlayAgain').addEventListener('click', () => {
  startGame();
});

document.getElementById('btnGoHome').addEventListener('click', () => {
  resetToHome();
});

document.getElementById('btnHome').addEventListener('click', () => {
  resetToHome();
});

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
  lastScreenCue = isComplete ? CUES.levelComplete : (isGameActive ? CUES.roundPrompt : CUES.intro);
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
