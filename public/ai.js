// Real API integration. No prewritten analysis or fallback recommendations.
const aiCopy={
 ko:{intro:'사진을 분석하고, 비슷한 상품을 찾아드려요.',photoNote:'분석 버튼을 누르면 사진을 OpenAI로 전송합니다. 화면에 보이는 옷만 분석하며, 추천 상품은 유사한 시연용 상품입니다.',retry:'다시 분석하기',noMatch:'비슷한 상품이 아직 없어요',missing:'등록 상품 중 가까운 디자인이 없습니다.',total:'추천 상품 합계',network:'서버에 연결할 수 없습니다. Vercel에 배포된 사이트에서 다시 시도해 주세요.',local:'이 기능은 서버 연결이 필요합니다. HTML 파일 대신 배포된 사이트 주소로 열어주세요.',failed:'분석하지 못했습니다. 다시 시도해 주세요.',noItems:'사진에서 분석할 옷을 찾지 못했습니다.',photoResult:'사진 속 착장과 비슷한 상품',sceneResult:'나에게 맞는 코디 추천',budget:'예산',add:'추천 상품 한 번에 담기',approx:'유사 상품',reason:'추천 이유',notice:'등록된 시연용 상품 안에서 추천합니다. 외부 쇼핑몰 검색은 포함하지 않습니다.',status:'AI 사진 분석 · 상품 추천',processing:'사진 준비 중…'},
 zh:{intro:'分析穿搭灵感，发现相似商品。',photoNote:'点击分析后，图片将发送至OpenAI。仅分析可见服饰，推荐为相似的虚构演示商品。',retry:'重新分析',noMatch:'暂无相似商品',missing:'目录中暂无足够接近的设计。',total:'推荐商品合计',network:'无法连接服务器，请在Vercel部署后重试。',local:'此功能需要服务器，请打开部署后的网站地址。',failed:'分析失败，请重试。',noItems:'未找到可分析的服饰。',photoResult:'照片中的穿搭与相似商品',sceneResult:'适合你的穿搭推荐',budget:'预算',add:'一键加入推荐商品',approx:'相似商品',reason:'推荐理由',notice:'仅推荐演示目录中的商品，不包含外部购物网站搜索。',status:'AI图片分析 · 商品推荐',processing:'正在准备图片…'}
};

Object.assign(aiCopy.ko,{lens:'카메라 렌즈 검색',cameraTitle:'카메라로 코디 찾기',cameraNote:'촬영하면 사진을 OpenAI로 보내 분석합니다.',cameraOpening:'카메라 연결 중…',capture:'촬영하고 분석하기',cameraClose:'카메라 닫기',cameraFile:'사진 파일 선택',cameraDenied:'카메라 사용이 허용되지 않았습니다. 브라우저의 카메라 권한을 확인하거나 사진 파일을 선택해 주세요.',cameraMissing:'사용 가능한 카메라가 없습니다. 사진 파일을 선택해 주세요.',cameraUnavailable:'카메라를 열지 못했습니다. 다른 앱에서 사용 중인지 확인하거나 사진 파일을 선택해 주세요.',cameraUnsupported:'이 브라우저에서는 카메라를 사용할 수 없습니다. 사진 파일을 선택해 주세요.',cameraNotReady:'카메라가 준비되지 않았습니다. 잠시 후 다시 촬영해 주세요.'});
Object.assign(aiCopy.zh,{lens:'相机识搭',cameraTitle:'拍照查找穿搭',cameraNote:'拍摄后，照片将发送至OpenAI进行分析。',cameraOpening:'正在连接相机…',capture:'拍摄并分析',cameraClose:'关闭相机',cameraFile:'选择照片文件',cameraDenied:'相机权限未获允许，请检查浏览器权限或选择照片文件。',cameraMissing:'未找到可用相机，请选择照片文件。',cameraUnavailable:'无法打开相机，请检查是否被其他应用占用，或选择照片文件。',cameraUnsupported:'此浏览器不支持相机，请选择照片文件。',cameraNotReady:'相机尚未就绪，请稍后重试。'});

