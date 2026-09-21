const translations = {
    en: {
        welcome: "Welcome to Match Them!",
        setup: "Select Difficulty",
        easy: "4 Pairs",
        hard: "6 Pairs",
        title: "Milai Diya",
        subtitle: "Match Them",
        play: "Let's Play",
        match: "Match the same pictures.",
        success: "Very good!",
        wrong: "Try again.",
        done: "Wonderful! You matched them all.",
        playAgain: "Play Again",
        lang: "অসমীয়া" // Shows the language you can switch to
    },
    as: {
        welcome: "মিলাই দিয়া খেললৈ স্বাগতম!",
        setup: "কঠিনতা বাছক",
        easy: "৪ যোৰ",
        hard: "৬ যোৰ",
        title: "মিলাই দিয়া",
        subtitle: "একেলগে মিলাওক",
        play: "খেলক", // Updated to match image "খেলক"
        match: "একে ধৰণৰ ছবি মিলাওক।",
        success: "বহুত ভাল!",
        wrong: "আকৌ চেষ্টা কৰক।",
        done: "অসাধাৰণ! আপুনি আটাইবোৰ মিলালে।",
        playAgain: "আকৌ খেলক",
        lang: "EN" // Shows the language you can switch to
    }
};

let currentLang = 'as'; // Set default to Assamese based on screenshot
let currentPairs = 4;
let flippedCards = [];
let matchedCount = 0;
let isLocked = false;
let currentMessageKey = 'welcome';

const allImages = [
    'images/card_jaapi.jpg',
    'images/card_xorai.jpg',
    'images/card_gamosa.jpg',
    'images/card_dhol.jpg',
    'images/card_kordoi.jpg',
    'images/card_tamul.jpg'
];

const objectNames = {
    'images/card_jaapi.jpg': { key: 'jaapi', en: 'Jaapi' },
    'images/card_xorai.jpg': { key: 'xorai', en: 'Xorai' },
    'images/card_gamosa.jpg': { key: 'gamosa', en: 'Gamosa' },
    'images/card_dhol.jpg': { key: 'dhol', en: 'Dhol' },
    'images/card_kordoi.jpg': { key: 'kordoi', en: 'Starfruit' },
    'images/card_tamul.jpg': { key: 'tamul', en: 'Betel Leaf' }
};

function playObjectAudio(imagePath) {
    const obj = objectNames[imagePath];
    if (!obj) return;
    
    if (currentLang === 'en') {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(obj.en);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    } else {
        new Audio('audio/audio_as_' + obj.key + '.mp3').play();
    }
}

// Screens
const screenWelcome = document.getElementById('screen-welcome');
const screenDifficulty = document.getElementById('screen-difficulty');
const screenGame = document.getElementById('screen-game');
const screenCelebration = document.getElementById('screen-celebration');

// Buttons
const btnLangToggles = document.querySelectorAll('.btn-lang-top');
const btnHomeButtons = document.querySelectorAll('.btn-home');
const btnPlay = document.getElementById('btn-play');
const btnEasy = document.getElementById('btn-easy');
const btnHard = document.getElementById('btn-hard');
const btnPlayAgain = document.getElementById('btn-play-again');

const btnRepeatWelcome = document.getElementById('btn-repeat-welcome');
const btnRepeatGame = document.getElementById('btn-repeat-game');
const btnRepeatDifficulty = document.getElementById('btn-repeat-difficulty');
const btnRepeatCelebration = document.getElementById('btn-repeat-celebration');

// Elements
const gameGrid = document.getElementById('game-grid');
const avatarGame = document.getElementById('avatar-game');
const avatarMessage = document.getElementById('avatar-message');
const avatarWelcome = document.getElementById('avatar-welcome');
const avatarCelebration = document.getElementById('avatar-celebration');
const avatarDifficulty = document.getElementById('avatar-difficulty');

// Events
btnLangToggles.forEach(btn => {
    btn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'as' : 'en';
        updateUI();
    });
});

btnHomeButtons.forEach(btn => {
    btn.addEventListener('click', showWelcomeScreen);
});

btnPlay.addEventListener('click', () => {
    showScreen(screenDifficulty);
    currentMessageKey = 'setup';
});

btnEasy.addEventListener('click', () => startGame(4));
btnHard.addEventListener('click', () => startGame(6));
btnPlayAgain.addEventListener('click', showWelcomeScreen);

