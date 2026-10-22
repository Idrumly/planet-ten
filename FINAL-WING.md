# The complete warehouse route

Spelling Bee → Band Aid → Board Room → Brainstorming Department → Food Court → Shoe Box → Vacuum Cleaner Storage → Bulldozer Garage → Coffee Shop → Butterflies Feeding.

Left doors revisit earlier rooms; completed rooms remain open in the current tab session. The final right doorway returns to the suite. New codes clears the current room's completion and generates a new set.

## Puzzles

Rooms 1–8 have three locks, progressing from tens through hundred-thousands, then tenths, hundredths and thousandths. Existing staged number-line help remains available. Every room after the first randomizes both numbers and question order, while guaranteeing one exact halfway case with 5 in the deciding place. The first room keeps its existing randomized introductory sequence.

Coffee Shop and Butterflies Feeding are the final two review rooms. Each has five locks, varied target places, typed answers and no number-line hint control. Sets include large decimal numbers rounded to internal whole-number places (for example 1245.65 to the nearest hundred gives 1200), true halfway cases, values immediately below halfway, and carrying through 9. The final review extends to thousandths. Input precision is preserved with integer-scaled arithmetic before rounding; it is never rounded to an integer first. All five answers are required before opening either room.

## Scenes

- Vacuum Cleaner Storage houses exactly eight alien cleaners. The revised backdrop has cubbies, cushions, cloths and brushes, with no stored vacuum equipment. Flossie polishes one practice vacuum on a foreground table and asks to clean the player's next.
- Bulldozer Garage contains two sleeping alien bulls and Cowpoke Nebula, who asks visitors to whisper because the bulls are dozing. Subtle breathing and Zs respect pause and motion settings.
- Coffee Shop contains Mr. Martian in his established hover pod, with a cup of coffee. Twelve comic lines describe seeds, processing, roasting, grinding and extraction in strange but accurate language. “Hot burnt bean juice” is explicitly his nickname; roasting does not require burning. His browser speech fallback uses a lower pitch than TEN-BOT.
- Butterflies Feeding is a fancy restaurant with three large bristly alien houseflies eating bricks of butter from china plates. The final dialogue congratulates the player.

All scenes use the shared speaker-anchored comic bubbles, individual character clicks, pause, next and replay controls. Master sound starts off; new narration uses browser speech when available. Coffee and cowboy desktop bubbles sit beside their speakers so faces stay visible.

## Art and factual references

Original PNGs, transparent cast sheets and optimized WebP files are in `assets/rounding/`. `vacuum-prompts.json` preserves the initial room prompts; `final-wing-prompts.json` records the revised storage and all new scene prompts. Artwork used the built-in image generation tool. Established living-lock illustrations are reused with new character names for the new rooms.

Coffee dialogue was checked against the National Coffee Association's [coffee lifecycle](https://www.aboutcoffee.org/origins/lifecycle-of-coffee/) and [coffee beans overview](https://www.aboutcoffee.org/beans/). The surreal phrasing is original; the process descriptions distinguish roasted seeds from literal burning and extraction from drinking the grounds.

## Verification

Browser playthrough solved the garage's three locks and both reviews' five locks through the normal controls. Wrong answers do not advance or expose hints; the visible Open Door control enables only after answer five, all five door sprites release, and New codes resets completion and releases. Session restoration and back/next navigation checked. Desktop scenes and the 390px final review form were inspected, with no observed console errors. Screenshots are saved in the parent workspace's `output/planet-ten/` directory.

Automated tests cover exact decimal boundaries, independent integer-oracle answers across randomized rooms, guaranteed halfway cases, mixed target places, replay variety and the ten-room route. Included in the October 22 living-door release.
