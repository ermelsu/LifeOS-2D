/* ============================================================
   MARCO ZERO — reset único (uma vez por aparelho).
   Zera TUDO menos a matilha (lifeos_dogs) e o Financeiro (livro-caixa:data).
   Depois força refazer o questionário/setup. Roda uma única vez, travado
   pelo token abaixo. Mude o token pra disparar um novo "recomeço" no futuro.
   ============================================================ */
const RESET_TOKEN='marco-zero-2026-07-16';
(function(){ try{
  if(localStorage.getItem('lifeos_reset')===RESET_TOKEN) return;
  ['lifeos_mapa','lifeos_inv','lifeos_tools','lifeos_cleaning','lifeos_fridge',
   'lifeos_pantry','lifeos_onboarded','lifeos_saude','lifeos_streak','lifeos_shopping']
    .forEach(k=>{ try{ localStorage.removeItem(k); }catch(e){} });
  // NÃO apaga: lifeos_dogs (matilha), livro-caixa:data (financeiro), lifeos_accounts/lifeos_user.
  localStorage.setItem('lifeos_reset',RESET_TOKEN);
}catch(e){} })();

/* ============================================================
   Gate de onboarding: primeira utilização vai pro "Vamos começar do zero".
   Usuário que já tem casa montada é migrado (grandfather) sem passar de novo.
   ============================================================ */
(function(){ try{
  if(localStorage.getItem('lifeos_onboarded')==='yes') return;
  var m=JSON.parse(localStorage.getItem('lifeos_mapa')||'null');
  if(m && Array.isArray(m.zones) && m.zones.length){ localStorage.setItem('lifeos_onboarded','yes'); return; }
  location.replace('setup.html');
}catch(e){} })();

/* ============================================================
   Estado REAL do jogo — dados do Emerson (questionário respondido).
   ============================================================ */
const DOG_NAMES=['Nina','Hector','Sansa','Nymeria','Lua','Max','Marie','Sky','Lady','Hércules',
  'Margot','Tisha','Dobby','Peppe','Penélope','Jake','Canela','Agostinho','Vhaghar','Princesa'];
// emoji único pra cada cão da matilha (20)
const DOG_EMOJIS=['🐕','🐶','🐩','🦮','🐕‍🦺','🐺','🦊','🐾','🐻','🐨',
  '🐼','🦝','🐯','🦁','🐰','🐹','🐭','🐱','🐮','🐷'];

