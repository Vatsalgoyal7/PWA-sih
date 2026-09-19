/* ============================================================
   Ki Ki Silo? (What Were They?) — Game 2, SmritiSetu
   Built strictly against the SmritiSetu UI/UX doc's shared
   components (§5) and Game-1 screen flow (§3), adapted for a
   working-memory task: presentation -> recall -> gentle feedback.

   Doc-derived rules enforced here:
   - No timers, no score/streak shown to the player (§1.2, §5)
   - No red-X / failure marks, ever (§6 anti-patterns)
   - Avatar is full-bleed, not a small icon (§3 Screen A)
   - Avatar state stays calm/gentle while a question is being
     asked or answered; only the post-submit result screen and
     the completion screen use the happy state (§3 Screen D) —
     no live per-tap reactions, per §1.7's "keep adaptivity
     simple" guidance
   - Single always-visible Repeat control (§5)
   - Real, recognizable Assamese item photos, never generic
     icons/emoji standing in for them (§2 iconography row, §6)
   ============================================================ */

const IMG_DIR = 'Assets/';
const AUD_DIR = 'Assets/Audios/';

/* ---------- item pool (targets) ---------- */
const TARGETS = [
  { id:'gamosa',       as:'গামোচা',        en:'Gamosa',        img:'gamosa_target.png',       audioAs:'item_gamosa.mp3',       audioEn:'item_gamosa_en.mp3' },
  { id:'jaapi',        as:'জাপি',          en:'Jaapi',         img:'jaapi_target.png',        audioAs:'item_jaapi.mp3',        audioEn:'item_jaapi_en.mp3' },
  { id:'xorai',        as:'শৰাই',          en:'Xorai',         img:'xorai_target.png',        audioAs:'item_xorai.mp3',        audioEn:'item_xorai_en.mp3' },
  { id:'tamul_paan',   as:'তামোল-পান',     en:'Tamul-Paan',    img:'tamul_paan_target.png',   audioAs:'item_tamul_paan.mp3',   audioEn:'item_tamul_paan_en.mp3' },
  { id:'kahor_bati',   as:'কাঁহৰ বাটি',    en:'Kahor Bati',    img:'kahor_bati_target.png',   audioAs:'item_kahor_bati.mp3',   audioEn:'item_kahor_bati_en.mp3' },
  { id:'soriohor_tel', as:'সৰিয়হৰ তেল',   en:'Mustard Oil',   img:'soriohor_tel_target.png', audioAs:'item_soriohor_tel.mp3', audioEn:'item_soriohor_tel_en.mp3' },
  { id:'bishoni',      as:'বিচনী',         en:'Bishoni',       img:'bishoni_target.png',      audioAs:'item_bishoni.mp3',      audioEn:'item_bishoni_en.mp3' },
  { id:'matir_koli',   as:'মাটিৰ কলি',     en:'Matir Koli',    img:'matir_koli_target.png',   audioAs:'item_matir_koli.mp3',   audioEn:'item_matir_koli_en.mp3' },
  { id:'jolpan_bowl',  as:'জলপান',         en:'Jolpan',        img:'jolpan_bowl_target.png',  audioAs:'item_jolpan.mp3',       audioEn:'item_jolpan_en.mp3' },
  { id:'pitha',        as:'পিঠা',          en:'Pitha',         img:'pitha_target.png',        audioAs:'item_pitha.mp3',        audioEn:'item_pitha_en.mp3' },
  { id:'kol',          as:'কল',            en:'Banana',        img:'kol_target.png',          audioAs:'item_kol.mp3',          audioEn:'item_kol_en.mp3' },
];

/* ---------- distractor pool (never shown, only offered as decoys) ---------- */
const DISTRACTORS = [
  { id:'broom',       as:'ঝাৰু',        en:'Broom',       img:'broom_distractor.png',       audioAs:'item_phatoni.mp3',     audioEn:'item_phatoni_en.mp3' },
  { id:'lantern',     as:'চাকি',        en:'Lamp',        img:'lantern_distractor.png',     audioAs:'item_chaki_lamp.mp3',  audioEn:'item_chaki_lamp_en.mp3' },
  { id:'plain_cloth', as:'বগা কাপোৰ',   en:'Plain Cloth', img:'plain_cloth_distractor.png', audioAs:'item_plain_cloth.mp3', audioEn:'item_plain_cloth_en.mp3' },
  { id:'glass_cup',   as:'কাঁচৰ গ্লাছ', en:'Glass Cup',   img:'glass_cup_distractor.png',   audioAs:'item_glass.mp3',       audioEn:'item_glass_en.mp3' },
];

