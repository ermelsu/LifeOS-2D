/* ============================================================
   PROJETO 6 SEMANAS MAIS MAGRO — módulo de nutrição do Emerson
   Foco: início de tirzepatida · perder peso e gordura visceral.
   Nutricionista (persona) — apoio educativo, NÃO substitui o médico.
   ============================================================ */
const PROFILE = { h:1.92, w:116, age:30, medStart:'2026-07-12' };  // tirzepatida iniciada ~2 dias antes
const IMC = +(PROFILE.w/(PROFILE.h*PROFILE.h)).toFixed(1);
const TARGET = { kcal:1700, prot:160, water:3000, fiber:30 };

/* refeições do dia (porções pequenas — o remédio reduz a fome) */
const MEALS = [
  { id:'m1', time:'06:45', ic:'🍳', name:'Café da manhã', appl:'Fogão', kcal:300, prot:20,
    items:['3 ovos mexidos','1 fruta (banana ou mamão)','Café preto sem açúcar'],
    prep:['Mexa os ovos na antiaderente com pouquíssimo óleo (3 min).','Comece pelos ovos. Café sem açúcar.','Simples e rápido antes do trabalho.'] },
  { id:'m2', time:'10:30', ic:'🥤', name:'Lanche no trabalho', appl:'Leva de casa', kcal:220, prot:28,
    items:['1 iogurte grego natural + 1 scoop de whey','(ou 2 ovos cozidos + 1 fruta)'],
    prep:['Já sai pronto de casa — leve na bolsa.','Zero preparo no trabalho: só abrir e comer.'] },
  { id:'m3', time:'15:00', ic:'🍗', name:'Almoço (ao chegar)', appl:'Fogão', kcal:550, prot:50,
    items:['180g de frango ou carne magra','3–4 colheres de arroz','1 concha de feijão','Salada + legumes à vontade'],
    prep:['DICA: grelhe a proteína em lote (2–3 dias) pra ganhar tempo.','Tempere e grelhe o frango; sirva com arroz, feijão e bastante salada.','Coma a proteína e a salada primeiro, devagar.'] },
  { id:'m4', time:'17:30', ic:'🥚', name:'Lanche da tarde', appl:'Nenhum', kcal:200, prot:26,
    items:['1 iogurte grego + 1 fruta','(ou shake de whey na água)'],
    prep:['Sem preparo. Se a fome estiver baixa, só o whey já resolve a proteína.'] },
  { id:'m5', time:'20:30', ic:'🐟', name:'Jantar (leve)', appl:'Fogão', kcal:430, prot:40,
    items:['150g de frango ou peixe','Legumes no vapor/refogados à vontade','½ batata-doce pequena (opcional)'],
    prep:['Grelhe a proteína, cozinhe os legumes.','Jante pelo menos 2h antes de deitar.'] },
];

const RULES = [
  'Proteína primeiro em cada prato — preserva músculo e dá saciedade.',
  'Coma devagar e pare no primeiro sinal de saciedade — o estômago esvazia mais lento com o remédio.',
  '3 litros de água ao longo do dia — evita constipação e dor de cabeça.',
  'Evite fritura, gordura pesada, açúcar e álcool — pioram náusea e refluxo.',
  'Não deite logo após comer (mínimo 2h antes de dormir).',
  'Fracione: 5 refeições pequenas funcionam melhor que 3 grandes.',
  'Fibra todo dia (legumes, feijão, aveia) — o intestino tende a prender.',
];
const SIDE = [
  { k:'🤢 Náusea', v:'Porções menores, alimentos leves e secos, gengibre, evite cheiros fortes e frituras.' },
  { k:'🚽 Constipação', v:'Água + fibra + caminhada. Se persistir, fale com seu médico.' },
  { k:'🔥 Azia / refluxo', v:'Não deite após comer, evite gordura e refeições grandes.' },
  { k:'😵 Sulfur burps / enjoo', v:'Reduza gordura pesada; refeições menores e mais frequentes.' },
];
const ALERTS = ['Vômito persistente ou incapacidade de beber água','Dor abdominal forte que irradia para as costas (possível pancreatite)','Sinais de desidratação, tontura ou hipoglicemia (tremor, suor frio)'];