const STATE = {
  hero:{ name:'Emerson', cls:'Explorador · cap. Reorganização da vida', level:1, xp:0, xpMax:100, avatar:'🧑🏻' },
  effects:[ {t:'✨ Melhorar tudo com IA', k:'buff'}, {t:'☠️ Excesso de maconha', k:'debuff'}, {t:'📱 Celular (distração)', k:'debuff'} ],
  attrs:[
    {n:'💪 Corpo',    v:0, c:'#54d98c'}, {n:'🧠 Mente',     v:0, c:'#5bb8ff'},
    {n:'💰 Recursos', v:0, c:'#ffcf5c'}, {n:'⚒️ Ofício',    v:0, c:'#ff9f5b'},
    {n:'❤️ Vínculos', v:0, c:'#ff7b9c'}, {n:'📚 Sabedoria', v:0, c:'#b98cff'},
    {n:'🔥 Espírito', v:0, c:'#ffa24d'}, {n:'⏳ Disciplina',v:0, c:'#7ee0d0'},
  ],
  goal:'🏡 Casa nova + o canil dos sonhos',
  resources:[ {k:'Estabilidade', v:'8/10 ✔'}, {k:'Renda', v:'Líder de almoxarifado (Cecape)'}, {k:'Dívida', v:'Média'}, {k:'Meta', v:'🏠 Comprar a casa'} ],
  measures:[
    {nm:'Peso',          ic:'⚖️', cur:null, goal:null, unit:'kg'},
    {nm:'Cintura',       ic:'📏', cur:null, goal:null, unit:'cm'},
    {nm:'% Gordura',     ic:'💧', cur:null, goal:null, unit:'%'},
    {nm:'Força de core', ic:'🏋️', start:null, cur:null, goal:8, unit:'/10'},
  ],
  workout:{ nm:'Coluna & Core — seguro pra lombar (L3–L5)', min:20, done:false,
    warn:'Evite por ora: agachamento pesado e abdominal com flexão da coluna.', ex:[
    {nm:'Gato-camelo (mobilidade)', s:'2× 10'}, {nm:'Ponte de glúteo', s:'3× 12'},
    {nm:'Prancha frontal', s:'3× 30s'}, {nm:'Bird-dog (perdigueiro)', s:'3× 10 c/lado'},
    {nm:'Dead bug (inseto-morto)', s:'3× 10'}, {nm:'Caminhada leve', s:'15–20 min'},
  ]},
  recipes:[
    {nm:'Ovos mexidos + pão',            has:['🥚','🍞'],      kcal:300, prot:20, tag:'⚡ rápido'},
    {nm:'Marmita: frango + arroz + feijão',has:['🍗','🍚','🥫'], kcal:520, prot:40, tag:'💪 massa'},
    {nm:'Iogurte + aveia + banana',      has:['🥛','🌾','🍌'], kcal:280, prot:16, tag:'⚡ sem fogão'},
    {nm:'Omelete + legumes',             has:['🥚','🥦'],      kcal:260, prot:22, tag:'🔥 leve'},
  ],
  weekly:'Organizar o jardim dos cachorros',
  quests:[
    {t:'Arrumar 1 canto da casa (15 min)', rw:'+3 Disciplina', done:false},
    {t:'Preparar uma refeição de verdade', rw:'+2 Corpo', done:false},
    {t:'Alongar a coluna (5 min)',         rw:'+2 Corpo', done:false},
    {t:'Beber água (3L)',                  rw:'+1 Corpo', done:false},
    {t:'Cuidar da matilha 🐾',             rw:'+3 Vínculos', done:false},
  ],
  boss:{ nm:'O Caos', face:'🌀', hp:100, sub:'Desorganização + falta de energia. Cada tarefa feita tira HP. Deixar pra depois faz ele crescer e invadir cômodos.' },
  mood:{ today:2, week:[] },
  dogs: DOG_NAMES.map((nm,i)=>({ nm, face:DOG_EMOJIS[i]||'🐶', well: 8 + (i%3) })),  // bem-estar 8–10 · emoji único
  allies:[ {nm:'Alisson', rl:'irmão · canal do YouTube', em:'🎬'}, {nm:'João Pedro', rl:'aliado de sempre', em:'🤝'}, {nm:'Clice', rl:'namorada', em:'💗'} ],
  fridge:[], pantry:[],
  appliances:[ {ic:'🍳',nm:'Fogão',ok:true},{ic:'🧊',nm:'Geladeira',ok:true},{ic:'🎮',nm:'Nintendo Switch',ok:true},{ic:'🖥️',nm:'PC',ok:true},{ic:'📺',nm:'Consoles',ok:true} ],
  shopping:[],
  inv:[ {ic:'🎮',q:''},{ic:'🖥️',q:''},{ic:'🎧',q:''},{ic:'✏️',q:''},{ic:'💻',q:''},{ic:'📱',q:''},{ic:'🎨',q:''} ], invSlots:12,
};
const MOODS=['😫','😕','😐','🙂','😄'];
const moodEmoji=v=>MOODS[Math.max(0,Math.min(4,Math.round((v-1)/2.25)))];

/* ============================================================
   Inventário / materiais / alimentos — do onboarding (localStorage),
   com fallback pros dados do Emerson (grandfather).
   ============================================================ */
function lsGet(k,def){ try{ const v=JSON.parse(localStorage.getItem(k)||'null'); return v==null?def:v; }catch(e){ return def; } }
const DEFAULT_INV={
  appliances:[{ic:'🍳',nm:'Fogão',ok:true},{ic:'🧊',nm:'Geladeira',ok:true},{ic:'📟',nm:'Micro-ondas',ok:true}],
  electronics:[{ic:'🎮',nm:'Nintendo Switch'},{ic:'🖥️',nm:'PC'},{ic:'📺',nm:'TV'},{ic:'🕹️',nm:'Consoles'},{ic:'💻',nm:'Notebook'},{ic:'📱',nm:'Celular'}]
};
const INV=lsGet('lifeos_inv',DEFAULT_INV);
const TOOLS_L=lsGet('lifeos_tools',[{ic:'🔌',nm:'Furadeira'},{ic:'🔨',nm:'Martelo'},{ic:'🧰',nm:'Caixa de ferramentas'}]);
const CLEAN_L=lsGet('lifeos_cleaning',[{ic:'🧴',nm:'Detergente'},{ic:'🧹',nm:'Vassoura'},{ic:'🚽',nm:'Desinfetante'}]);
const FRIDGE_L=lsGet('lifeos_fridge',STATE.fridge);
const PANTRY_L=lsGet('lifeos_pantry',STATE.pantry);
const DOGS_L=lsGet('lifeos_dogs',STATE.dogs);
const SHOP=lsGet('lifeos_shopping',STATE.shopping);

/* ============================================================
   Calendário do jogo — o app "entra no ar" amanhã (marco zero).
   Hoje é o dia 0 (streak 0); o 1º dia que conta é o START_DATE.
   ============================================================ */
