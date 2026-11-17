// Conversation view: retain messages and the composer while updating individual turns.
Object.assign(aiCopy.ko,{previousOutfit:'이전 추천 코디 보기',newMessages:'새 메시지 보기 ↓'});
Object.assign(aiCopy.zh,{previousOutfit:'查看之前的搭配',newMessages:'查看新消息 ↓'});
Object.assign(state,{chatDraft:'',chatContext:{budget:null,situation:'',preferences:'',itemIds:[]}});
const chatView={follow:true,unread:false,lastCount:0,top:0};
const chatTurnKeys=new WeakMap();let nextChatTurnKey=0;
const chatActive=()=>state.tab==='ai'&&state.aiMode==='scene';
function chatKey(turn){if(!chatTurnKeys.has(turn))chatTurnKeys.set(turn,++nextChatTurnKey);return chatTurnKeys.get(turn);}
function compactChatProduct(p){return `<button type="button" class="chat-product" onclick="openProduct(${p.id})">${productPhoto(p,'rank-box')}<span class="chat-product-copy"><small>${esc(p.brand)}</small><span>${esc(p[state.lang])}</span></span><strong>${price(p.price)}</strong></button>`;}
chatResultUI=function(result,index){
 const original=result,translated=translatedResult(original);result=translated||original;
 const latest=!state.chatBusy&&index===state.chatTurns.length-1;
 const items=result.items.map(p=>getProduct(p.id)).filter(Boolean);
 const products=items.length?`<div class="chat-products">${items.map(compactChatProduct).join('')}</div><div class="chat-total"><span>${at('total')}</span><strong>${price(result.total)}</strong></div><button type="button" class="black-button chat-add" onclick="addChatResult(${index})">${at('add')}</button>`:'';
 const brands=(result.brands||[]).length?`<div class="chat-brand-links">${result.brands.map((brand,i)=>`<button type="button" class="chat-suggestion" onclick="openChatBrand(${index},${i})">${esc(brand.name)} ${at('brandStore')} ↗</button>`).join('')}</div>`:'';
 const recommendation=products+brands;
 const followups=latest&&result.followups.length?`<div class="chat-followups">${result.followups.slice(0,2).map((q,i)=>`<button type="button" class="chat-suggestion" onclick="askFollowup(${index},${i})">${esc(q)} ↗</button>`).join('')}</div>`:'';
 return `<div class="chat-assistant">${translationNotice(original)}${!translated?`<p class="tiny" role="status">${at('translating')}</p>`:''}<div class="bubble-ai">${esc(result.reply)}</div>${recommendation?(latest?recommendation:`<details class="chat-previous"><summary>${at('previousOutfit')}</summary>${recommendation}</details>`):''}${followups}</div>`;
};
function chatTurnHTML(turn,index){
 if(turn.role==='user')return `<div class="bubble-user">${esc(turn.content)}</div>`;
 if(turn.role==='assistant')return chatResultUI(turn.result,index);
 return `<div class="bubble-ai chat-failure" role="alert"><p>${at('chatFailed')}</p>${['auth','rate_limited','forbidden','model_unavailable'].includes(turn.code)?`<p class="tiny">${at(turn.code==='auth'?'chatAuth':turn.code==='rate_limited'?'chatRate':'chatModel')}</p>`:''}${index===state.chatTurns.length-1?`<button type="button" class="chat-suggestion" onclick="retryChat(${index})" ${state.chatBusy?'disabled':''}>${at('chatRetry')}</button>`:''}</div>`;
}
function chatHeadingHTML(){return `<div class="micro">YOUR EVERYDAY STYLING PARTNER</div><h2 class="page-title">${t('ai')}</h2><p class="subtext">${at('intro')}</p><div class="segmented">${['photo','scene'].map(k=>`<button class="${state.aiMode===k?'active':''}" aria-pressed="${state.aiMode===k}" onclick="state.aiMode='${k}';renderAI()">${t(k+'Mode')}</button>`).join('')}</div><div class="ai-label">${t('assistant')}</div>`;}
sceneUI=function(){return '<div id="chat-starters"></div><div class="chat-transcript" id="chat-transcript" role="log" aria-live="polite" aria-relevant="additions"></div><div id="chat-pending"></div>';};
function syncChatComposer(active=chatActive()){
 const composer=document.getElementById('chat-composer');if(!composer)return;
 composer.hidden=!active;document.getElementById('content').classList.toggle('chat-scroll',active);
 if(!active)return;
 if(!composer.querySelector('form')){
  composer.innerHTML=`<button type="button" id="chat-new-messages" class="chat-new-messages" onclick="jumpToChatLatest()" hidden></button><form class="chat-form" onsubmit="event.preventDefault();askFree()"><input id="chat-input" maxlength="1000" autocomplete="off" oninput="state.chatDraft=this.value"><button type="submit">↑</button></form>`;
  document.getElementById('chat-input').value=state.chatDraft;
 }
 const input=document.getElementById('chat-input');input.placeholder=t('ask');input.setAttribute('aria-label',t('ask'));
 const send=composer.querySelector('button[type="submit"]');send.disabled=state.chatBusy;send.setAttribute('aria-label',t('send'));
 const jump=document.getElementById('chat-new-messages');jump.textContent=at('newMessages');jump.hidden=!chatView.unread;
}
function captureChatAnchor(content){
 const edge=content.getBoundingClientRect();
 for(const node of content.querySelectorAll('.chat-turn')){const rect=node.getBoundingClientRect();if(rect.bottom>edge.top&&rect.top<edge.bottom)return {id:node.id,offset:rect.top-edge.top};}
 return null;
}
function restoreChatAnchor(content,anchor,top){
 const node=anchor&&document.getElementById(anchor.id);
 if(node)content.scrollTop+=node.getBoundingClientRect().top-content.getBoundingClientRect().top-anchor.offset;
 else content.scrollTop=top;
}
function scrollChatToBottom(){
 if(!chatActive())return;const content=document.getElementById('content');content.scrollTop=content.scrollHeight;chatView.top=content.scrollTop;
}
function jumpToChatLatest(){chatView.follow=true;chatView.unread=false;syncChatComposer();scrollChatToBottom();}
function updateChatScene(){
 const content=document.getElementById('content');
 const mounted=Boolean(document.getElementById('chat-scene'));
 const top=mounted?content.scrollTop:chatView.top,anchor=mounted&&!chatView.follow?captureChatAnchor(content):null;
 if(!mounted)content.innerHTML=`<div class="page chat-scene" id="chat-scene"><div id="chat-heading"></div>${sceneUI()}</div>`;
 const heading=document.getElementById('chat-heading'),headingHTML=chatHeadingHTML();if(heading.innerHTML!==headingHTML)heading.innerHTML=headingHTML;
 const starters=document.getElementById('chat-starters');starters.hidden=state.chatTurns.length>0;
 if(!state.chatTurns.length){const html=t('prompts').map((q,i)=>`<button type="button" class="prompt" onclick="askPreset(${i})">${esc(q)} ↗</button>`).join('');if(starters.innerHTML!==html)starters.innerHTML=html;}
 const transcript=document.getElementById('chat-transcript'),keys=new Set();
 state.chatTurns.forEach((turn,index)=>{
  const id='chat-turn-'+chatKey(turn);keys.add(id);let node=document.getElementById(id);
  if(!node){node=document.createElement('div');node.id=id;node.className='chat-turn';transcript.append(node);}
  const html=chatTurnHTML(turn,index);
  if(node._chatHTML!==html){const expanded=node.querySelector('details')?.open;node.innerHTML=html;node._chatHTML=html;if(expanded&&node.querySelector('details'))node.querySelector('details').open=true;}
 });
 for(const node of [...transcript.children])if(!keys.has(node.id))node.remove();
 const pending=document.getElementById('chat-pending');
 const pendingHTML=state.chatBusy?`<div class="bubble-ai chat-typing" role="status" aria-label="${t('thinking')}"><span></span><span></span><span></span></div>`:'';
 if(pending.innerHTML!==pendingHTML)pending.innerHTML=pendingHTML;
 if(!chatView.follow&&state.chatTurns.length>chatView.lastCount&&state.chatTurns.at(-1)?.role==='assistant')chatView.unread=true;
 chatView.lastCount=state.chatTurns.length;syncChatComposer();
 if(chatView.follow){scrollChatToBottom();requestAnimationFrame(()=>{if(chatView.follow)scrollChatToBottom();});}
 else restoreChatAnchor(content,anchor,top);
}
const previousRenderAI=renderAI;
renderAI=function(){
 syncChatComposer();
 if(!chatActive())return previousRenderAI();
 if(state.cameraOpen)closeCamera(false);
 updateChatScene();
};
const previousChatRender=render;
render=function(){previousChatRender();syncChatComposer();};
const previousChatNavigate=navigate;
navigate=function(tab){
 if(chatActive())chatView.top=document.getElementById('content').scrollTop;
 previousChatNavigate(tab);
 if(chatActive()){const content=document.getElementById('content');content.scrollTop=chatView.follow?content.scrollHeight:chatView.top;}
};
document.getElementById('content').addEventListener('scroll',()=>{
 if(!chatActive())return;
 const content=document.getElementById('content');chatView.top=content.scrollTop;
 chatView.follow=content.scrollHeight-content.clientHeight-content.scrollTop<64;
 if(chatView.follow&&chatView.unread){chatView.unread=false;syncChatComposer();}
},{passive:true});
startChat=async function(chat){
 const text=String(chat.text||'').trim().slice(0,1000);if(!text||state.chatBusy)return;
 const controller=new AbortController();sceneController=controller;const resultLang=state.lang;
 const contextBefore=JSON.parse(JSON.stringify(state.chatContext));
 state.chatTurns.push({role:'user',content:text,contextBefore});state.chatHistory.push({role:'user',content:text});
 state.chatDraft='';const input=document.getElementById('chat-input');if(input)input.value='';
 chatView.follow=true;chatView.unread=false;state.chatBusy=true;renderAI();
 try{
  const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:state.chatHistory.slice(-10),context:contextBefore,lang:resultLang}),signal:controller.signal});
  const data=await response.json().catch(()=>null);if(!response.ok)throw Object.assign(new Error('CHAT_FAILED'),{code:data?.error||'upstream'});
  if(!data||typeof data.reply!=='string'||!Array.isArray(data.items)||!Array.isArray(data.followups)||!Array.isArray(data.brands)||!Number.isFinite(data.total))throw new Error('INVALID_RESULT');
  if(sceneController!==controller)return;
  rememberResultLanguage(data,resultLang);state.chatTurns.push({role:'assistant',result:data});
  state.chatContext=data.context||{...contextBefore,itemIds:data.items.length?data.items.map(p=>p.id):contextBefore.itemIds};
  state.chatHistory.push({role:'assistant',content:data.reply+'\n[items: '+data.items.map(p=>p.id).join(', ')+'][brands: '+data.brands.map(b=>b.id).join(', ')+']'});
  state.chatHistory=state.chatHistory.slice(-40);
 }catch(e){
  if(sceneController===controller){state.chatHistory.pop();state.chatTurns.push({role:'error',text,code:e.code||'network'});}
 }finally{
  if(sceneController===controller){state.chatBusy=false;if(chatActive())renderAI();}
 }
};
retryChat=function(index){
 const turn=state.chatTurns[index];if(state.chatBusy||index!==state.chatTurns.length-1||turn?.role!=='error')return;
 const user=state.chatTurns[index-1];state.chatContext=user?.contextBefore||state.chatContext;
 state.chatTurns=state.chatTurns.slice(0,index-1);
 state.chatHistory=state.chatTurns.flatMap(turn=>turn.role==='user'?[{role:'user',content:turn.content}]:turn.role==='assistant'?[{role:'assistant',content:turn.result.reply+'\n[items: '+turn.result.items.map(p=>p.id).join(', ')+']'}]:[]).slice(-40);
 return startChat({text:turn.text});
};
// Keep the phone and pinned composer within the mobile keyboard's visible viewport.
function fitChatViewport(){
 const phone=document.querySelector('.phone'),viewport=window.visualViewport;
 if(!phone||!viewport)return;
 const height=chatActive()&&window.innerWidth<=430?viewport.height+'px':'';
 if(phone.style.height!==height){phone.style.height=height;if(chatView.follow&&chatActive())requestAnimationFrame(()=>{if(chatView.follow)scrollChatToBottom();});}
}
window.visualViewport?.addEventListener('resize',fitChatViewport);
const previousSyncChatComposer=syncChatComposer;
syncChatComposer=function(active=chatActive()){previousSyncChatComposer(active);fitChatViewport();};
syncChatComposer();
