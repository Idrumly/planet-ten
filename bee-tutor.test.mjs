import {test} from 'node:test';
import assert from 'node:assert/strict';
import {wordTips,feedbackFor,learningResult} from './bee-tutor.mjs';
import {questions,newProfile} from './bee-playground-rules.mjs';
test('every tutorial word has a specific feature to practise',()=>{for(const q of questions)assert.ok(wordTips[q.word]);});
test('feedback compares an attempt without diagnosing the child',()=>{const f=feedbackFor('comb','com');assert.match(f.comparison,/com.*comb/);assert.match(f.tip,/silent b/);});
test('learning retries never change wallet or earned words',()=>{const p=newProfile();for(const correct of [true,false]){const r=learningResult(p,correct);assert.equal(r.award,0);assert.deepEqual(r.profile,p);}});