Object.assign(aiCopy.ko,{chatFailed:'AI 연결에 실패했어요. 잠시 후 다시 시도해 주세요.',chatRetry:'다시 보내기',chatAuth:'API 키 인증에 실패했습니다.',chatRate:'API 사용량 또는 잔액을 확인해 주세요.',chatModel:'모델 접근 권한을 확인해 주세요.'});
Object.assign(aiCopy.zh,{chatFailed:'AI连接失败，请稍后重试。',chatRetry:'重新发送',chatAuth:'API密钥认证失败。',chatRate:'请检查API额度或余额。',chatModel:'请检查模型访问权限。'});
const chatBrandCatalog=[{"id":"arcteryx","name":"ARC'TERYX"},{"id":"salomon","name":"SALOMON"},{"id":"puma","name":"PUMA"},{"id":"fila","name":"FILA"},{"id":"anta","name":"ANTA"},{"id":"matinkim","name":"MATIN KIM"},{"id":"mardi","name":"Mardi Mercredi"},{"id":"girbaud","name":"Marithé François Girbaud"},{"id":"standard","name":"MUSINSA STANDARD"}];
Object.assign(aiCopy.ko,{brandStore:'브랜드관 보기'});
Object.assign(aiCopy.zh,{brandStore:'品牌馆'});
Object.assign(copy.ko,{brandView:'브랜드관',brandUpcoming:'곧 입점 예정인 상품이에요.',clearBrand:'브랜드 필터 해제'});
Object.assign(copy.zh,{brandView:'品牌馆',brandUpcoming:'商品即将上架，敬请期待。',clearBrand:'清除品牌筛选'});
Object.assign(aiCopy.ko,{photoNote:'분석 버튼을 누르면 사진을 OpenAI로 전송합니다. 등록 상품에 없으면 BRANDS 공식몰에서 유사 상품을 검색합니다.',internalTier:'사이트 등록 상품',externalTier:'BRANDS 공식몰 유사 상품',externalNone:'입점 브랜드에서 비슷한 상품을 찾지 못했어요.',externalUnavailable:'지금 외부 검색을 완료하지 못했어요. 아래 브랜드관에서 직접 확인해 주세요.',externalNotSearched:'이번 검색에 포함되지 않은 아이템입니다. 브랜드관에서 확인해 주세요.',officialStore:'공식 브랜드관 보기',sourcePage:'공식 판매 페이지 보기',noImage:'상품 이미지 없음',externalNote:'사진 속 제품과 동일하다는 뜻은 아닙니다. 가격·재고·배송 가능 지역은 판매 페이지에서 확인해 주세요.',notice:'사이트 등록 상품을 우선 추천하고, 없으면 BRANDS 공식몰의 유사 상품을 검색합니다. 외부 상품은 판매 페이지로 연결됩니다.'});
Object.assign(aiCopy.zh,{photoNote:'点击分析后，照片将发送至OpenAI。站内无匹配商品时，将搜索BRANDS官方商城的相似商品。',internalTier:'站内演示商品',externalTier:'BRANDS官方商城相似商品',externalNone:'未在入驻品牌中找到足够相似的商品。',externalUnavailable:'暂时无法完成外部搜索，请到以下品牌官网查看。',externalNotSearched:'此单品未包含在本次搜索中，可到品牌官网查看。',officialStore:'查看品牌官网',sourcePage:'查看官方商品页面',noImage:'暂无商品图片',externalNote:'相似推荐并非同款鉴定。价格、库存及配送地区请以销售页面为准。',notice:'优先推荐站内商品，无匹配时搜索BRANDS官方商城。外部商品链接将打开销售页面。'});

