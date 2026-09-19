// Forcefully unregister any lingering PWA Service Workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('Service worker unregistered.');
        }
    });
}

const LANG_ASSAMESE = 'as';
const LANG_ENGLISH = 'en';

let currentLang = LANG_ASSAMESE;
let activeScenario = null;
let selectedItems = new Set();
let allCurrentItems = [];

// Data Layer
const TEXTS = {
    [LANG_ASSAMESE]: {
        title: "বছৰটকি লাগে?",
        play: "খেলক",
        choose_task: "কোনটো কাম কৰিব লাগে?",
        scen_tea: "সাহ খাবলৈ আলহী আহিছে",
        scen_temple: "মন্দিৰলৈ যাওঁ আহা",
        scen_cooking: "ভাত ৰান্ধোঁ আহা",
        done: "হ'ল",
        feedback_correct: "বাৰু পাইছে! ভাল হৈছে!",
        feedback_miss: "একো কথা নাই, আকৌ চেষ্টা কৰোঁ আহক",
        play_again: "আকৌ খেলক",
        question_tea: "সাহ খাবলৈ কি কি লাগিব?",
        question_temple: "মন্দিৰলৈ যাবলৈ কি কি লাগিব?",
        question_cooking: "ভাত ৰান্ধিবলৈ কি কি লাগিব?",
        lang_btn: "EN"
    },
    [LANG_ENGLISH]: {
        title: "What Do We Need?",
        play: "Play",
        choose_task: "Which task should we do?",
        scen_tea: "Guests are coming for tea",
        scen_temple: "Let's go to the temple",
        scen_cooking: "Let's cook rice",
        done: "Done",
        feedback_correct: "Well done! You got it!",
        feedback_miss: "No worries, let's try again",
        play_again: "Play Again",
        question_tea: "What do we need for tea?",
        question_temple: "What do we need for the temple?",
        question_cooking: "What do we need to cook rice?",
        lang_btn: "অ"
    }
};

const ITEMS = {
    tea: { id: 'tea', as: 'চাহ পাত', en: 'Tea leaves', img: 'item_tea.png', audio: 'audio_item_tea.mp3' },
    cups: { id: 'cups', as: 'কাপ-চাকী', en: 'Cups & saucers', img: 'item_cups.png', audio: 'audio_item_cups.mp3' },
    sugar: { id: 'sugar', as: 'চেনি', en: 'Sugar', img: 'item_sugar.png', audio: 'audio_item_sugar.mp3' },
    biscuits: { id: 'biscuits', as: 'বিস্কুট', en: 'Biscuits', img: 'item_biscuits.png', audio: 'audio_item_biscuits.mp3' },
    milk: { id: 'milk', as: 'গাখীৰ', en: 'Milk', img: 'item_milk.png', audio: 'audio_item_milk.mp3' },
    tray: { id: 'tray', as: 'ট্ৰে', en: 'Tray', img: 'item_tray.png', audio: 'audio_item_tray.mp3' },
    
    flowers: { id: 'flowers', as: 'ফুল', en: 'Flowers', img: 'item_flowers.png', audio: 'audio_item_flowers.mp3' },
    incense: { id: 'incense', as: 'ধূপ', en: 'Incense', img: 'item_incense.png', audio: 'audio_item_incense.mp3' },
    diya: { id: 'diya', as: 'চাকি', en: 'Lamp (Diya)', img: 'item_diya.png', audio: 'audio_item_diya.mp3' },
    prasad: { id: 'prasad', as: 'প্ৰসাদ', en: 'Prasad', img: 'item_prasad.png', audio: 'audio_item_prasad.mp3' },
    gamosa: { id: 'gamosa', as: 'গামোচা', en: 'Gamosa', img: 'item_gamosa.png', audio: 'audio_item_gamosa.mp3' },

    rice: { id: 'rice', as: 'চাউল', en: 'Rice', img: 'item_rice.png', audio: 'audio_item_rice.mp3' },
    pot: { id: 'pot', as: 'হাঁড়ি', en: 'Pot', img: 'item_pot.png', audio: 'audio_item_pot.mp3' },
    water: { id: 'water', as: 'পানী', en: 'Water', img: 'item_water.png', audio: 'audio_item_water.mp3' },
    stove: { id: 'stove', as: 'চৌকা', en: 'Stove', img: 'item_stove.png', audio: 'audio_item_stove.mp3' },
    ladle: { id: 'ladle', as: 'হেতা', en: 'Ladle', img: 'item_ladle.png', audio: 'audio_item_ladle.mp3' },

    // Distractors
    broom: { id: 'broom', as: 'ঝাৰু', en: 'Broom', img: 'item_broom.png', audio: 'audio_item_broom.mp3' },
    umbrella: { id: 'umbrella', as: 'ছাতি', en: 'Umbrella', img: 'item_umbrella.png', audio: 'audio_item_umbrella.mp3' },
    pillow: { id: 'pillow', as: 'গাৰু', en: 'Pillow', img: 'item_pillow.png', audio: 'audio_item_pillow.mp3' },
    comb: { id: 'comb', as: 'ফনি', en: 'Comb', img: 'item_comb.png', audio: 'audio_item_comb.mp3' },
    shoes: { id: 'shoes', as: 'জোতা', en: 'Shoes', img: 'item_shoes.png', audio: 'audio_item_shoes.mp3' },
    bucket: { id: 'bucket', as: 'বাল্টি', en: 'Bucket', img: 'item_bucket.png', audio: 'audio_item_bucket.mp3' },
    book: { id: 'book', as: 'কিতাপ', en: 'Book', img: 'item_book.png', audio: 'audio_item_book.mp3' }
};

