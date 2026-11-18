import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newProfile,restoreProfile,makeover,potential,settle,appendLetter,defaultLook} from './bee-playground-rules.mjs';
test('first makeover is free, unchanged saves are free, changed returns cost ten, insufficient funds preserve profile',()=>{
 const fresh=newProfile();const first=makeover(fresh,{...fresh.look,wings:'round',voice:'lower'});assert.equal(first.balance,20);assert.equal(first.madeOver,true);
 assert.deepEqual(makeover(first,first.look),first);
 const second=makeover(first,{...first.look,eyes:'violet'});assert.equal(second.balance,10);
 const third=makeover(second,{...second.look,hair:'curls'});assert.equal(third.balance,0);
 assert.throws(()=>makeover(third,{...third.look,wings:'swift'}),/10 Hexes/);assert.equal(third.look.wings,'round');assert.equal(fresh.madeOver,false);
});
test('one free clue, free replays, no negative reward, mistakes do not debit, repeats cannot duplicate prizes',()=>{
 assert.equal(potential([]),5);assert.equal(potential(['sentence']),5);assert.equal(potential(['sentence','sentence']),5);assert.equal(potential(['sentence','definition']),4);
 const p=newProfile();assert.deepEqual(settle(p,0,false,['sentence']).profile,p);
 const success=settle(p,0,true,['sentence','definition']);assert.equal(success.award,4);assert.equal(success.profile.balance,24);assert.equal(settle(success.profile,0,true,[]).award,0);
 assert.equal(potential(['a','b','c','d','e','f','g']),0);
});
test('restoration sanitizes appearance and rejects malformed wallet and progress',()=>{
 const p=restoreProfile({version:1,look:{wings:'<script>',eyes:'__proto__'},balance:-50,index:88,earned:[1,1,11,'2']});assert.deepEqual(p.look,defaultLook);assert.equal(p.balance,20);assert.equal(p.index,0);assert.deepEqual(p.earned,[1]);
 assert.deepEqual(restoreProfile(null),newProfile());
});
test('the answer is assembled from individual controls, never an editable input',()=>{
 assert.equal(appendLetter('su','n'),'sun');assert.equal(appendLetter('su','paste word'),'su');assert.equal(appendLetter('a'.repeat(80),'b').length,80);
 const html=readFileSync(new URL('./bee-playground.html',import.meta.url),'utf8');assert.match(html,/<p id="answer"/);assert.doesNotMatch(html,/contenteditable|type="text"/);assert.match(html,/fair-return/);
});
