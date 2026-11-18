# S'Pling game design and delivery roadmap

Updated November 17, 2026. This revision adopts the talking honeycomb keyboard, first makeover, two separate stores, Earth hologram and fair-play story. It supersedes earlier descriptions of The Bee's Knees as a clothing store. The public design playground is a prototype, not the student assessment service.

## First playable design slice

Open `bee-playground.html`. Implemented here:

- Honeycomb letter buttons assemble an answer in a non-editable speech bubble above S'Pling. No standard answer input, contenteditable surface, autocorrect dropdown or paste target. Mouse, touch, and native button keyboard activation work. Delete, clear, space, apostrophe and hyphen are available.
- The bee speaks letter names, not phonemes, using device speech. Z is “zed.” A spoken-letter toggle supports quieter use and assistive technology. No direct physical-letter typing is enabled in this version; keyboard users can Tab to buttons and activate them.
- The androgynous bee has independent wing shapes/patterns, stripe designs, eye colours, hair styles/colours, lips and voice-style presets. First saved makeover is free. A later changed makeover costs 10 demo Hexes on save. Browsing, cancelling and saving an unchanged look are free. Insufficient funds leave both wallet and appearance intact.
- A stylized amorphous hologram introduces “Connecting you to a random human on Earth.” This is fictional framing, not a real connection. Demo speech uses the device; production pronunciation will reuse the teacher's selected MW, Wikimedia, TTS or teacher-recorded source.
- All five clue types are spoken instead of printed: Sentence, Part of Speech, Definition, Word Origin and Word History. The first distinct clue is free; subsequent distinct clues reduce the sample prize. Replays are free. Only completed playback unlocks a clue; stopping, hiding the page, speech error or timeout leaves the freebee and prize unchanged.
- Ten sample words, first-success-only demo prizes, and locally saved appearance/progress. A new demo starts with 20 pretend Hexes so both free and returning makeover flows can be tried. This is not the real tutorial's starting economy. “Reset playground” resets only these demo records after confirmation.
- Optional Focus flight requests fullscreen through an explicit button. It handles unsupported or denied fullscreen without blocking learning. Visibility interruptions or unexpected fullscreen exits during Focus flight queue a neutral return reminder, with no score or wallet penalty. The explicit Leave Focus flight button disables the mode. No browsing history or event logs are transmitted.
- Tailors and story dialogs describe future systems. They are not disguised working stores or playable cutscenes.

Browser-local state is deliberately not authoritative or secure. Anyone can inspect this prototype's sample answers or modify demo coins. It contains no teacher credentials, private word lists or real student progress. Do not connect the teacher bank API directly to this public code. Do not treat the public bee code manifest as authentication. The demo is not tied to a particular bee identity; classmates sharing a browser would share its demo profile.

## Agreed creative direction

S'Pling is an androgynous alien bee; appearance never constrains voice, ability or role. The first free makeover creates ownership of the hero. Use one consistent currency name: HoneyHexes, or Hexes for short.

The Bee's Knees Salon handles physical appearance and voice. Bee-Spoke Tailors and Haberdashery Ltd sells outfits and accessories. Equipment never improves spelling answers or bypasses clue costs. More elaborate outfits qualify for increasingly theatrical contest rooms, with affordable qualifying options at each tier.

The Earth hologram has no fixed gender or realistic identity. Its changing transmissions explain why saved pronunciations use different human voices. Do not replace good saved word audio merely to match the avatar. The bee's letter voice is a separate audio channel and stays consistent with the student's choice.

The actual bee voice menu should offer previewable male and female voice packs independent of appearance. Browser SpeechSynthesisVoice exposes names/languages, not a standardized gender field, and available voices differ by device. The prototype explicitly labels its lower/higher pitch presets as styles. Production should use consistent recorded or licensed/generated letter packs, with an optional device-voice fallback. Store a stable pack ID, not the index of an installed voice. Voice preview, error handling and volume controls must remain free; accessibility changes must not require a paid makeover.

The initial title “S'Pling” and existing fictional surnames remain stable. The new stores and story do not change player IDs or teacher assignments.

## Honest hero and dishonest rival

Honesty is a positive, recurring part of roleplaying S'Pling, not a suspicion meter. Establish early that the FireBee cheats, without revealing the mechanism. A small opening scene might show the Baron hiding a mysterious device just after boasting that he never needs to practise. The audience understands his dishonesty; S'Pling gradually discovers the evidence.

