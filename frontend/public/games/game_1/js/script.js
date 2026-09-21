/* =============================================
   SmritiSetu — Ki Utsav? — Game Logic
   Full-screen layout, vertical option cards
   ============================================= */

"use strict";

// ── Game Content ──────────────────────────────
const gameData = [
    {
        id: 'q1_rongali',
        image: 'images/rongali_bihu_scene.jpg',
        question: {
            en: 'What festival is this?',
            as: 'এইটো কি উৎসৱ?'
        },
        feedback: {
            correct: {
                en: 'Exactly right! This is Rongali Bihu — the spring festival of dance and music!',
                as: "একদম ঠিক! এইটো ৰঙালী বিহু — নাচ-গানৰ বসন্ত উৎসৱ!"
            },
            incorrect: {
                en: 'This is Rongali Bihu — see the Bihu dancers and the dhol?',
                as: "এইটো ৰঙালী বিহু — বিহু নাচনী আৰু ঢোলটো দেখিছানে?"
            }
        },
        audio: {
            question:  'audio/q1_question.mp3',
            correct:   'audio/q1_correct.mp3',
            incorrect: 'audio/q1_incorrect.mp3'
        },
        options: [
            {
                img: 'images/option_bohag_bihu.jpg',
                label: { en: "Rongali Bihu", as: "ৰঙালী বিহু" },
                isCorrect: true
            },
            {
                img: 'images/option_jolpan.jpg',
                label: { en: "Jolpan", as: "জলপান" },
                isCorrect: false
            },
            {
                img: 'images/option_kati_bihu.jpg',
                label: { en: "Kati Bihu", as: "কাতি বিহু" },
                isCorrect: false
            }
        ]
    },
    {
        id: 'q2_jolpan',
        image: 'images/jolpan_spread.jpg',
        question: {
            en: 'What is this food called?',
            as: 'এই খাদ্যবিধক কি বুলি কয়?'
        },
        feedback: {
            correct: {
                en: 'Very good! This is Jolpan — the traditional Assamese breakfast!',
                as: "বহুত ভাল! এইটো জলপান — অসমীয়া পৰম্পৰাগত জলখাবাৰ!"
            },
            incorrect: {
                en: 'This is Jolpan — chira, doi, and goor, our traditional breakfast.',
                as: "এইটো জলপান — চিৰা, দৈ আৰু গুৰ, আমাৰ পৰম্পৰাগত জলখাবাৰ।"
            }
        },
        audio: {
            question:  'audio/q2_question.mp3',
            correct:   'audio/q2_correct.mp3',
            incorrect: 'audio/q2_incorrect.mp3'
        },
        options: [
            {
                img: 'images/option_kati_bihu.jpg',
                label: { en: "Kati Bihu", as: "কাতি বিহু" },
                isCorrect: false
            },
            {
                img: 'images/option_jolpan.jpg',
                label: { en: "Jolpan", as: "জলপান" },
                isCorrect: true
            },
            {
                img: 'images/option_bohag_bihu.jpg',
                label: { en: "Rongali Bihu", as: "ৰঙালী বিহু" },
                isCorrect: false
            }
        ]
    },
    {
        id: 'q3_magh',
        image: 'images/magh_bihu_meji.jpg',
        question: {
            en: 'What festival is this?',
            as: 'এইটো কি উৎসৱ?'
        },
        feedback: {
            correct: {
                en: 'Well done! This is Magh Bihu — the harvest festival with the meji bonfire!',
                as: "বাঃ! এইটো মাঘ বিহু — মেজি জ্বলোৱাৰ চপোৱা উৎসৱ!"
            },
            incorrect: {
                en: 'This is Magh Bihu — look at the big meji bonfire in the field!',
                as: "এইটো মাঘ বিহু — পথাৰত ডাঙৰ মেজি জুই জ্বলি আছে চাওকচোন!"
            }
        },
        audio: {
            question:  'audio/q3_question.mp3',
            correct:   'audio/q3_correct.mp3',
            incorrect: 'audio/q3_incorrect.mp3'
        },
        options: [
            {
                img: 'images/option_kati_bihu.jpg',
                label: { en: "Magh Bihu", as: "মাঘ বিহু" },
                isCorrect: true
            },
            {
                img: 'images/option_jolpan.jpg',
                label: { en: "Jolpan", as: "জলপান" },
                isCorrect: false
            },
            {
                img: 'images/option_bohag_bihu.jpg',
                label: { en: "Rongali Bihu", as: "ৰঙালী বিহু" },
                isCorrect: false
            }
        ]
    }
];