Object.assign(aiCopy.ko,{photoNote:'분석 버튼을 누르면 사진을 OpenAI로 전송합니다. 등록 상품을 우선 추천하고, 부족하면 입점 브랜드와 중국어 검색어를 안내합니다.',internalTier:'사이트 등록 상품',brandMore:'입점 브랜드에서 더 찾아보기',tmallSearch:'티몰에서 검색',tierEmpty:'입점 브랜드에서 비슷한 상품을 찾지 못했어요. 옷이 잘 보이는 사진으로 다시 시도해 주세요',notice:'등록 상품을 우선 추천하며, 추가로 안내하는 브랜드·티몰 링크는 직접 검색하기 위한 링크입니다.'});
Object.assign(aiCopy.zh,{photoNote:'点击分析后，照片将发送至OpenAI。优先推荐站内相似商品，不足时提供入驻品牌及中文搜索词。',internalTier:'站内相似商品',brandMore:'在入驻品牌中继续查找',tmallSearch:'在天猫搜索',tierEmpty:'未在入驻品牌中找到相似商品，请换一张服装清晰可见的照片再试。',notice:'优先推荐站内商品。品牌馆与天猫链接用于继续查找，并非已查到的外部商品。'});

const at=k=>aiCopy[state.lang][k];
Object.assign(state,{photoResult:null,photoError:'',chatResult:null,chatError:'',chatHistory:[],chatTurns:[],photoPreparing:false,cameraOpen:false,cameraReady:false,cameraError:''});
let photoController=null,sceneController=null,uploadVersion=0;
let cameraStream=null,cameraVersion=0,cameraReturnFocus=null;
copy.ko.aiIntro=aiCopy.ko.intro;copy.zh.aiIntro=aiCopy.zh.intro;
copy.ko.largePhoto='10MB 이하 이미지를 선택해 주세요.';copy.zh.largePhoto='请选择10MB以内的图片。';
const apiError=text=>`<p class="ai-error" role="alert">${esc(text)}</p>`;
const recommendedIds=result=>[...new Set((result?.items||[]).map(x=>x.productId).filter(id=>Number.isInteger(id)&&getProduct(id)))];

