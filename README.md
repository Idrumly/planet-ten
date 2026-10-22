# Planet Ten

A growing suite of classroom games set on Planet Ten. The first game, **Energy Configuration Assistant**, explores place value with Mr. Martian, Glowblocks, ridiculous machines and an alien farm.

**[Play Planet Ten](https://idrumly.github.io/planet-ten/)**

Choose Energy Configuration Assistant from the suite landing page, start with the interactive tutorial, then enter the fabrication field. Use the Assignment menu on the mission card to jump to a puzzle. Sound is optional; Motion off reduces animation. Progress currently resets when the page is reloaded.

## Playtesting

Use a desktop or laptop browser first. Split a block with the Discombobulator; sweep across ten matching blocks with the Transmorgifier. Keyboard users can Tab to blocks and press Enter to select them. Watch both the total value and representation label.

Report the assignment, target number, browser/device, expected result and actual result in GitHub Issues. Please do not include student names or identifiable student work.

The current game reaches ten-thousands; six-digit numbers and money are future work.

## Local development

Serve this folder with any static HTTP server. No build step, accounts or API keys are required. Run the mathematical regression checks:

```sh
node puzzle-contracts.test.js
node farm-contracts.test.js
```

Artwork is reused from the original Planet Ten prototype; the Mr. Martian prompt is preserved in assets. All assets use relative paths for GitHub Pages.

## Guided first activity and screen fit

The comic now leads to `world.html?training=1`. TEN-BOT uses the real game tools, blocks, aiming and sweep-to-collect controls. Only the expected action is unlocked. Students enter total value and separate-block count before splitting, after splitting, after regrouping, and for a new delivery of 12 (one ten and two ones). Incorrect answers give targeted hints and retain the current step; incomplete collections can be retried without losing progress. Restart starts this practice again. The first shift remains directly available for returning players.

The game uses the available viewport height. Long missions and large block collections scroll inside their own panels; the page itself stays fitted. Fullscreen/Exit fullscreen is available on the comic and game, with an unavailable/refusal fallback. Browser policy may require the user to activate fullscreen themselves.

Additional checks: `node --test training.test.js`. Reviewed at a desktop viewport, 1024×600 laptop and 390×844 phone frame, including real split/sweep/regroup and wrong-answer recovery. Fullscreen success/exit and error paths have automated coverage; the browser automation session refused actual fullscreen entry, so native fullscreen remains a manual browser check.

## Alien tutorial narration

The first comic panel has a large Sound ON/OFF control, also available in the header. Sound starts off and the choice lasts for the current browser tab session. Enabling sound reads the current panel; TEN-BOT reads each new instruction and correction hint. Hear instruction again replays the step. Turning sound off cancels speech and closes any active sound-effects context; hidden tabs stop narration. Browser autoplay restrictions can require pressing Hear instruction again after navigation.

The 57 bundled WAV clips cover the comic, guided training, first puzzle, hints, and machine/seed introductions and reveals. Text transcripts remain in assets/voice/transcripts.json. Assets load on demand; no microphone or speech recognition is used.

Run `node --test alien-voice.test.js` for mute/cancellation, missing speech-engine support, replay, preferences, transcript consistency and non-silent audio checks. Browser review confirmed the bundled audio enters playback and stops on mute; classroom speaker volume and intelligibility remain a listening check.

### TEN-BOT first puzzle
After accepting the first shift, TEN-BOT highlights the word description, value, block count, configuration and Supply Power control. Guided actions allow one split for 28 / 19 blocks, then one regroup for 28 / 10 blocks. Each supply unlocks a key and machine action; completion announces 100% active. Every new tab session requires guided practice and this first-shift walkthrough. The six explanation cards show More Help? and a progress count; students cannot dismiss the helper or switch assignments until both keys are complete. Completion unlocks free assignment selection for the rest of the tab session. The twelve first-puzzle recordings use the higher TEN-BOT character voice.

Narration now reads only the comic instructions, excluding headings. The header Voice ON/OFF toggle mutes narration independently of the master Sound control and remembers the preference for this tab. Hear again explicitly re-enables narration.

### TEN-BOT character and sound
TEN-BOT is an original, precise civic engineer: serious about community work, dryly funny about absurd equipment, and encouraging toward apprentices. Every machine and seed bed has its own initial assignment and completion speech in ten-bot-character.js. Readouts and headings are not automatically narrated. Completed inventions are deliberately introduced in authored dialogue.

Regenerate with `powershell.exe -NoProfile -File regenerate-voices.ps1` on Windows with Microsoft David and Zira installed. Fresh WinRT recordings use David for the four Mr. Martian comic panels and Zira for TEN-BOT. Mr. Martian has a deeper pitch (x0.92) and warm short reverb; TEN-BOT has higher pitch (x1.16), short metallic reflections, 73/131Hz ring modulation, and a quiet speech-gated scrape. The dry signal remains dominant, tails stay below half a second, and peaks are limited to 29000/32768. The script stores untreated sources in a separate temporary directory and renders each only once. Speaker metadata and versioned audio URLs are written into voice-clips.js. Voice-only mute and master mute stop the whole recording, including its tail. Native speech fallback selects a male/deep profile for Mr. Martian and a higher profile for TEN-BOT, but cannot reproduce the rendered metal/reverb. Run `node --test alien-voice.test.js voice-effects.test.js` to check routing, cancellation, assets, silence, tails and clipping.

Pre-activity civic briefings now use oblique Earth sayings without naming the surprise. At both ready-to-supply steps in the first puzzle, TEN-BOT flies from his panel to a pointer beside Supply Power. The button receives keyboard focus, the pointer follows panel scrolling and viewport resizing, and it clears during power delivery, completion, or helper dismissal. Motion-off mode positions him instantly. Verified at desktop and 390px width, with both keyboard power activations.

### Expanded block field
From round three onward, the block field uses a wider, deeper portion of the ground. Workshop ones are interleaved among rods and flats in stable denomination order, preserving exchange targets and keyboard traversal. Early guided levels retain their original layout. Farm groups retain their explicit denomination labels and reserve counts while gaining ground space. Native wrapping accommodates resizing; scrolling remains available for unusually large decompositions. Verified all 64 ones at 1024 x 600 without scrolling, mixed rods/ones, keyboard regrouping, mouse sweep collection, and hundred-flat exchanges.

### Farm machine crossovers
The final watering key reveals a short creature/machine scene: Cloudbun chases the hairy-legged fabricator; Slobber Slug sends the dust-bunny vacuum skidding; Pocket Puffalo gets a snack from the stationary elevator; Jellyjaw receives Mamma Toaster toast; Moonkit becomes living Zargon pompoms; Mucus Mite polishes the coffee protection dome; Tiny Star Otter conducts a machine parade. Earlier keys still grow the seed and flower. Guest art reuses the original SVGs with separate IDs and no inherited workshop animations.

Watch them again replays only the crossover, without changing keys, value or representations. Scenes use the existing cancellable animation/pause system and jump to a final tableau with Motion off. New assignments clear all guest artwork. The reward stage has its own responsive layout; completion controls appear above the optional scrolling TEN-BOT speech. Browser checks covered all seven tableaux, animated Moonkit completion, pause/resume, replay with unchanged counts, 390px layout, and a complete two-key Cloudbun puzzle followed by the next assignment.

Supply Power is a large gold button with a raised edge. Matching configurations add a glowing outline and READY — PRESS HERE label. The glow respects reduced motion. Required onboarding, its session persistence, and blocked-storage fallback have automated coverage; the full practice and both first-shift keys were also checked in Chrome.

## The Rounding Department

The second suite game begins at rounding.html. Room 1 uses three randomly generated two-digit rounding questions: one below a midpoint, one above, and one exactly halfway. Furry digit locks accept pointer, keyboard arrow, and typed input. Number-line support is visible for the first question and appears on mistakes. Three correct answers unlock the Spelling Bee scene. Replay uses new codes; no account or persistent progress is required. Sound starts off, narration uses available browser speech, and motion can be paused. Other warehouse rooms are not yet implemented. Run node --test rounding-model.test.js to check generation and rounding boundaries.

Room 1 now has a first-person 2.5D warehouse (projected architecture with animated character sprites). WASD moves, left/right arrows turn, and touch movement buttons or Walk to door provide alternatives. Click the nearby door to inspect locks; Esc returns without losing work. Movement is suspended during inspection. Three locks open the doorway into a room with three spelling bees, three flower judges and a nectar station. Lock digits start at the question number, with fifteen rotating speech bubbles. Fourteen bundled narration clips use the same Zira source and metallic TEN-BOT profile as the first game; regenerate with regenerate-rounding-voices.ps1.

## October 22: living door locks

The warehouse now has ten rooms, including the final five-lock reviews. Each door is one puzzle: all locks are available in any order, with number reels recessed through transparent windows in the worm artwork. Hints sit beside the regular locks; review doors have no hints. Small unlock reactions lead to a door reveal and fanfare (when sound is enabled). Open Door remains visible with progress until ready. Laptop layouts fit without scrolling; narrow screens use lock selectors.

Validation: `node --test *.test.js` (46 checks). With Playwright and Chrome available, run `node door-puzzle.playtest.cjs` and `node door-layout.playtest.cjs` from this directory. Browser checks cover solving, hints, keyboard and pointer input, resets, reduced motion, viewport resizing and five screen sizes.