const START_DATE='2026-07-16';
function ymd(d){ const z=new Date(d.getTime()-d.getTimezoneOffset()*60000); return z.toISOString().slice(0,10); }
function daysBetween(a,b){ return Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/86400000); }
function shiftYmd(k,delta){ const d=new Date(k+'T00:00:00'); d.setDate(d.getDate()+delta); return ymd(d); }
function brDate(k){ const [Y,M,D]=k.split('-'); return `${D}/${M}`; }
const TODAY=ymd(new Date());
const IS_LIVE=daysBetween(START_DATE,TODAY)>=0;         // já chegou o marco zero?
const DAY_NUM=Math.max(0,daysBetween(START_DATE,TODAY)+1); // 0 antes de começar, 1 no 1º dia

/* streak persistido — cada dia "cumprido" fica marcado */
function loadStreak(){ try{ return JSON.parse(localStorage.getItem('lifeos_streak')||'{}')||{}; }catch(e){ return {}; } }
function streakChecks(){ return loadStreak().checks||{}; }
function checkInToday(){ if(!IS_LIVE) return; const s=loadStreak(); s.checks=s.checks||{}; if(!s.checks[TODAY]){ s.checks[TODAY]=true; try{ localStorage.setItem('lifeos_streak',JSON.stringify(s)); }catch(e){} } }
function computeStreak(){ const c=streakChecks(); let cur=TODAY;
  if(!c[cur]){ cur=shiftYmd(TODAY,-1); if(!c[cur]) return 0; }
  let n=0; while(c[cur]){ n++; cur=shiftYmd(cur,-1); } return n; }
function streakWeek(){ const c=streakChecks(); const out=[]; const WD=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  for(let i=6;i>=0;i--){ const k=shiftYmd(TODAY,-i); out.push({ d:WD[new Date(k+'T00:00:00').getDay()], on:!!c[k], today:k===TODAY }); } return out; }

/* ============================================================
   Zonas da casa — do Mapa (localStorage) com fallback no repo.
   ============================================================ */
const MAPA_KEY='lifeos_mapa';
function readMapa(){ try{ return JSON.parse(localStorage.getItem(MAPA_KEY)||'{}')||{}; }catch(e){ return {}; } }
function readZones(){ const m=readMapa(); return Array.isArray(m.zones)?m.zones:[]; }
function saveZones(z){ const m=readMapa(); m.zones=z; try{ localStorage.setItem(MAPA_KEY,JSON.stringify(m)); }catch(e){} }
let ZONES=readZones();
// Sem áreas locais? Carrega as zonas oficiais do repo (planta padrão) e guarda pra edição.
async function ensureZones(){
  if(ZONES.length) return;
  if(localStorage.getItem('lifeos_onboarded')==='yes') return;   // marco zero: casa vem do onboarding
  try{ const r=await fetch('assets/casa-zones.json',{cache:'no-store'});
    if(r.ok){ const j=await r.json();
      if(j&&Array.isArray(j.zones)&&j.zones.length){ ZONES=j.zones; saveZones(ZONES); } } }catch(e){}
}
function houseStats(){ let done=0,total=0;
  ZONES.forEach(z=>(z.tasks||[]).forEach(t=>{ total++; if(t.done) done++; }));
  return { done, total, pct: total? Math.round(done/total*100) : 100 }; }

/* ============================================================ render */
const grid=document.getElementById('grid');
const pct=v=>Math.round(v*10);
function panel(cls,icon,title,right,body){ return `<section class="panel ${cls}">
  <div class="ph"><span class="ic">${icon}</span><h2>${title}</h2>${right?`<span class="r">${right}</span>`:''}</div>${body}</section>`; }
function bar(v,c){ return `<div class="bar"><i data-w="${pct(v)}%" style="background:linear-gradient(90deg,${c}99,${c})"></i></div>`; }

const h=STATE.hero;
let SN=computeStreak();

/* faixa compacta no topo: herói + streak + meta + progresso da casa */
const stripBody=`<div class="istrip">
  <div class="iu"><span class="iav">${h.avatar}</span>
    <div class="iuinfo"><div class="il"><b>${h.name}</b><span class="lvl">Nv ${h.level}</span></div>
      <div class="ixp"><i data-w="${Math.round(h.xp/h.xpMax*100)}%"></i></div></div></div>
  <div class="ik"><span class="ke">🔥</span><b>${SN}</b><small>dia${SN===1?'':'s'} de sequência</small></div>
  <div class="ik"><span class="ke">🎯</span><small>${STATE.goal}</small></div>
  <div class="ik casa"><span class="ke">🏠</span><small>Casa em ordem</small><b id="casaPct">—</b></div>
</div>`;

