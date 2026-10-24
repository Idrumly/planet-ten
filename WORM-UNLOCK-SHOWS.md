# Worm unlock shows

Each of the thirty-four named nudibranch-inspired worms now owns one original 2.8–4 second illustrated performance. Each act has 24 drawn poses, with the actual character transforming or acting out its purpose. Other locks remain usable. The unlocked label, correct answer, and final pose remain after the performance. Opening the door finishes any remaining performances and proceeds straight to the main reveal.

Open `unlock-showcase.html` to audition every character, replay a favourite, or draw a random act. Fullscreen keeps the stage and controls visible for Smartboard testing. Sound starts off in the showcase. The game uses its existing Sound and Motion preferences. `puff-preview.html` preserves the original approved study with pose inspection and slow motion.

The original twenty acts are: fuse to smiling ash; runaway balloon; taxi escape; Cloudbun eating licorice; cheerful pink puddle; floating bubbles; rolling hoop; slipper fitting and wedding waltz; wizard to frog; ticklish glowblade; disco; popcorn; rocket; miniature department head stepping out of a zipped worm suit; sock portal; origami plane; backwards magic trick; moustache sneeze; skateboard; pancake flipping.

The fourteen new acts are Jiggles (Irish alien step dancers), Rah-Rah (the original Zargon cheerleader and living pom-poms), Crumpet (the original baby toasters), Howlie (tiny werewolf), Roswell (Earth shuttle specimen collection), Splat (happy shoe sticker), Encore (three talent judges), Drippy (wet paint), Eightball (billiards), Peepers (blinking eggs and hatchlings), Clank (giant magnet), Byte (original pixel chomper), Lo-Bat (unpainted low-poly model), and Click (pointer and recycling bin). Zippy now reveals a miniature department head who stamps APPROVED and carries the folded suit away as a briefcase.

Production prompts are in `worm-expansion-specs.json`. Built-in ImageGen generated the new transparent 24-pose sheets, including reference-based guest characters. Reference images live in `assets/rounding/worm-cartoons-v1/references/`. The existing packaging script uses one scale for each full sequence and bottom-centres the frames. Jiggles uses a separate 24-pose single-dancer atlas, rendered six times in two rows of three; the game controls the count and staggered exit. The shuffle bag uses a new storage version so an old twenty-character bag cannot delay the expanded cast.

## Playback and accessibility

- A shuffled bag assigns characters when the door puzzle is created. Session storage carries the bag between rooms; duplicate characters are skipped within a door. Blocked storage falls back to an in-memory bag. Solving a worm always plays that same character's signature act.
- No extra modal or required click. Every lock has its own timeline, and hidden locks/dialogs pause their performances.
- Reduced motion and Motion OFF show the final souvenir immediately. Switching motion off finishes active performances. Reset cancels them.
- The approved cast and Puff study are in `assets/rounding/puff-v1/`. The other original illustrations were generated using built-in ImageGen; their briefs and base prompt are in `worm-cast-specs.json`. Source sheets, crop records, optimized WebP atlases and idle portraits are in `assets/rounding/worm-cartoons-v1/`. `build-worm-cartoons.cjs` packages the illustrations using a shared scale per sequence.
- Each door preloads only its assigned atlases. The idle worm remains visible during loading. A failed atlas request uses the previous lightweight act so unlocking never depends on a successful image download.
- The Web Audio effects respect the game's sound setting. They are short synthesized cues, without licensed audio or character voices.

## Verification

Run `node --test *.test.js` for the puzzle, cast assets and shuffle-bag checks. With Playwright and Chrome installed, run `node worm-cartoons.playtest.cjs` for all 34 full performances, reduced-motion endings, fullscreen, concurrent playback, hidden-dialog pause, reset cancellation, and failed-image fallback. `node door-puzzle.playtest.cjs` covers solving locks and opening doors; `node door-layout.playtest.cjs` covers every room at Smartboard, laptop and mobile sizes. `lock-gags.playtest.cjs` forwards to the illustrated-cast suite for compatibility.

Browser screenshots go to `../output/planet-ten/cartoons/`. Browser checks cannot establish readability from the back of a physical classroom or speaker quality; those remain part of the teacher's Smartboard trial.

## 34-character release — 23 October 2026

Local verification: all 51 Node tests pass. Chrome checked all 34 complete performances, every frame of all 35 atlases for nonblank transparent artwork, exactly six runtime dancers, reduced-motion endings, fullscreen, concurrent playback, hidden-dialog pause, reset cancellation and failed-image fallback for the whole cast. Door solving and reveal checks pass, and all ten rooms fit at 1920×1080, 1536×864, 1366×650, 1280×600, 1024×600 and 390×844. Reviewed browser captures of the new acts. Previous published source: 6bca7cb.

