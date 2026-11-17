import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {studentEntries,findByCode,findByLink,entryForBee,directLink} from './student-entry-data.mjs';
test('29 stable codes and direct links resolve to the same fictional bees',()=>{
 assert.equal(studentEntries.length,29);
 for(const key of ['beeId','surname','code','linkId'])assert.equal(new Set(studentEntries.map(b=>b[key])).size,29);
 for(const bee of studentEntries){assert.match(bee.code,/^[a-z]+zzz$/);assert.equal(findByCode(' '+bee.code.toUpperCase()+' '),bee);assert.equal(findByLink(new URL(directLink(bee)).searchParams.get('bee')),bee);assert.equal(entryForBee(bee.beeId),bee);}
 assert.equal(entryForBee('5f-30'),null);assert.equal(findByCode('unknownzzz'),null);assert.equal(findByLink('https://evil.example'),null);assert.equal(findByCode('<script>'),null);
});
test('teacher and student routing manifests match',{skip:!existsSync(new URL('./.spelling-hosted/lib/student-entry-data.mjs',import.meta.url))},()=>{
 assert.equal(readFileSync(new URL('./student-entry-data.mjs',import.meta.url),'utf8'),readFileSync(new URL('./.spelling-hosted/lib/student-entry-data.mjs',import.meta.url),'utf8'));
});