const SCENARIOS = {
    tea: {
        id: 'tea',
        questionTextId: 'question_tea',
        audioIntro: 'audio_scenario_tea.mp3',
        correctItems: ['tea', 'cups', 'sugar', 'biscuits'], // Base 4
        distractors: ['broom', 'umbrella', 'pillow', 'comb'] // Base 4 (Total 8 for Medium)
    },
    temple: {
        id: 'temple',
        questionTextId: 'question_temple',
        audioIntro: 'audio_scenario_temple.mp3',
        correctItems: ['flowers', 'incense', 'diya', 'prasad'], 
        distractors: ['shoes', 'bucket', 'book', 'broom']
    },
    cooking: {
        id: 'cooking',
        questionTextId: 'question_cooking',
        audioIntro: 'audio_scenario_cooking.mp3',
        correctItems: ['rice', 'pot', 'water', 'stove'], 
        distractors: ['umbrella', 'pillow', 'comb', 'book']
    }
};

// UI Elements
const screens = {
    home: document.getElementById('screen-home'),
    scenarios: document.getElementById('screen-scenarios'),
    game: document.getElementById('screen-game'),
    feedback: document.getElementById('screen-feedback')
};

// Robust Audio Player
function playAudio(filename, fallbackAssameseText) {
    if (!filename) return;

    // 1. Try playing actual file
    const audio = new Audio(`audio/${filename}`);
    
    audio.play().catch(e => {
        console.log("Audio file missing or blocked, falling back to TTS", e);
        
        // 2. Fallback to Web Speech API
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any current speech
            const utterance = new SpeechSynthesisUtterance(fallbackAssameseText);
            
            // Try to find a Hindi or Indian English voice if Assamese isn't explicitly available
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('bn') || v.lang.includes('as')) 
                                || voices.find(v => v.lang.includes('IN'))
                                || voices[0];
            
            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.rate = 0.85; // Slightly slower for elderly
            utterance.pitch = 1.0;
            
            window.speechSynthesis.speak(utterance);
        }
    });
}

// Navigation & State
function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    
    screens[screenName].classList.remove('hidden');
    screens[screenName].classList.add('active');
    
    const homeBtn = document.getElementById('btn-home');
    if (screenName === 'home') {
        homeBtn.classList.add('hidden');
    } else {
        homeBtn.classList.remove('hidden');
    }
}

function updateLanguage() {
    const t = TEXTS[currentLang];
    
    // Update simple texts
    document.getElementById('text-title').innerText = t.title;
    document.getElementById('text-play').innerText = t.play;
    document.getElementById('text-choose-task').innerText = t.choose_task;
    document.getElementById('text-scen-tea').innerText = t.scen_tea;
    document.getElementById('text-scen-temple').innerText = t.scen_temple;
    document.getElementById('text-scen-cooking').innerText = t.scen_cooking;
    document.getElementById('text-done').innerText = t.done;
    document.getElementById('text-play-again').innerText = t.play_again;
    document.getElementById('btn-lang').innerText = t.lang_btn;
    
    // Update dynamic game texts
    if (activeScenario) {
        document.getElementById('game-question').innerText = t[SCENARIOS[activeScenario].questionTextId];
    }
    
    // Update grid items if visible
    document.querySelectorAll('.item-card').forEach(card => {
        const itemId = card.dataset.id;
        const itemNameEl = card.querySelector('.item-name');
        if (itemNameEl && ITEMS[itemId]) {
            itemNameEl.innerText = ITEMS[itemId][currentLang];
        }
    });
}

// Event Listeners
document.getElementById('btn-lang').addEventListener('click', () => {
    currentLang = currentLang === LANG_ASSAMESE ? LANG_ENGLISH : LANG_ASSAMESE;
    updateLanguage();
});

document.getElementById('btn-home').addEventListener('click', () => { window.location.href = '/'; });

document.getElementById('btn-play').addEventListener('click', () => {
    showScreen('scenarios');
    playAudio('audio_choose_task.mp3', TEXTS[LANG_ASSAMESE].choose_task);
});

// Setup scenario buttons
document.querySelectorAll('.scenario-card').forEach(btn => {
    btn.addEventListener('click', () => {
        const scenarioId = btn.dataset.scenario;
        startGame(scenarioId);
    });
});

