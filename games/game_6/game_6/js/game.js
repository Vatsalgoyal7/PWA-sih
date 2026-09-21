/*  ============================================================
    game.js — Card sequencing game engine for "Loga Loi Jua"
    
    Handles:
    - Card shuffling
    - Drag & drop (touch + mouse)
    - Tap-to-place fallback (for reduced motor control)
    - Sequence validation (gentle, no penalties)
    - Silent logging for caregiver
    ============================================================ */

const Game = {
  currentScenario: null,
  steps: [],           // Correct order
  shuffled: [],        // Shuffled presentation order
  placed: [],          // Cards placed in slots (index = slot, value = step)
  nextSlot: 0,         // Next empty slot
  attempts: 0,
  hints: 0,
  selectedCard: null,  // For tap-to-place

  /** Start a scenario */
  start(scenarioId) {
    const scenario = LANG.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    this.currentScenario = scenario;
    this.steps = [...scenario.steps];
    this.shuffled = this._shuffle([...scenario.steps]);
    this.placed = new Array(this.steps.length).fill(null);
    this.nextSlot = 0;
    this.attempts = 0;
    this.hints = 0;
    this.selectedCard = null;

    this._renderCards();
    this._renderSlots();
    this._updateInstruction();
  },

  /** Fisher-Yates shuffle — ensure it's actually shuffled */
  _shuffle(arr) {
    let shuffled = [...arr];
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (this._isSameOrder(shuffled, arr));
    return shuffled;
  },

  _isSameOrder(a, b) {
    return a.every((item, i) => item === b[i]);
  },

  /** Render shuffled cards in the deck area */
  _renderCards() {
    const deck = document.getElementById('card-deck');
    deck.innerHTML = '';

    this.shuffled.forEach((step, idx) => {
      if (this.placed.includes(step)) return; // Already placed

      const card = document.createElement('div');
      card.className = 'game-card';
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', step.label[LANG.current]);
      card.setAttribute('data-step-index', this.steps.indexOf(step));
      card.draggable = true;

      card.innerHTML = `
        <img src="${step.img}" alt="${step.label[LANG.current]}" 
             class="card-img" draggable="false"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%22%23F5EDE0%22 width=%22200%22 height=%22200%22/><text x=%22100%22 y=%22100%22 text-anchor=%22middle%22 font-size=%2240%22>📷</text></svg>'">
        <span class="card-label">${step.label[LANG.current]}</span>
      `;

      // Speaker button on each card
      const speakBtn = document.createElement('button');
      speakBtn.className = 'card-speak-btn';
      speakBtn.setAttribute('aria-label', LANG.t('btn_repeat'));
      speakBtn.innerHTML = '<img src="assets/icons/icon_speaker.png" alt="" class="card-speak-icon">';
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        TTS.speak(step.label);
      });
      card.appendChild(speakBtn);

      // ---- Drag events (mouse) ----
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', this.steps.indexOf(step).toString());
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });

      // ---- Touch events (mobile) ----
      let touchStartX, touchStartY, clone;
      card.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX - card.offsetLeft;
        touchStartY = touch.clientY - card.offsetTop;
        card.classList.add('dragging');

        // Create visual clone for dragging
        clone = card.cloneNode(true);
        clone.classList.add('drag-clone');
        clone.style.position = 'fixed';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.width = card.offsetWidth + 'px';
        clone.style.left = touch.clientX - card.offsetWidth / 2 + 'px';
        clone.style.top = touch.clientY - card.offsetHeight / 2 + 'px';
        document.body.appendChild(clone);
      }, { passive: true });

      card.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!clone) return;
        const touch = e.touches[0];
        clone.style.left = touch.clientX - card.offsetWidth / 2 + 'px';
        clone.style.top = touch.clientY - card.offsetHeight / 2 + 'px';
      }, { passive: false });

      card.addEventListener('touchend', (e) => {
        card.classList.remove('dragging');
        if (clone) {
          clone.remove();
          clone = null;
        }
        // Find which slot the touch ended over
        const touch = e.changedTouches[0];
        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        const slot = elem?.closest('.drop-slot');
        if (slot) {
          const slotIdx = parseInt(slot.dataset.slotIndex);
          this._tryPlace(this.steps.indexOf(step), slotIdx);
        } else {
          // Tap-to-place: select this card
          this._selectCard(card, step);
        }
      });

      // ---- Tap-to-place (click) ----
      card.addEventListener('click', () => {
        this._selectCard(card, step);
      });

      deck.appendChild(card);
    });
  },

  /** Handle tap-to-place card selection */
  _selectCard(cardEl, step) {
    // Deselect previous
    document.querySelectorAll('.game-card.selected').forEach(c => c.classList.remove('selected'));
    
    this.selectedCard = { el: cardEl, step: step };
    cardEl.classList.add('selected');
    
    // Speak the card label
    TTS.speak(step.label);
  },

  /** Render empty drop slots */
  _renderSlots() {
    const tray = document.getElementById('slot-tray');
    tray.innerHTML = '';

    this.steps.forEach((_, idx) => {
      const slot = document.createElement('div');
      slot.className = 'drop-slot';
      slot.dataset.slotIndex = idx;
      
      const numLabel = LANG.current === 'as' 
        ? ['১', '২', '৩', '৪', '৫'][idx] 
        : (idx + 1).toString();

      slot.innerHTML = `<span class="slot-number">${numLabel}</span>`;

      // Mark filled slots
      if (this.placed[idx]) {
        slot.classList.add('filled');
        const step = this.placed[idx];
        slot.innerHTML = `
          <img src="${step.img}" alt="${step.label[LANG.current]}" class="slot-img"
               onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%22%23F5EDE0%22 width=%22200%22 height=%22200%22/><text x=%22100%22 y=%22100%22 text-anchor=%22middle%22 font-size=%2240%22>✓</text></svg>'">
          <span class="slot-card-label">${step.label[LANG.current]}</span>
        `;
      }

      // ---- Drop events (mouse drag) ----
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!this.placed[idx]) slot.classList.add('drag-over');
      });
      slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
      });
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const stepIdx = parseInt(e.dataTransfer.getData('text/plain'));
        this._tryPlace(stepIdx, idx);
      });

      // ---- Tap-to-place (click on slot) ----
      slot.addEventListener('click', () => {
        if (this.selectedCard && !this.placed[idx]) {
          const stepIdx = this.steps.indexOf(this.selectedCard.step);
          this._tryPlace(stepIdx, idx);
        }
      });

      tray.appendChild(slot);
    });
  },

  /** Try to place a card — validate and give feedback */
  _tryPlace(stepIndex, slotIndex) {
    this.attempts++;

    // The card at stepIndex should go to slot stepIndex
    // We only allow sequential placement (next empty slot)
    // OR: the card must match the slot's correct position
    if (stepIndex === slotIndex) {
      // Correct!
      this.placed[slotIndex] = this.steps[stepIndex];
      this.nextSlot = this.placed.findIndex(s => s === null);
      if (this.nextSlot === -1) this.nextSlot = this.steps.length;

      this._renderSlots();
      this._renderCards();

      // Feedback
      TTS.speak(this.steps[stepIndex].narr);
      this._flashCorrect(slotIndex);

      // Check completion
      if (this.placed.every(s => s !== null)) {
        setTimeout(() => this._complete(), 1500);
      }
    } else {
      // Wrong — gentle nudge
      this.hints++;
      this._shakeCard(stepIndex);
      TTS.speak(LANG.strings.wrong_nudge);
      App.setAvatar('gentle');
      setTimeout(() => App.setAvatar('idle'), 2000);
    }

    this.selectedCard = null;
  },

  /** Flash green glow on correct slot */
  _flashCorrect(slotIndex) {
    const slot = document.querySelectorAll('.drop-slot')[slotIndex];
    if (slot) {
      slot.classList.add('correct-flash');
      App.setAvatar('idle');
      setTimeout(() => slot.classList.remove('correct-flash'), 1000);
    }
  },

  /** Shake card on wrong placement */
  _shakeCard(stepIndex) {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach(c => {
      if (parseInt(c.dataset.stepIndex) === stepIndex) {
        c.classList.add('shake');
        setTimeout(() => c.classList.remove('shake'), 600);
      }
    });
  },

  /** Completion — warm celebration */
  _complete() {
    App.setAvatar('happy');
    App.showScreen('screen-complete');

    // Silent logging for caregiver
    this._log();

    // Narrate completion
    TTS.speak(LANG.strings.completion_title);
  },

  /** Silent caregiver logging (localStorage) */
  _log() {
    const log = JSON.parse(localStorage.getItem('smritisetu_log') || '[]');
    log.push({
      game: 'loga_loi_jua',
      scenario: this.currentScenario.id,
      date: new Date().toISOString(),
      attempts: this.attempts,
      hints: this.hints,
      steps: this.steps.length,
      lang: LANG.current
    });
    // Keep last 100 entries
    if (log.length > 100) log.splice(0, log.length - 100);
    localStorage.setItem('smritisetu_log', JSON.stringify(log));
  },

  /** Update instruction text */
  _updateInstruction() {
    const el = document.getElementById('game-instruction');
    if (el) el.textContent = LANG.t('instruction');
  }
};