const WEEKS = [
  { n:1, dose:'2,5 mg (início)', txt:'Corpo se ajustando. Prioridade: HIDRATAR (3L) + PROTEÍNA em toda refeição. Porções menores, coma devagar. Peso cai rápido (é bastante água no começo).' },
  { n:2, dose:'2,5 mg', txt:'Constância. Comece caminhadas de 15–20 min/dia. Registre peso e cintura 1×/semana, sempre no mesmo horário.' },
  { n:3, dose:'possível 5 mg (com seu médico)', txt:'Fome bem baixa — cuidado pra NÃO ficar abaixo de ~120g de proteína/dia. Comece o treino seguro de lombar 2–3×/sem.' },
  { n:4, dose:'5 mg', txt:'Aumente a caminhada para ~30 min. Mantenha proteína alta e fibra. Reavalie medidas.' },
  { n:5, dose:'5 mg', txt:'Consolidação. Ajuste porções se a fome mudar. Força + caminhada firmes.' },
  { n:6, dose:'5 mg', txt:'Fechamento do projeto: remeça medidas e foto. Meta realista: −5 a −7 kg e menos cintura/gordura visceral. Ajuste de dose só com médico.' },
];

/* ---------------- estado (localStorage) ---------------- */
const KEY='lifeos_dieta';
const todayKey=()=>new Date().toISOString().slice(0,10);
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}')||{}; }catch(e){ return {}; } }
function save(s){ try{ localStorage.setItem(KEY,JSON.stringify(s)); }catch(e){} }
let S=load();
if(!S.start){ S.start=todayKey(); }
S.done=S.done||{}; S.water=S.water||{};
const dk=todayKey();
S.done[dk]=S.done[dk]||{}; if(S.water[dk]==null) S.water[dk]=0;
save(S);

function projectDay(){ const d0=new Date(S.start+'T00:00:00'), now=new Date(dk+'T00:00:00');
  return Math.max(1, Math.floor((now-d0)/86400000)+1); }
const dayN=projectDay();
const weekN=Math.min(6, Math.floor((dayN-1)/7)+1);

function consumed(){ let kcal=0,prot=0; MEALS.forEach(m=>{ if(S.done[dk][m.id]){ kcal+=m.kcal; prot+=m.prot; } }); return {kcal,prot}; }
function nowMin(){ const n=new Date(); return n.getHours()*60+n.getMinutes(); }
function mealMin(m){ const [h,mm]=m.time.split(':').map(Number); return h*60+mm; }
function currentMeal(){ const t=nowMin();
  // refeição "da vez": a mais recente cujo horário já chegou (janela 120min) e não foi feita; senão a próxima
  let cur=null;
  for(const m of MEALS){ const mt=mealMin(m); if(mt<=t && t-mt<=120 && !S.done[dk][m.id]) cur=m; }
  if(cur) return {m:cur, state:'agora'};
  const next=MEALS.find(m=>mealMin(m)>t);
  if(next) return {m:next, state:'próxima'};
  return null;
}

/* ---------------- render ---------------- */
const grid=document.getElementById('grid');
function panel(cls,icon,title,right,body){ return `<section class="panel ${cls}">
  <div class="ph"><span class="ic">${icon}</span><h2>${title}</h2>${right?`<span class="r">${right}</span>`:''}</div>${body}</section>`; }
function ring(pct,color,label,center){ const p=Math.max(0,Math.min(100,pct)); return `<div class="ring" style="--p:${p};--c:${color}"><div class="rc"><b>${center}</b><small>${label}</small></div></div>`; }

function heroBody(){ return `<div class="dhero">
    <div class="dbadge">💉 Tirzepatida · início</div>
    <div class="dstat"><b>${PROFILE.h.toFixed(2)}m</b><small>altura</small></div>
    <div class="dstat"><b>${PROFILE.w}kg</b><small>peso atual</small></div>
    <div class="dstat"><b>${IMC}</b><small>IMC</small></div>
    <div class="dstat"><b>~108–110kg</b><small>meta 6 sem</small></div>
  </div>
  <div class="dprog"><div class="dpline"><span>Semana <b>${weekN}</b> de 6</span><span>Dia <b>${Math.min(dayN,42)}</b>/42</span></div>
    <div class="bar big"><i style="width:${Math.min(100,dayN/42*100)}%"></i></div></div>`; }