/* real avatar assets — two states used: gentle (default, throughout
   questioning) and happy (only on a fully-correct result / level
   complete, per doc §3 Screen D's binary correct/incorrect framing).
   avatar_idle.png is supplied but not used by this flow. */
const AVATAR = {
  gentle: { img:'avatar_gentle.png', as:'অৱতাৰ' },
  happy:  { img:'avatar_happy.png',  as:'অৱতাৰ' },
};

/* ---------- game-flow voice cues (exact PDF filenames) ---------- */
/* each cue now has an Assamese file (as recorded) and an English
   counterpart (_en suffix) — playCue() below picks whichever
   matches the current translation-toggle state automatically */
const CUES = {
  intro:            { as:'g2_intro_welcome.mp3',            en:'g2_intro_welcome_en.mp3' },
  presentPrompt:    { as:'g2_presentation_prompt.mp3',      en:'g2_presentation_prompt_en.mp3' },
  recallPrompt:     { as:'g2_recall_prompt.mp3',            en:'g2_recall_prompt_en.mp3' },
  levelComplete:    { as:'g2_level_complete.mp3',           en:'g2_level_complete_en.mp3' },
  correct:          { as:'g2_feedback_correct.mp3',         en:'g2_feedback_correct_en.mp3' },
  wrongGentle:      { as:'g2_feedback_wrong_gentle.mp3',    en:'g2_feedback_wrong_gentle_en.mp3' },
  partial1:         { as:'g2_feedback_partial.mp3',         en:'g2_feedback_partial_en.mp3' },
  partial2:         { as:'g2_feedback_partial_2.mp3',       en:'g2_feedback_partial_2_en.mp3' },
  partial3:         { as:'g2_feedback_partial_3.mp3',       en:'g2_feedback_partial_3_en.mp3' },
  partial4:         { as:'g2_feedback_partial_4.mp3',       en:'g2_feedback_partial_4_en.mp3' },
  partial5:         { as:'g2_feedback_partial_5.mp3',       en:'g2_feedback_partial_5_en.mp3' },
  repeatButton:     { as:'ui_button_repeat.mp3',            en:'ui_button_repeat_en.mp3' },
  helpPrompt:       { as:'ui_help_prompt.mp3',              en:'ui_help_prompt_en.mp3' },
};

/* ---------- difficulty: item count grows, no speed pressure (doc §1.2) ---------- */
/* every round's recall grid = showCount + distractorCount, capped
   at 6 images total on screen at once (hard limit) — difficulty
   still ramps via item count (3 -> 4 -> 5 to remember), just with
   fewer decoys to keep the total within the cap */
const ROUNDS = [
  { showCount: 3, distractorCount: 3 },  // 6 total
  { showCount: 4, distractorCount: 2 },  // 6 total
  { showCount: 5, distractorCount: 1 },  // 6 total
];

/* ============ state ============ */
let roundIndex = 0;
let currentShown = [];      // items actually presented this round
let currentChoices = [];    // shown + distractors, shuffled, for recall
let selectedIds = new Set();
let lastScreenCue = null;   // for the repeat button
let translationOn = false;  // Assamese is the default/primary channel
let audioUnlocked = false;  // true once the browser has actually let audio play

/* ============ helpers ============ */

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function pickItems(pool, count, excludeIds=[]){
  const available = pool.filter(it => !excludeIds.includes(it.id));
  return shuffle(available).slice(0, count);
}

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // Home/Help are redundant on the home screen itself — hidden there,
  // shown on every other screen. Translate + Listen stay visible always.
  const onHome = (id === 'screen-home');
  document.getElementById('btnHome').style.display = onHome ? 'none' : '';
  document.getElementById('btnHelp').style.display = onHome ? 'none' : '';
}

function playCue(cue){
  lastScreenCue = cue;
  const filename = translationOn ? cue.en : cue.as;
  const player = document.getElementById('player');
  player.src = AUD_DIR + filename;
  const p = player.play();
  if(p && p.then){
    p.then(() => { audioUnlocked = true; })
     .catch(() => { /* blocked by browser autoplay policy, or asset not present yet — captions remain visible either way */ });
  }
}

function buildThumb(item){
  const wrap = document.createElement('div');
  wrap.className = 'thumb';
  const img = document.createElement('img');
  img.src = IMG_DIR + item.img;
  img.alt = item.en;
  img.onerror = () => {
    wrap.removeChild(img);
    wrap.textContent = item.as;
  };
  wrap.appendChild(img);
  wrap.appendChild(buildItemSpeaker(item));
  return wrap;
}

/* single label element per item, swapped in place (not shown below
   the Assamese line) when translation is toggled */
