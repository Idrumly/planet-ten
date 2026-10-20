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

## Guided first activity and screen fit

The comic now leads to `world.html?training=1`. TEN-BOT uses the real game tools, blocks, aiming and sweep-to-collect controls. Only the expected action is unlocked. Students enter total value and separate-block count before splitting, after splitting, after regrouping, and for a new delivery of 12 (one ten and two ones). Incorrect answers give targeted hints and retain the current step; incomplete collections can be retried without losing progress. Restart starts this practice again. The first shift remains directly available for returning players.

The game uses the available viewport height. Long missions and large block collections scroll inside their own panels; the page itself stays fitted. Fullscreen/Exit fullscreen is available on the comic and game, with an unavailable/refusal fallback. Browser policy may require the user to activate fullscreen themselves.

Additional checks: `node --test training.test.js`. Reviewed at a desktop viewport, 1024×600 laptop and 390×844 phone frame, including real split/sweep/regroup and wrong-answer recovery. Fullscreen success/exit and error paths have automated coverage; the browser automation session refused actual fullscreen entry, so native fullscreen remains a manual browser check.

## Alien tutorial narration

The first comic panel has a large Sound ON/OFF control, also available in the header. Sound starts off and the choice lasts for the current browser tab session. Enabling sound reads the current panel; TEN-BOT reads each new instruction and correction hint. Hear instruction again replays the step. Turning sound off cancels speech and closes any active sound-effects context; hidden tabs stop narration. Browser autoplay restrictions can require pressing Hear instruction again after navigation.

Fifteen bundled WAV clips in assets/voice cover the four comic pages, nine training steps and two hints. Transcripts are preserved in transcripts.json and voice-clips.js. Generated with the installed Microsoft Zira Desktop speech synthesizer at rate -2, then raised in pitch/speed by a factor of 1.35 through the PCM sample-rate header; the slower source preserves clear pacing. Assets load on demand. Dynamic text can fall back to browser speech synthesis at pitch 1.65/rate 0.9. No microphone or speech recognition is used.

Run `node --test alien-voice.test.js` for mute/cancellation, missing speech-engine support, replay, preferences, transcript consistency and non-silent audio checks. Browser review confirmed the bundled audio enters playback and stops on mute; classroom speaker volume and intelligibility remain a listening check.