const heroBody=`<div class="hero">
    <div class="avatar">${h.avatar}</div>
    <div class="who">
      <div style="display:flex;align-items:center;gap:8px"><span class="name">${h.name}</span><span class="lvl">Nv ${h.level}</span></div>
      <div class="cls">${h.cls}</div>
      <div class="xp"><i data-w="${Math.round(h.xp/h.xpMax*100)}%"></i></div>
      <div class="xp-lbl"><span>XP</span><span>${h.xp}/${h.xpMax}</span></div>
    </div></div>
  <div class="effects">${STATE.effects.map(e=>`<span class="eff ${e.k}">${e.t}</span>`).join('')}</div>
  <div class="attrs">${STATE.attrs.map(a=>`<div class="attr"><div class="top"><b>${a.n}</b><span>${a.v}/10</span></div>${bar(a.v,a.c)}</div>`).join('')}</div>`;

function streakInner(){ SN=computeStreak(); const done=!!streakChecks()[TODAY];
  return `<div class="stk"><div class="big">🔥 ${SN}<small> dia${SN===1?'':'s'}</small></div>
  <div class="stkdays">${streakWeek().map(d=>`<div class="sd ${d.on?'on':''} ${d.today?'now':''}"><div class="f">🔥</div>${d.d}</div>`).join('')}</div>
  ${ IS_LIVE
    ? `<button class="wbtn ${done?'done':''}" id="checkinBtn">${done?'✅ Dia registrado':'🔥 Registrar hoje'}</button>`
    : `<div class="sub" style="text-align:center;margin-top:12px">🚀 Sua jornada começa <b style="color:var(--acc)">amanhã (${brDate(START_DATE)})</b>. Hoje é o dia 0.</div>` }
  <div class="sub" style="text-align:center;margin-top:9px">Faça 1 missão por dia pra manter a chama acesa.</div></div>`; }
const streakBody=`<div id="streakWrap">${streakInner()}</div>`;
function renderStreak(){ const w=document.getElementById('streakWrap'); if(!w) return; w.innerHTML=streakInner();
  const b=document.getElementById('checkinBtn'); if(b) b.onclick=()=>{ checkInToday(); renderStreak(); };
  const topSN=document.querySelector('.istrip .ik b'); if(topSN) topSN.textContent=SN;
  document.querySelectorAll('[data-w]').forEach(el=>{ if(el.dataset.w) el.style.width=el.dataset.w; }); }

const measBody=STATE.measures.map(m=>{
  const has=m.cur!=null&&m.goal!=null;
  const p= (has&&m.start!=null)?Math.max(0,Math.min(100,Math.round((m.start-m.cur)/(m.start-m.goal)*100))):0;
  const val= has? `<b>${m.cur}${m.unit}</b> <span class="g">→ ${m.goal}${m.unit}</span>` : `<span class="g">a definir</span>`;
  return `<div class="meas"><span class="ic">${m.ic}</span><div class="mid">
    <div class="nm"><span>${m.nm}</span><span class="cur">${val}</span></div>
    <div class="bar"><i data-w="${p}%" style="background:linear-gradient(90deg,#54d98c99,#54d98c)"></i></div></div></div>`;
}).join('')+`<div class="sub" style="margin-top:8px">🪞 Registre e acompanhe no <a href="saude.html" style="color:var(--acc)">Espelho da Saúde</a>.</div>`;

const w=STATE.workout;
const workoutBody=`<div class="wo">`+w.ex.map((x,i)=>`<div class="exi"><b style="color:var(--mut);font-family:ui-monospace,monospace">${i+1}</b><span>${x.nm}</span><span class="s">${x.s}</span></div>`).join('')+
  `</div><div class="sub" style="margin-top:8px">⚠️ ${w.warn}</div>
   <button class="wbtn ${w.done?'done':''}" id="woBtn">${w.done?'✅ Treino concluído':'💪 Concluir treino de hoje'}</button>`;

const recBody=`<div class="recs">`+STATE.recipes.map(r=>`<div class="rec"><div class="rn">${r.nm}<span class="tag">${r.tag}</span></div>
    <div class="ing">${r.has.join(' ')}</div><div class="mac"><span>${r.kcal} kcal</span><span>${r.prot}g proteína</span></div></div>`).join('')+`</div>`;

const questBody=`<div class="weekly">🗓️ <b>Missão da semana:</b> ${STATE.weekly}</div><div id="quests">`+STATE.quests.map((q,i)=>`
  <div class="quest ${q.done?'done':''}" data-i="${i}"><div class="box">${q.done?'✔':''}</div><div class="txt">${q.t}</div><div class="rw">${q.rw}</div></div>`).join('')+`</div>`;

const b=STATE.boss;
const bossBody=`<div class="boss"><div class="face2">${b.face}</div><div class="hpwrap">
  <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><b>${b.nm}</b><span class="sub">HP ${b.hp}%</span></div>
  ${bar(b.hp/10,'#ff6b6b')}<div class="sub" style="margin-top:6px">${b.sub}</div></div></div>`;

