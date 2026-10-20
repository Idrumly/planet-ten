# Planet Ten

A classroom place-value puzzle game with Mr. Martian, Glowblocks, ridiculous machines and an alien farm.

**[Play Planet Ten](https://idrumly.github.io/planet-ten/)**

Start with the interactive tutorial, then enter the fabrication field. Use the Assignment menu on the mission card to jump to a puzzle. Sound is optional; Motion off reduces animation. Progress currently resets when the page is reloaded.

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
