4444# SmritiSetu — UI/UX Design Document
### MVP Scope: Game 1 "Ki Utsav?" & Game 6 "Loga Loi Jua"
*SIH 2026 · CodeVengers · Problem Statement 26003 · MDoNER*

---

## 0. Purpose & Who This Is For

This document translates SmritiSetu's game design into concrete screen-level UI/UX decisions for the two MVP games. Every non-obvious decision below is tied to a numbered source — full list at the end. Target user: an Assamese-speaking elderly person (typically 60+) with early-stage dementia or mild cognitive impairment (MCI), most likely a first-time or low-frequency touchscreen user, possibly with reduced vision, reduced fine motor control, and low reading comfort in general.

---

## 1. Design Principles (Grounded)

### 1.1 Guided onboarding, never "explore to learn"
Older, unfamiliar-with-technology users do not learn well by trial and error — every screen must be walkable start-to-finish through the avatar's spoken narration, never something the person has to poke around to figure out **[4]**.

### 1.2 No timers, no failure state, gentle feedback only
Difficulty scales by *how much* the person has to hold or process (item count, visual similarity of distractors), never by *how fast* they must respond **[2]**. This matters clinically, not just aesthetically: a systematic meta-analysis of 14 RCTs found generic, non-purpose-built "brain gaming" produces **no significant improvement** in cognitive function for people with MCI or dementia **[1]** — reinforcing that mechanic design (ecological validity, adaptive load, not speed) is what separates a game that helps from one that's just a reskinned puzzle. A separate review of dementia serious games found adaptive difficulty specifically improves participation and lowers cognitive load, and that multimodal (touch+voice) interaction reduces load further compared to touch alone **[3]** — supporting both our no-speed-pressure design and the voice-first approach in §1.5. A validated five-game RCT independently confirms the "scale by count, not speed" pattern in practice — e.g. increasing the number of items to track rather than shortening the time allowed **[16]**.

### 1.3 Typography & contrast are non-negotiable minimums
- Body text: **minimum 20pt**, font weight **700 (bold)** as the floor, not the ceiling — smaller UI text (captions, labels) should not drop below this **[7]**.
- Contrast: dark text on light background always; **never** color-code meaning without an accompanying text or icon label, since color perception alone cannot be relied on **[8]**.
- Small font sizes are one of the most consistently flagged usability failures across touchscreen-dementia studies specifically — this is not a generic elderly-UX guess, it is dementia-specific evidence **[10]**.