const moodBody=`<div class="mtoday"><div class="big" id="moodBig">${MOODS[STATE.mood.today]}</div><div class="lbl">como você está hoje?</div></div>
  <div class="mpick" id="moodPick">${MOODS.map((e,i)=>`<button data-m="${i}" class="${i===STATE.mood.today?'on':''}">${e}</button>`).join('')}</div>
  <div class="mweek" style="margin-top:12px">${STATE.mood.week.map(d=>`<div class="mday"><div class="track"><div class="fill" data-h="${d.v*10}%"></div></div><div class="e">${moodEmoji(d.v)}</div><div class="d">${d.d}</div></div>`).join('')}</div>`;

const dogsBody=`<div class="dogsgrid">`+DOGS_L.map(d=>`<div class="dogc"><div class="f">${d.face}</div><div class="n" title="${d.nm}">${d.nm}</div>${bar(d.well!=null?d.well:9,'#54d98c')}</div>`).join('')+`</div>`;

/* ============================================================
   Coleções editáveis (inventário/alimentos): adicionar em massa
   colando texto (voz→transcrição) e remover item a item. Persistem
   no localStorage. O Financeiro NÃO usa isto (fica no banco.html).
   ============================================================ */
function saveInv(){ try{ localStorage.setItem('lifeos_inv',JSON.stringify(INV)); }catch(e){} }
const COLL={
  electronics:{title:'Eletrônicos', def:'🎮', get:()=>INV.electronics||(INV.electronics=[]), persist:saveInv},
  appliances :{title:'Eletrodomésticos', def:'🔌', dot:true, get:()=>INV.appliances||(INV.appliances=[]), persist:saveInv},
  tools      :{title:'Ferramentas', def:'🧰', key:'lifeos_tools',   get:()=>TOOLS_L},
  cleaning   :{title:'Produtos de limpeza', def:'🧼', key:'lifeos_cleaning', get:()=>CLEAN_L},
  fridge     :{title:'Geladeira', def:'🧊', q:true, key:'lifeos_fridge', get:()=>FRIDGE_L},
  pantry     :{title:'Despensa',  def:'🥫', q:true, key:'lifeos_pantry', get:()=>PANTRY_L},
};
function persistColl(name){ const c=COLL[name]; if(c.persist) c.persist(); else if(c.key){ try{ localStorage.setItem(c.key,JSON.stringify(c.get())); }catch(e){} } }
function collBody(name){ return `<div id="coll-${name}"></div>
  <button class="addbtn" data-add="${name}">＋ adicionar <small>(pode colar uma lista)</small></button>`; }
function renderColl(name){ const c=COLL[name], arr=c.get(); const box=document.getElementById('coll-'+name); if(!box) return;
  box.innerHTML = arr.length ? `<div class="list">`+arr.map((it,i)=>{
      const rt = c.dot ? `<span class="sdot" style="background:${it.ok!==false?'var(--hp)':'var(--dmg)'};box-shadow:0 0 8px ${it.ok!==false?'var(--hp)':'var(--dmg)'}"></span>`
                       : (it.q?`<span class="q">${it.q}</span>`:'');
      return `<div class="li"><span class="ic">${it.ic||c.def}</span><span class="nm">${it.nm}</span>${rt}<button class="lidel" data-i="${i}" title="remover">✕</button></div>`;
    }).join('')+`</div>`
    : `<div class="sub">Vazio. Toque em ＋ pra adicionar — pode colar uma lista grande. 🎙️</div>`;
  const cnt=document.getElementById('cnt-'+name); if(cnt) cnt.textContent=arr.length+' '+(arr.length===1?'item':'itens');
  box.querySelectorAll('.lidel').forEach(b=>b.onclick=()=>{ arr.splice(+b.dataset.i,1); persistColl(name); renderColl(name); });
}
function cntSpan(name,arr){ return `<span id="cnt-${name}">${arr.length} ${arr.length===1?'item':'itens'}</span>`; }
const shopBody=`<div id="shop"></div><button class="addbtn" id="addShop">＋ adicionar <small>(pode colar uma lista)</small></button>`;