function agoraBody(){ const c=currentMeal();
  if(!c) return `<div class="sub" style="text-align:center;padding:12px">✅ Refeições de hoje encerradas. Ótimo trabalho! Hidrate-se e descanse.</div>`;
  const m=c.m, done=!!S.done[dk][m.id];
  return `<div class="agora">
    <div class="atop"><span class="apill ${c.state==='agora'?'now':''}">${c.state==='agora'?'🔔 AGORA':'⏭️ PRÓXIMA'}</span>
      <span class="atime">${m.ic} ${m.time} · ${m.name}</span>
      <span class="amac">${m.kcal} kcal · ${m.prot}g P${m.appl!=='Nenhum'?' · '+m.appl:''}</span></div>
    <div class="acols">
      <div><div class="asub">O que comer</div><ul class="alist">${m.items.map(i=>`<li>${i}</li>`).join('')}</ul></div>
      <div><div class="asub">Como preparar</div><ol class="aprep">${m.prep.map(p=>`<li>${p}</li>`).join('')}</ol></div>
    </div>
    <button class="eatbtn ${done?'done':''}" data-eat="${m.id}">${done?'✅ Comi essa refeição':'🍽️ Marcar como feita'}</button>
  </div>`; }

function metasBody(){ const c=consumed(), wa=S.water[dk];
  return `<div class="rings">
    ${ring(c.kcal/TARGET.kcal*100,'#54d98c', 'kcal', c.kcal+'<i>/'+TARGET.kcal+'</i>')}
    ${ring(c.prot/TARGET.prot*100,'#5bb8ff', 'proteína', c.prot+'<i>/'+TARGET.prot+'g</i>')}
    ${ring(wa/TARGET.water*100,'#4dd0e1', 'água', (wa/1000).toFixed(1)+'<i>/'+(TARGET.water/1000)+'L</i>')}
  </div>
  <div class="water"><span class="sub">💧 Registrar água:</span>
    <button data-w="250">+250ml</button><button data-w="500">+500ml</button><button data-w="-250" class="minus">−250</button></div>
  <div class="sub" style="margin-top:8px">Metas do dia: <b style="color:var(--acc)">${TARGET.kcal} kcal</b>, <b style="color:var(--acc)">${TARGET.prot}g de proteína</b>, <b style="color:var(--acc)">${TARGET.water/1000}L de água</b> e ~${TARGET.fiber}g de fibra. Proteína é o mais importante — não fique abaixo dela.</div>`; }

function planoBody(){ return `<div id="plano">`+MEALS.map(m=>{ const done=!!S.done[dk][m.id];
  return `<div class="meal ${done?'done':''}" data-meal="${m.id}">
    <div class="mhead"><button class="mchk" data-eat="${m.id}">${done?'✔':''}</button>
      <div class="mtitle"><b>${m.ic} ${m.name}</b><small>${m.time} · ${m.kcal} kcal · ${m.prot}g P${m.appl!=='Nenhum'?' · '+m.appl:''}</small></div>
      <span class="caret">▸</span></div>
    <div class="mbody">
      <div class="asub">O que comer</div><ul class="alist">${m.items.map(i=>`<li>${i}</li>`).join('')}</ul>
      <div class="asub">Como preparar</div><ol class="aprep">${m.prep.map(p=>`<li>${p}</li>`).join('')}</ol>
    </div></div>`; }).join('')+`</div>`; }

function rulesBody(){ return `<ol class="rules">${RULES.map(r=>`<li>${r}</li>`).join('')}</ol>`; }
function sideBody(){ return SIDE.map(s=>`<div class="kv2"><b>${s.k}</b><span>${s.v}</span></div>`).join('')
  +`<div class="alert"><b>🚨 Procure atendimento se tiver:</b><ul>${ALERTS.map(a=>`<li>${a}</li>`).join('')}</ul></div>`; }
function weeksBody(){ return `<div class="weeks">`+WEEKS.map(w=>`<div class="wk ${w.n===weekN?'on':''}">
  <div class="wkh"><b>Semana ${w.n}</b><span>${w.dose}</span></div><div class="sub">${w.txt}</div></div>`).join('')+`</div>`; }
