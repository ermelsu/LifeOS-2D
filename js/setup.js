/* ============================================================
   ONBOARDING — "Vamos começar do zero"
   Monta o banco de dados inicial do app (casa, eletro, ferramentas,
   limpeza, alimentos, pets) e só então libera a Home.
   ============================================================ */
const PAL=['#ffc94d','#54d98c','#5bb8ff','#ff6b6b','#b98cff','#ff9f5b','#7ee0d0','#ff8fd0','#54d98c','#5bb8ff','#ffc94d','#b98cff','#ff9f5b'];

const APPLIANCES=[['🧊','Geladeira'],['🍳','Fogão'],['📟','Micro-ondas'],['🍟','Air fryer'],['🥤','Liquidificador'],['☕','Cafeteira'],['🍞','Torradeira'],['🎂','Batedeira'],['🥪','Sanduicheira'],['🫧','Máquina de lavar'],['🍽️','Lava-louças'],['❄️','Ar-condicionado'],['🌀','Ventilador'],['♨️','Chaleira elétrica']];
const ELECTRONICS=[['📺','TV'],['💻','Notebook'],['🖥️','PC'],['📱','Celular'],['📟','Tablet/iPad'],['🎮','Nintendo Switch'],['🕹️','PlayStation/Xbox'],['📖','Kindle'],['🎧','Fone'],['⌚','Smartwatch'],['📷','Câmera'],['🔊','Caixa de som'],['🖨️','Impressora']];
const TOOLS=[['🔌','Furadeira'],['🔨','Martelo'],['🪛','Chave de fenda'],['🔧','Chave inglesa'],['🗜️','Alicate'],['🪚','Serra'],['📏','Trena'],['🪜','Escada'],['🔩','Parafusos'],['🧰','Caixa de ferramentas']];
const CLEANING=[['🧴','Detergente'],['🧼','Sabão em pó'],['🧽','Esponja'],['🧹','Vassoura'],['🪣','Balde/rodo'],['🚽','Desinfetante'],['💧','Água sanitária'],['🧻','Papel higiênico'],['🧺','Amaciante'],['🪥','Escova de limpeza']];
const FOODS=[['🥚','Ovos'],['🍗','Frango'],['🥩','Carne'],['🐟','Peixe'],['🥛','Leite'],['🧀','Queijo'],['🍚','Arroz'],['🫘','Feijão'],['🌾','Aveia'],['☕','Café'],['🍌','Banana'],['🍎','Fruta'],['🥦','Legumes'],['🥔','Batata-doce'],['🥤','Whey'],['🥣','Iogurte']];

const ROOM_TYPES={
  quarto:{label:'Quarto',tasks:['Arrumar a cama','Recolher roupas do chão','Trocar os lençóis','Varrer/aspirar']},
  banheiro:{label:'Banheiro',tasks:['Limpar o vaso','Limpar a pia','Limpar o box/chuveiro','Repor papel higiênico']},
  cozinha:{label:'Cozinha',tasks:['Lavar a louça','Limpar o fogão','Tirar o lixo','Varrer e passar pano']},
  sala:{label:'Sala',tasks:['Organizar objetos','Passar pano nos móveis','Varrer o chão']},
  escritorio:{label:'Escritório',tasks:['Organizar a mesa','Fazer backup dos arquivos','Organizar cabos']},
  lavanderia:{label:'Lavanderia',tasks:['Lavar roupa','Estender/recolher','Dobrar e guardar']},
  quintal:{label:'Quintal',tasks:['Recolher fezes dos cães','Aparar o mato','Varrer folhas']},
  area_caes:{label:'Área dos cães',tasks:['Recolher fezes','Trocar a água','Encher os potes de ração','Lavar comedouros']},
  garagem:{label:'Garagem',tasks:['Varrer','Organizar ferramentas']},
  area_externa:{label:'Área externa',tasks:['Varrer o pátio','Recolher entulho']},
};

