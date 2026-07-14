/* ============================================================
   Estado REAL do jogo — dados do Emerson (questionário respondido).
   ============================================================ */
const DOG_NAMES=['Nina','Hector','Sansa','Nymeria','Lua','Max','Marie','Sky','Lady','Hércules',
  'Margot','Tisha','Dobby','Peppe','Penélope','Jake','Canela','Agostinho','Vhaghar','Princesa'];
const DOG_EMO=['🐕','🐩','🐶'];

const STATE = {
  hero:{ name:'Emerson', cls:'Explorador · cap. Reorganização da vida', level:1, xp:15, xpMax:100, avatar:'🧑🏻' },
  effects:[ {t:'✨ Melhorar tudo com IA', k:'buff'}, {t:'☠️ Excesso de maconha', k:'debuff'}, {t:'📱 Celular (distração)', k:'debuff'} ],
  attrs:[
    {n:'💪 Corpo',    v:4, c:'#54d98c'}, {n:'🧠 Mente',     v:5, c:'#5bb8ff'},
    {n:'💰 Recursos', v:7, c:'#ffcf5c'}, {n:'⚒️ Ofício',    v:5, c:'#ff9f5b'},
    {n:'❤️ Vínculos', v:5, c:'#ff7b9c'}, {n:'📚 Sabedoria', v:7, c:'#b98cff'},
    {n:'🔥 Espírito', v:5, c:'#ffa24d'}, {n:'⏳ Disciplina',v:2, c:'#7ee0d0'},
  ],
  streak:{ n:1, week:[{d:'Seg',on:false},{d:'Ter',on:false},{d:'Qua',on:false},{d:'Qui',on:false},{d:'Sex',on:false},{d:'Sáb',on:false},{d:'Hoje',on:true}] },
  goal:'🏡 Casa nova + o canil dos sonhos',
  resources:[ {k:'Estabilidade', v:'8/10 ✔'}, {k:'Renda', v:'Líder de almoxarifado (Cecape)'}, {k:'Dívida', v:'Média'}, {k:'Meta', v:'🏠 Comprar a casa'} ],
  measures:[
    {nm:'Peso',          ic:'⚖️', cur:null, goal:null, unit:'kg'},
    {nm:'Cintura',       ic:'📏', cur:null, goal:null, unit:'cm'},
    {nm:'% Gordura',     ic:'💧', cur:null, goal:null, unit:'%'},
    {nm:'Força de core', ic:'🏋️', start:2, cur:2, goal:8, unit:'/10'},
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
    {t:'Cuidar da matilha 🐾',             rw:'+3 Vínculos', done:true},
  ],
  boss:{ nm:'O Caos', face:'🌀', hp:78, sub:'Desorganização + falta de energia. Cada tarefa feita tira HP. Deixar pra depois faz ele crescer e invadir cômodos.' },
  mood:{ today:3, week:[{d:'Seg',v:6},{d:'Ter',v:7},{d:'Qua',v:6},{d:'Qui',v:8},{d:'Sex',v:5},{d:'Sáb',v:8},{d:'Dom',v:7}] },
  dogs: DOG_NAMES.map((nm,i)=>({ nm, face:DOG_EMO[i%DOG_EMO.length], well: 8 + (i%3) })),  // bem-estar 8–10
  allies:[ {nm:'Alisson', rl:'irmão · canal do YouTube', em:'🎬'}, {nm:'João Pedro', rl:'aliado de sempre', em:'🤝'}, {nm:'Clice', rl:'namorada', em:'💗'} ],
  fridge:[ {ic:'🥚',nm:'Ovos',q:'?'},{ic:'🍗',nm:'Frango',q:'?'},{ic:'🥛',nm:'Leite',q:'?'},{ic:'🧀',nm:'Queijo',q:'?'} ],
  pantry:[ {ic:'🍚',nm:'Arroz',q:'?'},{ic:'🥫',nm:'Feijão',q:'?'},{ic:'🌾',nm:'Aveia',q:'?'},{ic:'☕',nm:'Café',q:'?'} ],
  appliances:[ {ic:'🍳',nm:'Fogão',ok:true},{ic:'🧊',nm:'Geladeira',ok:true},{ic:'🎮',nm:'Nintendo Switch',ok:true},{ic:'🖥️',nm:'PC',ok:true},{ic:'📺',nm:'Consoles',ok:true} ],
  shopping:[ {t:'Peito de frango',done:false},{t:'Ovos',done:false},{t:'Legumes',done:false},{t:'Ração da matilha',done:false} ],
  inv:[ {ic:'🎮',q:''},{ic:'🖥️',q:''},{ic:'🎧',q:''},{ic:'✏️',q:''},{ic:'💻',q:''},{ic:'📱',q:''},{ic:'🎨',q:''} ], invSlots:12,
};
const MOODS=['😫','😕','😐','🙂','😄'];
const moodEmoji=v=>MOODS[Math.max(0,Math.min(4,Math.round((v-1)/2.25)))];

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

