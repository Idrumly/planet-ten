# Worm unlock shows

Each solved lock plays one original 2.8–4 second performance inside its own space on the door. Other locks remain usable. The unlocked label, correct answer, and a little souvenir remain after the performance. Opening the door finishes any remaining performances and proceeds straight to the main reveal.

Open `unlock-showcase.html` to audition every act on any of the three worms, replay a favourite, or draw a random act. Sound starts off in the showcase. The game uses its existing Sound and Motion preferences.

The twenty acts are: fuse to smiling ash; runaway balloon; taxi escape; Cloudbun eating licorice; cheerful pink puddle; floating bubbles; rolling hoop; slipper fitting and wedding waltz; wizard to frog; ticklish glowblade; disco; popcorn; rocket; zipper; sock portal; origami plane; backwards magic trick; moustache sneeze; skateboard; pancake flipping.

## Playback and accessibility

- A shuffled bag gives every act a turn before repeating. Session storage carries the bag between rooms, with no immediate repeat at the boundary. Blocked storage falls back to an in-memory bag.
- No extra modal or required click. Every lock has its own timeline, and hidden locks/dialogs pause their performances.
- Reduced motion and Motion OFF show the final souvenir immediately. Switching motion off finishes active performances. Reset cancels them.
- New vector props are original designs. Cloudbun reuses the original farm creature drawing; worm skins reuse the existing atlas.
- The Web Audio effects respect the game's sound setting. They are short synthesized cues, without licensed audio or character voices.

## Verification

Run `node --test *.test.js` for the puzzle and shuffle-bag checks. With Playwright and Chrome installed, run `node lock-gags.playtest.cjs` for all 20 full performances, reduced-motion endings, concurrent playback, hidden-dialog pause, reset cancellation, and motion changes. `node door-puzzle.playtest.cjs` covers solving locks and opening doors; `node door-layout.playtest.cjs` covers room layouts at laptop and mobile sizes.

Browser screenshots go to `../output/planet-ten/gags/`. Automated browser checks exercise audio calls but do not establish subjective sound quality; audition with Sound ON for that review.