grid.innerHTML =
  /* 1º Ficha do Personagem */
  panel('col-12','🧝','Ficha do personagem','', heroBody) +
  /* 2º Sua Casa — mapa no desktop / lista priorizada no mobile */
  panel('col-12','🏠','Sua casa','<span id="casaPct">—</span> arrumado', '<div class="casa-map" id="housemapWrap"></div><div class="casa-list" id="casaListWrap"></div>') +
  /* 3º demais módulos */
  panel('col-4','🔥','Sequência (streak)','', streakBody) +
  panel('col-4','🗺️','Missões de hoje','', questBody) +
  panel('col-4','🙂','Humor da semana','', moodBody) +
  panel('col-6','📊','Medidas & Progresso', STATE.goal, measBody) +
  panel('col-6','🏋️','Treino de hoje', w.min+' min · casa', workoutBody) +
  panel('col-12','🍽️','Receitas com o que você tem','pra sua meta', recBody) +
  panel('col-4','🌀','Chefão atual','', bossBody) +
  panel('col-12','🐾','A matilha', DOGS_L.length+' cães', dogsBody) +
  panel('col-4','🎮','Eletrônicos', cntSpan('electronics',INV.electronics||[]), collBody('electronics')) +
  panel('col-4','🔌','Eletrodomésticos', cntSpan('appliances',INV.appliances||[]), collBody('appliances')) +
  panel('col-4','🧰','Ferramentas', cntSpan('tools',TOOLS_L), collBody('tools')) +
  panel('col-4','🧼','Produtos de limpeza', cntSpan('cleaning',CLEAN_L), collBody('cleaning')) +
  panel('col-4','🧊','Geladeira', cntSpan('fridge',FRIDGE_L), collBody('fridge')) +
  panel('col-4','🥫','Despensa', cntSpan('pantry',PANTRY_L), collBody('pantry')) +
  panel('col-4','🛒','Lista de compras','', shopBody) +
  panel('col-12','⭐','Grande missão de vida','', `<div style="font-size:14px;line-height:1.5">Guiar a matilha bem até o fim, ter uma vida confortável e um <b style="color:var(--acc)">sítio 100×100m</b> com um canil de verdade pra eles. 🐾🏡</div>`);

requestAnimationFrame(()=>requestAnimationFrame(()=>{
  document.querySelectorAll('[data-w]').forEach(el=>el.style.width=el.dataset.w);
  document.querySelectorAll('[data-h]').forEach(el=>el.style.height=el.dataset.h);
}));
/* DIA do jogo (data-driven) */
const dayEl=document.getElementById('day'); if(dayEl) dayEl.textContent=DAY_NUM;

/* Cumprir uma missão do dia marca o streak (a partir do marco zero) */
function bindChecklist(id,arr){ const box=document.getElementById(id); if(!box)return;
  box.addEventListener('click',e=>{ const q=e.target.closest('.quest'); if(!q)return; const i=+q.dataset.i; arr[i].done=!arr[i].done; q.classList.toggle('done'); q.querySelector('.box').textContent=arr[i].done?'✔':'';
    if(arr[i].done){ checkInToday(); renderStreak(); } }); }
bindChecklist('quests',STATE.quests);
const woBtn=document.getElementById('woBtn'); if(woBtn) woBtn.onclick=()=>{ STATE.workout.done=!STATE.workout.done; woBtn.classList.toggle('done',STATE.workout.done); woBtn.textContent=STATE.workout.done?'✅ Treino concluído':'💪 Concluir treino de hoje'; if(STATE.workout.done){ checkInToday(); renderStreak(); } };
const moodPick=document.getElementById('moodPick'); if(moodPick) moodPick.addEventListener('click',e=>{ const btn=e.target.closest('button'); if(!btn)return; STATE.mood.today=+btn.dataset.m; moodPick.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===btn)); document.getElementById('moodBig').textContent=MOODS[STATE.mood.today]; });

/* streak — botão registrar hoje */
(function(){ const b=document.getElementById('checkinBtn'); if(b) b.onclick=()=>{ checkInToday(); renderStreak(); }; })();

/* ============================================================
   ENTRADA DE TEXTO GRANDE (colar) — modal reutilizável.
   Usado em todo lugar que precisa dar entrada (menos o Financeiro):
   grava voz → transcreve → cola aqui → vira lista de itens.
   ============================================================ */
function splitItems(s){ return (s||'').split(/[\n,;]+/).map(x=>x.replace(/^[\s•\-\*•\d.)]+/,'').trim()).filter(Boolean); }
const imodal=document.getElementById('inputModal');
function askItems(title, placeholder){ return new Promise(res=>{
  if(!imodal){ const v=prompt(title); res(v?splitItems(v):[]); return; }
  const ta=document.getElementById('imText');
  document.getElementById('imTitle').textContent=title;
  ta.value=''; ta.placeholder=placeholder||'Um item por linha…';
  imodal.hidden=false; document.body.classList.add('mopen'); setTimeout(()=>ta.focus(),30);
  const okB=document.getElementById('imOk'), cB=document.getElementById('imCancel'), xB=document.getElementById('imClose'), back=imodal.querySelector('.mback');
  function done(val){ imodal.hidden=true; document.body.classList.remove('mopen'); okB.onclick=cB.onclick=xB.onclick=back.onclick=null; res(val); }
  okB.onclick=()=>done(splitItems(ta.value)); cB.onclick=xB.onclick=back.onclick=()=>done([]);
}); }

/* coleções: render inicial + botão adicionar (colar) */
Object.keys(COLL).forEach(renderColl);
document.querySelectorAll('[data-add]').forEach(btn=>btn.onclick=async()=>{ const name=btn.dataset.add, c=COLL[name];
  const items=await askItems('Adicionar · '+c.title, 'Cole aqui — um item por linha.\nEx.:\nArroz\nFeijão 1kg\nCafé');
  if(!items.length) return; const arr=c.get();
  items.forEach(nm=>{ const it={ic:c.def, nm}; if(c.q) it.q='?'; if(c.dot) it.ok=true; arr.push(it); });
  persistColl(name); renderColl(name);
});

