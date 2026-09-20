const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
let homeMap,liveMap,liveVehicle,liveTimer; const screens=['home','journey','live'];
const KDU=[6.8669,79.9186], GATE=[6.873,79.902], PETTAH=[6.932,79.849], WELL=[6.916,79.861], FORT=[6.9344,79.8428];
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove('show'),2500)}
function showScreen(id){screens.forEach(s=>$('#'+s).classList.toggle('active',s===id));$$('.nav').forEach(n=>n.classList.toggle('active',n.dataset.screen===id));scrollTo({top:0,behavior:'smooth'});history.replaceState(null,'','#'+id);if(id==='home')setTimeout(initHomeMap,80);if(id==='live')setTimeout(initLiveMap,80)}
$$('[data-screen]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.screen)));
function icon(label){return L.divIcon({className:'flow-marker',html:`<div>${label}</div>`,iconSize:[70,28],iconAnchor:[35,14]})}
function tiles(map){L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map)}
function initHomeMap(){
  const mapEl=$('#homeMap'); if(!mapEl) return;
  if(homeMap) return;
  homeMap={zoom:1};
  const setZoom=(delta)=>{
    homeMap.zoom=Math.max(.9,Math.min(1.15,homeMap.zoom+delta));
    mapEl.style.setProperty('--map-scale',homeMap.zoom);
    const art=mapEl.querySelector('.map-art');
    if(art) art.style.transform=`scale(${homeMap.zoom})`;
    toast(homeMap.zoom>1?'Network map zoomed in.':'Network map reset.');
  };
  $('#mapPlus')?.addEventListener('click',()=>setZoom(.05));
  $('#mapMinus')?.addEventListener('click',()=>setZoom(-.05));
  $('#locate')?.addEventListener('click',()=>{
    mapEl.animate([{filter:'brightness(1)'},{filter:'brightness(1.12)'},{filter:'brightness(1)'}],{duration:700});
    toast('Your journey position is highlighted on the live network.');
  });
}
function initLiveMap(){return}
$('#heroPlan').addEventListener('click',()=>{document.querySelector('#from').focus();document.querySelector('.planner').scrollIntoView({behavior:'smooth',block:'center'})});$('#heroLive').addEventListener('click',()=>showScreen('live'));
$$('.mode').forEach(m=>m.addEventListener('click',()=>{$$('.mode').forEach(x=>x.classList.remove('active'));m.classList.add('active');toast(`${m.querySelector('b').textContent} added to your journey.`)}));
$$('.pref').forEach(p=>p.addEventListener('click',()=>{const group=p.closest('.preference-row')||p.parentElement;group.querySelectorAll('.pref').forEach(x=>x.classList.remove('active'));p.classList.add('active');toast(`${p.textContent.trim()} preference selected.`)}));
$('#swap').addEventListener('click',()=>{const a=$('#from'),b=$('#to');[a.value,b.value]=[b.value,a.value];toast('Start and destination swapped.')});
$('#find').addEventListener('click',()=>{$('#journeyTitle').innerHTML=`${$('#from').value||'Your location'} <em>→</em> ${$('#to').value||'Your destination'}`;showScreen('journey');toast('AI route ready — transfers protected.')});
$('#track').addEventListener('click',()=>{showScreen('live');toast('Live tracking started.')});$('#backHome').addEventListener('click',()=>showScreen('home'));
$('#locate').addEventListener('click',()=>{if(homeMap){homeMap.setView(KDU,14,{animate:true});toast('Showing your selected starting point.')}});
$$('.dest').forEach(d=>d.addEventListener('click',()=>{$('#to').value=d.dataset.dest;document.querySelector('.planner').scrollIntoView({behavior:'smooth',block:'center'});toast(`${d.dataset.dest} selected.`)}));
$('#simple').addEventListener('click',()=>{document.body.classList.add('large-text');$('#large').checked=true;toast('Simple journey mode enabled — larger text and clearer controls.')});
function speak(){const t='Next step: choose your destination, then tap Find my journey.';toast(t);if('speechSynthesis'in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(t))}}
$('#voice').addEventListener('click',speak);$('#voicePanel').addEventListener('click',speak);
$('#accessBtn').addEventListener('click',()=>$('#accessPanel').classList.toggle('open'));$('#closeAccess').addEventListener('click',()=>$('#accessPanel').classList.remove('open'));
$('#large').addEventListener('change',e=>document.body.classList.toggle('large-text',e.target.checked));$('#contrast').addEventListener('change',e=>document.body.classList.toggle('high-contrast',e.target.checked));$('#motion').addEventListener('change',e=>document.body.classList.toggle('reduce-motion',e.target.checked));
$('#bellBtn').addEventListener('click',()=>toast('No new disruptions. Your network is running smoothly.'));$('#viewAll').addEventListener('click',()=>toast('More 2100 destinations are being added to the city network.'));