// ── State ─────────────────────────────────────
const state = {
    lang: 'as',
    screen: 'home',
    qIndex: 0,
    busy: false
};

// Silent caregiver log (§5 — never shown to patient)
const caregiverLog = [];

// ── UI Text ───────────────────────────────────
const uiText = {
    homeTitle: { en: 'What Festival?', as: 'কি উৎসৱ?' },
    play:      { en: 'Play', as: 'খেলক' },
    langBtn:   { en: 'EN', as: 'অ' }
};

// ── DOM ───────────────────────────────────────
const $ = (sel) => document.querySelector(sel);

const dom = {
    btnHome:       $('#btn-home'),
    btnLang:       $('#btn-lang'),
    btnPlay:       $('#btn-play'),
    btnHomeSpeak:  $('#btn-home-speak'),
    btnRepeat:     $('#btn-repeat'),
    screenHome:    $('#screen-home'),
    screenGame:    $('#screen-game'),
    homeTitle:     $('#home-title'),
    gamePhoto:     $('#game-photo'),
    gameAvatar:    $('#game-avatar'),
    gameQuestion:  $('#game-question'),
    optionsArea:   $('#options-area'),
    feedbackOverlay: $('#feedback-overlay'),
    feedbackAvatar:  $('#feedback-avatar'),
    feedbackText:    $('#feedback-text'),
    audioPlayer:   $('#audio-player')
};

// ── Language ──────────────────────────────────
function setLanguage(lang) {
    state.lang = lang;
    document.documentElement.lang = lang;

    dom.homeTitle.textContent = uiText.homeTitle[lang];
    dom.btnPlay.textContent   = uiText.play[lang];
    dom.btnLang.textContent   = uiText.langBtn[lang];

    if (state.screen === 'game') {
        const q = gameData[state.qIndex];
        dom.gameQuestion.textContent = q.question[lang];
        dom.optionsArea.querySelectorAll('.option-card__label').forEach((el, i) => {
            el.textContent = q.options[i].label[lang];
        });
    }
}

dom.btnLang.addEventListener('click', () => {
    setLanguage(state.lang === 'as' ? 'en' : 'as');
});

// ── Screens ───────────────────────────────────
function showScreen(name) {
    state.screen = name;
    dom.screenHome.classList.remove('screen--active');
    dom.screenGame.classList.remove('screen--active');
    dom.btnHome.style.visibility = (name === 'home') ? 'hidden' : 'visible';

    if (name === 'home') {
        dom.screenHome.classList.add('screen--active');
        stopAudio();
    } else {
        dom.screenGame.classList.add('screen--active');
    }
}

function exitToDashboard() {
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'EXIT_GAME' }, '*');
            return;
        }
    } catch (e) {}
    window.location.href = '/';
}

dom.btnHome.addEventListener('click', exitToDashboard);

// ── Home speak button ─────────────────────────
dom.btnHomeSpeak.addEventListener('click', () => {
    playAudio('audio/home_title.mp3', uiText.homeTitle[state.lang]);
});

// ── Start Game ────────────────────────────────
dom.btnPlay.addEventListener('click', () => {
    state.qIndex = 0;
    showScreen('game');
    loadQuestion();
});

