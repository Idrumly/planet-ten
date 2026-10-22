# Warehouse wing: rooms 3–7

Historical notes for the initial wing. See [FINAL-WING.md](FINAL-WING.md) for the current ten-room route, revised cleaner storage and five-lock final reviews.

After Band Aid, the right doorway leads through Board Room → Brainstorming Department → Food Court → Shoe Box → Vacuum Cleaner Storage. Left doors revisit completed rooms during the current tab session. The final right door returns to the suite.

Each room has three living locks and randomized below-halfway, above-halfway and halfway questions. Rounding progresses through thousands, ten-thousands, hundred-thousands, tenths and hundredths. Decimal calculations use integer hundredths or thousandths to avoid binary floating-point tie errors. Clues preserve the shared line → benchmarks → target progression.

Vacuum Cleaner Storage has exactly eight individually clickable alien janitors pleading to leave and clean the player's vacuum cleaners. Four stand on a rear riser and four in front. Twelve lines use the shared comic bubbles, pause, next, and voice replay controls. Existing fuzzy, slug and jelly lock artwork is reused with the names Lint Warden, Polish Inspector and Filter Keeper. New dialogue uses the existing browser speech fallback when sound is enabled. Artwork was generated with the built-in image tool; exact prompts and processing details are in `assets/rounding/vacuum-prompts.json`, alongside the original transparent cast sheet, eight WebP sprites and backdrop.

Room 7 validation: 42 Node tests pass, including randomized hundredth questions, exact halfway carry boundaries, seven-room navigation and eight speaking residents. Browser playthrough solved all three locks (including 7.095 → 7.10), entered the room, and checked pause and individual dialogue. Desktop and 390px layout reviewed; no browser console errors observed. Local preview only; not published.

Each room loops twelve comic-bubble exchanges. Click residents for additional delivery of their own lines, or use pause, next and replay. Master sound, voice and reduced-motion preferences remain shared. The runtime uses illustrated sprites within the existing projected 2.5D world.

Artwork sources, optimized backdrops, cast cutouts and lock cutouts are in `assets/rounding/` with board-, brain-, court- and shoe- prefixes. Exact generation prompts are in `assets/rounding/warehouse-wing-prompts.json`. The brain cast received a second transparent-background pass: remove the background and glow while preserving the umbrella, seated alien and chair. Original generated images are preserved outside the repository as well.

Validation: all 40 Node tests passed; manually solved all twelve locks, entered all four rooms, checked staged decimal clues, pause/next, back navigation and session restoration. Desktop and 390px layouts inspected. No browser console errors were observed during this playthrough.