$$('.details-btn').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.toast||'Segment details opened.')));
$('#alternativeRoute')?.addEventListener('click',()=>toast('Alternative found: 21 min · one transfer · step-free.'));
$('#shareJourney')?.addEventListener('click',async()=>{const text='RIDE 2100 journey: KDU Smart Campus → Colombo Fort · arrive 10:42 AM';try{await navigator.clipboard.writeText(text);toast('Journey link copied.')}catch(e){toast('Journey details ready to share.')}});
$('#saveJourney')?.addEventListener('click',()=>toast('Journey saved to My Trips.'));
$('#editPrefs')?.addEventListener('click',()=>{$('#accessPanel')?.classList.add('open');toast('Accessibility and travel preferences opened.');});
$('#voiceRoute')?.addEventListener('click',()=>{const t='Next: walk to Gate A, then board Autonomous Bus A12. Your Maglev transfer is protected.';toast(t);if('speechSynthesis'in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(t))}});



// Premium Live Tracking interactions
let liveScale=1;
function setLiveScale(delta){liveScale=Math.max(.92,Math.min(1.12,liveScale+delta));const c=$('#proMapCanvas');if(c)c.style.transform=`scale(${liveScale})`;toast(delta>0?'Live map zoomed in.':'Live map zoomed out.');}
$('#liveZoomIn')?.addEventListener('click',()=>setLiveScale(.05));
$('#liveZoomOut')?.addEventListener('click',()=>setLiveScale(-.05));
$('#liveLocate')?.addEventListener('click',()=>{const el=$('#proMapCanvas');if(el){el.animate([{filter:'brightness(1)'},{filter:'brightness(1.12)'},{filter:'brightness(1)'}],{duration:650});el.querySelector('.you-pulse')?.animate([{transform:'scale(1)'},{transform:'scale(1.35)'},{transform:'scale(1)'}],{duration:650});}toast('Your live position is highlighted.');});
$('#liveLayers')?.addEventListener('click',()=>{document.body.classList.toggle('clean-map');toast(document.body.classList.contains('clean-map')?'Simplified map view on.':'All map layers visible.');});
$('#mapDetails')?.addEventListener('click',()=>toast('42 active corridors · 11,204 vehicles · 98% network signal.'));
$('#liveBack')?.addEventListener('click',()=>showScreen('journey'));
// Follow-your-trip live mode: clicking it starts a guided, continuously updating journey view.
let followTimer=null, followStep=0;
const followStops=[
  ['Bus A12','Colombo Fort → Pettah','On time · 2 min away','Pettah','2 min','You’re on the move'],
  ['Maglev M03','Pettah → Wellawatte','Connection protected','Wellawatte','12 min','Transfer protected'],
  ['Air Taxi','Wellawatte → KDU','Arriving in 7 min','KDU','19 min','Next connection confirmed'],
  ['Autonomous Shuttle','KDU Skyway → Entrance','Arriving in 4 min','KDU Entrance','4 min','Final transfer approaching']
];
function setFollowStep(i){
  const items=$$('.guide-item'); items.forEach(x=>x.classList.remove('follow-active'));
  const item=items[i%items.length]; if(item){item.classList.add('follow-active'); item.scrollIntoView({behavior:'smooth',block:'nearest'});}
  const u=followStops[i%followStops.length];
  $('#trackingStatus').textContent=u[5];
  $('#trackingSub').textContent=`${u[0]} · ${u[2]}. Your next transfer is protected.`;
  $('#nextStop').textContent=u[3]; $('#nextEta').textContent=u[4]; $('#aiLiveText').textContent=`Live guidance: ${u[0]} is ${u[2].toLowerCase()}. Follow the highlighted step.`;
  const banner=$('.map-bottom-banner'); if(banner){banner.innerHTML=`<span>🚍 <b>${u[0]}</b> · LIVE</span><span>${u[2]} · <b>${u[4]}</b> to ${u[3]}</span>`;banner.animate([{transform:'translateY(6px)',opacity:.65},{transform:'translateY(0)',opacity:1}],{duration:400});}
  const orbs=$$('.vehicle-orb'); orbs.forEach(x=>x.style.opacity='.42'); if(orbs[i%orbs.length]){orbs[i%orbs.length].style.opacity='1';orbs[i%orbs.length].animate([{transform:'translateY(0) scale(1)'},{transform:'translateY(-6px) scale(1.05)'},{transform:'translateY(0) scale(1)'}],{duration:700});}
  toast(`Following live: ${u[0]} · ${u[2]}`);
}
function toggleFollow(){
  const btn=$('#followTrip'), guide=$('.live-guide');
  if(!btn||!guide)return;
  if(followTimer){clearInterval(followTimer);followTimer=null;btn.classList.remove('active');guide.classList.remove('following');btn.innerHTML='Follow live <b>→</b>';toast('Live follow paused.');return;}
  guide.classList.add('following');btn.classList.add('active');btn.innerHTML='Following live <b>●</b>';
  if(!$('.follow-live-note')){const note=document.createElement('div');note.className='follow-live-note';note.innerHTML='<b>LIVE FOLLOW ON</b> · We’ll move through each transfer and update your next step automatically.<div class="follow-progress"><i></i></div>';guide.insertBefore(note,$('.guide-timeline'));}
  followStep=0;setFollowStep(followStep++);followTimer=setInterval(()=>setFollowStep(followStep++),4000);
}
$('#followTrip')?.addEventListener('click',toggleFollow);
$$('.guide-item').forEach((item,i)=>item.addEventListener('click',()=>{if(followTimer){followStep=i+1;}setFollowStep(i)}));

