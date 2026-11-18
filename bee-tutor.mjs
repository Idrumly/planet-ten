// Authored teaching prompts: features, not diagnoses of a learner.
export const wordTips = {
 hive:'Notice i–e in hive. Compare it with five: the middle vowel says its name.',
 honey:'Listen to honey, then notice its ending: the last sound is written ey.',
 wing:'The letters ng work together at the end of wing. Keep that team together.',
 sting:'Build sting from st and ing. Compare its ending with wing.',
 pollen:'Say pollen in two beats. Notice the double l in the middle.',
 buzz:'Buzz ends in two z letters. Say the word, then remember both z letters.',
 comb:'Comb has a silent b after m. Sounding it out alone will not tell you that b is there.',
 fly:'In fly, the final y spells the long i sound. Compare it with my.',
 queen:'Start with qu, then ee, then n. The ee team spells the long e sound.',
 swarm:'Look at the letters in swarm as you say it. Notice that the word starts with sw.',
 wax:'The x at the end of wax represents two sounds together: k and s.',
 clover:'Say clover in two beats. Notice the ending er; keep those letters together.',
 garden:'Say garden in two beats. Look closely at the second part, den.',
 planet:'Say planet in two beats. Notice the second part is spelled net.',
 ten:'Stretch ten slowly. Match its three sounds to t, e and n.',
 baby:'Baby has two beats. Its final y spells the long e sound.',
 papa:'Look at papa: the letters pa appear twice. Say the word as you trace each part.',
 fire:'Notice the final e in fire. Compare the spelling with wire.',
 bloom:'Bloom has the oo team in the middle. Compare that team with moon.',
 egg:'Egg ends in two g letters. One sound can need more than one letter.',
 hum:'Stretch hum slowly. Match its three sounds to h, u and m.',
 sweet:'In sweet, ee spells the long e sound. Compare it with queen.',
 summer:'Say summer in two beats. Notice the double m in the middle.',
 nectar:'Say nectar in two beats. The last part is spelled tar; look carefully at its a.',
 human:'Say human in two beats. Notice the ending man, even though its vowel can sound less clear.',
 spell:'Spell ends in double l. Compare that ending with bell.',
 quest:'Build quest with qu, e, s and t. Keep the qu together.'
};
export function feedbackFor(word,attempt){
 const typed=String(attempt).trim().toLowerCase();
 return {comparison:`You tried “${typed}”. The spelling is “${word}”.`,
 tip:wordTips[word]||'Say the word slowly. Look at how its sounds match its letters, and choose one part to remember.',
 action:'Look closely, say the word, then cover it and try from memory. Learning retries are free and earn no extra Hexes.'};
}
export const wisdom = [
 'Clues are tools for thoughtful bees. A sentence tells you which meaning you need; a definition helps you picture it. Using a clue to learn is wise.',
 'Word families can help in your writing. Sail + ing makes sailing: keep the whole base word sail, then add ing. Check whether a word you know can help.',
 'Origins sometimes explain a spelling pattern. Action and nation came through French from Latin; both end in tion. That is a useful comparison, not a rule for every Latin word.',
 'Some spellings preserve old sounds. The k in knee was once pronounced. History can explain that letter, but you still need to practise remembering it.',
 'When writing a story, keep your ideas flowing. Mark a spelling you want to check, then check it while editing. Try today’s word again tomorrow without looking.'
];
export function learningResult(profile,correct){return {profile,award:0,correct};}
