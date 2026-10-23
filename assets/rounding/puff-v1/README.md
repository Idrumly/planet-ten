# Puff animation study

The approved twenty-character cast is `approved-cast.png`. Puff is the first animation proof, available at `puff-preview.html`; this does not replace the published game's existing animations.

Built-in ImageGen produced the isolated idle and 24-pose sequence from the approved cast. The sequence was generated together, then a background-extraction pass preserved the poses. The alpha channel is transparent even though some image viewers display its hidden purple RGB matte.

The initial normalization used the game-studio sprite normalizer. `build-puff-atlas.cjs` improves packaging by finding transparent gutters around the slightly uneven generated grid, then applies one shared scale and baseline to all 24 poses. It only crops and packages the generated artwork. Run with Node and Sharp installed. `frame-bounds.json` records each source crop. The browser consumes only `puff-atlas.webp`.

The preview provides play, pause/resume, repeat, slow motion, pose inspection, and reduced motion. It pauses elapsed time when the document is hidden. This first study demonstrates inflation and deflation, with a small winking final pose; it is not yet a production replacement for a door lock.