Suggested chapter scenes:

1. **Lower Comb:** “Getting help to learn is brave. Pretending someone else's answer is yours is different.” The mentor introduces the human voice and legitimate freebee clues. Asking for allowed help is explicitly honest.
2. **Garden victory:** the Baron notices the newcomer and demands that his accomplice watch S'Pling. “They are actually practising?”
3. **Market victory:** a crackle interrupts the Baron's performance. The child sees a clue, not a full explanation.
4. **Opera victory:** the accomplice is shown looking up words and sending them through a transmitter. S'Pling begins to connect the clues.
5. **Stolen final:** the Baron wins through the hidden assistance. Preserve the player's actual correct spellings and earned prizes. Present the loss as a clearly authored story outcome or disqualification mystery, not false spelling feedback or a secretly impossible test.
6. **Preparation:** honest play earns parts for a fictional signal blocker. Provide an affordable, visible cost and progress goal; no destructive purchase, endless grind or loss of existing achievements. The device has no real-world engineering instructions or function.
7. **Rematch:** a fair-play official exposes and blocks the unauthorized signal. The blocker removes the villain's unfair advantage; it does not give S'Pling answers. The player still has to spell correctly, and can retry/practise normally.

Cutscenes should be short, skippable and replayable from the home scrapbook, with captions and narration. Narrative captions do not reveal an active spelling answer. A skipped scene must still apply its chapter milestone once, not lose rewards. Do not depict children needing game money to receive essential accessibility support.

Recurring mentor lines: “Every honest word gives your wings a little more strength.” “A mistake can teach you. A borrowed answer cannot show what you know.” “Your freebee is part of the rules. Asking for it is wise.” Never shame a child or equate disability accommodations with cheating.

## Fullscreen and fair play

A webpage can request fullscreen following a click and observe fullscreenchange and visibilitychange. It cannot reliably detect or intercept the OS's Alt-Tab shortcut, identify which app or site the child visits, or rule out another device/person. Keyboard Lock, where available, is not a portable solution and is not used. Do not trap students in fullscreen or suppress the standard exit path.

Prototype policy: optional fullscreen; remember an interruption in the current page session; return message: “In our hive, we grow by trying honestly. Ready to continue?” Preserve answer and coins. Explicit exit turns the mode off. Fullscreen denial has a windowed fallback. This is focus support, not a cheat detector.

Future supervised contest policy: teacher may require fullscreen on supported devices, with an accommodation/windowed path. During a scored question, leaving the required mode suspends input and flags the attempt as interrupted. Returning resumes according to the pinned timing policy; a supervisor can excuse interruptions. Do not automatically mark the word wrong. Keep interruption evidence separate from correctness. Time limits must be adjustable and server-controlled; browser events remain untrusted evidence. Practice stays forgiving and untimed.

We cannot claim that moral roleplay will prevent cheating, but it gives a coherent reason to value independent effort. Pair it with manageable word difficulty, allowed help, no public wealth leaderboard, and teacher observation rather than escalating surveillance.

## Audio-only clues and answer secrecy

Speaking a sentence containing the target avoids visibly printing its spelling. It does not guarantee that a clue never gives the answer away: explicit letter-by-letter spelling, an acrostic, or an excessively revealing word history still needs teacher review. Competition-safe history must be separate from rich practice notes; current teacher helpers previously excluded history from scored clues.

Browser TTS needs plaintext, which can be inspected. A custom keyboard prevents normal input-field suggestions, but it cannot block every extension, OS overlay, physical keyboard tool or second device. Production scored questions need server-side checking, opaque question/media IDs, no answer-bearing URLs or dictionary keys, and one prize settlement per question.

For a stronger contest boundary, generate/cache clue audio server-side during publication, retaining editable text in the teacher workspace. Key audio cache entries by normalized clue text, language, voice pack, settings and revision so edits invalidate the correct file. Audio serving must be authorized to the student's current published attempt. Check permitted reuse for provider audio before proxying it. Browser TTS remains a practice fallback with explicit assurance limits.