/* lista de compras — editável e persistida */
function saveShop(){ try{ localStorage.setItem('lifeos_shopping',JSON.stringify(SHOP)); }catch(e){} }
function renderShop(){ const box=document.getElementById('shop'); if(!box) return;
  box.innerHTML = SHOP.length ? SHOP.map((x,i)=>`<div class="quest ${x.done?'done':''}" data-i="${i}"><div class="box">${x.done?'✔':''}</div><div class="txt">${x.t}</div><button class="lidel" data-i="${i}" title="remover">✕</button></div>`).join('')
    : `<div class="sub">Lista vazia. Toque em ＋ pra adicionar — pode colar. 🛒</div>`;
  box.querySelectorAll('.quest').forEach(q=>q.onclick=e=>{ if(e.target.closest('.lidel'))return; const i=+q.dataset.i; SHOP[i].done=!SHOP[i].done; saveShop(); renderShop(); });
  box.querySelectorAll('.lidel').forEach(b=>b.onclick=e=>{ e.stopPropagation(); SHOP.splice(+b.dataset.i,1); saveShop(); renderShop(); });
}
renderShop();
const addShop=document.getElementById('addShop'); if(addShop) addShop.onclick=async()=>{
  const items=await askItems('Adicionar · Lista de compras','Cole aqui — um item por linha.\nEx.:\nPeito de frango\nOvos\nRação da matilha');
  if(!items.length) return; items.forEach(t=>SHOP.push({t,done:false})); saveShop(); renderShop();
};

/* ============================================================
   SUA CASA — lista priorizada (mobile-first) + modal por cômodo
   (o mapa/planta continua interno na página 🗺️ Mapa)
   ============================================================ */
/* mapa (desktop) — a planta com os cômodos, tarefas e calor de atenção */
function renderHouse(){
  ZONES=readZones();
  const m=readMapa();
  const wrap=document.getElementById('housemapWrap');
  const mapSrc = m.img || 'assets/casa.png';
  const st=houseStats();
  const pctEl=document.getElementById('casaPct'); if(pctEl) pctEl.textContent = st.total? st.pct+'%' : '—';
  if(!wrap) return;
  const ov=ZONES.map((z,i)=>{ const tasks=z.tasks||[]; const pl=tasks.filter(t=>!t.done); const pend=pl.length;
    // atenção pendente = âmbar suave (bem menos vermelho); em ordem = verde suave
    const fill = pend? `rgba(255,180,90,${Math.min(.07+pend*0.025,.22).toFixed(3)})` : 'rgba(84,217,140,.12)';
    const items = pend
      ? pl.slice(0,7).map(t=>`<i>${t.t}</i>`).join('')+(pend>7?`<i class="more">+${pend-7}…</i>`:'')
      : `<i class="ok">tudo em ordem ✨</i>`;
    return `<button class="harea ${pend?'pend':'done'}" data-z="${i}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%;border-color:${z.color};background:${fill}" aria-label="${z.name}: ${pend} pendente(s)">
      <span class="lab" style="background:${z.color}">${z.name}</span>
      <span class="bd" style="background:${pend?'rgba(150,95,25,.82)':'#153a29'};color:${pend?'#ffe0a8':'#54d98c'}">${pend?'⚠ '+pend:'✓'}</span>
      <span class="htasks">${items}</span></button>`; }).join('');
  const hint = ZONES.length? '' : `<div class="mhint">Nomeie os cômodos e crie tarefas no <a href="mapa.html">🗺️ Mapa</a> — eles aparecem aqui.</div>`;
  wrap.innerHTML=`<div class="housemap"><img id="hmimg" src="${mapSrc}" alt="planta da casa">${ov}${hint}
    <div class="hbar"><i style="width:${st.pct}%"></i></div></div>`;
  const hm=document.getElementById('hmimg');
  if(hm){ hm.onerror=()=>{ const s=hm.getAttribute('src')||'';
      if(s.indexOf('casa.png')>=0) hm.src='assets/casa.jpg';
      else if(s.indexOf('casa.jpg')>=0) hm.src='assets/casa.svg';
      else hm.closest('.housemap').classList.add('noimg'); }; }
  wrap.querySelectorAll('.harea').forEach(a=>a.onclick=()=>openRoom(+a.dataset.z));
}
function casaLevel(pend){ return pend>=3?{ic:'🔥',cls:'hot'}: pend>=1?{ic:'🟡',cls:'warn'}:{ic:'🟢',cls:'ok'}; }
function renderCasaList(){
  ZONES=readZones();
  const st=houseStats();
  const pctEl=document.getElementById('casaPct'); if(pctEl) pctEl.textContent = st.total? st.pct+'%' : '—';
  const wrap=document.getElementById('casaListWrap'); if(!wrap) return;
  if(!ZONES.length){ wrap.innerHTML=`<div class="sub">Nenhum cômodo ainda. Crie no <a href="mapa.html" style="color:var(--acc)">🗺️ Mapa</a>.</div>`; return; }
  const rows=ZONES.map((z,i)=>({z,i,pend:(z.tasks||[]).filter(t=>!t.done).length})).sort((a,b)=>b.pend-a.pend);
  wrap.innerHTML=`<div class="cbar"><i style="width:${st.pct}%"></i></div>
    <div class="casalist">`+rows.map(({z,i,pend})=>{ const lv=casaLevel(pend);
      const pl=(z.tasks||[]).filter(t=>!t.done);
      const tks= pend? `<div class="ctasks">`+pl.slice(0,6).map(t=>`<span class="ct">${t.t}</span>`).join('')+(pend>6?`<span class="ct more">+${pend-6}</span>`:'')+`</div>` : `<div class="cok">tudo em ordem ✨</div>`;
      return `<button class="croom ${lv.cls}" data-z="${i}">
        <div class="crh"><span class="cico">${lv.ic}</span><span class="cname" style="color:${z.color}">${z.name}</span>
          <span class="ccount">${pend? pend+' pendente'+(pend>1?'s':''):'ok'}</span></div>
        ${tks}</button>`; }).join('')+`</div>
    <div class="sub" style="margin-top:11px">🗺️ Ver a planta completa no <a href="mapa.html" style="color:var(--acc)">Mapa</a>.</div>`;
  wrap.querySelectorAll('.croom').forEach(b=>b.onclick=()=>openRoom(+b.dataset.z));
}

