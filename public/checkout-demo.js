// Visual checkout demo only. No payment SDK, credentials, persistence or transmission.
const checkoutCopy={
 zh:{checkout:'去结算',confirmOrder:'确认订单',pickup:'门店自提',delivery:'快递配送',chooseStore:'选择自提门店',chooseSlot:'选择取货时间',unavailable:'当前商品数量超出该门店的演示库存',noStore:'请选择有库存的门店，或切换快递配送。',deliveryAddress:'上海市徐汇区 ○○路（演示地址）',shipping:'运费',products:'商品清单',coupon:'新人专享券',couponNote:'首单优惠 · 演示',couponUsed:'首单优惠已使用',subtotal:'商品金额',discount:'优惠',total:'合计',submit:'提交订单',seller:'收款方',method:'支付方式',wechat:'微信支付',fixed:'固定支付方式',pay:'确认支付',notice:'模拟支付 · 不会产生实际扣款',auth:'正在模拟身份验证…',authNote:'无需输入任何信息',verified:'验证完成',success:'支付成功',orderNumber:'订单编号',paidTime:'支付时间',pickupCode:'取货码',remind:'订阅取货提醒',remindToast:'取货准备好后，我们会通过微信通知你',viewOrder:'查看订单',home:'返回首页',details:'订单详情',pendingPickup:'待取货',pendingDelivery:'待发货',preparing:'正在准备配送',empty:'购物车还是空的。',backCart:'返回购物车',backSuccess:'返回支付结果',session:'刷新页面后，演示订单将清除。',size:'尺码',qty:'数量',close:'关闭',language:'切换到韩语',cartChanged:'商品已变化，请重新确认订单。'},
 ko:{checkout:'결제하기',confirmOrder:'주문 확인',pickup:'매장 픽업',delivery:'택배 배송',chooseStore:'픽업 매장 선택',chooseSlot:'픽업 시간 선택',unavailable:'선택한 상품 수량이 이 매장의 시연 재고보다 많아요',noStore:'재고가 있는 매장을 선택하거나 택배 배송으로 바꿔주세요.',deliveryAddress:'上海市徐汇区 ○○路 (시연용 주소)',shipping:'배송비',products:'주문 상품',coupon:'첫 구매 전용 쿠폰',couponNote:'첫 구매 할인 · 시연용',couponUsed:'첫 구매 쿠폰 사용 완료',subtotal:'상품 금액',discount:'할인',total:'합계',submit:'주문하기',seller:'판매자',method:'결제 수단',wechat:'위챗페이로 연결',fixed:'고정된 결제 수단',pay:'결제하기',notice:'시연용 결제 · 실제 결제 없음',auth:'본인 인증 시연 중…',authNote:'아무 정보도 입력하지 않아요',verified:'인증 완료',success:'결제 완료',orderNumber:'주문번호',paidTime:'결제 시간',pickupCode:'픽업 코드',remind:'픽업 알림 받기',remindToast:'픽업 준비되면 위챗으로 알려드릴게요',viewOrder:'주문 보기',home:'홈으로',details:'주문 상세',pendingPickup:'픽업 대기',pendingDelivery:'배송 준비 중',preparing:'배송 준비 중',empty:'장바구니가 비어 있습니다.',backCart:'장바구니로',backSuccess:'결제 결과로',session:'새로고침하면 시연 주문이 초기화됩니다.',size:'사이즈',qty:'수량',close:'닫기',language:'중국어로 전환',cartChanged:'상품이 변경됐어요. 주문을 다시 확인해 주세요.'}
};
const ct=key=>checkoutCopy[state.lang][key];
Object.assign(state,{checkoutDraft:null,checkoutPayment:null,lastOrder:null,firstCouponUsed:false});
let demoPayVersion=0,demoPayTimers=[];
const checkoutKinds=new Set(['checkout','paymentSuccess','orderDetails']);
const cartCheckoutLines=()=>DemoCheckout.lines(state.cart,getProduct);
const checkoutNotice=()=>`<p class="payment-demo-notice checkout-notice">${ct('notice')}</p>`;
const checkoutIcon=name=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${{back:'M15 5l-7 7 7 7',close:'M6 6l12 12M18 6L6 18',check:'M5 12l4 4 10-10',wallet:'M4 6h15v13H4z M4 6V4h13v2 M15 11h6v4h-6z',store:'M3 10h18L19 4H5z M5 10v10h14V10 M9 20v-6h6v6',truck:'M3 6h12v12H3z M15 10h4l3 4v4h-7 M8 19a2 2 0 11-4 0 2 2 0 014 0 M20 19a2 2 0 11-4 0 2 2 0 014 0',lock:'M6 10h12v10H6z M8 10V7a4 4 0 018 0v3'}[name]}"/></svg>`;
function checkoutLanguageButton(id){return `<button type="button" class="checkout-language" id="${id}" aria-label="${ct('language')}" onclick="toggleCheckoutLanguage()">${state.lang==='zh'?'<b>中</b> / 한':'中 / <b>한</b>'}</button>`;}
function toggleCheckoutLanguage(){state.lang=state.lang==='zh'?'ko':'zh';renderModal();updateCheckoutCartBadge();}
function updateCheckoutCartBadge(){const badge=document.querySelector('.cart-count');if(badge)badge.textContent=state.cart.reduce((sum,row)=>sum+row.qty,0);document.getElementById('cart-button')?.setAttribute('aria-label',t('cart'));}
function checkoutItems(lines){return `<div class="checkout-items">${lines.map(row=>{const p=getProduct(row.id);return `<article class="checkout-item">${productPhoto(p,'rank-box')}<div class="checkout-item-copy"><small>${esc(p.brand)}</small><strong>${esc(p[state.lang])}</strong><span>${ct('size')} ${row.size==='ONE'?t('oneSize'):esc(row.size)} · ${ct('qty')} ${row.qty}</span></div><div class="checkout-item-price"><strong>${price(row.unitPrice*row.qty)}</strong><small>${price(row.unitPrice)} × ${row.qty}</small></div></article>`;}).join('')}</div>`;}
function checkoutTotals(totals,firstCouponUsed=false){return `<div class="checkout-bill"><div><span>${ct('subtotal')}</span><span>${price(totals.subtotal)}</span></div><div><span>${ct('shipping')}</span><span>${price(0)}</span></div><div class="checkout-coupon"><span>${ct(firstCouponUsed?'couponUsed':'coupon')}<small>${ct('couponNote')}</small></span><strong>−${price(totals.coupon)}</strong></div></div>`;}
function checkoutStoreAvailable(id,lines=cartCheckoutLines()){return lines.length>0&&lines.every(row=>stock(row.id,id,row.size==='ONE'?'M':row.size)>=row.qty);}
function beginCheckout(){
 if(!cartCheckoutLines().length)return;
 const store=stores.find(s=>checkoutStoreAvailable(s.id));
 state.checkoutDraft={method:'pickup',storeId:store?.id??null,slot:0};
 cancelDemoPayTimers();state.checkoutPayment=null;state.modal='checkout';renderModal();
}
function chooseCheckoutMethod(method){if(state.checkoutPayment||!['pickup','delivery'].includes(method))return;state.checkoutDraft.method=method;renderModal();}
function chooseCheckoutStore(id){if(state.checkoutPayment||!stores.some(s=>s.id===id)||!checkoutStoreAvailable(id))return;state.checkoutDraft.storeId=id;renderModal();}
function chooseCheckoutSlot(index){if(state.checkoutPayment||!Number.isInteger(index)||index<0||index>=t('slots').length)return;state.checkoutDraft.slot=index;renderModal();}
function validCheckout(){const draft=state.checkoutDraft;return Boolean(draft&&cartCheckoutLines().length&&(draft.method==='delivery'||(stores.some(s=>s.id===draft.storeId)&&checkoutStoreAvailable(draft.storeId)&&Number.isInteger(draft.slot)&&draft.slot>=0&&draft.slot<t('slots').length)));}
function checkoutFulfillment(){
 const draft=state.checkoutDraft;
 return `<div class="checkout-methods" role="group" aria-label="${ct('confirmOrder')}">${['pickup','delivery'].map(method=>`<button type="button" id="checkout-method-${method}" aria-pressed="${draft.method===method}" class="${draft.method===method?'active':''}" onclick="chooseCheckoutMethod('${method}')">${checkoutIcon(method==='pickup'?'store':'truck')}${ct(method)}</button>`).join('')}</div>${draft.method==='pickup'?`<section class="checkout-card"><h3>${ct('chooseStore')}</h3><div class="checkout-store-list">${stores.map(s=>{const available=checkoutStoreAvailable(s.id);return `<button type="button" id="checkout-store-${s.id}" class="checkout-store ${draft.storeId===s.id?'selected':''}" aria-pressed="${draft.storeId===s.id}" ${available?'':'disabled'} onclick="chooseCheckoutStore(${s.id})"><strong>${esc(storeName(s))}</strong><span>${esc(s[state.lang==='zh'?'addressZh':'addressKo'])}</span><small>${available?s.hours:ct('unavailable')}</small></button>`;}).join('')}</div><h3>${ct('chooseSlot')}</h3><div class="time-grid">${t('slots').map((slot,index)=>`<button type="button" id="checkout-slot-${index}" class="time-option ${draft.slot===index?'active':''}" aria-pressed="${draft.slot===index}" onclick="chooseCheckoutSlot(${index})">${slot}</button>`).join('')}</div>${!validCheckout()?`<p class="tiny">${ct('noStore')}</p>`:''}</section>`:`<section class="checkout-card"><h3>${ct('delivery')}</h3><p class="checkout-address">${checkoutIcon('truck')}${ct('deliveryAddress')}</p><div class="checkout-shipping"><span>${ct('shipping')}</span><strong>${price(0)}</strong></div></section>`}`;
}
function openMockPayment(){
 if(state.checkoutPayment||!validCheckout())return;
 const draft=state.checkoutDraft;
 state.checkoutPayment={phase:'confirm',snapshot:{lines:cartCheckoutLines(),method:draft.method,storeId:draft.storeId,slot:draft.slot,firstCouponUsed:state.firstCouponUsed}};
 renderModal();
}
function cancelDemoPayTimers(){++demoPayVersion;demoPayTimers.forEach(clearTimeout);demoPayTimers=[];}
function cancelMockPayment(){cancelDemoPayTimers();state.checkoutPayment=null;if(state.modal==='checkout'){renderModal();document.getElementById('submit-demo-order')?.focus();}}
function backToCheckoutCart(){cancelDemoPayTimers();state.checkoutPayment=null;state.modal='cart';renderModal();}
function startMockPayment(){
 const payment=state.checkoutPayment;if(state.modal!=='checkout'||payment?.phase!=='confirm')return;
 cancelDemoPayTimers();const version=demoPayVersion;payment.phase='auth';payment.startedAt=Date.now();renderModal();
 demoPayTimers.push(setTimeout(()=>{if(version!==demoPayVersion||state.checkoutPayment!==payment||state.modal!=='checkout')return;payment.phase='checked';renderModal();},1200));
 demoPayTimers.push(setTimeout(()=>{if(version!==demoPayVersion||state.checkoutPayment!==payment||state.modal!=='checkout')return;finishMockPayment(payment);},1500));
}
function finishMockPayment(payment){
 if(state.checkoutPayment!==payment||!['auth','checked'].includes(payment.phase))return;
 // The snapshot is never sent or persisted. Cancelled sheets never create orders.
 const current=JSON.stringify(cartCheckoutLines());
 if(current!==JSON.stringify(payment.snapshot.lines)){cancelMockPayment();toast(ct('cartChanged'));return;}
 const order=DemoCheckout.order(payment.snapshot);
 cancelDemoPayTimers();state.lastOrder=order;state.firstCouponUsed=true;state.cart=[];state.checkoutPayment=null;state.checkoutDraft=null;state.modal='paymentSuccess';updateCheckoutCartBadge();renderModal();
}
function mockPaymentSheet(){
 const payment=state.checkoutPayment;if(!payment)return '';
 const total=DemoCheckout.totals(payment.snapshot.lines,payment.snapshot.firstCouponUsed).total;
 const phase=payment.phase,elapsed=Math.max(0,Math.min(1200,Date.now()-(payment.startedAt||Date.now())));
 const auth=phase==='auth'||phase==='checked',entering=!payment.shown;payment.shown=true;
 return `<div class="mock-pay-backdrop" onclick="if(event.target===this)cancelMockPayment()"><section class="mock-pay-sheet ${entering?'entering':''}" id="mock-payment-sheet" role="dialog" aria-modal="true" aria-labelledby="mock-payment-title" tabindex="-1"><header><button type="button" class="checkout-icon-button" aria-label="${ct('close')}" onclick="cancelMockPayment()">${checkoutIcon('close')}</button><span id="mock-payment-title">${ct('pay')}</span>${checkoutLanguageButton('payment-language')}</header><div class="mock-pay-content"><p class="mock-pay-seller">${ct('seller')} · MUSINSA中国</p><div class="mock-pay-amount">${price(total)}</div><div class="mock-pay-method">${checkoutIcon('wallet')}<div><small>${ct('method')}</small><strong>${ct('wechat')}</strong></div><span aria-label="${ct('fixed')}">${checkoutIcon('lock')}</span></div>${auth?`<div class="mock-auth" role="status" aria-live="polite"><div class="mock-auth-icon ${phase==='checked'?'verified':''}"><svg class="mock-auth-ring" viewBox="0 0 100 100" aria-hidden="true"><circle class="ring-track" cx="50" cy="50" r="45"/><circle class="ring-fill" cx="50" cy="50" r="45" style="animation-delay:-${elapsed}ms"/></svg>${phase==='checked'?checkoutIcon('check'):`<svg class="fingerprint" viewBox="0 0 48 48" aria-hidden="true"><path d="M9 23a15 15 0 0130 0 M14 27v-4a10 10 0 0120 0v6 M19 30v-7a5 5 0 0110 0v10 M24 23v14 M10 29l-2 8 M15 34l-1 7 M34 34l2 7 M39 29l2 8"/></svg>`}</div><strong>${ct(phase==='checked'?'verified':'auth')}</strong><small>${ct('authNote')}</small></div>`:''}</div><footer class="mock-pay-footer">${!auth?`<button type="button" id="confirm-demo-pay" class="black-button" onclick="startMockPayment()">${ct('pay')}</button>`:''}${checkoutNotice()}</footer></section></div>`;
}
function checkoutHeader(title,backAction){return `<header class="checkout-header"><button type="button" class="checkout-icon-button" aria-label="${ct(state.modal==='checkout'?'backCart':state.modal==='orderDetails'?'backSuccess':'home')}" onclick="${backAction}">${checkoutIcon('back')}</button><h2 id="checkout-title">${title}</h2>${checkoutLanguageButton('checkout-language')}</header>`;}
function checkoutConfirmation(){
 const lines=cartCheckoutLines(),totals=DemoCheckout.totals(lines,state.firstCouponUsed);
 return `<div class="checkout-base" ${state.checkoutPayment?'inert aria-hidden="true"':''}>${checkoutHeader(ct('confirmOrder'),'backToCheckoutCart()')}<div class="checkout-scroll">${checkoutFulfillment()}<section class="checkout-card"><h3>${ct('products')}</h3>${checkoutItems(lines)}${checkoutTotals(totals,state.firstCouponUsed)}</section></div><footer class="checkout-footer">${checkoutNotice()}<div class="checkout-footer-row"><span>${ct('total')}<strong>${price(totals.total)}</strong></span><button type="button" id="submit-demo-order" class="black-button" onclick="openMockPayment()" ${validCheckout()?'':'disabled'}>${ct('submit')}</button></div></footer></div>${mockPaymentSheet()}`;
}
function paidTime(order){return new Intl.DateTimeFormat(state.lang==='zh'?'zh-CN':'ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(order.paidAt));}
function checkoutOrderInfo(order){return `<dl class="checkout-order-info"><div><dt>${ct('orderNumber')}</dt><dd>${esc(order.number)}</dd></div><div><dt>${ct('paidTime')}</dt><dd>${paidTime(order)}</dd></div></dl>`;}
function checkoutOrderFulfillment(order){return order.method==='pickup'?`<section class="checkout-card checkout-pickup"><h3>${ct('pickup')}</h3><strong>${esc(storeName(stores.find(s=>s.id===order.storeId)))}</strong><p>${t('slots')[order.slot]}</p>${qrMock()}<p class="tiny">${t('qrNote')}</p><div class="checkout-pickup-code"><small>${ct('pickupCode')}</small><strong>${order.pickupCode.slice(0,3)} ${order.pickupCode.slice(3)}</strong></div></section>`:`<section class="checkout-card"><h3>${ct('delivery')}</h3><p>${ct('deliveryAddress')}</p><p class="checkout-order-status">${ct('preparing')}</p></section>`;}
function showPaymentSuccess(){if(!state.lastOrder)return;state.modal='paymentSuccess';renderModal();}
function viewLastOrder(){if(!state.lastOrder)return;state.modal='orderDetails';renderModal();}
function checkoutHome(){cancelDemoPayTimers();state.checkoutPayment=null;state.checkoutDraft=null;state.modal=null;navigate('home');}
function mockPickupReminder(){if(state.lastOrder?.method==='pickup')toast(ct('remindToast'));}
function checkoutSuccess(){
 const order=state.lastOrder;
 return `${checkoutHeader(ct('success'),'checkoutHome()')}<div class="checkout-scroll"><section class="checkout-success-hero"><div class="checkout-success-check">${checkoutIcon('check')}</div><h3>${ct('success')}</h3><strong>${price(order.total)}</strong></section>${checkoutOrderInfo(order)}${checkoutOrderFulfillment(order)}${order.method==='pickup'?`<button type="button" class="secondary-wide" onclick="mockPickupReminder()">${ct('remind')}</button>`:''}</div><footer class="checkout-footer">${checkoutNotice()}<div class="checkout-success-actions"><button type="button" class="black-button" onclick="viewLastOrder()">${ct('viewOrder')}</button><button type="button" class="secondary-wide" onclick="checkoutHome()">${ct('home')}</button></div></footer>`;
}
function checkoutOrderDetails(){
 const order=state.lastOrder;
 return `${checkoutHeader(ct('details'),'showPaymentSuccess()')}<div class="checkout-scroll"><div class="checkout-order-status">${ct(order.method==='pickup'?'pendingPickup':'pendingDelivery')}</div>${checkoutOrderInfo(order)}${checkoutOrderFulfillment(order)}<section class="checkout-card"><h3>${ct('products')}</h3>${checkoutItems(order.lines)}${checkoutTotals(order,order.coupon===0)}<div class="checkout-order-total"><span>${ct('total')}</span><strong>${price(order.total)}</strong></div></section><p class="tiny">${ct('session')}</p></div><footer class="checkout-footer">${checkoutNotice()}<button type="button" class="black-button" onclick="checkoutHome()">${ct('home')}</button></footer>`;
}
function removeCheckoutCartLine(index){if(!Number.isInteger(index)||index<0||index>=state.cart.length)return;state.cart.splice(index,1);updateCheckoutCartBadge();renderCheckoutCart();}
function renderCheckoutCart(){
 const lines=cartCheckoutLines(),subtotal=DemoCheckout.totals(lines,true).subtotal;
 const body=lines.length?lines.map((row,i)=>{const p=getProduct(row.id);return `<div class="inventory-row">${productPhoto(p,'rank-box')}<div style="flex:1">${esc(p[state.lang])}<small>${row.size==='ONE'?t('oneSize'):esc(row.size)} · ${t('quantity')} ${row.qty} · ${price(row.unitPrice*row.qty)}</small></div><button type="button" onclick="removeCheckoutCartLine(${i})">${t('remove')}</button></div>`;}).join(''):`<div class="cart-empty">${ct('empty')}</div>`;
 document.getElementById('modal').innerHTML=`<div class="overlay" onclick="if(event.target===this)closeModal()"><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="sheet-head"><h2 id="modal-title">${t('cart')}</h2><button type="button" class="close" aria-label="${ct('close')}" onclick="closeModal()">×</button></div>${body}<p class="tiny">${t('cartNote')}</p><button type="button" id="cart-checkout" class="black-button" onclick="beginCheckout()" ${lines.length?'':'disabled'}>${ct('checkout')} ${price(subtotal)}</button>${state.lastOrder?`<button type="button" class="secondary-wide" onclick="viewLastOrder()">${ct('viewOrder')}</button>`:''}</section></div>`;
}
const beforeCheckoutModal=renderModal;
renderModal=function(){
 if(state.modal==='cart'){renderCheckoutCart();return;}
 if(!checkoutKinds.has(state.modal)){beforeCheckoutModal();return;}
 if(state.modal!=='checkout'&&!state.lastOrder){state.modal='cart';renderCheckoutCart();return;}
 const focused=document.activeElement?.id,oldFrame=document.querySelector('.checkout-frame'),scrollTop=oldFrame?.dataset.stage===state.modal?oldFrame.querySelector('.checkout-scroll')?.scrollTop||0:0;
 const html=state.modal==='checkout'?checkoutConfirmation():state.modal==='paymentSuccess'?checkoutSuccess():checkoutOrderDetails();
 document.getElementById('modal').innerHTML=`<div class="checkout-cover"><section class="checkout-frame" data-stage="${state.modal}" role="dialog" aria-modal="true" aria-labelledby="checkout-title" tabindex="-1">${html}</section></div>`;
 const scroller=document.querySelector('.checkout-scroll');if(scroller)scroller.scrollTop=scrollTop;
 const focusTarget=focused&&document.getElementById(focused);
 if(focusTarget&&!focusTarget.closest('[inert]'))focusTarget.focus({preventScroll:true});else (document.getElementById('mock-payment-sheet')||document.querySelector('.checkout-frame')).focus({preventScroll:true});
};
const beforeCheckoutClose=closeModal;
closeModal=function(){if(checkoutKinds.has(state.modal)){if(state.checkoutPayment)cancelMockPayment();else if(state.modal==='checkout')backToCheckoutCart();else checkoutHome();return;}beforeCheckoutClose();};
const beforeCheckoutHome=renderHome;
renderHome=function(){beforeCheckoutHome();if(state.lastOrder){const button=document.createElement('button');button.className='order-chip';button.type='button';button.textContent=ct('viewOrder')+' · '+ct(state.lastOrder.method==='pickup'?'pendingPickup':'pendingDelivery');button.onclick=viewLastOrder;document.querySelector('.home .search').after(button);}};
document.addEventListener('keydown',event=>{
 if(!checkoutKinds.has(state.modal))return;
 if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeModal();}
 if(event.key==='Tab'){
  event.stopImmediatePropagation();const root=document.getElementById('mock-payment-sheet')||document.querySelector('.checkout-frame');
  const buttons=[...root.querySelectorAll('button:not(:disabled)')].filter(button=>!button.closest('[inert]'));
  if(!buttons.length){event.preventDefault();root.focus();return;}
  const first=buttons[0],last=buttons.at(-1);
  if(!root.contains(document.activeElement)){event.preventDefault();first.focus();}
  else if(event.shiftKey&&(document.activeElement===first||document.activeElement===root)){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
},true);
