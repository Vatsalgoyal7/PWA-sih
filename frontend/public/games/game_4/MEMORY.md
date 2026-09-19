# SmritiSetu Project Rules & Memory

## 1. Core Architecture & Tech Stack
- **Languages**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+).
- **STRICT PROHIBITION**: NO TypeScript. No heavy JS frameworks.
- **Dementia UI/UX Standard**: Strictly follow `smritisetu-uiux-doc (2).md` and friend's game (`https://game2code.netlify.app`).
  - Warm palette (Paper #F7F0DE, Terracotta #C1522F, Soft Green #7C9473, Mustard #D9A441, Card #FFFBF2).
  - Blue is strictly avoided.
  - No timers, no speed pressure, no penalty, no red-X, no buzzers.
  - Font floor: 20pt+ weight 700 (Baloo Da 2).
  - Tap targets: Minimum 48px to 56px+ with generous margins.
  - Avatar: Persistent presence (gentle during play, happy on completion).
  - Feedback: Constructive, gentle, positive.

## 2. Voice & Audio
- Voice synthesis: ElevenLabs using the **Zara** character for authentic Assamese accent.
- Language support: Bilingual (Assamese primary + English translation toggle).
- Audio cues: Saved under Assets/Audios/ with standard naming conventions.
- Fallback: Graceful handling so if an audio file is not yet generated, gameplay works smoothly without freezing.

## 3. Workflow & Permissions
- Always inform the user about changes before implementing them and obtain permission.