// ── Load Question ─────────────────────────────
function loadQuestion() {
    state.busy = false;
    const q = gameData[state.qIndex];

    dom.feedbackOverlay.classList.remove('feedback--visible');
    dom.optionsArea.classList.remove('game__options--disabled');

    dom.gamePhoto.src = q.image;
    dom.gameQuestion.textContent = q.question[state.lang];
    dom.gameAvatar.src = 'images/avatar_idle.png';

    // Build option cards
    dom.optionsArea.innerHTML = '';
    q.options.forEach((opt, i) => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        // Thumbnail
        const img = document.createElement('img');
        img.className = 'option-card__img';
        img.src = opt.img;
        img.alt = opt.label.en;

        // Label
        const label = document.createElement('span');
        label.className = 'option-card__label';
        label.textContent = opt.label[state.lang];

        // Speaker button for this option
        const speakBtn = document.createElement('button');
        speakBtn.className = 'option-card__speak';
        speakBtn.setAttribute('aria-label', 'Listen to ' + opt.label.en);
        const speakImg = document.createElement('img');
        speakImg.src = 'images/icon_speaker.png';
        speakImg.alt = 'Listen';
        speakBtn.appendChild(speakImg);

        // Speaker reads just this option's label
        speakBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const safeName = opt.label.en.toLowerCase().replace(/ /g, '_');
            const audioPath = 'audio/opt_' + safeName + '.mp3';
            playAudio(audioPath, opt.label[state.lang]);
        });

        card.appendChild(img);
        card.appendChild(label);
        card.appendChild(speakBtn);

        // Tapping the card = selecting this answer
        card.addEventListener('click', () => handleAnswer(i, opt.isCorrect, card));

        dom.optionsArea.appendChild(card);
    });

    // Speak the question
    playAudio(q.audio.question, q.question[state.lang]);
}

// ── Handle Answer ─────────────────────────────
function handleAnswer(idx, isCorrect, cardEl) {
    if (state.busy) return;
    state.busy = true;

    const q = gameData[state.qIndex];
    dom.optionsArea.classList.add('game__options--disabled');

    // Silent log
    caregiverLog.push({
        questionId: q.id,
        chosen: idx,
        correct: isCorrect,
        timestamp: new Date().toISOString(),
        language: state.lang
    });

    if (isCorrect) {
        cardEl.classList.add('option-card--correct');
        dom.feedbackAvatar.src = 'images/avatar_happy.png';
        dom.feedbackText.textContent = q.feedback.correct[state.lang];
        dom.feedbackOverlay.classList.add('feedback--visible');
        dom.gameAvatar.src = 'images/avatar_happy.png';

        playAudio(q.audio.correct, q.feedback.correct[state.lang], () => {
            setTimeout(() => {
                state.qIndex++;
                if (state.qIndex < gameData.length) {
                    loadQuestion();
                } else {
                    showScreen('home');
                }
            }, 1200);
        });
    } else {
        dom.feedbackAvatar.src = 'images/avatar_gentle.png';
        dom.feedbackText.textContent = q.feedback.incorrect[state.lang];
        dom.feedbackOverlay.classList.add('feedback--visible');
        dom.gameAvatar.src = 'images/avatar_gentle.png';

        playAudio(q.audio.incorrect, q.feedback.incorrect[state.lang], () => {
            setTimeout(() => {
                dom.feedbackOverlay.classList.remove('feedback--visible');
                dom.optionsArea.classList.remove('game__options--disabled');
                dom.gameAvatar.src = 'images/avatar_idle.png';
                state.busy = false;
            }, 800);
        });
    }
}

// ── Audio System ──────────────────────────────
function playAudio(audioPath, fallbackText, onComplete) {
    stopAudio();

    if (audioPath) {
        const player = dom.audioPlayer;
        player.src = audioPath;
        const p = player.play();
        if (p !== undefined) {
            p.then(() => {
                player.onended = () => {
                    player.onended = null;
                    if (onComplete) onComplete();
                };
            }).catch(() => {
                speakTTS(fallbackText, onComplete);
            });
        }
    } else {
        speakTTS(fallbackText, onComplete);
    }
}

function speakTTS(text, onComplete) {
    if (!text) { if (onComplete) onComplete(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = (state.lang === 'as') ? 'hi-IN' : 'en-US';
    u.rate = 0.9;
    u.onend = () => { if (onComplete) onComplete(); };
    u.onerror = () => { if (onComplete) onComplete(); };
    window.speechSynthesis.speak(u);
}

function stopAudio() {
    window.speechSynthesis.cancel();
    dom.audioPlayer.pause();
    dom.audioPlayer.currentTime = 0;
    dom.audioPlayer.onended = null;
}

// Repeat button
dom.btnRepeat.addEventListener('click', () => {
    if (state.screen !== 'game') return;
    const q = gameData[state.qIndex];
    playAudio(q.audio.question, q.question[state.lang]);
});

// ── Init ──────────────────────────────────────
setLanguage('as');
showScreen('home');