function exerBody(){ return `<div class="sub" style="margin-bottom:8px">Começar seguro pra sua lombar (L3–L5) — nada de agachamento pesado ou abdominal com flexão da coluna.</div>
  <ul class="alist">
    <li><b>Base:</b> caminhada diária 15 → 30 min (comece leve).</li>
    <li><b>Força 2–3×/sem:</b> gato-camelo, ponte de glúteo, prancha, bird-dog, dead bug.</li>
    <li>O treino completo e seguro está no <a href="painel.html" style="color:var(--acc)">Painel → Treino de hoje</a>.</li>
  </ul>`; }

grid.innerHTML =
  panel('col-12 dherop','🔥','Projeto 6 Semanas Mais Magro','tirzepatida · perder gordura', heroBody()) +
  panel('col-8 agorap','🍽️','Sua refeição agora','o que comer e como preparar', '<div id="agoraWrap"></div>') +
  panel('col-4','🎯','Metas de hoje','', metasBody()) +
  panel('col-12','🗓️','Plano do dia (toque pra ver o preparo)', TARGET.kcal+' kcal · '+TARGET.prot+'g proteína', planoBody()) +
  panel('col-6','✅','Regras de ouro (tirzepatida)','', rulesBody()) +
  panel('col-6','🩺','Efeitos & manejo','', sideBody()) +
  panel('col-12','📈','Progressão das 6 semanas','', weeksBody()) +
  panel('col-6','🏃','Começar a se exercitar','seguro p/ lombar', exerBody()) +
  panel('col-6','📏','Acompanhar o corpo','', `<div class="sub">Registre <b>peso</b>, <b>cintura</b> e <b>% de gordura</b> no <a href="saude.html" style="color:var(--acc)">🪞 Espelho da Saúde</a> — 1× por semana, no mesmo horário. A cintura caindo é o melhor sinal de perda de gordura visceral.</div>`) +
  panel('col-12 disc','⚠️','Aviso importante','', `<div class="sub">Este módulo é <b>apoio educativo</b> e <b>não substitui seu médico prescritor</b>. A tirzepatida exige acompanhamento clínico: ajuste de dose, exames e sintomas são responsabilidade do seu médico. Se surgir qualquer sinal de alerta acima, procure atendimento. Feito com carinho pra te ajudar a chegar mais leve e saudável. 🐾</div>`);

function renderAgora(){ const w=document.getElementById('agoraWrap'); if(w) w.innerHTML=agoraBody();
  const c=consumed(), wa=S.water[dk];
  // atualiza anéis sem re-render total
  document.querySelectorAll('[data-eat]').forEach(b=>b.onclick=()=>toggleMeal(b.dataset.eat));
  document.querySelectorAll('.meal').forEach(el=>{ const head=el.querySelector('.mhead'); head.onclick=(e)=>{ if(e.target.closest('.mchk')) return; el.classList.toggle('open'); }; });
}
function refreshMetas(){ // re-render metas panel body in place
  const metaPanel=[...document.querySelectorAll('.panel')].find(p=>p.querySelector('.rings'));
  if(metaPanel){ const holder=metaPanel; const ph=holder.querySelector('.ph'); holder.innerHTML=''; holder.appendChild(ph);
    holder.insertAdjacentHTML('beforeend', metasBody()); bindWater(); }
}
function toggleMeal(id){ S.done[dk][id]=!S.done[dk][id]; save(S);
  // atualiza checkbox/estado no plano
  document.querySelectorAll(`.meal[data-meal="${id}"]`).forEach(el=>{ el.classList.toggle('done',S.done[dk][id]); const chk=el.querySelector('.mchk'); if(chk) chk.textContent=S.done[dk][id]?'✔':''; });
  renderAgora(); refreshMetas(); }
function bindWater(){ document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{ S.water[dk]=Math.max(0,(S.water[dk]||0)+ +b.dataset.w); save(S); refreshMetas(); }); }

renderAgora(); bindWater();
function tick(){ const c=document.getElementById('clock'); if(c) c.textContent=new Date().toLocaleTimeString('pt-BR'); } tick(); setInterval(tick,1000);
// re-checa a refeição "agora" a cada minuto
setInterval(()=>renderAgora(), 60000);
