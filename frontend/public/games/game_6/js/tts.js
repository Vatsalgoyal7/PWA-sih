/*  ============================================================
    tts.js — Text-to-Speech wrapper for SmritiSetu Game 6
    
    Priority chain:
    1. Pre-recorded Assamese audio file (if exists in assets/audio/)
    2. Web Speech API with Assamese voice (as-IN)
    3. Web Speech API with Hindi voice (hi-IN) fallback
    4. Web Speech API with any available voice
    
    Audio file naming convention:
      assets/audio/{key}.mp3  — where key matches i18n string key
      OR custom path passed to speak()
    ============================================================ */

const TTS = {
  _synth: window.speechSynthesis,
  _currentAudio: null,
  _speaking: false,
  _voices: [],
  _voiceReady: false,

  /** Initialize — load voices (some browsers load async) */
  init() {
    const loadVoices = () => {
      this._voices = this._synth.getVoices();
      this._voiceReady = true;
    };
    loadVoices();
    if (this._synth.onvoiceschanged !== undefined) {
      this._synth.onvoiceschanged = loadVoices;
    }
  },

  /** Pick best voice: Assamese → Hindi → any */
  _pickVoice() {
    // Try Assamese
    let v = this._voices.find(v => v.lang.startsWith('as'));
    if (v) return v;
    // Try Bengali (very close to Assamese script/sound)
    v = this._voices.find(v => v.lang.startsWith('bn'));
    if (v) return v;
    // Try Hindi
    v = this._voices.find(v => v.lang.startsWith('hi'));
    if (v) return v;
    // Any Indian voice
    v = this._voices.find(v => v.lang.includes('IN'));
    if (v) return v;
    // Fallback to default
    return this._voices[0] || null;
  },

  /** Pick English voice */
  _pickEnglishVoice() {
    let v = this._voices.find(v => v.lang.startsWith('en-IN'));
    if (v) return v;
    v = this._voices.find(v => v.lang.startsWith('en'));
    if (v) return v;
    return this._voices[0] || null;
  },

  /** Stop any current speech or audio */
  stop() {
    this._speaking = false;
    this._synth.cancel();
    if (this._currentAudio) {
      this._currentAudio.pause();
      this._currentAudio.currentTime = 0;
      this._currentAudio = null;
    }
  },

  /**
   * Speak text.
   * @param {string|{as:string, en:string}} text — bilingual object or plain string
   * @param {string} [audioFile] — optional pre-recorded audio path
   * @returns {Promise<void>}
   */
  speak(text, audioFile) {
    return new Promise((resolve) => {
      this.stop();
      this._speaking = true;

      // Resolve bilingual text
      const lang = LANG.current;
      const actualText = (typeof text === 'object') ? (text[lang] || text['en'] || '') : text;

      // 1. Try pre-recorded audio first
      if (audioFile) {
        const audio = new Audio(audioFile);
        this._currentAudio = audio;
        audio.onended = () => { this._speaking = false; resolve(); };
        audio.onerror = () => {
          // File not found → fall back to Web Speech API
          this._speakWithSynth(actualText, lang).then(resolve);
        };
        audio.play().catch(() => {
          this._speakWithSynth(actualText, lang).then(resolve);
        });
        return;
      }

      // 2. Try pre-recorded audio by convention
      if (typeof text === 'object' && lang === 'as') {
        const audioKey = this._findAudioKey(text);
        if (audioKey) {
          const audio = new Audio('assets/audio/' + audioKey + '.mp3');
          this._currentAudio = audio;
          audio.onended = () => { this._speaking = false; resolve(); };
          audio.onerror = () => {
            this._speakWithSynth(actualText, lang).then(resolve);
          };
          audio.play().catch(() => {
            this._speakWithSynth(actualText, lang).then(resolve);
          });
          return;
        }
      }

      // 3. Web Speech API fallback
      this._speakWithSynth(actualText, lang).then(resolve);
    });
  },

  /** Speak using Web Speech API */
  _speakWithSynth(text, lang) {
    return new Promise((resolve) => {
      if (!text || !this._synth) { resolve(); return; }

      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.85;   // Slightly slower for elderly users
      utt.pitch = 1.0;
      utt.volume = 1.0;

      // Pick voice based on language
      const voice = (lang === 'as') ? this._pickVoice() : this._pickEnglishVoice();
      if (voice) utt.voice = voice;
      utt.lang = (lang === 'as') ? 'as-IN' : 'en-IN';

      utt.onend = () => { this._speaking = false; resolve(); };
      utt.onerror = () => { this._speaking = false; resolve(); };

      this._synth.speak(utt);
    });
  },

  /** Map bilingual text to audio filename key */
  _findAudioKey(textObj) {
    if (!textObj || !textObj.as) return null;
    const asText = textObj.as;
    // Check all known audio mappings
    for (const [key, val] of Object.entries(this.AUDIO_MAP)) {
      if (val === asText) return key;
    }
    return null;
  },

  /** Audio filename → Assamese text lookup */
  AUDIO_MAP: {
    // UI lines
    'greeting': 'নমস্কাৰ! আজি আমি একেলগে খেলিম। তলৰ বুটাম টিপক।',
    'choose_scenario': 'কি কাম কৰিব?',
    'instruction': 'কাৰ্ডবোৰ সঠিক ক্ৰমত সজাওক',
    'wrong_nudge': 'কোনটো আগত হ\'ব? আকৌ চেষ্টা কৰক।',
    'correct_place': 'শুদ্ধ!',
    'completion_title': 'বৰ ভাল হ\'ল!',
    // Scenario narrations
    'narr_tea': 'আজি আমি একেলগে চাহ বনাম! চাহ বনাবলৈ কি কি লাগে আৰু কেনেকৈ কৰে মনত পেলাওক।',
    'narr_guest': 'ঘৰলৈ অতিথি আহিছে! তামোল-পাণেৰে কেনেকৈ সাদৰ কৰে মনত পেলাওক।',
    'narr_morning': 'পুৱা উঠি আমি কি কি কৰোঁ? সঠিক ক্ৰমত সজাওক।',
    'narr_bihu': 'বিহু আহিছে! বিহুৰ আগতে কি কি কৰিব লাগে মনত পেলাওক।',
    // Card labels — Tea
    'card_tea_step1': 'পানী উতলোৱা',
    'card_tea_step2': 'চাহ-পাত দিয়া',
    'card_tea_step3': 'গাখীৰ দিয়া',
    'card_tea_step4': 'চেনি দি লৰোৱা',
    'card_tea_step5': 'কাপত চাহ ঢলা',
    // Card labels — Guest
    'card_guest_step1': 'গামোছা পৰা',
    'card_guest_step2': 'তামোল-পাণ দিয়া',
    'card_guest_step3': 'শৰাইত থোৱা',
    'card_guest_step4': 'অতিথিক আগবঢ়োৱা',
    // Card labels — Morning
    'card_morning_step1': 'শুই উঠা',
    'card_morning_step2': 'দাঁত মজা',
    'card_morning_step3': 'গা ধোৱা',
    'card_morning_step4': 'কাপোৰ পিন্ধা',
    'card_morning_step5': 'জলপান খোৱা',
    // Card labels — Bihu
    'card_bihu_step1': 'ঘৰ সাফ কৰা',
    'card_bihu_step2': 'পিঠা বনোৱা',
    'card_bihu_step3': 'মেখেলা-চাদৰ পিন্ধা',
    'card_bihu_step4': 'চাকি জ্বলোৱা',
    // Step narrations — Tea
    'step_tea_1': 'প্ৰথমে কেটলিত পানী উতলাব লাগে।',
    'step_tea_2': 'তাৰ পিছত চাহ-পাত দিব লাগে।',
    'step_tea_3': 'এতিয়া গাখীৰ দিব লাগে।',
    'step_tea_4': 'চেনি দি ভালকৈ লৰাওক।',
    'step_tea_5': 'শেষত কাপত চাহ ঢালক।',
    // Step narrations — Guest
    'step_guest_1': 'প্ৰথমে গামোছা পাৰি দিব লাগে।',
    'step_guest_2': 'তাৰ ওপৰত তামোল-পাণ দিব লাগে।',
    'step_guest_3': 'সকলো শৰাইত থ\'ব লাগে।',
    'step_guest_4': 'শেষত অতিথিক শ্ৰদ্ধাৰে আগবঢ়াওক।',
    // Step narrations — Morning
    'step_morning_1': 'প্ৰথমে বিচনাৰ পৰা উঠিব লাগে।',
    'step_morning_2': 'তাৰ পিছত দাঁত মাজিব লাগে।',
    'step_morning_3': 'এতিয়া গা ধুব লাগে।',
    'step_morning_4': 'পৰিষ্কাৰ কাপোৰ পিন্ধক।',
    'step_morning_5': 'শেষত জলপান খাওক।',
    // Step narrations — Bihu
    'step_bihu_1': 'প্ৰথমে ঘৰখন সাফ-চিকুণ কৰিব লাগে।',
    'step_bihu_2': 'তাৰ পিছত পিঠা-পনা বনাব লাগে।',
    'step_bihu_3': 'ধুনীয়া মেখেলা-চাদৰ পিন্ধক।',
    'step_bihu_4': 'শেষত চাকি জ্বলাই প্ৰাৰ্থনা কৰক।',
  },

  /** Check if currently speaking */
  get isSpeaking() {
    return this._speaking || this._synth.speaking;
  }
};