const modal=document.getElementById('roomModal');
function openRoom(zi){
  ZONES=readZones(); const z=ZONES[zi]; if(!z) return;
  const tasks=z.tasks||[];
  const pend=tasks.filter(t=>!t.done).length;
  document.getElementById('rmName').textContent=z.name;
  const dot=modal.querySelector('.mdot'); if(dot) dot.style.background=z.color;
  document.getElementById('rmSub').textContent = tasks.length? (pend? pend+' pra fazer aqui' : 'tudo em ordem ✨') : 'sem tarefas ainda';
  const box=document.getElementById('rmTasks');
  box.innerHTML = tasks.length? tasks.map((t,ti)=>`
    <div class="ask ${t.done?'ok':''}"><div class="q">${t.t}</div>
      <div class="yn"><button class="yes ${t.done?'on':''}" data-ti="${ti}" data-v="1">Sim</button>
      <button class="no ${!t.done?'on':''}" data-ti="${ti}" data-v="0">Não</button></div></div>`).join('')
    : `<div class="sub">Sem tarefas aqui ainda. Adicione no <a href="mapa.html" style="color:var(--acc)">🗺️ Mapa</a>.</div>`;
  box.querySelectorAll('.yn button').forEach(bt=>bt.onclick=()=>{
    ZONES=readZones(); const zz=ZONES[zi]; const ti=+bt.dataset.ti;
    if(zz&&zz.tasks[ti]){ zz.tasks[ti].done=(bt.dataset.v==='1'); saveZones(ZONES); }
    openRoom(zi); renderHouse(); renderCasaList();
  });
  modal.hidden=false; document.body.classList.add('mopen');
}
function closeRoom(){ modal.hidden=true; document.body.classList.remove('mopen'); }
if(modal){
  modal.querySelector('.mback').onclick=closeRoom;
  modal.querySelector('#rmClose').onclick=closeRoom;
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!modal.hidden) closeRoom(); });
}

(async()=>{ await ensureZones(); renderHouse(); renderCasaList(); })();
/* Recomeçar do zero — limpa a base (financeiro NÃO é afetado) e volta pro onboarding */
const resetBtn=document.getElementById('resetBtn');
if(resetBtn) resetBtn.onclick=()=>{
  if(!confirm('Recomeçar do zero?\n\nIsso apaga a SUA CASA, tarefas, inventário, ferramentas, produtos de limpeza, geladeira, despensa e a matilha DESTE app. O Financeiro (banco) NÃO é afetado. Você vai refazer a configuração inicial.')) return;
  ['lifeos_mapa','lifeos_inv','lifeos_tools','lifeos_cleaning','lifeos_fridge','lifeos_pantry','lifeos_dogs','lifeos_onboarded'].forEach(k=>{ try{ localStorage.removeItem(k); }catch(e){} });
  location.replace('setup.html');
};
function tick(){ const c=document.getElementById('clock'); if(c) c.textContent=new Date().toLocaleTimeString('pt-BR'); } tick(); setInterval(tick,1000);
