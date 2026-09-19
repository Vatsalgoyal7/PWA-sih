# Game Brief: Game 3 — "Kot Gol?" (Where Did It Go?)

## 1. Overview & Core Objective
- **Game Title:** "Kot Gol?" (Where Did It Go?)
- **Cognitive Domain:** Spatial / Direction Memory
- **Target Audience:** Assamese-speaking elderly individuals with early-stage dementia or Mild Cognitive Impairment (MCI).
- **Core Objective:** Train and gently monitor spatial processing and direction recall by asking users to remember a brief, simple path or sequence of movement through a familiar Assamese setting.

---

## 2. Research & Clinical Precedent
- **Scientific Basis:** Spatial memory ("where") is distinct from object ("what") or event ("when") memory. Difficulty navigating or remembering spatial layouts is an early sign of cognitive decline.
- **Validated Precedent:** Adapted directly from the "Direction Memorizing" task used in published mobile brain-training platforms validated for older adults with MCI.
- **Evidence Alignment:** Implements the "scale by count/complexity, not speed" pattern from validated MCI game studies.

---

## 3. Game Mechanics & Gameplay Flow

### Step 1: Narrated Animation (Observation Phase)
- The user views a brief, calm animated scene narrated in Assamese via Text-to-Speech (TTS).
- **MVP Scenario 1:** A traditional wooden boat (`obj_assamese_boat.png`) floats down a river (`bg_river_path_01.png`) and turns left at a Tamul tree (`marker_tamul_tree.png`).
- **MVP Scenario 2:** A villager (`obj_village_walker.png`) walks down a dirt path (`bg_village_path_01.png`) and turns right toward a Chang Ghar (`marker_chang_ghar.png`).
- **Path Length:** Kept short (2–3 steps maximum) to remain accessible and low-stress for MVP.

### Step 2: Spoken Prompt & Choice Selection (Recall Phase)
- The avatar asks a simple, spoken Assamese question (e.g., *"Did the boat turn left or right at the tree?"*).
- The screen presents 2 to 3 large interactive choice cards with explicit directional arrows and landmark cues (`card_direction_left.png`, `card_direction_right.png`, `card_direction_straight.png`).
- The user responds either by tapping a choice card or speaking the answer aloud.

### Step 3: Gentle Feedback & Silent Telemetry
- **Correct Answer:** The avatar provides warm, spoken affirmation in Assamese and smoothly advances.
- **Incorrect Answer:** No red "X", buzzer, or penalty is displayed. The avatar gently clarifies the correct path and moves forward.
- **Caregiver Telemetry:** All metrics (recall accuracy, prompts needed) are logged silently to the background Caregiver Dashboard.

---

## 4. UI/UX Rules & Accessibility Guardrails
- **No Timers / Speed Pressure:** Difficulty scales strictly by adding path steps or subtle landmarks, never by adding countdown clocks or response speed limits.
- **Touch Target Sizing:** Interactive choice cards use standard tap target dimensions of 48×48px minimum with 16px+ target spacing.
- **Voice-First Navigation:** Instructions and prompts auto-play via TTS using Bhashini / AI4Bharat Assamese voice models.
- **Always-Visible "🔊 Repeat" Control:** A persistent terracotta-colored button allows the user to re-hear the question and options at any point.
- **Fixed-Vocabulary ASR:** Voice recognition only checks for expected directional keywords matching the displayed choices, avoiding open-ended speech limitations.
- **Color Science Compliance:** Palette strictly uses earth tones (cream, soft green, terracotta, mustard yellow). No pure blue load-bearing elements or high-saturation fields are used.

---

## 5. Asset List

### 5.1 Background Scene Assets
- `bg_main.png`
- `bg_river_path_01.png`
- `bg_village_path_01.png`

### 5.2 Animated / Moving Focal Subject Assets
- `obj_assamese_boat.png`
- `obj_village_walker.png`

### 5.3 Choice Card / Touch Target Assets
- `card_direction_left.png`
- `card_direction_right.png`
- `card_direction_straight.png`

### 5.4 Environment Feature Markers
- `marker_tamul_tree.png`
- `marker_chang_ghar.png`

### 5.5 Avatar Assets
- `avatar_gentle.png`
- `avatar_happy.png`
- `avatar_idle.png`

### 5.6 Navigation & Control Icon Assets
- `icon_home.png`
- `icon_speaker.png`