// Interactive transport mode rail: Bus / Train / Air / Road are selectable journey stages.
const modeNodes=$$('.mode-node');
modeNodes.forEach((node,i)=>node.addEventListener('click',()=>{
  modeNodes.forEach(n=>n.classList.remove('active'));
  node.classList.add('active');
  const guideItems=$$('.guide-item');
  guideItems.forEach(n=>n.classList.remove('follow-active'));
  const selected=guideItems[i];
  if(selected){
    selected.classList.add('follow-active');
    selected.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  if(followTimer) followStep=i+1;
  setFollowStep(i);
  const labels=['Bus','Train','Air','Road'];
  toast(`${labels[i]} selected — live journey step updated.`);
}));

$('#shareLive')?.addEventListener('click',async()=>{const text='RIDE 2100 live trip: Colombo Fort → KDU · Bus A12 · ETA 10:45 AM';try{await navigator.clipboard.writeText(text);toast('Live trip link copied.')}catch(e){toast('Live trip details ready to share.')}});
$('#speakLive')?.addEventListener('click',()=>{const t='Next stop: Pettah. Stay on Bus A12. We will alert you before your transfer.';toast(t);if('speechSynthesis'in window){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(t));}});
let liveUiTick=0;
function startLiveUi(){clearInterval(window.liveUiTimer);const updates=[['You’re on the move','Bus A12 is approaching Pettah. Your connection is protected.','Pettah','2 min'],['Transfer protected','Maglev M03 is ready at Platform 2. No action needed.','Pettah','1 min'],['Traffic updated','Coastal corridor remains clear. Arrival is still on schedule.','Wellawatte','8 min'],['Approaching transfer','Prepare for your Maglev connection at Pettah.','Pettah','30 sec']];
 const apply=()=>{const u=updates[liveUiTick++%updates.length];$('#trackingStatus').textContent=u[0];$('#trackingSub').textContent=u[1];$('#nextStop').textContent=u[2];$('#nextEta').textContent=u[3];$('#aiLiveText').textContent=u[1];const banner=$('.map-bottom-banner');if(banner)banner.animate([{transform:'translateY(5px)',opacity:.7},{transform:'translateY(0)',opacity:1}],{duration:420});};apply();window.liveUiTimer=setInterval(apply,4500)}
const oldShowScreen2=showScreen;showScreen=(id)=>{oldShowScreen2(id);if(id==='live')setTimeout(startLiveUi,100);else clearInterval(window.liveUiTimer)};