Use separate queues for bee letter speech and human/clue playback. Entering a clue cancels pending letter chatter; changing scenes stops stale audio. Track successful playback and handle errors/cancellation without spending a freebee. Do not allow repeated audio errors to become an unlimited unreviewed scoring bypass in production; route technical failures to recovery/review. Include teacher-enabled accessible alternatives rather than silently excluding students who cannot hear or use pointer input.

## Next delivery steps

| Step | Deliverable | Acceptance gate |
| --- | --- | --- |
| 1 — now | Design playground, layerable bee, Salon preview, talking keyboard, Earth hologram and spoken sample clues | Free and paid makeovers, cancellation, persistence, speech failures, keyboard/touch and responsive layout checked |
| 2 | Production student sessions and approved publication snapshots | Existing codes remain selectors; real sessions authorize only that bee. Teacher Site stays private. No raw answer sheet reaches the client |
| 3 | Reliable audio service and bee letter packs | Preview both voices, exact target pronunciation, cached clue audio, revision invalidation, accessible alternatives and no charge on playback failure |
| 4 | Real tutorial and wallet ledger | Start at zero, first successful words earn once, no client-authoritative coin changes, refresh/retries cannot duplicate rewards |
| 5 | Home, saved customization and both shops | First makeover free once per player; 10-Hex changed makeover commits atomically; outfits owned/equipped separately; cancel free |
| 6 | First contest and focus policy | Ten reviewed assigned/supplement words, freebee rules, explicit entry price, resume/refund rules, optional teacher-enforced fullscreen and neutral interruption review |
| 7 | Chapter scenes and mastery progression | Early villain dishonesty, later transmitter reveal, skip/replay safe, actual spelling scores preserved |
| 8 | Signal-blocker quest and rematch | Visible attainable cost, no soft lock, fair rematch depends on spelling, practice always available |
| 9 | 5F playtest and balance | Observe audio clarity, keyboard effort, customization interest, fairness, accessibility, interruption false positives, and time to earn each gate |

## Verification and sources

Unit checks cover free/paid/unchanged/insufficient-funds makeovers, malformed local saves, clue prices, duplicate rewards and non-editable letter assembly. Browser checks covered makeover changes, cancellation, persistence after reload, spoken-word completion, button-built correct spelling, one free clue and a second paid clue, fullscreen entry/explicit exit, and a narrow layout without horizontal overflow. Browser test controls did not verify OS Alt-Tab or physical Escape behaviour. Voice intelligibility on classroom speakers and mobile audio remain teacher/device playtest items.

- [MDN Fullscreen guide](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide)
- [MDN fullscreenchange](https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenchange_event)
- [MDN Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN speech voices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices)
- [MDN SpeechSynthesisVoice properties](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice)

Garden art: `bee-art/dewdrop-garden.png`, generated with the built-in image-generation tool. Prompt: Create one production background illustration for a desktop educational alien-bee spelling game, wide landscape 16:9. Warm richly painted storybook 2.5D, honey-amber and deep teal with lilac alien flowers, ages 9-12. View from a small garden clearing under magnificent hexagonal wax hive architecture, looking through a huge arched honeycomb opening toward a distant glowing tiered hive palace floating beneath a lavender planet and stars. Foreground left and right framed by subtle flowering branches and wax arches, central foreground a calm empty mossy platform for a bee character and speech bubble that software will overlay, right middle clear soft dark teal area for a holographic human projection software will overlay. Lower third dark quiet moss and soft glow for keyboard overlay. Refined painterly light and enchanted atmosphere, strong depth, cozy ambitious magical world. No characters, no bees, no humans, no text, no UI, no lettering, no symbols, no coins. Avoid dense detail in center and lower third. This is actual game background art not a mockup.

The interactive bee is an original layered SVG, allowing independent appearance changes; the hologram is an original SVG with soft light and minimal facial detail. All UI text and controls are rendered separately from the generated background.

## Tutorial bank update

The tutorial now draws ten distinct words at random from: hive, honey, wing, sting, pollen, buzz, comb, fly, queen, swarm, wax, clover, garden, planet, ten, baby, papa, fire, bloom, egg, hum, sweet, summer, nectar, human, spell, quest.

A saved round survives reload. Completing flower ten and choosing Practise again draws another set; words can recur between runs. Rewards are tracked by word identity, so a new position in a new draw does not duplicate a previously earned prize. Existing demo appearance and wallet survive the migration; old numeric reward IDs referred to the retired sample bank and are discarded. Sentences, definitions and parts of speech are supplied; origin/history buttons are disabled rather than filled with unverified claims. These remain public prototype words, not private teacher data.