function buildLabel(item){
  const label = document.createElement('div');
  label.className = 'label translatable';
  label.dataset.as = item.as;
  label.dataset.en = item.en;
  label.textContent = translationOn ? item.en : item.as;
  return label;
}

/* plays an item's own pronunciation clip (item_gamosa.mp3 etc.) —
   kept separate from playCue/lastScreenCue so tapping an item's
   speaker icon never changes what the global Repeat button replays */
function playItemAudio(item){
  const filename = translationOn ? item.audioEn : item.audioAs;
  const player = document.getElementById('player');
  player.src = AUD_DIR + filename;
  player.play().catch(()=>{ /* asset not present yet — fail silently */ });
}

/* small speaker-icon button under every item's image, in every grid
   (presentation, recall, feedback reveal) — tap to hear that item's
   name. stopPropagation so it never also toggles a recall card's
   selection state. */
function buildItemSpeaker(item){
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'item-speaker-btn';
  btn.setAttribute('aria-label', 'Listen: ' + item.as);
  const img = document.createElement('img');
  img.src = 'Assets/icon_speaker.png';
  img.alt = 'Listen';
  btn.appendChild(img);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    playItemAudio(item);
  });
  return btn;
}

/* renders the avatar as a real <img> (not a CSS background), with
   mix-blend-mode:screen so the PNG's black background blends away
   into the container's own background color instead of showing as
   a solid black rectangle behind the character */
function setAvatar(el, item){
  if(!el) return;
  el.innerHTML = '';
  el.classList.remove('avatar-fallback');
  const img = document.createElement('img');
  img.className = 'avatar-img';
  img.alt = item.as;
  img.src = IMG_DIR + item.img;
  img.onerror = () => {
    el.removeChild(img);
    el.classList.add('avatar-fallback');
    el.textContent = item.as;
  };
  el.appendChild(img);
}

/* replaces Assamese with English (or back) on every marked element —
   in place, same line, not a second line underneath */
function applyTranslation(){
  document.querySelectorAll('.translatable').forEach(el => {
    el.textContent = translationOn ? el.dataset.en : el.dataset.as;
  });
}

/* ============ screen: presentation ============ */

function startRound(){
  const cfg = ROUNDS[roundIndex];
  currentShown = pickItems(TARGETS, cfg.showCount);
  selectedIds = new Set();

  const grid = document.getElementById('presentGrid');
  grid.innerHTML = '';
  currentShown.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.appendChild(buildThumb(item));
    card.appendChild(buildLabel(item));
    grid.appendChild(card);
  });

  showScreen('screen-present');
  playCue(CUES.presentPrompt);
}

/* ============ screen: recall ============ */

function startRecall(){
  const cfg = ROUNDS[roundIndex];
  const decoys = pickItems(DISTRACTORS, cfg.distractorCount);
  currentChoices = shuffle([...currentShown, ...decoys]);

  const grid = document.getElementById('recallGrid');
  grid.innerHTML = '';
  currentChoices.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card tappable';
    card.tabIndex = 0;
    card.setAttribute('role','button');
    card.dataset.id = item.id;
    card.appendChild(buildThumb(item));
    const badge = document.createElement('div'); badge.className='check-badge'; badge.textContent='বাছিলে';
    card.appendChild(badge);
    card.appendChild(buildLabel(item));

    /* selection toggles only the card's own state — the avatar stays
       gentle throughout recall, no live per-tap reaction (doc §1.7) */
    const toggle = () => {
      if(selectedIds.has(item.id)){
        selectedIds.delete(item.id);
        card.classList.remove('selected');
      } else {
        selectedIds.add(item.id);
        card.classList.add('selected');
      }
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); }});

    grid.appendChild(card);
  });

  showScreen('screen-recall');
  playCue(CUES.recallPrompt);
}

/* ============ screen: feedback ============ */

