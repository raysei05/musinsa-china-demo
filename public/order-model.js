// Canonical, serializable demo orders shared by checkout and store reservations.
const DemoOrders=Object.freeze({
 dateParts(time){const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(time));return ['year','month','day'].map(type=>Number(p.find(x=>x.type===type).value));},
 schedule(slot,baseTime,hours='10:00–22:00'){
  const [year,month,day]=this.dateParts(baseTime),start=[14,16,10,14][slot],end=[16,18,12,16][slot],offset=slot>=2?1:0;
  const closing=hours.split(/[–-]/).at(-1).match(/(\d{1,2}):(\d{2})/)||['','22','00'];
  const stamp=(h,m=0)=>Date.UTC(year,month-1,day+offset,h,m)-9*3600000;
  return {pickupAt:stamp(start),pickupEndAt:stamp(end),holdUntil:stamp(Number(closing[1]),Number(closing[2]))};
 },
 uniqueNumber(number,orders){let result=number;for(let i=0;orders.some(o=>o.number===result);i++){if(i>=9000)throw Error('ORDER_NUMBER_LIMIT');const suffix=1000+(Number(number.slice(-4))-1000+i+1)%9000;result=number.slice(0,-4)+suffix;}return result;},
 paid(order,stores,existing=[]){
  const number=this.uniqueNumber(order.number,existing),store=stores.find(s=>s.id===order.storeId);
  return {...order,number,type:'paid',status:order.method==='pickup'?'pending_pickup':'pending_delivery',createdAt:order.paidAt,updatedAt:order.paidAt,qrValue:order.method==='pickup'?`MUSINSA-DEMO|${number}|${order.pickupCode}`:null,...(store?this.schedule(order.slot,order.paidAt,store.hours):{})};
 },
 reserve(snapshot,stores,existing=[],now=Date.now(),random=Math.random){
  if(!stores.some(s=>s.id===snapshot.storeId))throw Error('INVALID_STORE');
  const base=DemoCheckout.order({...snapshot,method:'pickup',firstCouponUsed:true},now,random),record=this.paid(base,stores,existing);
  return {...record,type:'reserve',status:'reserved',paidAt:null};
 },
 payReservation(order,firstCouponUsed=false,now=Date.now()){
  if(order.type!=='reserve'||order.status!=='reserved')throw Error('RESERVATION_NOT_ACTIVE');
  return {...order,...DemoCheckout.totals(order.lines,firstCouponUsed),type:'paid',status:'pending_pickup',paidAt:now,updatedAt:now};
 },
 cancel(order,now=Date.now()){
  if(order.type!=='reserve'||order.status!=='reserved')throw Error('RESERVATION_NOT_ACTIVE');
  return {...order,status:'cancelled',cancelledAt:now,updatedAt:now};
 },
 collect(order,now=Date.now()){
  if(order.method!=='pickup'||!['reserved','pending_pickup'].includes(order.status))throw Error('ORDER_NOT_COLLECTABLE');
  return {...order,status:'collected',collectedAt:now,updatedAt:now};
 },
 normalize(input,findProduct,stores){
  if(!input||!['paid','reserve'].includes(input.type)||!/^MC\d{8}-\d{4}$/.test(input.number)||!['pickup','delivery'].includes(input.method)||!Number.isFinite(input.createdAt)||input.createdAt<0||!Array.isArray(input.lines)||!input.lines.length)return null;
  const allowed=input.type==='reserve'?['reserved','collected','cancelled']:['pending_pickup','pending_delivery','collected'];
  if(!allowed.includes(input.status)||input.type==='reserve'&&input.method!=='pickup'||input.method==='delivery'&&input.status!=='pending_delivery'||input.method==='pickup'&&input.status==='pending_delivery')return null;
  const lines=[];
  for(const row of input.lines){if(!row||!findProduct(row.id)||!Number.isSafeInteger(row.qty)||row.qty<1||row.qty>999||typeof row.size!=='string'||row.size.length>20||!Number.isFinite(row.unitPrice)||row.unitPrice<0||row.unitPrice>100000)return null;lines.push({id:row.id,size:row.size,qty:row.qty,unitPrice:row.unitPrice});}
  const base=DemoCheckout.totals(lines,true),coupon=input.type==='paid'?input.coupon:0;
  if(!Number.isFinite(coupon)||coupon<0||coupon>20||coupon>base.subtotal||input.type==='paid'&&(!Number.isFinite(input.paidAt)||input.paidAt<0))return null;
  const record={number:input.number,type:input.type,status:input.status,method:input.method,createdAt:input.createdAt,updatedAt:Number.isFinite(input.updatedAt)?input.updatedAt:input.createdAt,paidAt:input.type==='paid'?input.paidAt:null,lines,subtotal:base.subtotal,coupon,shipping:0,total:Math.round((base.subtotal-coupon)*100)/100,storeId:null,slot:null,pickupCode:null,qrValue:null};
  for(const key of ['cancelledAt','collectedAt'])if(Number.isFinite(input[key]))record[key]=input[key];
  if(input.method==='pickup'){
   const store=stores.find(s=>s.id===input.storeId);
   if(!store||!Number.isInteger(input.slot)||input.slot<0||input.slot>3||!/^\d{6}$/.test(input.pickupCode)||typeof input.qrValue!=='string'||input.qrValue!==`MUSINSA-DEMO|${input.number}|${input.pickupCode}`||!Number.isFinite(input.pickupAt)||!Number.isFinite(input.pickupEndAt)||!Number.isFinite(input.holdUntil))return null;
   Object.assign(record,{storeId:input.storeId,slot:input.slot,pickupCode:input.pickupCode,qrValue:input.qrValue,pickupAt:input.pickupAt,pickupEndAt:input.pickupEndAt,holdUntil:input.holdUntil});
  }
  return record;
 },
 decode(raw,findProduct,stores){
  const value=JSON.parse(raw||'{"version":1,"orders":[]}');
  if(value?.version!==1||!Array.isArray(value.orders))throw Error('INVALID_ORDERS_STORAGE');
  const seen=new Set();return value.orders.map(o=>this.normalize(o,findProduct,stores)).filter(o=>o&&!seen.has(o.number)&&seen.add(o.number)).sort((a,b)=>b.createdAt-a.createdAt||b.number.localeCompare(a.number));
 }
});