function photoBrandSuggestions(result){return (result.brandSuggestions||[]).filter(s=>chatBrandCatalog.some(b=>b.id===s.brand)).slice(0,2);}
function tmallSearchURL(query){return 'https://list.tmall.com/search_product.htm?q='+encodeURIComponent(query)+'&type=p';}
function openPhotoBrand(index){const suggestion=photoBrandSuggestions(state.photoResult||{})[index];if(suggestion)openBrandStore(suggestion.brand);}
function resultUI(result,mode){
 const fashion=result.isFashion!==false;
 const ids=fashion?recommendedIds(result):[];
 const matches=fashion?result.items.filter(item=>getProduct(item.productId)):[];
 const suggestions=fashion?photoBrandSuggestions(result):[];
 return `<section class="ai-results"><h3>${at(mode==='photo'?'photoResult':'sceneResult')}</h3><div class="bubble-ai">${esc(result.summary)}</div><div class="tags">${result.tags.map(x=>`<span>${esc(x)}</span>`).join('')}</div>${matches.map(item=>{const p=getProduct(item.productId);return `<article class="detected-item"><p class="result-tier">${at('internalTier')}</p><h4>${esc(item.garment)}${item.color?' · '+esc(item.color):''}</h4><p class="subtext">${esc(item.details)}</p>${itemCard(p)}<p class="tiny">${at('approx')} · ${esc(item.reason)}</p></article>`;}).join('')}${ids.length?`<div class="total"><span>${at('total')}</span><strong>${price(ids.reduce((n,id)=>n+getProduct(id).price,0))}</strong></div>${result.budget!==null?`<p class="tiny">${at('budget')}: ${price(result.budget)}</p>`:''}<button class="black-button" onclick="addAIResult('${mode}')">${at('add')}</button>`:''}${suggestions.length?`<section class="photo-brand-suggestions"><h3>${at('brandMore')}</h3>${suggestions.map((s,i)=>{const brand=chatBrandCatalog.find(b=>b.id===s.brand);return `<article class="photo-brand-suggestion"><p class="subtext">${esc(s.reason)}</p><p class="tiny">${esc(s.query)}</p><button type="button" class="prompt" onclick="openPhotoBrand(${i})">${esc(brand.name)} ${at('brandStore')} ↗</button><a class="external-link" href="${esc(tmallSearchURL(s.query))}" target="_blank" rel="noopener noreferrer">${at('tmallSearch')} ↗</a></article>`;}).join('')}</section>`:''}${!matches.length&&!suggestions.length?`<p class="photo-tier-empty" role="status">${at('tierEmpty')}</p>`:''}<p class="tiny">${at('notice')}</p></section>`;
}
renderAI=function(){if(state.aiMode!=='photo'&&state.cameraOpen)closeCamera(false);document.getElementById('content').innerHTML=`<div class="page fade-in"><div class="micro">YOUR EVERYDAY STYLING PARTNER</div><h2 class="page-title">${t('ai')}</h2><p class="subtext">${at('intro')}</p><div class="segmented">${['photo','scene'].map(k=>`<button class="${state.aiMode===k?'active':''}" aria-pressed="${state.aiMode===k}" onclick="state.aiMode='${k}';renderAI()">${t(k+'Mode')}</button>`).join('')}</div>${state.aiMode==='photo'?photoUI():sceneUI()}</div>`;if(state.cameraOpen&&cameraStream)attachCameraPreview();};
photoUI=function(){const image=state.photo;return `${state.cameraOpen?cameraUI():`<button type="button" class="upload-box" aria-label="${t(image?'reset':'upload')}" onclick="document.getElementById('photo-file').click()">${image?`<img src="${esc(image)}" alt="${t('upload')}"><span class="upload-caption">${t('reset')}</span>`:`<span class="plus" aria-hidden="true">＋</span><span class="upload-caption">${t('upload')}</span>`}</button><button type="button" class="secondary-wide camera-launch" onclick="openLensCamera()">${at('lens')}</button>`}<input id="photo-file" type="file" accept="image/jpeg,image/png,image/webp" aria-label="${t('upload')}" style="display:none" onchange="uploadPhoto(this)">${image&&!state.cameraOpen&&!state.photoBusy&&!state.photoPreparing?`<button class="black-button" style="margin-top:10px" onclick="analyzePhoto()">✦ ${at(state.photoResult?'retry':'status')}</button>`:''}<p class="tiny">${at('photoNote')}</p>${state.photoError?apiError(state.photoError):''}${state.photoBusy||state.photoPreparing?`<div class="loader" role="status"><span class="spinner"></span>${state.photoPreparing?at('processing'):t('analyzing')}</div>`:state.photoResult?resultUI(state.photoResult,'photo'):''}`;};
function cameraUI(){
 return `<section class="lens-camera" aria-label="${at('cameraTitle')}"><div class="lens-heading"><h3>${at('cameraTitle')}</h3><button type="button" class="outline-button" onclick="closeCamera()">${at('cameraClose')}</button></div><div class="lens-viewfinder"><video id="lens-video" autoplay muted playsinline aria-label="${at('cameraTitle')}"></video><span class="lens-frame" aria-hidden="true"></span>${!state.cameraReady&&!state.cameraError?`<p class="lens-status" role="status">${at('cameraOpening')}</p>`:''}<button type="button" class="lens-shutter" aria-label="${at('capture')}" onclick="captureLensPhoto()" ${state.cameraReady?'':'disabled'}><span aria-hidden="true"></span></button></div><p class="tiny">${at('cameraNote')}</p>${state.cameraError?apiError(state.cameraError):''}<button type="button" class="secondary-wide" onclick="chooseLensFile()">${at('cameraFile')}</button></section>`;
}
function stopCameraStream(stream){stream?.getTracks().forEach(track=>track.stop());}
function attachCameraPreview(){
 const video=document.getElementById('lens-video');
 if(!video||!cameraStream)return;
 video.srcObject=cameraStream;
 video.onloadeddata=()=>{if(!state.cameraOpen||video.srcObject!==cameraStream)return;state.cameraReady=true;const shutter=document.querySelector('.lens-shutter');if(shutter)shutter.disabled=false;document.querySelector('.lens-status')?.remove();};
 video.play().catch(()=>{});
}
async function openLensCamera(){
 if(state.cameraOpen)return;
 cameraReturnFocus=document.activeElement;
 cancelPhoto();++uploadVersion;state.photoPreparing=false;
 state.cameraOpen=true;state.cameraReady=false;state.cameraError='';
 const version=++cameraVersion;renderAI();
 document.querySelector('.lens-heading button')?.focus();
 if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){state.cameraError=at('cameraUnsupported');renderAI();return;}
 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1400},height:{ideal:1400}}});
  if(version!==cameraVersion||!state.cameraOpen||state.tab!=='ai'||state.aiMode!=='photo'){stopCameraStream(stream);return;}
  cameraStream=stream;attachCameraPreview();
 }catch(e){
  if(version!==cameraVersion||!state.cameraOpen)return;
  state.cameraError=at(['NotAllowedError','SecurityError'].includes(e.name)?'cameraDenied':['NotFoundError','OverconstrainedError'].includes(e.name)?'cameraMissing':'cameraUnavailable');renderAI();
 }
}
function closeCamera(redraw=true){
 ++cameraVersion;stopCameraStream(cameraStream);cameraStream=null;
 state.cameraOpen=false;state.cameraReady=false;state.cameraError='';
 if(redraw&&state.tab==='ai'){renderAI();const launch=document.querySelector('.camera-launch');(launch||cameraReturnFocus)?.focus();}
}
function chooseLensFile(){closeCamera();document.getElementById('photo-file').click();}
async function captureLensPhoto(){
 const video=document.getElementById('lens-video');
 if(!state.cameraReady||!video?.videoWidth||!video.videoHeight){state.cameraError=at('cameraNotReady');renderAI();return;}
 try{
  const scale=Math.min(1,1400/Math.max(video.videoWidth,video.videoHeight));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(video.videoWidth*scale));canvas.height=Math.max(1,Math.round(video.videoHeight*scale));
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error(t('readError'));
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  const image=canvas.toDataURL('image/jpeg',.82);if(image.length>3_000_000)throw new Error(t('largePhoto'));
  closeCamera(false);++uploadVersion;cancelPhoto();state.photo=image;state.photoPreparing=false;
  await analyzePhoto();
 }catch(e){closeCamera(false);state.photoError=e.message||t('readError');if(state.tab==='ai')renderAI();}
}
const navigateWithLens=navigate;
navigate=function(tab){if(state.cameraOpen)closeCamera(false);navigateWithLens(tab);};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.cameraOpen)closeCamera();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.cameraOpen)closeCamera();});
window.addEventListener('pagehide',()=>closeCamera(false));