function submitRecall(){
  const shownIds = new Set(currentShown.map(i => i.id));
  let correctCount = 0;
  selectedIds.forEach(id => { if(shownIds.has(id)) correctCount++; });
  const total = currentShown.length;

  // silent caregiver-side log only — never shown to the player as a score (doc §5)
  logToCaregiver({ round: roundIndex+1, total, correctCount, selected:[...selectedIds] });

  const as = document.getElementById('feedbackAs');

  /* doc §3 Screen D is a binary correct/incorrect avatar reaction —
     fully correct = happy; anything short of that (partial or zero)
     is treated as the doc's gentle "Incorrect" case, not a third
     invented state */
  let cue;
  if(correctCount === total){
    cue = CUES.correct;
    as.dataset.as = 'একদম শুদ্ধ! বৰ ধুনীয়া হৈছে।';
    as.dataset.en = 'Absolutely correct! Well done.';
  } else if(correctCount === 0){
    cue = CUES.wrongGentle;
    as.dataset.as = 'একো কথা নাই, চাওকচোন— ইয়াত গামোচা আৰু বাটি আছিল।';
    as.dataset.en = 'No problem at all, look closely— a gamosa and a bowl were here.';
  } else {
    const map = {1:CUES.partial1, 2:CUES.partial2, 3:CUES.partial3, 4:CUES.partial4, 5:CUES.partial5};
    cue = map[correctCount] || CUES.wrongGentle;
    const asWord = {1:'এটা',2:'দুটা',3:'তিনিটা',4:'চাৰিটা',5:'পাঁচটা'}[correctCount] || `${correctCount}`;
    const enWord = correctCount === 1 ? 'one' : `${correctCount}`;
    as.dataset.as = `আপুনি ${asWord} শুদ্ধকৈ বাছিলে! বাকী কেইটাও চাওকচোন।`;
    as.dataset.en = `You got ${enWord} right! Take a look at the remaining ones too.`;
  }
  as.textContent = translationOn ? as.dataset.en : as.dataset.as;

  const grid = document.getElementById('revealGrid');
  grid.innerHTML = '';
  currentChoices.forEach(item => {
    const wasShown = shownIds.has(item.id);
    const card = document.createElement('div');
    card.className = 'item-card' + (wasShown ? ' was-shown' : '');
    card.appendChild(buildThumb(item));
    const tag = document.createElement('div'); tag.className='tag translatable';
    tag.dataset.as = 'দেখা গৈছিল'; tag.dataset.en = 'Shown';
    tag.textContent = translationOn ? tag.dataset.en : tag.dataset.as;
    card.appendChild(tag);
    card.appendChild(buildLabel(item));
    grid.appendChild(card);
  });

  showScreen('screen-feedback');
  playCue(cue);
}

/* silent logging stub — wire this to the real caregiver-dashboard
   endpoint later; the player never sees this data. */
function logToCaregiver(entry){
  console.log('[caregiver-log]', entry);
}

/* ============ round / level flow ============ */

function nextStep(){
  roundIndex++;
  if(roundIndex >= ROUNDS.length){
    setAvatar(document.getElementById('heroImageComplete'), AVATAR.happy);
    showScreen('screen-complete');
    playCue(CUES.levelComplete);
  } else {
    startRound();
  }
}

function resetGame(){
  roundIndex = 0;
}

/* ============ wiring ============ */

document.getElementById('btnPlay').addEventListener('click', () => {
  resetGame();
  startRound();
});

document.getElementById('btnReady').addEventListener('click', startRecall);
document.getElementById('btnSubmit').addEventListener('click', submitRecall);
document.getElementById('btnNext').addEventListener('click', nextStep);

document.getElementById('btnPlayAgain').addEventListener('click', () => {
  resetGame();
  startRound();
});
document.getElementById('btnGoHome').addEventListener('click', () => {
  resetGame();
  showScreen('screen-home');
});
document.getElementById('btnHome').addEventListener('click', () => {
  resetGame();
  showScreen('screen-home');
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
});
document.getElementById('btnSpeakHelp').addEventListener('click', () => {
  playCue(CUES.helpPrompt);
});

/* translation toggle: replaces Assamese text in place with English
   (and back), rather than showing a second line underneath */
document.getElementById('btnTranslate').addEventListener('click', () => {
  translationOn = !translationOn;
  const btn = document.getElementById('btnTranslate');
  btn.textContent = translationOn ? 'AS' : 'EN';
  btn.classList.toggle('translation-on', translationOn);
  applyTranslation();
});

/* play the welcome cue and show the gentle avatar once the home screen first shows */
window.addEventListener('load', () => {
  showScreen('screen-home');
  setAvatar(document.getElementById('heroImage'), AVATAR.gentle);
  playCue(CUES.intro);
});

/* most browsers block audio-with-sound autoplay until the user has
   interacted with the page at least once — this is a browser policy,
   not something fixable purely in code. As the closest honest
   workaround: the instant the very first tap/click/key happens
   ANYWHERE on the page (not specifically the Play button), replay
   whatever cue was pending so it starts as close to "automatically"
   as the platform allows. */
function unlockAudioOnFirstTouch(){
  if(audioUnlocked) return;
  const player = document.getElementById('player');
  if(player.src){
    player.play().then(() => { audioUnlocked = true; }).catch(() => {});
  }
}
document.addEventListener('pointerdown', unlockAudioOnFirstTouch, { once:true });
document.addEventListener('keydown', unlockAudioOnFirstTouch, { once:true });
