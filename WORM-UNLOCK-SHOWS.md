# Worm unlock shows

Each of the twenty named nudibranch-inspired worms now owns one original 2.8–4 second illustrated performance. Each act has 24 drawn poses, with the actual character transforming or acting out its purpose. Other locks remain usable. The unlocked label, correct answer, and final pose remain after the performance. Opening the door finishes any remaining performances and proceeds straight to the main reveal.

Open `unlock-showcase.html` to audition every character, replay a favourite, or draw a random act. Fullscreen keeps the stage and controls visible for Smartboard testing. Sound starts off in the showcase. The game uses its existing Sound and Motion preferences. `puff-preview.html` preserves the original approved study with pose inspection and slow motion.

The twenty acts are: fuse to smiling ash; runaway balloon; taxi escape; Cloudbun eating licorice; cheerful pink puddle; floating bubbles; rolling hoop; slipper fitting and wedding waltz; wizard to frog; ticklish glowblade; disco; popcorn; rocket; zipper; sock portal; origami plane; backwards magic trick; moustache sneeze; skateboard; pancake flipping.

## Playback and accessibility

- A shuffled bag assigns characters when the door puzzle is created. Session storage carries the bag between rooms; duplicate characters are skipped within a door. Blocked storage falls back to an in-memory bag. Solving a worm always plays that same character's signature act.
- No extra modal or required click. Every lock has its own timeline, and hidden locks/dialogs pause their performances.
- Reduced motion and Motion OFF show the final souvenir immediately. Switching motion off finishes active performances. Reset cancels them.
- The approved cast and Puff study are in `assets/rounding/puff-v1/`. The other original illustrations were generated using built-in ImageGen; their briefs and base prompt are in `worm-cast-specs.json`. Source sheets, crop records, optimized WebP atlases and idle portraits are in `assets/rounding/worm-cartoons-v1/`. `build-worm-cartoons.cjs` packages the illustrations using a shared scale per sequence.
- Each door preloads only its assigned atlases. The idle worm remains visible during loading. A failed atlas request uses the previous lightweight act so unlocking never depends on a successful image download.
- The Web Audio effects respect the game's sound setting. They are short synthesized cues, without licensed audio or character voices.

## Verification

Run `node --test *.test.js` for the puzzle, cast assets and shuffle-bag checks. With Playwright and Chrome installed, run `node worm-cartoons.playtest.cjs` for all 20 full performances, reduced-motion endings, fullscreen, concurrent playback, hidden-dialog pause, reset cancellation, and failed-image fallback. `node door-puzzle.playtest.cjs` covers solving locks and opening doors; `node door-layout.playtest.cjs` covers every room at Smartboard, laptop and mobile sizes. `lock-gags.playtest.cjs` forwards to the illustrated-cast suite for compatibility.

Browser screenshots go to `../output/planet-ten/cartoons/`. Browser checks cannot establish readability from the back of a physical classroom or speaker quality; those remain part of the teacher's Smartboard trial.