## Elder Clover: learning after a miss

Implemented in the public sample playground: each of the 27 starter words has one authored spelling feature. After a miss, Clover compares the attempt with the correct word, offers one feature, and lets the learner cover it and retrieve the spelling. Learning retries earn no coins. Successful retries invite an original sentence and a later recall attempt. The game does not yet schedule spaced review or assess the sentence.

Evidence-informed design, not a validated intervention: IES/What Works Clearinghouse, *Teaching Elementary School Students to Be Effective Writers*, Recommendation 3, pp. 29–31 (https://ies.ed.gov/ncee/wwc/Docs/practiceguide/writing_pg_062612.pdf), supports explicit sound–letter, spelling-pattern, and word-part instruction and connecting spelling to actual writing. Tips are authored examples of those approaches; one miss does not diagnose a learning difficulty. Future work: teacher-editable strategy prompts, delayed review, and classroom writing follow-up.

Origin examples are deliberately narrow: action/nation share a Latin-derived -tion ending (Merriam-Webster dictionary entries); knee preserves a formerly pronounced k (Vrije Universiteit Amsterdam, https://www.sgw.fsg.vu.nl/english-pronunciation/silent-letters/silent-letters-nojs.htm). Do not invent etymologies when source data is missing.

The private teacher vocabulary tool now seeds an editable **Bee and Game Start Words** unit once, preserving edits and cached clues. **Needs free context sentence** defaults off and requires a sentence before approval when enabled. The sample journey exposes this separately from optional hints. Connecting approved teacher data to the public student runtime remains a separate integration step; this public playground still uses its authored sample bank.

### Spelling Detective reflection
After a miss, the learner compares their attempt with the model, chooses one of six self-reflection categories (or “I’m not sure yet”), and sees one matching strategy. The category is not scored or treated as a diagnosis. Categories can overlap. The student then uses the honeycomb keyboard to produce the correct spelling before advancing. Failed retries return to Clover; no currency changes. Pending corrections and their selected reflection survive refresh on the same browser. These reflections are not yet sent to a teacher dashboard.

Meaning examples use “their” for possession, “there” for place, and “its” in “The cat licked its paw”; “it’s” expands to “it is” or “it has.” Word-part and doubling tips use specific examples rather than claiming that every word follows one rule.

### Recorded alphabet voices
The playground bundles 26 public MP3 previews from tim.kahn’s *The Alphabet* pack, each individually verified as CC BY 4.0. Per-letter source links and licence URLs are in `bee-audio/letters/sources.json`; credits are also visible under Voice & sound. No Freesound account or API key is needed during gameplay. Original WAV downloads remain an optional future quality upgrade.

The natural female recording is unmodified. The lower bee plays the same files at 0.86 speed with pitch preservation disabled, so it is slightly slower and lower, not a separate male speaker. A natural male candidate for future comparison is dersuperanton’s *Alphabet Letters ABC Male*: https://freesound.org/people/dersuperanton/sounds/434730/ (CC BY 4.0; a single clip requiring segmentation and listening checks). The current sources are described as American English. A Canadian “zed” recording remains a possible replacement.

Newest letter interrupts older playback to avoid a delayed queue. Stop, mute, dialogue changes, navigation and clue speech cancel recordings. Unsupported characters and failed playback use device speech. All files are fetched only when played; the Salon previews A, B and C.

### Tutorial lockup fix
Closing Clover’s advice now returns to an editable learning attempt; the reflection still must be completed before checking the correction. Word and clue playback no longer disables letter entry. A visible Stop listening button cancels a stuck voice. Restart tutorial is available in navigation and Clover’s dialog, preserves the bee and wallet, clears pending correction state, and cancels audio. Listening requests carry a generation token so interrupted old callbacks cannot overwrite a restarted round. Chrome UI checks covered closing advice then entering planet, and restarting during clue playback then entering a letter in the fresh round.

## Clue policy update
All clues and replays are free. Correct first attempts earn five HoneyHexes regardless of clue use; correction retries do not duplicate prizes. Word history & origin is one clue, using history first and origin as fallback. This supersedes earlier clue-cost proposals.