### 1.4 Touch targets differ by *interaction type*, not one blanket number
- **Tap targets** (choosing an answer, confirming): 44×44px minimum is the common baseline **[8]**, but dedicated elderly-app guidance pushes this to **48×48px with generous spacing** to prevent accidental taps from reduced dexterity **[8]**.
- **Drag targets** (Game 6's sequencing cards): research specifically comparing pointing vs. steering/dragging tasks in older adults found **32px best for simple tap/pointing**, but **64px assisted more with dragging/steering tasks** **[9]** — so Game 6's cards need to be larger than Game 1's tap-choice buttons, not the same size.
- Every interactive element needs a visible boundary/affordance cue — older users under cognitive strain struggle to tell touchable from non-touchable elements **[4]**.

### 1.5 Voice-first, not voice-only
TTS (spoken narration) carries every instruction, question, and piece of encouragement — nothing critical is text-only, since reading comfort cannot be assumed **[4]**. ASR is used narrowly: matching a spoken answer against a small, known set of expected options per screen, never open free-form understanding, which is both a hard technical constraint of Assamese ASR today and, per rural-India voice-interface research, actually the more usable design — a persona-driven, narrated interaction style measurably outperformed a plain interactive-voice-response (IVR) format with low-literacy rural users in a field study of 62 participants **[13]**, and IVR-localization research separately argues input, error-recovery, and output all need cultural/linguistic tailoring rather than one generic dialog flow **[14]**. Assamese TTS/ASR coverage itself is confirmed at the model level — AI4Bharat's own multilingual dataset includes ~25–28 hours of dedicated Assamese speaker data per gender, funded directly by the Bhashini mission **[15]**.

### 1.6 Cultural familiarity drives *content*; clarity drives the *mechanic*
This is the single most important nuance in the whole doc. A controlled study comparing a familiar game (Solitaire) against a completely novel one (Bubble Xplode) in 30 people living with dementia found the **novel game was reached to checkpoint far more often (93%) than the familiar one (17%)** — yet enjoyment was high (88%) regardless of which game was played **[12]**. The takeaway: don't assume "this feels familiar" substitutes for "this is taught clearly." Assamese cultural content (Bihu imagery, gamosa, xorai) should drive *what's shown*, but the *task itself* — tap the picture, drag the card — still needs an explicit, narrated walkthrough on first use, every time, not just an assumption that cultural familiarity carries the mechanic.
Touchscreens are independently well-suited to this population precisely because their direct, intuitive control method doesn't require complex device literacy — and this population is documented as generally short on engaging, independent activity options to begin with **[11]**.

### 1.7 Adaptive interfaces, used carefully
During moments of stress or fatigue, people with dementia may benefit from an interface that adapts — but a 2025 scoping review of 18 studies cautions this needs to be balanced so personalization doesn't overwhelm or over-restrict the person **[10]**. For MVP: keep adaptivity simple (e.g., a "repeat instruction" button always visible, difficulty easing after repeated gentle misses) rather than building complex real-time stress detection.

### 1.8 Color theory: why blue is deprioritized and red is favored for key actions
This isn't just an aesthetic preference — it's rooted in age- and dementia-specific vision science, and it matters at two levels: normal aging, and dementia-specific perceptual decline on top of that.

**Normal aging effect:** the eye's lens naturally yellows with age, which filters out shorter wavelengths of light — blue is affected most. A vision scientist studying this describes the resulting effect as aging eyes seeing the world "as if wearing sunglasses," with blues in particular appearing darkened and muted, sometimes to the point that navy and black become hard to tell apart **[20]**. This is why a well-known HCI design guideline states plainly: don't use blue for text or small objects, and avoid red-green or blue-green combinations in areas requiring quick discrimination **[8]**.

**Dementia-specific effect, compounding the above:** roughly 80% of people with dementia experience visual and spatial perception issues on top of normal age-related decline **[24]**. Two things matter here:
- **Red is a strong, well-supported choice — with one honest caveat.** A recurring claim across dementia-care product sources is that red is the color most easily perceived by people with dementia and best retained in age-related conditions like macular degeneration **[22]**. This lines up with the underlying retinal science: red is one of only three "spectral" colors (alongside blue and green) that the eye's cone cells register directly, while muted in-between shades (pastels, purples, some yellows) are the first to fade under cone-cell degeneration **[21]**. **Caveat worth stating plainly to a judge:** the specific claim that red is retained *longest as the disease progresses* comes only from commercial product-catalog sources, not peer-reviewed research, and at least one other non-academic source claims the opposite (that green is retained longest) — so that narrower "longest-lasting" point is contested, not settled. What *is* well-supported and what we're actually relying on is the weaker, safer claim: red is strongly and reliably perceived now, across normal aging and dementia, which is sufficient justification for using it as our primary action color.
- **Contrast matters more than any single hue.** The University of Stirling's Dementia Services Development Centre — a leading authority in this field — recommends a minimum contrast differential (measured as Light Reflectance Value, LRV) of 30 points between any two surfaces or elements that need to be told apart **[23]**. There's no direct 1:1 unit conversion from physical LRV to on-screen digital contrast, but the *principle* transfers directly: any two interactive elements shown together (e.g. the correct-answer card vs. the three options around it) need to be told apart by more than color alone — shape, size, or spacing should reinforce the distinction, not just a color shift.
- Busy patterns and highly saturated colors are consistently flagged as increasing confusion and visual overstimulation for people with dementia, not just cognitive load in the abstract **[24]**.

**What this means concretely for SmritiSetu:**
- Our chosen palette (cream, terracotta, soft green, mustard yellow) already avoids blue entirely — no change needed there, but this is now a deliberate rule, not a coincidental style choice.
- **Terracotta (a red-adjacent warm tone) is the right choice for the single most important recurring action** — the "🔊 Repeat" button and any correct-answer highlight — precisely because red-family hues are the most robustly perceived color group across both normal aging and dementia-specific decline.
- If a blue accent is ever introduced later (e.g. a caregiver-dashboard-only color, since that audience doesn't have the same constraint), it must never sit adjacent to the soft green already in the palette, and must never be the only signal carrying meaning on the patient-facing screens.
- Avoid pastel or muted in-between shades for anything meaning-bearing (e.g. don't rely on "light pink vs. light peach" as a distinguishing pair) — these are the shades most likely to wash out first under cone-cell decline **[21]**.

---

## 2. Visual Design System

| Token | Spec | Why |
|---|---|---|
| Body text size | 20pt minimum | **[7]** |
| Body text weight | 700 minimum | **[7]** |
| Heading/question text | 28–32pt | scaled up from body per elderly-UX scaling guidance **[7]** |
| Primary tap target (buttons, answer cards) | 48×48px min, 16px+ spacing between targets | **[8]** |
| Drag target (sequence cards, Game 6) | 64×64px min | **[9]** |
| Contrast | Dark ink on light paper background; no pure white-on-white or light-gray-on-white text | **[8]** |
| Color-coding | Never used alone — always paired with an icon or text label | **[8]** |
| Blue usage | Avoided for text, small icons, or anything needing quick reading; if used at all, large, high-contrast, and never load-bearing for meaning | **[8], [20]** |
| Primary action color | Warm, red-family tone (terracotta) for the Repeat button and correct-answer highlight — most robustly perceived color across normal aging and dementia | **[21], [22]** |
| Adjacent-element distinction | Any two elements shown side by side (e.g. answer choices) differ in shape/size/spacing, not color alone | **[23]** |
| Pattern/saturation | No busy patterns, no highly saturated large fields of color — flat, muted, calm fields only | **[24]** |
| Navigation depth | Max 1 level deep from home — no nested menus | **[4]**, **[5]**, **[6]** |
| Font family | Rounded, high-legibility sans-serif; Assamese script rendered natively, not transliterated | supports **[10]** |
| Iconography/photography | Real, recognizable Assamese cultural objects and scenes (not abstract/generic imagery) — this content-authenticity part is evidence-backed **[25]**; whether photographic realism specifically outperforms stylized illustration is untested in the literature reviewed, so illustration is an acceptable, honestly-scoped MVP stand-in |

---

## 3. Game 1 — "Ki Utsav?" (What Festival?) Screen Flow

**Screen A — Avatar Greeting (Home)**
Full-bleed warm illustration, avatar centered, one large "Play" tap target (48×48px+), spoken greeting auto-plays on load — no reading required to start **[4]**.

**Screen B — The Photo Question**
- Top 60% of screen: a single, large, real photograph — e.g. a Rongali Bihu scene, a jolpan spread of chira-muri-doi-goor, or a Magh Bihu meji bonfire **[17], [19]**.
- Avatar narrates the question aloud in Assamese ("Iyat ki utsav?" / "What festival is this?") — text is also shown beneath the image but is not required reading **[4]**.
- Below: exactly 3  buttons (48×48px min, generous spacing), never more, to avoid overload.
- A visible "🔊 Repeat" button (48×48px) lets the person re-hear the question and options anytime — this is the "adaptive-but-simple" affordance from **[10]**.

**Screen C — Voice Answer Path (optional, parallel to tapping)**
If the person speaks instead of tapping, ASR only checks whether the spoken word matches one of the 3 shown picture labels — never open recognition **[13], [14]**.

**Screen D — Feedback (always gentle)**
- Correct: warm visual (soft glow/checkmark equivalent that isn't a harsh green tick), avatar gives specific positive spoken feedback, auto-advances.
- Incorrect: **no red X, no buzzer** **[2]**. Avatar gently states the correct answer ("This is Bohag Bihu — see the new cow-bathing?") and moves on. No retry-forcing, no visible score change.
- Progress/accuracy is logged silently in the background for the caregiver dashboard only — never shown to the patient as a score, streak, or percentage **[2]**.

---

## 4. Game 6 — "Loga Loi Jua" (Take Them Along) Screen Flow

**Screen A — Narrated Setup**
Avatar explains the routine being sequenced (e.g., welcoming a guest with tamul-paan: gamosa offered first, then paan on the gamosa, placed on the xorai **[18]**), fully spoken, before any interaction begins.

**Screen B — The Card Deck (drag-to-sequence)**
- 4–5 large photo cards (64×64px min each, per drag-target sizing **[9]**) shown in a shuffled horizontal row, real photographed objects (gamosa, tamul-paan, xorai) **[18]**.
- Cards have a visible "lift" affordance (subtle shadow/border) when touched, addressing the touchable/non-touchable ambiguity problem **[4]**.
- An empty sequence tray below shows numbered slots (1, 2, 3...) the person drags cards into.

**Screen C — Wrong Order Retry**
If a card is placed out of order: no penalty, no red mark — the card simply doesn't lock in, and the avatar offers a gentle spoken nudge ("Kot age hobo lage?" / "What comes first?") **[2]**. Voice narration can walk through the full correct order on request via the same "🔊 Repeat" affordance as Game 1.

**Screen D — Completion**
Warm, low-key celebration (no fireworks/scorekeeping); avatar affirms the completed routine; silent logging of attempts/prompts-needed to caregiver dashboard only **[2]**.

---

## 5. Shared Components Across Both Games

- **Persistent avatar presence** — same character voices every prompt, building the persona-driven interaction style shown to outperform plain IVR-style prompting **[13]**.
- **Single always-visible "🔊 Repeat" control** — the one adaptive affordance kept in MVP scope **[10]**.
- **No score, streak, or timer UI anywhere in the patient-facing app** — anything tracked is caregiver-side only **[2]**.
- **One-tap "Home" escape** from any screen — supports the max-1-level navigation rule **[4], [5], [6]**.

---

## 6. Explicit Anti-Patterns (What We Are Deliberately Not Doing)

- ❌ Countdown timers or speed-based scoring — contradicts **[2]**.
- ❌ Red used as a *failure signal* (a red X, a red buzzer flash) — contradicts **[2]**. Note this is not in tension with §1.8's use of red/terracotta as the *primary action* color elsewhere (Repeat button, correct-answer highlight) — the rule is about what red *means* in context (failure vs. call-to-action), not a ban on the hue itself.
- ❌ Nested menus or nav deeper than 1 level — contradicts **[4], [5]**.
- ❌ Relying on a novel/familiar dichotomy as a design shortcut — **[12]** shows this alone doesn't predict task success; mechanic clarity still has to be built explicitly.
- ❌ Free-form voice conversation — current Assamese ASR accuracy doesn't support it reliably; fixed-vocabulary matching only **[13], [14]**.
- ❌ Generic/abstract icons in place of real, recognizable Assamese cultural content — content authenticity (not necessarily photographic medium specifically) is what the reminiscence evidence backs **[25]**; see the honest scope note in §2's iconography row.

---

## 7. Next Step

This doc covers the two MVP games' screen-level UI/UX. Ready to move to a basic frontend component structure (screen list → component tree → state/data flow) whenever you want — say the word and I'll scaffold it next.

---

## References

| # | Name | Description | URL |
|---|---|---|---|
| 1 | Kletzel et al. (2021), *Effectiveness of Brain Gaming in Older Adults With Cognitive Impairments: A Systematic Review and Meta-Analysis*, JAMDA | Meta-analysis of 14 RCTs finding generic brain gaming shows no significant improvement in cognitive function for MCI/dementia patients — the basis for building purpose-built, not generic, games | https://pmc.ncbi.nlm.nih.gov/articles/PMC8628430/ |
| 2 | Ortega Morán et al. (2024), *A Serious Game for Cognitive Stimulation of Older People With Mild Cognitive Impairment: Design and Pilot Usability Study*, JMIR Aging | Ecologically valid shopping-task serious game; scales difficulty by item count/time allowed, not speed pressure — basis for our no-timer, no-failure-state design | https://aging.jmir.org/2024/1/e41437 |
| 3 | Mezrar & Bendella (2022), *A Systematic Review of Serious Games Relating to Cognitive Impairment and Dementia* | Found adaptive difficulty improves participation and lowers cognitive load; multimodal (touch+voice) interaction reduces load vs. touch alone | https://www.researchgate.net/publication/360853072 |
| 4 | JMIR mHealth and uHealth (2023), *Design Guidelines of Mobile Apps for Older Adults: Systematic Review and Thematic Analysis* | Systematic review backing guided (not exploratory) onboarding, large fonts, clear touchable/non-touchable distinction, high contrast | https://mhealth.jmir.org/2023/1/e43186 |
| 5 | Nielsen Norman Group, *UX Design for Seniors, 3rd Edition* | 123 users aged 65+ tested across five countries over ~20 years; 87 design guidelines on simplified navigation and voice interaction | https://www.nngroup.com/reports/senior-citizens-on-the-web/ |
| 6 | Nielsen Norman Group, *Usability for Older Adults: Challenges and Changes* | Companion research backing large, high-contrast buttons and minimal navigation steps | https://www.nngroup.com/articles/usability-for-senior-citizens/ |
| 7 | *Accessibility Recommendations for Designing Better Mobile Application User Interfaces for Seniors* | Recommends minimum 20pt body font and minimum font weight 700 for senior-facing mobile UI | https://arxiv.org/html/2504.12690v1 |
| 8 | *Elder-Friendly UI: Designing Accessible Digital Interfaces*, aufaitux | Recommends 44×44px minimum (up to 48×48px for elderly-specific apps) touch targets, high contrast, no color-only navigation cues | https://www.aufaitux.com/blog/designing-elder-friendly-ui-interfaces/ |
| 9 | *Touch Screen User Interfaces for Older Adults: Button Size and Spacing* | Study with 12 participants (55–89) finding 32px targets best for pointing tasks, 64px better for steering/dragging tasks | https://www.researchgate.net/publication/225367546_Touch_Screen_User_Interfaces_for_Older_Adults_Button_Size_and_Spacing |
| 10 | *Tapping into the Future – Touchscreen Technology for People with Dementia: A Scoping Review* (2025) | 18-study scoping review; small font sizes a recurring flagged issue; adaptive interfaces may help during stress/fatigue but must be balanced carefully | https://www.tandfonline.com/doi/full/10.1080/10447318.2025.2587243 |
| 11 | Joddrell & Astell (2016), *Studies Involving People With Dementia and Touchscreen Technology: A Literature Review*, JMIR Rehab Assist Technol | Review of 45 studies confirming touchscreens are well-suited to people with dementia due to intuitive control; this population lacks engaging independent activities | https://rehab.jmir.org/2016/2/e10/ |
| 12 | Astell et al. (2016), *Does familiarity affect the enjoyment of touchscreen games for people with dementia?*, Int J Med Inform | RCT-style study (n=30) finding a novel game was completed to checkpoint far more often (93%) than a familiar one (17%), though enjoyment was high (88%) either way | https://researchportal.northumbria.ac.uk/en/publications/does-familiarity-affect-the-enjoyment-of-touchscreen-games-for-pe/ |
| 13 | IBM Research, *Contextualized Spoken Web Browser for Low Literate Users* | Field study (62 participants) in rural India finding persona/storytelling-based voice interaction outperforms plain IVR for low-literacy users | https://research.ibm.com/publications/contextualized-spoken-web-browser-for-low-literate-users |
| 14 | IBM Research, *Designing Interactive Voice Response (IVR) Interfaces: Localisation for Low Literacy Users* | Proposes input / error-recovery / output as the three components needing cultural-linguistic localization for low-literacy IVR design | https://research.ibm.com/publications/designing-interactive-voice-response-ivr-interfaces-localisation-for-low-literacy-users |
| 15 | AI4Bharat, *Rasa: Towards Building an Expressive Multilingual Text-To-Speech Dataset for Indian Languages* | Bhashini-funded dataset confirming ~25.8 hrs (female) / 28.55 hrs (male) of dedicated Assamese speaker data | https://huggingface.co/datasets/ai4bharat/Rasa |
| 16 | Pumpho et al. (2025), *Mobile app-based cognitive decision-making and memory games enhance cognitive function in older adults with mild cognitive impairment*, Frontiers in Psychology | RCT (n=42) validating five game types incl. Rabbit Counting, Direction Memorizing, Rock-Paper-Scissors — source of adaptive difficulty-by-count design pattern | https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1633043/full |
| 17 | Assam Government, *Bihu Festival* | Official overview of the three Bihu festivals and their rituals — grounding for Game 1 content | https://assam.gov.in/node/399 |
| 18 | Civilsdaily, *Jaapi, Xorai and Gamosa* | Overview of the gamosa → tamul-paan → xorai hospitality sequence used as the basis for Game 6's sequencing task | https://www.civilsdaily.com/?p=401086 |
| 19 | Wikipedia, *Jolpan* | Overview of the traditional Assamese breakfast/snack spread (chira, muri, doi, goor, pitha) used as recall content in Game 1 | https://wikipedia.com/wiki/Jolpan |
| 20 | Sherwin-Williams, *SW ART/STIR: Color & the Aging Eye* | Interview with vision scientist Schneck on lens yellowing and reduced blue sensitivity with age | https://www.sherwin-williams.com/architects-specifiers-designers/inspiration/styles-and-techniques/SW-ART-STIR-COLOR-AGING-EYE |
| 21 | Prevent Blindness, *Color Perception and Macular Degeneration* | Explains the three "spectral" cone-cell colors (red, green, blue) and why non-spectral/pastel shades fade first under cone-cell decline | https://lowvision.preventblindness.org/?p=861 |
| 22 | Hewi, *Dementia Sensitive Products* | Industry source reporting qualitative findings that red is the color most easily and longest perceived by people with dementia, and best retained in age-related conditions like macular degeneration | https://catalog.hewi.com/en-DE/dementia-sensitive-products.html |
| 23 | University of Stirling, Dementia Services Development Centre, *Dementia Design Toolkit: Light Reflectance Values (LRVs)* | Recommends a minimum 30-point contrast differential between surfaces/elements that need to be told apart by people with dementia | https://dementia.stir.ac.uk/newsblog/dementia-design-toolkit-lrvs |
| 24 | Axalta, *Dementia Design and Colour* | Summarizes dementia-friendly color research (citing Zeisel et al. 2003, van Hoof et al. 2010) on contrast, avoiding busy patterns, and the ~80% prevalence of visual/spatial perception issues in dementia | https://secure.axalta.com/colourdesign_global/en_US/colourdesign-library/Dementia-design-and-colour.html |
| 25 | National Institute for Dementia Education (2022), *Cognitive Benefits of Photo Reminiscence Therapy for Dementia Patients* | 37-patient study (ages 67–92) finding concrete, recognizable photos — personal or generic stock alike — sustained engagement, while abstract/less-concrete images reduced eye contact and conversation. Supports concrete content-recognizability as the evidence-backed factor, not photographic-vs-illustrated medium specifically | https://nid.education/nide-publications.html |