// Repeat Audio logic
function playRepeatAudio() {
    console.log(`Playing audio for: ${currentMessageKey} in ${currentLang}`);
    
    // Play audio
    if (currentLang === 'en') {
        // Use built-in browser Text-to-Speech for English
        const utterance = new SpeechSynthesisUtterance(translations['en'][currentMessageKey]);
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // Slightly slower for clarity
        window.speechSynthesis.speak(utterance);
    } else {
        // Use uploaded MP3 files for Assamese
        new Audio('audio/audio_as_' + currentMessageKey + '.mp3').play();
    }
    
    // Animate the avatar slightly to indicate speaking
    let activeAvatar = null;
    if (screenWelcome.classList.contains('active')) activeAvatar = avatarWelcome;
    else if (screenDifficulty.classList.contains('active')) activeAvatar = avatarDifficulty;
    else if (screenGame.classList.contains('active')) activeAvatar = avatarGame;
    else if (screenCelebration.classList.contains('active')) activeAvatar = avatarCelebration;
    
    if (activeAvatar) {
        activeAvatar.style.transform = 'scale(1.05)';
        setTimeout(() => {
            activeAvatar.style.transform = 'scale(1)';
        }, 300);
    }
}

btnRepeatWelcome.addEventListener('click', () => {
    currentMessageKey = 'welcome';
    playRepeatAudio();
});
btnRepeatGame.addEventListener('click', playRepeatAudio);

btnRepeatDifficulty.addEventListener('click', () => {
    currentMessageKey = 'setup';
    playRepeatAudio();
});

btnRepeatCelebration.addEventListener('click', () => {
    currentMessageKey = 'done';
    playRepeatAudio();
});

function updateUI() {
    document.documentElement.lang = currentLang;
    document.getElementById('game-title').innerText = translations[currentLang].title;
    
    // The screenshot doesn't have a subtitle, we can clear it or keep it depending on language
    const sub = document.getElementById('game-subtitle');
    if (currentLang === 'as') {
        sub.style.display = 'none'; // Hide subtitle in Assamese to match screenshot perfectly
    } else {
        sub.style.display = 'block';
        sub.innerText = translations[currentLang].subtitle;
    }

    document.getElementById('btn-play').innerText = translations[currentLang].play;
    document.getElementById('instruction-setup').innerText = translations[currentLang].setup;
    document.getElementById('btn-easy').innerText = translations[currentLang].easy;
    document.getElementById('btn-hard').innerText = translations[currentLang].hard;
    document.getElementById('celebration-title').innerText = translations[currentLang].done;
    document.getElementById('btn-play-again').innerText = translations[currentLang].playAgain;
    
    btnLangToggles.forEach(btn => btn.innerText = translations[currentLang].lang);
    
    setMessage(currentMessageKey);
}

function setMessage(key) {
    currentMessageKey = key;
    if (avatarMessage) {
        avatarMessage.innerText = translations[currentLang][key];
    }
}

function showScreen(screenToShow) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    screenToShow.classList.remove('hidden');
    screenToShow.classList.add('active');
}

function showWelcomeScreen() {
    showScreen(screenWelcome);
    currentMessageKey = 'welcome';
}

function startGame(pairs) {
    currentPairs = pairs;
    matchedCount = 0;
    flippedCards = [];
    isLocked = false;
    
    showScreen(screenGame);
    gameGrid.setAttribute('data-pairs', pairs);
    setMessage('match');
    
    createGrid(pairs);
}

function createGrid(pairs) {
    gameGrid.innerHTML = '';
    
    let selectedImages = allImages.slice(0, pairs);
    let deck = [...selectedImages, ...selectedImages];
    deck.sort(() => Math.random() - 0.5);
    
    deck.forEach(image => {
        const card = document.createElement('button');
        card.classList.add('card');
        card.setAttribute('data-image', image);
        card.setAttribute('aria-label', 'Card');
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="${image}" class="card-image" alt="Item">
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => flipCard(card));
        gameGrid.appendChild(card);
    });
}

function flipCard(card) {
    if (isLocked) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    const imagePath = card.getAttribute('data-image');
    playObjectAudio(imagePath);
    
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    isLocked = true;
    const [card1, card2] = flippedCards;
    
    const isMatch = card1.getAttribute('data-image') === card2.getAttribute('data-image');
    
    if (isMatch) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCount++;
        setMessage('success');
        flippedCards = [];
        isLocked = false;
        
        if (matchedCount === currentPairs) {
            setTimeout(() => {
                showScreen(screenCelebration);
                currentMessageKey = 'done';
            }, 1000);
        } else {
            setTimeout(() => setMessage('match'), 2000);
        }
    } else {
        setMessage('wrong');
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            isLocked = false;
            setMessage('match');
        }, 1500);
    }
}

// Initialize
updateUI();