/* matilha do Emerson pré-preenchida (decisão: manter os 20 com emoji único) */
const DOG_NAMES=['Nina','Hector','Sansa','Nymeria','Lua','Max','Marie','Sky','Lady','Hércules','Margot','Tisha','Dobby','Peppe','Penélope','Jake','Canela','Agostinho','Vhaghar','Princesa'];
const DOG_EMOJIS=['🐕','🐶','🐩','🦮','🐕‍🦺','🐺','🦊','🐾','🐻','🐨','🐼','🦝','🐯','🦁','🐰','🐹','🐭','🐱','🐮','🐷'];

const A = {   // respostas
  rooms:{ quarto:1, banheiro:1, cozinha:true, sala:true, escritorio:false, lavanderia:false, quintal:false, area_caes:false, garagem:false, area_externa:false },
  appliances:new Set(['Geladeira','Fogão']),
  electronics:new Set(['Celular']),
  tools:new Set(), cleaning:new Set(), fridge:new Set(), pantry:new Set(),
  dogs: DOG_NAMES.map((nm,i)=>({nm, face:DOG_EMOJIS[i]||'🐶'})),
};

/* ---------------- steps ---------------- */
const steps=[
  { key:'welcome', ic:'🚀', title:'Vamos começar do zero',
    render:()=>`<p class="lead">Bora montar o seu LifeOS do jeitinho que é a sua casa de verdade. São perguntas rápidas — casa, eletro, ferramentas, limpeza, alimentos e a matilha. No fim eu monto tudo e te levo pra Home. 🐾</p>
      <p class="lead2">Leva ~2 minutos. Dá pra ajustar tudo depois.</p>` },

  { key:'casa', ic:'🏠', title:'Sua casa', sub:'Quantos cômodos e quais áreas você tem?',
    render:()=>`
      ${counterRow('quarto','🛏️','Quartos')}
      ${counterRow('banheiro','🚿','Banheiros')}
      <div class="toglist">
        ${toggle('cozinha','🍳','Cozinha')}${toggle('sala','🛋️','Sala')}${toggle('escritorio','💻','Escritório')}
        ${toggle('lavanderia','🧺','Lavanderia')}${toggle('quintal','🌳','Quintal')}${toggle('area_caes','🐾','Área dos cães')}
        ${toggle('garagem','🚗','Garagem')}${toggle('area_externa','🧱','Área externa')}
      </div>` },

  { key:'appliances', ic:'🔌', title:'Eletrodomésticos', sub:'Toque no que você tem', render:()=>chips('appliances',APPLIANCES) },
  { key:'electronics', ic:'🎮', title:'Eletrônicos', sub:'Toque no que você tem', render:()=>chips('electronics',ELECTRONICS) },
  { key:'tools', ic:'🧰', title:'Ferramentas', sub:'Toque no que existe em casa', render:()=>chips('tools',TOOLS) },
  { key:'cleaning', ic:'🧼', title:'Produtos de limpeza', sub:'Toque no que você tem', render:()=>chips('cleaning',CLEANING) },
  { key:'food', ic:'🍽️', title:'Alimentos', sub:'O que tem agora? (pode deixar vazio e adicionar depois)',
    render:()=>`<div class="fgrp"><div class="glabel">🧊 Geladeira</div>${chips('fridge',FOODS.slice(0,8))}</div>
      <div class="fgrp"><div class="glabel">🥫 Despensa</div>${chips('pantry',FOODS.slice(6))}</div>` },

  { key:'pets', ic:'🐾', title:'A matilha', sub:'Seus cães (cada um com emoji único). Edite à vontade.',
    render:()=>petsBody() },

  { key:'done', ic:'✅', title:'Tudo pronto!', sub:'',
    render:()=>`<p class="lead">Perfeito! Vou montar sua base agora: cômodos com tarefas, inventário separado, matilha e o resto. 🎉</p>
      <p class="lead2" id="doneSummary"></p>` },
];

