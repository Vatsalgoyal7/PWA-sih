# Ki Utsav? (What Festival?) - SmritiSetu Game 1

This is a reminiscence-based therapy game built specifically for elderly Assamese patients with early-stage dementia or mild cognitive impairment (MCI). 

It is designed following strict UI/UX and accessibility guidelines: no timers, no failure states (no red buzzers/crosses), large 48px+ tap targets, high-contrast dark text on cream backgrounds, and voice-first guided interactions.

## Project Structure

```
├── index.html                 # Main entry point (Single Page Application)
├── audio/                     # Local Assamese MP3 audio files go here
├── css/
│   └── style.css              # Styling following accessibility guidelines
├── images/                    # UI icons and culturally accurate AI images
├── js/
│   └── script.js              # Game logic, state management, and TTS engine
├── audio_recording_list.md    # List of Assamese phrases and emotions for ElevenLabs
└── smritisetu-uiux-doc (2).md # The original UI/UX design foundation
```

## How to Run
This is a purely front-end application with no external dependencies. 
To run it, simply double-click `index.html` in your web browser. 
It supports full offline mode (assuming the local assets are present).

## Adding Assamese Audio
Because built-in browser Text-to-Speech (TTS) often lacks offline Assamese support, the game is configured to try playing local MP3 files first, and fall back to browser TTS if the files are missing.

To complete the offline experience:
1. Generate the audio clips using ElevenLabs using the exact filenames and emotions detailed in `audio_recording_list.md`.
2. Place the generated `.mp3` files directly into the `audio/` folder.
3. The game will automatically detect and play them when running in Assamese mode.

## Development & Modification
- **Adding Questions:** Open `js/script.js` and add a new object to the `gameData` array following the exact same structure as the existing questions.
- **Styling Changes:** Modify `css/style.css`. Note that the `var(--color-terracotta)` is specifically chosen as the primary action color based on dementia-specific vision science. Do not replace it with blue.
