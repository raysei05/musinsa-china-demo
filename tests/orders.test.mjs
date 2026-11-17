import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context=vm.createContext({Intl,Date});
for(const file of ['checkout-model.js','order-model.js'])vm.runInContext(readFileSync(new URL('../public/'+file,import.meta.url),'utf8'),context);
const model=vm.runInContext('DemoOrders',context),checkout=vm.runInContext('DemoCheckout',context);
const now=Date.parse('2026-11-17T16:00:00Z'),stores=[{id:0,hours:'10:00–21:30'}],find=id=>id===1?{id:1,price:100}:null;
const snapshot={lines:[{id:1,size:'M',qty:2,unitPrice:100}],storeId:0,slot:2};
const reserve=()=>model.reserve(snapshot,stores,[],now,()=>0);
test('reservation saves a frozen appointment in client timezone and closes on appointment day',()=>{
 const o=reserve();assert.equal(o.number,'MC20261118-1000');assert.equal(o.type,'reserve');assert.equal(o.status,'reserved');assert.equal(o.paidAt,null);assert.equal(o.total,200);assert.equal(new Date(o.pickupAt).toISOString(),'2026-11-19T01:00:00.000Z');assert.equal(new Date(o.holdUntil).toISOString(),'2026-11-19T12:30:00.000Z');assert.equal(o.qrValue,`MUSINSA-DEMO|${o.number}|${o.pickupCode}`);
});
test('payment converts the reservation in place and preserves its identity and appointment',()=>{
 const o=reserve(),p=model.payReservation(o,false,now+1000);for(const key of ['number','createdAt','qrValue','pickupCode','storeId','pickupAt','pickupEndAt','holdUntil'])assert.equal(p[key],o[key]);assert.equal(p.type,'paid');assert.equal(p.status,'pending_pickup');assert.equal(p.total,180);assert.equal(o.type,'reserve');assert.throws(()=>model.payReservation(p));
});
test('cancel and collection preserve codes but reject further active actions',()=>{
 const o=reserve(),c=model.cancel(o);assert.equal(c.status,'cancelled');assert.equal(c.qrValue,o.qrValue);assert.throws(()=>model.payReservation(c));assert.throws(()=>model.collect(c));assert.throws(()=>model.cancel(c));assert.equal(model.collect(o).status,'collected');const paid=model.payReservation(o);assert.equal(model.collect(paid).status,'collected');assert.throws(()=>model.cancel(paid));
});
test('storage decodes mixed newest-first records and excludes malformed/duplicate identities',()=>{
 const o=reserve(),p=model.paid(checkout.order({...snapshot,method:'pickup'},now+1000,()=>0),stores,[o]);assert.notEqual(o.number,p.number);const raw=JSON.stringify({version:1,orders:[o,p,o,{...o,number:'invalid'}]});const decoded=model.decode(raw,find,stores);assert.equal(decoded.length,2);assert.equal(decoded[0].number,p.number);assert.equal(decoded[1].qrValue,o.qrValue);assert.equal(model.normalize({...o,qrValue:'changed'},find,stores),null);assert.equal(model.normalize({...o,lines:[{...o.lines[0],id:999}]},find,stores),null);assert.throws(()=>model.decode('{broken',find,stores));
});
test('stored totals are recalculated and unrelated fields are discarded',()=>{
 const o=reserve(),read=model.normalize({...o,total:-100,shipping:20,personalData:'discard'},find,stores);assert.equal(read.total,200);assert.equal(read.shipping,0);assert.equal(read.personalData,undefined);
});
