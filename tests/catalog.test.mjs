import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import vm from 'node:vm';
import {normalizeChat} from '../api/chat.js';
import {normalizeResult} from '../api/analyze.js';
const catalog=JSON.parse(readFileSync(new URL('../lib/catalog.json',import.meta.url),'utf8'));
test('every catalog item has a compact local WebP and synchronized browser metadata',()=>{
 const context={products:[],extraProductPhotos:{}};vm.runInNewContext(readFileSync(new URL('../public/catalog.js',import.meta.url),'utf8'),context);
 assert.equal(new Set(catalog.map(p=>p.id)).size,catalog.length);
 for(const p of catalog){
  const src=context.extraProductPhotos[p.id];assert.ok(src?.endsWith('.webp'));
  const file=new URL('../public'+src,import.meta.url);const data=readFileSync(file);
  assert.equal(data.toString('ascii',8,12),'WEBP');assert.ok(statSync(file).size<50000,`${p.id} is too large`);
  if(p.id>=16&&p.id<100){const browser=context.products.find(x=>x.id===p.id);assert.equal(browser.ko,p.ko);assert.equal(browser.zh,p.zh);assert.equal(browser.price,p.price);assert.ok(p.type);assert.ok(p.visualDescription);}
 }
});
test('new bags, dresses and footwear are eligible in both AI recommendation flows',()=>{
 const out=normalizeChat({reply:'추천',items:[34,43,47],followups:[],budget:null});assert.deepEqual(out.items.map(p=>p.id),[34,43,47]);assert.equal(out.total,757);
 const photo=normalizeResult({isFashion:true,summary:'검은 가방',tags:[],items:[{garment:'가방',color:'검정',details:'숄더백',productId:47,reason:'유사한 형태'}],brandSuggestions:[],budget:null});assert.equal(photo.items[0].productId,47);
});