// Scenario speaker buttons
document.querySelectorAll('.scen-speak').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        playAudio(btn.dataset.audio, TEXTS[currentLang][btn.dataset.textid]);
    });
});

// Game Logic
function startGame(scenarioId) {
    activeScenario = scenarioId;
    selectedItems.clear();
    const scenario = SCENARIOS[scenarioId];
    
    updateLanguage(); // Ensure question text is correct
    
    // Prepare items (shuffle correct + distractors)
    allCurrentItems = [...scenario.correctItems, ...scenario.distractors];
    // Shuffle array
    allCurrentItems.sort(() => Math.random() - 0.5);
    
    renderGrid();
    checkDoneButton();
    showScreen('game');
    
    // Intro audio
    playAudio(scenario.audioIntro, TEXTS[LANG_ASSAMESE][scenario.questionTextId]);
}

function renderGrid() {
    const grid = document.getElementById('item-grid');
    grid.innerHTML = '';
    
    allCurrentItems.forEach(itemId => {
        const item = ITEMS[itemId];
        
        const card = document.createElement('button');
        card.className = 'item-card';
        card.dataset.id = itemId;
        
        card.innerHTML = `
            <div class="card-speak-btn" aria-label="Listen">
                <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            </div>
            <img src="images/${item.img}" class="item-icon" alt="${item[currentLang]}">
            <span class="item-name">${item[currentLang]}</span>
        `;
        
        // Handle independent speaker button click
        const speakBtn = card.querySelector('.card-speak-btn');
        speakBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card selection
            playAudio(item.audio, item[currentLang]);
        });
        
        // Handle card selection
        card.addEventListener('click', () => {
            if (selectedItems.has(itemId)) {
                selectedItems.delete(itemId);
                card.classList.remove('selected');
            } else {
                selectedItems.add(itemId);
                card.classList.add('selected');
                // Play item name on select as extra reinforcement
                playAudio(item.audio, item[currentLang]);
            }
            checkDoneButton();
        });
        
        grid.appendChild(card);
    });
}

function checkDoneButton() {
    const doneBtn = document.getElementById('btn-done');
    if (selectedItems.size > 0) {
        doneBtn.classList.remove('disabled');
    } else {
        doneBtn.classList.add('disabled');
    }
}

document.getElementById('btn-done').addEventListener('click', () => {
    if (selectedItems.size === 0) return;
    
    const scenario = SCENARIOS[activeScenario];
    
    let hasDistractor = false;
    let correctPicks = [];
    
    selectedItems.forEach(id => {
        if (scenario.correctItems.includes(id)) {
            correctPicks.push(id);
        } else {
            hasDistractor = true;
        }
    });
    
    const feedbackMsg = document.getElementById('feedback-message');
    const feedbackVis = document.getElementById('feedback-visuals');
    const avatarFb = document.getElementById('avatar-feedback');
    feedbackVis.innerHTML = '';
    
    if (hasDistractor || correctPicks.length < scenario.correctItems.length/2) {
        // Gentle miss
        feedbackMsg.innerText = TEXTS[currentLang].feedback_miss;
        avatarFb.src = 'images/avatar_idle.png';
        playAudio('audio_gentle_miss.mp3', TEXTS[LANG_ASSAMESE].feedback_miss);
    } else {
        // Correct/Good job
        feedbackMsg.innerText = TEXTS[currentLang].feedback_correct;
        avatarFb.src = 'images/avatar_happy.png';
        playAudio('audio_correct.mp3', TEXTS[LANG_ASSAMESE].feedback_correct);
        
        // Show correct items
        correctPicks.forEach(id => {
            const item = ITEMS[id];
            feedbackVis.innerHTML += `
                <div class="item-card selected" style="min-height: 120px;">
                    <img src="images/${item.img}" class="item-icon" style="width: 80px; height: 80px;" alt="${item[currentLang]}">
                    <span class="item-name">${item[currentLang]}</span>
                </div>
            `;
        });
    }
    
    showScreen('feedback');
});

document.getElementById('btn-play-again').addEventListener('click', () => {
    showScreen('scenarios');
});

// Speaker Buttons
document.getElementById('btn-speak-welcome').addEventListener('click', () => {
    playAudio('audio_welcome.mp3', 'নমস্কাৰ! আহক, আমি একেলগে খেলোঁ');
});

document.getElementById('btn-speak-scenario-prompt').addEventListener('click', () => {
    playAudio('audio_choose_task.mp3', TEXTS[LANG_ASSAMESE].choose_task);
});

document.getElementById('btn-speak-question').addEventListener('click', () => {
    if (activeScenario) {
        const sc = SCENARIOS[activeScenario];
        playAudio(sc.audioIntro, TEXTS[LANG_ASSAMESE][sc.questionTextId]);
    }
});

document.getElementById('btn-speak-feedback').addEventListener('click', () => {
    const msg = document.getElementById('feedback-message').innerText;
    const utterance = new SpeechSynthesisUtterance(msg);
    window.speechSynthesis.speak(utterance);
});

if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}
