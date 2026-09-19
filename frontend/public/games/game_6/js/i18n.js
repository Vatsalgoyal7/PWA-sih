/*  ============================================================
    i18n.js — SmritiSetu Game 6 "Loga Loi Jua"
    All text strings in Assamese (as) and English (en).
    Scenario card data lives here too so it stays next to labels.
    ============================================================ */

const LANG = {
  /* ---- Current language (default Assamese) ---- */
  _current: 'as',

  get current() { return this._current; },
  set current(v) { this._current = v; document.documentElement.lang = v; },

  toggle() {
    this.current = this.current === 'as' ? 'en' : 'as';
    return this.current;
  },

  /** Return the string for the current language */
  t(key) {
    const entry = this.strings[key];
    if (!entry) return key;
    return entry[this.current] || entry['en'] || key;
  },

  /* =========================================================
     All UI strings
     ========================================================= */
  strings: {

    /* ---- Home / Greeting ---- */
    app_title:        { as: 'মিলাই দিয়া',         en: 'Milai Diya' },
    app_subtitle:     { as: 'ক্ৰমত সজাওক',          en: 'Match Them' },
    greeting:         { as: 'নমস্কাৰ! আজি আমি একেলগে খেলিম। তলৰ বুটাম টিপক।',
                        en: 'Hello! Let\'s play together today. Press the button below.' },
    btn_play:         { as: 'খেলো আহক',             en: 'Let\'s Play' },
    lang_label:       { as: 'EN',                   en: 'অসমীয়া' },

    /* ---- Scenario Selection ---- */
    choose_scenario:  { as: 'কি কাম কৰিব?',         en: 'What routine?' },
    choose_hint:      { as: 'এটা বাছক',              en: 'Pick one' },

    /* ---- Narrated Setup ---- */
    btn_start:        { as: 'আৰম্ভ কৰক',            en: 'Start' },

    /* ---- Game Screen ---- */
    instruction:      { as: 'কাৰ্ডবোৰ সঠিক ক্ৰমত সজাওক',
                        en: 'Arrange the cards in the correct order' },
    slot_label:       { as: 'ঠাই',                   en: 'Slot' },

    /* ---- Feedback ---- */
    wrong_nudge:      { as: 'কোনটো আগত হ\'ব? আকৌ চেষ্টা কৰক।',
                        en: 'What comes first? Try again.' },
    correct_place:    { as: 'শুদ্ধ!',                en: 'Correct!' },

    /* ---- Completion ---- */
    completion_title: { as: 'বৰ ভাল হ\'ল!',          en: 'Well done!' },
    completion_msg:   { as: 'আপুনি সকলো ঠিককৈ সজালে!',
                        en: 'You arranged everything correctly!' },
    btn_next:         { as: 'পাছৰটো খেলক',          en: 'Play Next' },
    btn_home:         { as: 'ঘৰ',                    en: 'Home' },

    /* ---- Accessibility ---- */
    btn_repeat:       { as: 'পুনৰ শুনক',             en: 'Listen Again' },
    btn_home_nav:     { as: 'ঘৰলৈ যাওক',            en: 'Go Home' },
  },

  /* =========================================================
     Scenario data
     Each scenario: id, title, narration, and ordered steps
     ========================================================= */
  scenarios: [
    {
      id: 'tea',
      title:     { as: 'চাহ বনোৱা',     en: 'Making Tea' },
      narration: { as: 'আজি আমি একেলগে চাহ বনাম! চাহ বনাবলৈ কি কি লাগে আৰু কেনেকৈ কৰে মনত পেলাওক।',
                   en: 'Today let\'s make tea together! Remember what we need and the steps to make it.' },
      steps: [
        { img: 'assets/cards/tea/step1_boil_water.jpg',
          label: { as: 'পানী উতলোৱা',      en: 'Boil water' },
          narr:  { as: 'প্ৰথমে কেটলিত পানী উতলাব লাগে।', en: 'First, boil water in the kettle.' }},
        { img: 'assets/cards/tea/step2_add_tea.jpg',
          label: { as: 'চাহ-পাত দিয়া',     en: 'Add tea leaves' },
          narr:  { as: 'তাৰ পিছত চাহ-পাত দিব লাগে।', en: 'Then add the tea leaves.' }},
        { img: 'assets/cards/tea/step3_add_milk.jpg',
          label: { as: 'গাখীৰ দিয়া',       en: 'Add milk' },
          narr:  { as: 'এতিয়া গাখীৰ দিব লাগে।', en: 'Now add the milk.' }},
        { img: 'assets/cards/tea/step4_add_sugar.jpg',
          label: { as: 'চেনি দি লৰোৱা',     en: 'Add sugar & stir' },
          narr:  { as: 'চেনি দি ভালকৈ লৰাওক।', en: 'Add sugar and stir well.' }},
        { img: 'assets/cards/tea/step5_pour_cup.jpg',
          label: { as: 'কাপত চাহ ঢলা',      en: 'Pour into cup' },
          narr:  { as: 'শেষত কাপত চাহ ঢালক।', en: 'Finally, pour the tea into a cup.' }},
      ]
    },
    {
      id: 'guest',
      title:     { as: 'অতিথি সাদৰ',     en: 'Welcoming a Guest' },
      narration: { as: 'ঘৰলৈ অতিথি আহিছে! তামোল-পাণেৰে কেনেকৈ সাদৰ কৰে মনত পেলাওক।',
                   en: 'A guest has come home! Remember how we welcome them with tamul-paan.' },
      steps: [
        { img: 'assets/cards/guest/step1_gamosa.jpg',
          label: { as: 'গামোছা পৰা',       en: 'Lay the gamosa' },
          narr:  { as: 'প্ৰথমে গামোছা পাৰি দিব লাগে।', en: 'First, lay out the gamosa.' }},
        { img: 'assets/cards/guest/step2_tamul_paan.jpg',
          label: { as: 'তামোল-পাণ দিয়া',   en: 'Place tamul-paan' },
          narr:  { as: 'তাৰ ওপৰত তামোল-পাণ দিব লাগে।', en: 'Place the tamul-paan on it.' }},
        { img: 'assets/cards/guest/step3_xorai.jpg',
          label: { as: 'শৰাইত থোৱা',        en: 'Place on xorai' },
          narr:  { as: 'সকলো শৰাইত থ\'ব লাগে।', en: 'Place everything on the xorai.' }},
        { img: 'assets/cards/guest/step4_offer.jpg',
          label: { as: 'অতিথিক আগবঢ়োৱা',   en: 'Offer to guest' },
          narr:  { as: 'শেষত অতিথিক শ্ৰদ্ধাৰে আগবঢ়াওক।', en: 'Finally, offer it respectfully to the guest.' }},
      ]
    },
    {
      id: 'morning',
      title:     { as: 'পুৱাৰ কাম',       en: 'Morning Routine' },
      narration: { as: 'পুৱা উঠি আমি কি কি কৰোঁ? সঠিক ক্ৰমত সজাওক।',
                   en: 'What do we do after waking up? Arrange in the right order.' },
      steps: [
        { img: 'assets/cards/morning/step1_wake.jpg',
          label: { as: 'শুই উঠা',           en: 'Wake up' },
          narr:  { as: 'প্ৰথমে বিচনাৰ পৰা উঠিব লাগে।', en: 'First, wake up from bed.' }},
        { img: 'assets/cards/morning/step2_brush.jpg',
          label: { as: 'দাঁত মজা',          en: 'Brush teeth' },
          narr:  { as: 'তাৰ পিছত দাঁত মাজিব লাগে।', en: 'Then brush your teeth.' }},
        { img: 'assets/cards/morning/step3_bath.jpg',
          label: { as: 'গা ধোৱা',           en: 'Take a bath' },
          narr:  { as: 'এতিয়া গা ধুব লাগে।', en: 'Now take a bath.' }},
        { img: 'assets/cards/morning/step4_dress.jpg',
          label: { as: 'কাপোৰ পিন্ধা',      en: 'Get dressed' },
          narr:  { as: 'পৰিষ্কাৰ কাপোৰ পিন্ধক।', en: 'Put on clean clothes.' }},
        { img: 'assets/cards/morning/step5_breakfast.jpg',
          label: { as: 'জলপান খোৱা',        en: 'Have breakfast' },
          narr:  { as: 'শেষত জলপান খাওক।', en: 'Finally, have your breakfast.' }},
      ]
    },
    {
      id: 'bihu',
      title:     { as: 'বিহুৰ প্ৰস্তুতি',  en: 'Preparing for Bihu' },
      narration: { as: 'বিহু আহিছে! বিহুৰ আগতে কি কি কৰিব লাগে মনত পেলাওক।',
                   en: 'Bihu is coming! Remember what we do to prepare for Bihu.' },
      steps: [
        { img: 'assets/cards/bihu/step1_clean.jpg',
          label: { as: 'ঘৰ সাফ কৰা',       en: 'Clean the house' },
          narr:  { as: 'প্ৰথমে ঘৰখন সাফ-চিকুণ কৰিব লাগে।', en: 'First, clean the house.' }},
        { img: 'assets/cards/bihu/step2_pitha.jpg',
          label: { as: 'পিঠা বনোৱা',        en: 'Make pitha' },
          narr:  { as: 'তাৰ পিছত পিঠা-পনা বনাব লাগে।', en: 'Then make pitha (rice cakes).' }},
        { img: 'assets/cards/bihu/step3_mekhela.jpg',
          label: { as: 'মেখেলা-চাদৰ পিন্ধা', en: 'Wear mekhela-sador' },
          narr:  { as: 'ধুনীয়া মেখেলা-চাদৰ পিন্ধক।', en: 'Wear a beautiful mekhela-sador.' }},
        { img: 'assets/cards/bihu/step4_lamp.jpg',
          label: { as: 'চাকি জ্বলোৱা',      en: 'Light the lamp' },
          narr:  { as: 'শেষত চাকি জ্বলাই প্ৰাৰ্থনা কৰক।', en: 'Finally, light the lamp and pray.' }},
      ]
    }
  ]
};
