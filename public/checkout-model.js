// Pure demo arithmetic and ephemeral order snapshots; no storage or network access.
const DemoCheckout=Object.freeze({
 lines(cart,findProduct){
  return (Array.isArray(cart)?cart:[]).flatMap(row=>{
   const product=findProduct(row.id);
   return product&&Number.isSafeInteger(row.qty)&&row.qty>0&&row.qty<=999&&Number.isFinite(product.price)&&product.price>=0?[{id:product.id,size:product.oneSize||product.id>=100?'ONE':String(row.size||'M'),qty:row.qty,unitPrice:product.price}]:[];
  });
 },
 totals(lines,firstCouponUsed=false){
  const cents=lines.reduce((sum,row)=>sum+Math.round(row.unitPrice*100)*row.qty,0);
  const coupon=lines.length&&!firstCouponUsed?Math.min(2000,cents):0;
  return {subtotal:cents/100,coupon:coupon/100,shipping:0,total:Math.max(0,cents-coupon)/100};
 },
 order(snapshot,now=Date.now(),random=Math.random){
  if(!snapshot.lines.length)throw Error('EMPTY_CART');
  if(snapshot.method==='pickup'&&(!Number.isInteger(snapshot.storeId)||snapshot.storeId<0||!Number.isInteger(snapshot.slot)||snapshot.slot<0||snapshot.slot>3))throw Error('INVALID_PICKUP');
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(now));
  const date=['year','month','day'].map(type=>parts.find(part=>part.type===type).value).join('');
  const suffix=Math.min(9999,1000+Math.floor(random()*9000));
  return {number:`MC${date}-${suffix}`,paidAt:now,method:snapshot.method,storeId:snapshot.method==='pickup'?snapshot.storeId:null,slot:snapshot.method==='pickup'?snapshot.slot:null,pickupCode:snapshot.method==='pickup'?String(Math.min(999999,100000+Math.floor(random()*900000))):null,lines:snapshot.lines.map(row=>({...row})),...this.totals(snapshot.lines,snapshot.firstCouponUsed)};
 }
});