const h=STATE.hero, s=STATE.streak;

/* faixa compacta no topo: herói + streak + meta + progresso da casa */
const stripBody=`<div class="istrip">
  <div class="iu"><span class="iav">${h.avatar}</span>
    <div class="iuinfo"><div class="il"><b>${h.name}</b><span class="lvl">Nv ${h.level}</span></div>
      <div class="ixp"><i data-w="${Math.round(h.xp/h.xpMax*100)}%"></i></div></div></div>
  <div class="ik"><span class="ke">🔥</span><b>${s.n}</b><small>dia de sequência</small></div>
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

const streakBody=`<div class="stk"><div class="big">🔥 ${s.n}<small> dia</small></div>
  <div class="stkdays">${s.week.map(d=>`<div class="sd ${d.on?'on':''}"><div class="f">🔥</div>${d.d}</div>`).join('')}</div>
  <div class="sub" style="text-align:center;margin-top:10px">Faça 1 missão por dia pra manter a chama acesa.</div></div>`;

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

const dogsBody=`<div class="dogsgrid">`+STATE.dogs.map(d=>`<div class="dogc"><div class="f">${d.face}</div><div class="n" title="${d.nm}">${d.nm}</div>${bar(d.well,'#54d98c')}</div>`).join('')+`</div>`;

const alliesBody=STATE.allies.map(a=>`<div class="ally"><span class="em">${a.em}</span><div><div class="nm">${a.nm}</div><div class="rl">${a.rl}</div></div></div>`).join('');
const resBody=STATE.resources.map(r=>`<div class="kv"><span>${r.k}</span><b>${r.v}</b></div>`).join('')+`<div class="sub" style="margin-top:8px">🏦 Anote gastos e entradas no <a href="banco.html" style="color:var(--acc)">Banco</a>.</div>`;
const listBody=arr=>`<div class="list">`+arr.map(it=>`<div class="li"><span class="ic">${it.ic}</span><span>${it.nm}</span>${it.q?`<span class="q">${it.q}</span>`:''}</div>`).join('')+`</div>`;
const applBody=`<div class="list">`+STATE.appliances.map(a=>`<div class="li"><span class="ic">${a.ic}</span><span>${a.nm}</span><span class="sdot" style="background:${a.ok?'var(--hp)':'var(--dmg)'};box-shadow:0 0 8px ${a.ok?'var(--hp)':'var(--dmg)'}"></span></div>`).join('')+`</div>`;
const shopBody=`<div id="shop">`+STATE.shopping.map((x,i)=>`<div class="quest ${x.done?'done':''}" data-i="${i}"><div class="box">${x.done?'✔':''}</div><div class="txt">${x.t}</div></div>`).join('')+`</div>`;
let invHtml=''; for(let i=0;i<STATE.invSlots;i++){ const it=STATE.inv[i]; invHtml+= it?`<div class="slot">${it.ic}${it.q?`<span class="q">${it.q}</span>`:''}</div>`:`<div class="slot empty">+</div>`; }
const invBody=`<div class="inv">${invHtml}</div>`;

grid.innerHTML =
  `<section class="panel col-12 infostrip">${stripBody}</section>` +
  panel('col-12 maphero','🗺️','Sua casa','toque num cômodo pra ver as tarefas', '<div id="housemapWrap"></div>') +
  panel('col-8','🧝','Personagem','', heroBody) +
  panel('col-4','🔥','Sequência (streak)','', streakBody) +
  panel('col-6','📊','Medidas & Progresso', STATE.goal, measBody) +
  panel('col-6','🏋️','Treino de hoje', w.min+' min · casa', workoutBody) +
  panel('col-12','🍽️','Receitas com o que você tem','pra sua meta', recBody) +
  panel('col-4','🗺️','Missões de hoje','', questBody) +
  panel('col-4','🌀','Chefão atual','', bossBody) +
  panel('col-4','🙂','Humor da semana','', moodBody) +
  panel('col-12','🐾','A matilha', STATE.dogs.length+' cães', dogsBody) +
  panel('col-4','🤝','Aliados (party)','', alliesBody) +
  panel('col-4','💰','Recursos','', resBody) +
  panel('col-4','🎒','Inventário','', invBody) +
  panel('col-3','🧊','Geladeira','', listBody(STATE.fridge)) +
  panel('col-3','🥫','Despensa','', listBody(STATE.pantry)) +
  panel('col-3','🔌','Eletrônicos','', applBody) +
  panel('col-3','🛒','Lista de compras','', shopBody) +
  panel('col-12','⭐','Grande missão de vida','', `<div style="font-size:14px;line-height:1.5">Guiar a matilha bem até o fim, ter uma vida confortável e um <b style="color:var(--acc)">sítio 100×100m</b> com um canil de verdade pra eles. 🐾🏡</div>`);

requestAnimationFrame(()=>requestAnimationFrame(()=>{
  document.querySelectorAll('[data-w]').forEach(el=>el.style.width=el.dataset.w);
  document.querySelectorAll('[data-h]').forEach(el=>el.style.height=el.dataset.h);
}));
function bindChecklist(id,arr){ const box=document.getElementById(id); if(!box)return;
  box.addEventListener('click',e=>{ const q=e.target.closest('.quest'); if(!q)return; const i=+q.dataset.i; arr[i].done=!arr[i].done; q.classList.toggle('done'); q.querySelector('.box').textContent=arr[i].done?'✔':''; }); }
bindChecklist('quests',STATE.quests); bindChecklist('shop',STATE.shopping);
const woBtn=document.getElementById('woBtn'); if(woBtn) woBtn.onclick=()=>{ STATE.workout.done=!STATE.workout.done; woBtn.classList.toggle('done',STATE.workout.done); woBtn.textContent=STATE.workout.done?'✅ Treino concluído':'💪 Concluir treino de hoje'; };
const moodPick=document.getElementById('moodPick'); if(moodPick) moodPick.addEventListener('click',e=>{ const btn=e.target.closest('button'); if(!btn)return; STATE.mood.today=+btn.dataset.m; moodPick.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===btn)); document.getElementById('moodBig').textContent=MOODS[STATE.mood.today]; });

/* ============================================================
   MAPA DA CASA (herói) + modal de tarefas por cômodo
   ============================================================ */
function renderHouse(){
  ZONES=readZones();
  const m=readMapa();
  const wrap=document.getElementById('housemapWrap');
  const mapSrc = m.img || 'assets/casa.png';   // foto do Emerson se subir; senão cai pro SVG oficial
  const st=houseStats();
  const pctEl=document.getElementById('casaPct'); if(pctEl) pctEl.textContent = st.total? st.pct+'%' : '—';
  if(!wrap) return;
  const ov=ZONES.map((z,i)=>{ const tasks=z.tasks||[]; const pl=tasks.filter(t=>!t.done); const pend=pl.length;
    const fill = pend? `rgba(255,86,86,${Math.min(.18+pend*0.05,.5).toFixed(2)})` : 'rgba(84,217,140,.16)';
    const items = pend
      ? pl.slice(0,7).map(t=>`<i>${t.t}</i>`).join('')+(pend>7?`<i class="more">+${pend-7}…</i>`:'')
      : `<i class="ok">tudo em ordem ✨</i>`;
    return `<button class="harea ${pend?'pend':'done'}" data-z="${i}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%;border-color:${z.color};background:${fill}" aria-label="${z.name}: ${pend} pendente(s)">
      <span class="lab" style="background:${z.color}">${z.name}</span>
      <span class="bd" style="background:${pend?'rgba(120,0,0,.82)':'#153a29'};color:${pend?'#fff':'#54d98c'}">${pend?'⚠ '+pend:'✓'}</span>
      <span class="htasks">${items}</span></button>`; }).join('');
  const hint = ZONES.length? '' : `<div class="mhint">Nomeie os cômodos e crie tarefas no <a href="mapa.html">🗺️ Mapa</a> — eles aparecem aqui.</div>`;
  wrap.innerHTML=`<div class="housemap"><img id="hmimg" src="${mapSrc}" alt="planta da casa">${ov}${hint}
    <div class="hbar"><i style="width:${st.pct}%"></i></div></div>`;
  const hm=document.getElementById('hmimg');
  if(hm){ hm.onerror=()=>{ if(hm.src.indexOf('casa.svg')<0){ hm.src='assets/casa.svg'; }   // tenta o SVG oficial
      else { hm.closest('.housemap').classList.add('noimg'); } }; }
  wrap.querySelectorAll('.harea').forEach(a=>a.onclick=()=>openRoom(+a.dataset.z));
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
    openRoom(zi); renderHouse();
  });
  modal.hidden=false; document.body.classList.add('mopen');
}
function closeRoom(){ modal.hidden=true; document.body.classList.remove('mopen'); }
if(modal){
  modal.querySelector('.mback').onclick=closeRoom;
  modal.querySelector('#rmClose').onclick=closeRoom;
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!modal.hidden) closeRoom(); });
}

(async()=>{ await ensureZones(); renderHouse(); })();
function tick(){ const c=document.getElementById('clock'); if(c) c.textContent=new Date().toLocaleTimeString('pt-BR'); } tick(); setInterval(tick,1000);