/* ---------------- widgets ---------------- */
function counterRow(key,ic,label){ return `<div class="counter"><span class="cl"><span class="ci">${ic}</span>${label}</span>
  <div class="cbtns"><button data-cnt="${key}" data-d="-1">−</button><b id="cnt-${key}">${A.rooms[key]}</b><button data-cnt="${key}" data-d="1">+</button></div></div>`; }
function toggle(key,ic,label){ return `<button class="tog ${A.rooms[key]?'on':''}" data-tog="${key}"><span class="ci">${ic}</span>${label}</button>`; }
function chips(setKey,list){ const s=A[setKey];
  return `<div class="chips" data-chips="${setKey}">`+list.map(([ic,nm])=>`<button class="chip ${s.has(nm)?'on':''}" data-nm="${nm}"><span class="ci">${ic}</span>${nm}</button>`).join('')
    +`<button class="chip add" data-add="${setKey}">＋ outro</button></div>`; }
function petsBody(){ return `<div class="pets" id="pets">`+A.dogs.map((d,i)=>`<div class="pet"><span class="pf">${d.face}</span><input value="${d.nm.replace(/"/g,'&quot;')}" data-pi="${i}"><button class="prm" data-prm="${i}">✕</button></div>`).join('')
  +`</div><button class="addpet" id="addpet">＋ adicionar cão</button>`; }

/* ---------------- render/nav ---------------- */
let cur=0;
const el=document.getElementById('wiz');
function render(){
  const s=steps[cur];
  document.getElementById('bar').style.width=Math.round(cur/(steps.length-1)*100)+'%';
  document.getElementById('stepn').textContent=`${cur+1}/${steps.length}`;
  el.innerHTML=`<div class="whead"><span class="wic">${s.ic}</span><div><h2>${s.title}</h2>${s.sub?`<p class="wsub">${s.sub}</p>`:''}</div></div>
    <div class="wbody">${s.render()}</div>
    <div class="wnav">
      ${cur>0?`<button class="wbtn ghost" id="back">Voltar</button>`:`<span></span>`}
      <button class="wbtn primary" id="next">${cur===0?'Começar':cur===steps.length-1?'Entrar no LifeOS ▶':'Próximo'}</button>
    </div>`;
  bind();
  if(s.key==='done') document.getElementById('doneSummary').textContent = summaryText();
}
function bind(){
  const back=document.getElementById('back'); if(back) back.onclick=()=>{ cur=Math.max(0,cur-1); render(); };
  document.getElementById('next').onclick=()=>{ if(cur===steps.length-1){ finish(); return; } cur++; render(); };
  el.querySelectorAll('[data-cnt]').forEach(b=>b.onclick=()=>{ const k=b.dataset.cnt; A.rooms[k]=Math.max(0,Math.min(9,A.rooms[k]+ +b.dataset.d)); document.getElementById('cnt-'+k).textContent=A.rooms[k]; });
  el.querySelectorAll('[data-tog]').forEach(b=>b.onclick=()=>{ const k=b.dataset.tog; A.rooms[k]=!A.rooms[k]; b.classList.toggle('on',A.rooms[k]); });
  el.querySelectorAll('[data-chips] .chip:not(.add)').forEach(b=>b.onclick=()=>{ const set=A[b.closest('[data-chips]').dataset.chips]; const nm=b.dataset.nm; if(set.has(nm))set.delete(nm);else set.add(nm); b.classList.toggle('on'); });
  el.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{ const key=b.dataset.add; const v=prompt('Nome do item:'); if(v&&v.trim()){ A[key].add(v.trim()); render(); } });
  const pets=document.getElementById('pets');
  if(pets){ pets.querySelectorAll('input[data-pi]').forEach(inp=>inp.oninput=()=>{ A.dogs[+inp.dataset.pi].nm=inp.value; });
    pets.querySelectorAll('[data-prm]').forEach(b=>b.onclick=()=>{ A.dogs.splice(+b.dataset.prm,1); render(); });
    const ap=document.getElementById('addpet'); if(ap) ap.onclick=()=>{ A.dogs.push({nm:'Novo cão', face:DOG_EMOJIS[A.dogs.length%DOG_EMOJIS.length]}); render(); };
  }
}
function summaryText(){ const r=A.rooms; let n=(r.quarto||0)+(r.banheiro||0)+['cozinha','sala','escritorio','lavanderia','quintal','area_caes','garagem','area_externa'].filter(k=>r[k]).length;
  return `${n} cômodos · ${A.appliances.size} eletrodomésticos · ${A.electronics.size} eletrônicos · ${A.tools.size} ferramentas · ${A.dogs.length} cães.`; }

