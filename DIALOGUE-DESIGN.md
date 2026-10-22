# Planet Ten: living comic dialogue

User-approved presentation rule for all new levels: characters speak in comic-book speech bubbles, not popup dialogue boxes.

- Anchor each line to the actual speaker, with a readable name and a tail. TEN-BOT speaks through his own visible avatar.
- Keep text at a readable screen size as the camera moves. Clamp bubbles inside the playfield; hide them when the speaker leaves view.
- Clicking a resident shows their line without a Close button, focus jump, camera lock, or frozen room. Allow reading time before the next automatic exchange.
- Keep one active conversational bubble at a time to avoid crowding. Character animations and ambient activity continue.
- Keep pause, next and voice replay controls in a separate compact strip. Do not put dialogue back into that strip.
- Preserve silent play, voice-only controls, reduced motion, keyboard interaction and mobile readability. Automatic conversations should not flood screen-reader live announcements; explicitly requested lines can be announced politely.
- Puzzle input dialogs remain task interfaces, not dialogue. Learning instructions and validation must remain visible and accessible.

Implemented in the Rounding Department's Spelling Bee, Band Aid, Board Room, Brainstorming Department, Food Court and Shoe Box rooms through the shared comic-dialogue module. Future rooms should reuse that module. Existing Energy Configuration Assistant scenes have not been migrated in this change.