let routeLiveTimer, routeTick=0;
function startRouteLiveUpdates(){
  clearInterval(routeLiveTimer);
  const updates=[
    ['Bus A12 approaching Gate A','Arriving in 1 min · boarding window protected.'],
    ['Maglev M03 connection protected','Platform 2 is clear · transfer hold remains active.'],
    ['Traffic update detected','Coastal corridor traffic is +8% · RIDE is monitoring an alternative.'],
    ['Route recalculated','Your arrival remains 10:42 AM · no action needed.'],
    ['Accessibility check','Step-free path confirmed from A12 to Platform 2.'],
    ['Network status','All planned connections are running within the live window.']
  ];
  const apply=()=>{
    const [title,text]=updates[routeTick%updates.length]; routeTick++;
    const titleEl=$('#liveUpdateTitle'), textEl=$('#liveUpdateText'), timeEl=$('#liveUpdateTime');
    if(titleEl) titleEl.textContent=title;
    if(textEl) textEl.textContent=text;
    if(timeEl) timeEl.textContent='just now';
    const status=$('#routeStatus'); if(status) status.textContent=routeTick%4===0?'LIVE · MONITORING':'LIVE · ON TIME';
    const strip=$('#liveUpdateStrip'); if(strip){strip.classList.remove('flash'); void strip.offsetWidth; strip.classList.add('flash');}
    if(routeTick===3) toast('Live update: traffic changed, your route is still protected.');
  };
  apply(); routeLiveTimer=setInterval(apply,5000);
}

const originalShowScreen=showScreen;
showScreen=(id)=>{originalShowScreen(id); if(id==='journey') setTimeout(startRouteLiveUpdates,120); else clearInterval(routeLiveTimer)};

// Extra polished interactions: every visible control has a useful response.
$('#centerLive')?.addEventListener('click',()=>{
  const el=$('#proMapCanvas');
  if(el){el.style.transform='scale(1)';el.animate([{filter:'brightness(1)'},{filter:'brightness(1.1)'},{filter:'brightness(1)'}],{duration:600});}
  toast('Live map centered on your current journey.');
});

$('.profile')?.addEventListener('click',()=>{
  toast('Traveler profile · My trips and preferences are ready.');
});

$('#viewAll')?.addEventListener('click',()=>{
  const first=$('.dest');
  if(first){first.scrollIntoView({behavior:'smooth',block:'center'});}
  toast('Showing the available popular destinations.');
});

$$('.mode').forEach(m=>m.setAttribute('title',`Use ${m.querySelector('b')?.textContent||'this mode'} in your next ride`));
$$('.pref').forEach(p=>p.setAttribute('type','button'));

// Keep the planner usable even when a destination is chosen from a card.
$$('.dest').forEach(d=>d.addEventListener('click',()=>{
  const planner=document.querySelector('.planner');
  if(planner) planner.classList.add('planner-focus');
  setTimeout(()=>planner?.classList.remove('planner-focus'),900);
}));

const hash=location.hash.slice(1);showScreen(screens.includes(hash)?hash:'home');
// Home destination and lower-section interactions
$$('.dest').forEach(d=>d.addEventListener('click',()=>{
  const planner=document.querySelector('.planner');
  const from=document.querySelector('#from'); const to=document.querySelector('#to');
  if(to) to.value=d.dataset.dest || 'Your destination';
  if(planner) planner.classList.add('planner-focus');
  setTimeout(()=>planner?.classList.remove('planner-focus'),900);
  toast(`${d.dataset.dest || 'Destination'} selected — choose Find my journey.`);
  setTimeout(()=>planner?.scrollIntoView({behavior:'smooth',block:'center'}),120);
}));
$('#viewAll')?.addEventListener('click',()=>{
  const grid=document.querySelector('.dest-grid');
  if(!grid) return;
  const open=grid.classList.toggle('show-extra');
  $('#viewAll').textContent=open?'Show fewer ↑':'View all →';
  toast(open?'More destinations added to Discover.':'Showing the featured destinations.');
});
$$('.next-stat[data-jump]').forEach(btn=>btn.addEventListener('click',()=>showScreen(btn.dataset.jump)));
$('#quickVoice')?.addEventListener('click',()=>speak());
