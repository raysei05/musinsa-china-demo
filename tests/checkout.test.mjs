import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context=vm.createContext({Intl,Date,Math});
vm.runInContext(readFileSync(new URL('../public/checkout-model.js',import.meta.url),'utf8'),context);
const checkout=vm.runInContext('DemoCheckout',context);
const plain=value=>JSON.parse(JSON.stringify(value));
test('coupon is capped at the subtotal and shipping is always zero',()=>{
 assert.deepEqual(plain(checkout.totals([{unitPrice:9,qty:1}])),{subtotal:9,coupon:9,shipping:0,total:0});
 assert.deepEqual(plain(checkout.totals([])),{subtotal:0,coupon:0,shipping:0,total:0});
});
test('quantity and fractional prices calculate in cents, with a first-order-only coupon',()=>{
 const lines=[{unitPrice:79.1,qty:3},{unitPrice:0.2,qty:1}];
 assert.equal(checkout.totals(lines).total,217.5);assert.equal(checkout.totals(lines,true).total,237.5);
});
test('cart lines use catalog prices and reject invalid items or quantities',()=>{
 const products={1:{id:1,price:79},13:{id:13,price:69,oneSize:true}};
 const lines=checkout.lines([{id:1,qty:2,size:'L',unitPrice:1},{id:13,qty:1,size:'M'},{id:1,qty:-1},{id:1,qty:1.5},{id:999,qty:1}],id=>products[id]);
 assert.deepEqual(plain(lines),[{id:1,size:'L',qty:2,unitPrice:79},{id:13,size:'ONE',qty:1,unitPrice:69}]);
});
test('an order freezes its own lines and uses the Korean date rather than UTC date',()=>{
 const lines=[{id:1,qty:1,size:'M',unitPrice:79}];
 const order=checkout.order({lines,method:'pickup',storeId:0,slot:2,firstCouponUsed:false},Date.parse('2026-11-16T16:00:00Z'),()=>0.5);
 lines[0].qty=9;assert.equal(order.lines[0].qty,1);assert.equal(order.total,59);assert.equal(order.number,'MC20261117-5500');assert.equal(order.pickupCode,'550000');
});
test('delivery does not retain pickup details; empty or invalid pickup cannot become an order',()=>{
 const snapshot={lines:[{id:1,qty:1,size:'M',unitPrice:79}],method:'delivery',storeId:0,slot:2,firstCouponUsed:true};
 const order=checkout.order(snapshot);assert.equal(order.storeId,null);assert.equal(order.slot,null);assert.equal(order.pickupCode,null);assert.equal(order.coupon,0);
 assert.throws(()=>checkout.order({...snapshot,lines:[]}),/EMPTY_CART/);
 assert.throws(()=>checkout.order({...snapshot,method:'pickup',storeId:null}),/INVALID_PICKUP/);
});