/* ---------------- build & save ---------------- */
function iconFor(nm, list){ for(const [ic,n] of list){ if(n===nm) return ic; } return '📦'; }
function buildZones(){
  const list=[]; const push=(type,label)=>{ const t=ROOM_TYPES[type]; list.push({name:label, tasks:(t?t.tasks:[]).map(x=>({t:x,done:false}))}); };
  for(let i=1;i<=A.rooms.quarto;i++) push('quarto', A.rooms.quarto>1?`Quarto ${i}`:'Quarto');
  for(let i=1;i<=A.rooms.banheiro;i++) push('banheiro', A.rooms.banheiro>1?`Banheiro ${i}`:'Banheiro');
  ['cozinha','sala','escritorio','lavanderia','quintal','area_caes','garagem','area_externa'].forEach(k=>{ if(A.rooms[k]) push(k, ROOM_TYPES[k].label); });
  // auto-grid de coordenadas (pra planta no desktop)
  const n=list.length, cols=Math.min(4,Math.max(1,Math.ceil(Math.sqrt(n)))), rows=Math.ceil(n/cols);
  const gap=2, cw=(100-gap*(cols+1))/cols, ch=(100-gap*(rows+1))/rows;
  list.forEach((z,i)=>{ const c=i%cols, r=Math.floor(i/cols);
    z.x=+(gap+c*(cw+gap)).toFixed(2); z.y=+(gap+r*(ch+gap)).toFixed(2); z.w=+cw.toFixed(2); z.h=+ch.toFixed(2);
    z.color=PAL[i%PAL.length]; });
  return list;
}
function setToList(setKey, catalog){ return [...A[setKey]].map(nm=>({ic:iconFor(nm,catalog), nm})); }
function finish(){
  try{
    localStorage.setItem('lifeos_mapa', JSON.stringify({ img:null, zones:buildZones() }));
    localStorage.setItem('lifeos_inv', JSON.stringify({
      appliances: setToList('appliances',APPLIANCES).map(x=>({...x, ok:true})),
      electronics: setToList('electronics',ELECTRONICS),
    }));
    localStorage.setItem('lifeos_tools', JSON.stringify(setToList('tools',TOOLS)));
    localStorage.setItem('lifeos_cleaning', JSON.stringify(setToList('cleaning',CLEANING)));
    localStorage.setItem('lifeos_fridge', JSON.stringify(setToList('fridge',FOODS).map(x=>({...x,q:'?'}))));
    localStorage.setItem('lifeos_pantry', JSON.stringify(setToList('pantry',FOODS).map(x=>({...x,q:'?'}))));
    localStorage.setItem('lifeos_dogs', JSON.stringify(A.dogs.map((d,i)=>({nm:d.nm||('Cão '+(i+1)), face:d.face||DOG_EMOJIS[i%DOG_EMOJIS.length], well:9}))));
    localStorage.setItem('lifeos_onboarded','yes');
  }catch(e){}
  location.replace('painel.html');
}
render();
