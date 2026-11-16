import test from 'node:test';
import assert from 'node:assert/strict';
import {BRANDS} from '../lib/brands.js';
import {safeURL,officialURL,searchEvidence,normalizeExternal,enrichPhotoResult} from '../lib/brand-search.js';
test('external results must be sourced official products from configured brands',()=>{
 const url='https://matinkim.com/product/detail.html?product_no=123';
 const evidence=searchEvidence({output:[{type:'web_search_call',action:{sources:[{url,title:'Black bag'}]}}]});
 const product={itemIndex:0,brandId:'matinkim',name:'Black bag',url,reason:'similar color and shape',confidence:.9};
 const found=normalizeExternal({products:[product,{...product,brandId:'puma'},{...product,url:'https://matinkim.com/product/invented'}]},evidence,[{index:0}]);
 assert.equal(found.length,1);assert.equal(found[0].image,null);
});
test('lookalike domains and non-HTTPS links are rejected',()=>{
 assert.equal(officialURL('https://matinkim.com.evil.test/product/x',BRANDS.find(b=>b.id==='matinkim')),null);
 assert.equal(safeURL('javascript:alert(1)'),null);
});
test('local catalog matches skip external search entirely',async()=>{
 const result={items:[{productId:1}],total:79};const enriched=await enrichPhotoResult(result);
 assert.equal(enriched.externalSearch.status,'not_needed');assert.equal(enriched.total,79);
});
test('no-match and service failure remain distinct without fabricated products',async(t)=>{
 const original=globalThis.fetch;t.after(()=>{globalThis.fetch=original});
 const result={items:[{garment:'bag',productId:null,brandIds:['matinkim']}],total:0};
 globalThis.fetch=async()=>({ok:false,status:429});
 let enriched=await enrichPhotoResult(result);assert.equal(enriched.items[0].external.status,'unavailable');assert.equal(enriched.items[0].external.products.length,0);
 globalThis.fetch=async()=>({ok:true,json:async()=>({status:'completed',output:[]})});
 enriched=await enrichPhotoResult(result);assert.equal(enriched.items[0].external.status,'no_match');
});