function cancelPhoto(){photoController?.abort();photoController=null;state.photoBusy=false;state.photoResult=null;state.photoError='';}
async function compressPhoto(blob){
 const url=URL.createObjectURL(blob);
 try {const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url;});
  if(img.naturalWidth*img.naturalHeight>50_000_000)throw new Error(t('largePhoto'));
  const scale=Math.min(1,1400/Math.max(img.naturalWidth,img.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);const data=canvas.toDataURL('image/jpeg',.82);if(data.length>3_000_000)throw new Error(t('largePhoto'));return data;
 }finally{URL.revokeObjectURL(url);}
}
uploadPhoto=async function(input){const f=input.files?.[0];if(!f)return;if(!['image/jpeg','image/png','image/webp'].includes(f.type)){toast(t('invalidPhoto'));return;}if(f.size>10*1024*1024){toast(t('largePhoto'));return;}cancelPhoto();const version=++uploadVersion;state.photoPreparing=true;if(state.tab==='ai')renderAI();try{const data=await compressPhoto(f);if(version!==uploadVersion)return;state.photo=data;}catch(e){if(version===uploadVersion)state.photoError=e.message||t('readError');}finally{if(version===uploadVersion){state.photoPreparing=false;if(state.tab==='ai')renderAI();}}};
async function callAI(payload,signal){
 if(location.protocol==='file:')throw new Error(at('local'));
 let response;try{response=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,lang:state.lang}),signal});}catch(e){if(e.name==='AbortError')throw e;throw new Error(at('network'));}
 const data=await response.json().catch(()=>null);if(!response.ok)throw new Error(data?.error||at('failed'));if(!data||!Array.isArray(data.items)||!Array.isArray(data.tags))throw new Error(at('failed'));return data;
}
analyzePhoto=async function(){if(!state.photo){toast(t('noPhoto'));return;}cancelPhoto();const controller=new AbortController();photoController=controller;state.photoBusy=true;renderAI();try{const image=state.photo;if(controller.signal.aborted)return;const result=await callAI({mode:'photo',image},controller.signal);if(photoController===controller)state.photoResult=result;}catch(e){if(photoController===controller&&e.name!=='AbortError')state.photoError=e.message||at('failed');}finally{if(photoController===controller){state.photoBusy=false;if(state.tab==='ai')renderAI();}}};
function chatResultUI(result,index){
 const items=result.items.map(p=>getProduct(p.id)).filter(Boolean);
 return `<div class="chat-assistant"><div class="bubble-ai">${esc(result.reply)}</div>${items.length?`<div class="outfit-products">${items.map(p=>itemCard(p)).join('')}</div><div class="total"><span>${at('total')}</span><strong>${price(result.total)}</strong></div><button class="black-button" onclick="addChatResult(${index})">${at('add')}</button>`:''}${(result.brands||[]).length?`<div class="chat-brand-links">${result.brands.map((brand,i)=>`<button type="button" class="prompt" onclick="openChatBrand(${index},${i})">${esc(brand.name)} ${at('brandStore')} ↗</button>`).join('')}</div>`:''}${result.followups.length?`<div class="chat-followups">${result.followups.map((q,i)=>`<button type="button" class="prompt" onclick="askFollowup(${index},${i})" ${state.chatBusy?'disabled':''}>${esc(q)} ↗</button>`).join('')}</div>`:''}</div>`;
}
sceneUI=function(){return `<div class="ai-label">${t('assistant')}</div>${t('prompts').map((q,i)=>`<button type="button" class="prompt" onclick="askPreset(${i})" ${state.chatBusy?'disabled':''}>${esc(q)} ↗</button>`).join('')}<div class="chat-transcript" aria-live="polite">${state.chatTurns.map((turn,i)=>turn.role==='user'?`<div class="bubble-user">${esc(turn.content)}</div>`:turn.role==='assistant'?chatResultUI(turn.result,i):`<div class="bubble-ai chat-failure" role="alert"><p>${at('chatFailed')}</p>${['auth','rate_limited','forbidden','model_unavailable'].includes(turn.code)?`<p class="tiny">${at(turn.code==='auth'?'chatAuth':turn.code==='rate_limited'?'chatRate':'chatModel')}</p>`:''}<button type="button" class="prompt" onclick="retryChat(${i})" ${state.chatBusy?'disabled':''}>${at('chatRetry')}</button></div>`).join('')}${state.chatBusy?`<div class="bubble-ai chat-typing" role="status" aria-label="${t('thinking')}"><span></span><span></span><span></span></div>`:''}</div><form class="chat-form" onsubmit="event.preventDefault();askFree()"><input id="chat-input" maxlength="1000" aria-label="${t('ask')}" placeholder="${t('ask')}" ${state.chatBusy?'disabled':''}><button type="submit" aria-label="${t('send')}" ${state.chatBusy?'disabled':''}>↑</button></form>`;};
askPreset=i=>startChat({text:t('prompts')[i]});
askFree=function(){const value=document.getElementById('chat-input').value.trim();if(value)startChat({text:value});};
function askFollowup(index,i){const text=state.chatTurns[index]?.result?.followups[i];if(text)startChat({text});}
function retryChat(index){
 if(state.chatBusy)return;
 const turn=state.chatTurns[index];if(turn?.role!=='error')return;
 // Discard the failed turn and any later branch before resending it.
 state.chatTurns=state.chatTurns.slice(0,index-1);
 state.chatHistory=state.chatTurns.flatMap(turn=>turn.role==='user'?[{role:'user',content:turn.content}]:turn.role==='assistant'?[{role:'assistant',content:turn.result.reply+'\\n[items: '+turn.result.items.map(p=>p.id).join(', ')+']'}]:[]);
 return startChat({text:turn.text});
}
function openBrandStore(id){
 const brand=chatBrandCatalog.find(b=>b.id===id);if(!brand)return;
 state.brandFilter=brand.name;state.query=brand.name;state.category='all';navigate('home');
}
function openChatBrand(index,i){openBrandStore(state.chatTurns[index]?.result?.brands?.[i]?.id);}
function clearChatBrand(){state.brandFilter=null;state.query='';state.category='all';renderHome();}
function addChatResult(index){const result=state.chatTurns[index]?.result;if(!result)return;[...new Set(result.items.map(p=>p.id))].filter(id=>getProduct(id)).forEach(id=>addLine(id,getProduct(id).oneSize?'ONE':'M'));render();toast(t('cartAddedAll'));}
startChat=async function(chat){
 const text=String(chat.text||'').trim().slice(0,1000);if(!text||state.chatBusy)return;
 const controller=new AbortController();sceneController=controller;
 state.chatTurns.push({role:'user',content:text});state.chatHistory.push({role:'user',content:text});state.chatBusy=true;renderAI();
 try{
  const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:state.chatHistory.slice(-10),lang:state.lang}),signal:controller.signal});
  const data=await response.json().catch(()=>null);if(!response.ok)throw Object.assign(new Error('CHAT_FAILED'),{code:data?.error||'upstream'});
  if(!data||typeof data.reply!=='string'||!Array.isArray(data.items)||!Array.isArray(data.followups)||!Array.isArray(data.brands)||!Number.isFinite(data.total))throw new Error('INVALID_RESULT');
  if(sceneController!==controller)return;
  state.chatTurns.push({role:'assistant',result:data});
  state.chatHistory.push({role:'assistant',content:data.reply+'\\n[items: '+data.items.map(p=>p.id).join(', ')+'][brands: '+data.brands.map(b=>b.id).join(', ')+']'});
  state.chatHistory=state.chatHistory.slice(-40);
 }catch(e){
  if(sceneController===controller){state.chatHistory.pop();state.chatTurns.push({role:'error',text,code:e.code||'network'});}
 }finally{
  if(sceneController===controller){state.chatBusy=false;if(state.tab==='ai'){renderAI();if(state.aiMode==='scene')document.getElementById('chat-input')?.focus();}}
 }
};
function addAIResult(mode){recommendedIds(mode==='photo'?state.photoResult:state.chatResult).forEach(id=>addLine(id,getProduct(id).oneSize?'ONE':'M'));render();toast(t('cartAddedAll'));}
addOutfit=()=>addAIResult('scene');

copy.ko.aboutBody='MUSINSA 차이나 · 학술제 시연용 콘셉트\n사진 분석과 상황별 코디는 연결된 OpenAI API를 사용합니다.\n상품·가격·매장·재고·예약은 시연용 데이터이며 실제 주문은 접수되지 않습니다.';
copy.zh.aboutBody='MUSINSA 中国 · 学术展示概念\n图片分析与场景穿搭通过已配置的OpenAI API提供。\n商品、价格、门店、库存和预约为演示数据，不会产生真实订单。';
