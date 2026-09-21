/*  ============================================================
    app.js — Main app controller for SmritiSetu Game 6
    
    Manages:
    - Screen routing (single-page, max 1 level deep)
    - Avatar state
    - Language toggle
    - PWA registration
    ============================================================ */

const App = {
  currentScreen: 'screen-home',

  /** Initialize the app */
  init() {
    TTS.init();

    // Set initial language
    LANG.current = 'as';

    // Render all text
    this.updateAllText();

    // Show home screen
    this.showScreen('screen-home');

    // Avatar starts idle
    this.setAvatar('idle');

    // Auto-play greeting after a brief delay
    setTimeout(() => {
      TTS.speak(LANG.strings.greeting);
    }, 800);

    // Bind global events
    this._bindEvents();
  },

  /** Show a screen by id, hide all others */
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      s.setAttribute('aria-hidden', 'true');
    });
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('active');
      screen.setAttribute('aria-hidden', 'false');
      this.currentScreen = screenId;
    }
    // Stop any current speech on screen change
    TTS.stop();

    // Scroll to top
    window.scrollTo(0, 0);
  },

  /** Set avatar state: idle, gentle, happy */
  setAvatar(state) {
    const avatarImgs = document.querySelectorAll('.avatar-img');
    const map = {
      idle: 'assets/avatars/avatar_idle.png',
      gentle: 'assets/avatars/avatar_gentle.png',
      happy: 'assets/avatars/avatar_happy.png'
    };
    avatarImgs.forEach(img => {
      img.src = map[state] || map.idle;
      img.alt = state === 'happy' ? '😊' : state === 'gentle' ? '🤗' : '🙏';
    });
  },

  /** Update all text on all screens */
  updateAllText() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = LANG.t(key);
    });

    // Update language toggle button text
    const langBtns = document.querySelectorAll('.btn-lang');
    langBtns.forEach(btn => {
      btn.textContent = LANG.t('lang_label');
    });

    // Update scenario cards
    this._renderScenarioCards();

    // Update HTML lang attribute
    document.documentElement.lang = LANG.current === 'as' ? 'as' : 'en';
  },

  /** Render scenario selection cards */
  _renderScenarioCards() {
    const container = document.getElementById('scenario-list');
    if (!container) return;
    container.innerHTML = '';

    LANG.scenarios.forEach(scenario => {
      const card = document.createElement('button');
      card.className = 'scenario-card';
      card.setAttribute('aria-label', scenario.title[LANG.current]);

      // Use first step image as scenario thumbnail
      card.innerHTML = `
        <img src="${scenario.steps[0].img}" alt="" class="scenario-thumb"
             onerror="this.style.display='none'">
        <span class="scenario-title">${scenario.title[LANG.current]}</span>
      `;

      card.addEventListener('click', () => {
        this._startScenario(scenario);
      });

      container.appendChild(card);
    });
  },

  /** Start a scenario — show setup screen then game */
  _startScenario(scenario) {
    this.showScreen('screen-setup');
    this.setAvatar('idle');
    Game.currentScenario = scenario; // Store it early for repeat narration

    // Set narration text
    const narrEl = document.getElementById('setup-narration');
    if (narrEl) narrEl.textContent = scenario.narration[LANG.current];

    // Speak the narration
    TTS.speak(scenario.narration);

    // Bind start button
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      // Remove old listeners
      const newBtn = startBtn.cloneNode(true);
      startBtn.parentNode.replaceChild(newBtn, startBtn);
      newBtn.textContent = LANG.t('btn_start');
      newBtn.addEventListener('click', () => {
        this.showScreen('screen-game');
        Game.start(scenario.id);
      });
    }
  },

  /** Bind all global event handlers */
  _bindEvents() {
    // Language toggle
    document.querySelectorAll('.btn-lang').forEach(btn => {
      btn.addEventListener('click', () => {
        LANG.toggle();
        this.updateAllText();
        // If in game, re-render
        if (this.currentScreen === 'screen-game' && Game.currentScenario) {
          Game.start(Game.currentScenario.id);
        }
      });
    });

    // Home buttons
    document.querySelectorAll('.btn-home').forEach(btn => {
      btn.addEventListener('click', () => {
        TTS.stop();
        this.setAvatar('idle');
        this.showScreen('screen-home');
      });
    });

    // Repeat/speaker buttons (screen-level)
    document.querySelectorAll('.btn-repeat').forEach(btn => {
      btn.addEventListener('click', () => {
        this._repeatCurrentScreen();
      });
    });

    // Play button
    const playBtn = document.getElementById('btn-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.showScreen('screen-scenarios');
        TTS.speak(LANG.strings.choose_scenario);
      });
    }

    // Completion buttons
    const nextBtn = document.getElementById('btn-next-scenario');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.showScreen('screen-scenarios');
        this.setAvatar('idle');
      });
    }

    const homeBtn2 = document.getElementById('btn-complete-home');
    if (homeBtn2) {
      homeBtn2.addEventListener('click', () => {
        this.setAvatar('idle');
        this.showScreen('screen-home');
      });
    }
  },

  /** Repeat narration for current screen */
  _repeatCurrentScreen() {
    switch (this.currentScreen) {
      case 'screen-home':
        TTS.speak(LANG.strings.greeting);
        break;
      case 'screen-scenarios':
        TTS.speak(LANG.strings.choose_scenario);
        break;
      case 'screen-setup':
        if (Game.currentScenario) {
          TTS.speak(Game.currentScenario.narration);
        }
        break;
      case 'screen-game':
        TTS.speak(LANG.strings.instruction);
        break;
      case 'screen-complete':
        TTS.speak(LANG.strings.completion_title);
        break;
    }
  }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
