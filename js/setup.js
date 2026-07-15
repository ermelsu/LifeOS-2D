/* ============================================================
   ONBOARDING — "Vamos começar do zero"
   Monta o banco de dados inicial do app (casa, eletro, ferramentas,
   limpeza, alimentos, pets) e só então libera a Home.

   Dois modos logo na entrada:
     • Passo a passo — perguntas rápidas com catálogos grandes.
     • Colar listas  — cole tudo de uma vez (um item por linha).
   ============================================================ */
const PAL=['#ffc94d','#54d98c','#5bb8ff','#ff6b6b','#b98cff','#ff9f5b','#7ee0d0','#ff8fd0','#54d98c','#5bb8ff','#ffc94d','#b98cff','#ff9f5b'];

/* ---------------- catálogos (variedade grande) ---------------- */
const APPLIANCES=[['🧊','Geladeira'],['❄️','Freezer'],['🍷','Adega'],['🍳','Fogão'],['🔥','Cooktop'],['🔥','Forno elétrico'],['📟','Micro-ondas'],['🍟','Air fryer'],['🥤','Liquidificador'],['🥛','Mixer'],['🔪','Processador'],['🍊','Espremedor'],['☕','Cafeteira'],['☕','Café expresso'],['🍞','Torradeira'],['🥪','Sanduicheira'],['🧇','Máquina de waffle'],['🎂','Batedeira'],['🍚','Panela elétrica'],['♨️','Panela de pressão elétrica'],['🫧','Máquina de lavar'],['🌀','Secadora'],['🍽️','Lava-louças'],['👕','Ferro de passar'],['🧹','Aspirador'],['🤖','Robô aspirador'],['❄️','Ar-condicionado'],['🌀','Ventilador'],['🔥','Aquecedor'],['💧','Purificador de água'],['🚰','Bebedouro'],['♨️','Chaleira elétrica'],['💨','Coifa/Exaustor'],['💧','Umidificador']];
const ELECTRONICS=[['📺','TV'],['📽️','Projetor'],['💻','Notebook'],['🖥️','PC'],['⌨️','Teclado'],['🖱️','Mouse'],['📱','Celular'],['📟','Tablet/iPad'],['🎮','Nintendo Switch'],['🕹️','PlayStation'],['🎮','Xbox'],['📖','Kindle'],['🎧','Fone'],['🎙️','Microfone'],['⌚','Smartwatch'],['📷','Câmera'],['📹','Webcam'],['🔊','Caixa de som'],['🔈','Soundbar'],['🖨️','Impressora'],['📡','Roteador'],['🔋','Power bank'],['💡','Lâmpada smart'],['🎛️','Alexa/Echo'],['📺','Chromecast/Fire TV'],['🕶️','VR headset'],['⌚','Relógio digital'],['🔌','Carregador']];
const TOOLS=[['🔌','Furadeira'],['🪛','Parafusadeira'],['🔨','Martelo'],['🪛','Chave de fenda'],['🔧','Chave inglesa'],['🔩','Chave Philips'],['🗜️','Alicate'],['✂️','Alicate de corte'],['🪚','Serra'],['🪚','Serra elétrica'],['📏','Trena'],['📐','Esquadro'],['📏','Nível'],['🪜','Escada'],['🔩','Parafusos'],['🔩','Buchas'],['🧰','Caixa de ferramentas'],['🪓','Machado'],['🔦','Lanterna'],['🧲','Detector de metais'],['🖌️','Pincéis/rolo'],['🩹','Fita isolante'],['📦','Fita crepe'],['🧴','Cola/silicone'],['⚙️','Lixadeira'],['🔥','Ferro de solda'],['🧤','Luvas'],['🥽','Óculos de proteção']];
const CLEANING=[['🧴','Detergente'],['🧼','Sabão em pó'],['🧼','Sabão em barra'],['🧽','Esponja'],['🧽','Esponja de aço'],['🧹','Vassoura'],['🧹','Rodo'],['🪣','Balde'],['🚽','Desinfetante'],['💧','Água sanitária'],['🍋','Limpador multiuso'],['🪟','Limpa-vidros'],['🛋️','Lustra-móveis'],['🧻','Papel higiênico'],['🧻','Papel toalha'],['🧺','Amaciante'],['🧴','Alvejante'],['🪥','Escova de limpeza'],['🧤','Luvas de limpeza'],['🗑️','Sacos de lixo'],['🌸','Aromatizador'],['🦟','Inseticida'],['🚿','Limpador de banheiro'],['🍽️','Detergente p/ máquina'],['🧴','Álcool'],['🧴','Álcool em gel'],['🧊','Pastilha sanitária'],['🧫','Desengordurante']];
const FRIDGE=[['🥚','Ovos'],['🍗','Frango'],['🥩','Carne'],['🥓','Bacon'],['🌭','Linguiça'],['🍖','Carne suína'],['🐟','Peixe'],['🦐','Camarão'],['🥛','Leite'],['🧀','Queijo'],['🧈','Manteiga'],['🥛','Requeijão'],['🥣','Iogurte'],['🍦','Sorvete'],['🥓','Presunto'],['🥤','Whey'],['🍌','Banana'],['🍎','Maçã'],['🍊','Laranja'],['🍓','Morango'],['🍇','Uva'],['🍉','Melancia'],['🥦','Brócolis'],['🥬','Alface'],['🍅','Tomate'],['🥕','Cenoura'],['🥒','Pepino'],['🫑','Pimentão'],['🧅','Cebola'],['🧄','Alho'],['🌿','Cheiro-verde'],['🥭','Manga'],['🥑','Abacate'],['🧃','Suco'],['🥥','Água de coco'],['🍋','Limão']];
const PANTRY=[['🍚','Arroz'],['🫘','Feijão'],['🍝','Macarrão'],['🌾','Aveia'],['🌽','Milho'],['🫓','Farinha de trigo'],['🌾','Farinha de mandioca'],['🍞','Pão'],['🥖','Pão de forma'],['🧂','Sal'],['🍬','Açúcar'],['☕','Café'],['🫖','Chá'],['🥛','Leite em pó'],['🍫','Achocolatado'],['🛢️','Óleo'],['🫒','Azeite'],['🍶','Vinagre'],['🥫','Molho de tomate'],['🥫','Milho/ervilha (lata)'],['🐟','Atum/sardinha'],['🍪','Biscoito'],['🍯','Mel'],['🥜','Amendoim'],['🌰','Castanhas'],['🍿','Pipoca'],['🧄','Temperos'],['🌶️','Pimenta'],['🍜','Miojo'],['🥣','Granola'],['🫙','Geleia'],['🥔','Batata'],['🍫','Chocolate'],['🧁','Fermento']];

const CATALOG={ appliances:APPLIANCES, electronics:ELECTRONICS, tools:TOOLS, cleaning:CLEANING, fridge:FRIDGE, pantry:PANTRY };
const DEFAULT_IC={ appliances:'🔌', electronics:'🎮', tools:'🧰', cleaning:'🧼', fridge:'🧊', pantry:'🥫' };
const ALL_ITEMS=[...APPLIANCES,...ELECTRONICS,...TOOLS,...CLEANING,...FRIDGE,...PANTRY];

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
function matchRoomType(label){
  const l=(label||'').toLowerCase();
  if(/quarto|dormit|suite|suíte/.test(l)) return 'quarto';
  if(/banh|lavab|toalet/.test(l)) return 'banheiro';
  if(/cozinh/.test(l)) return 'cozinha';
  if(/sala|estar|jantar|living/.test(l)) return 'sala';
  if(/escrit|office|home\s?office/.test(l)) return 'escritorio';
  if(/lavand|área\s*de\s*serv|area\s*de\s*serv/.test(l)) return 'lavanderia';
  if(/quintal/.test(l)) return 'quintal';
  if(/c[ãa]es|canil|pet/.test(l)) return 'area_caes';
  if(/garag/.test(l)) return 'garagem';
  if(/extern|p[áa]tio|varand|jardim/.test(l)) return 'area_externa';
  return null;
}

/* matilha do Emerson pré-preenchida (decisão: manter os 20 com emoji único) */
const DOG_NAMES=['Nina','Hector','Sansa','Nymeria','Lua','Max','Marie','Sky','Lady','Hércules','Margot','Tisha','Dobby','Peppe','Penélope','Jake','Canela','Agostinho','Vhaghar','Princesa'];
const DOG_EMOJIS=['🐕','🐶','🐩','🦮','🐕‍🦺','🐺','🦊','🐾','🐻','🐨','🐼','🦝','🐯','🦁','🐰','🐹','🐭','🐱','🐮','🐷'];

const A = {   // respostas
  rooms:{ quarto:1, banheiro:1, cozinha:true, sala:true, escritorio:false, lavanderia:false, quintal:false, area_caes:false, garagem:false, area_externa:false },
  appliances:new Set(['Geladeira','Fogão']),
  electronics:new Set(['Celular']),
  tools:new Set(), cleaning:new Set(), fridge:new Set(), pantry:new Set(),
  // matilha: mantém os cães já salvos (o "recomeço" preserva a matilha); senão, os 20 padrão.
  dogs:(function(){ try{ const d=JSON.parse(localStorage.getItem('lifeos_dogs')||'null');
    if(Array.isArray(d)&&d.length) return d.map((x,i)=>({nm:x.nm||('Cão '+(i+1)), face:x.face||DOG_EMOJIS[i%DOG_EMOJIS.length]})); }catch(e){}
    return DOG_NAMES.map((nm,i)=>({nm, face:DOG_EMOJIS[i]||'🐶'})); })(),
  customRooms:[],                 // usado no modo "colar listas"
  pasteRaw:{},                    // texto cru de cada campo do modo paste
};

/* ---------------- fluxo / modo ---------------- */
let mode='guided';                // 'guided' | 'paste'
const GUIDED=['welcome','casa','appliances','electronics','tools','cleaning','food','pets','done'];
const PASTE =['welcome','paste','done'];
function flow(){ return mode==='paste'?PASTE:GUIDED; }

/* ---------------- definição das telas ---------------- */
const stepDefs={
  welcome:{ ic:'🚀', title:'Vamos começar do zero', hideNav:true,
    render:()=>`<p class="lead">Bora montar seu LifeOS do jeitinho da sua casa de verdade. Como você prefere começar?</p>
      <div class="modes">
        <button class="modecard" data-mode="guided"><span class="mi">📝</span><b>Passo a passo</b>
          <span class="ms">Responda perguntas rápidas — casa, eletro, ferramentas, limpeza, alimentos e a matilha. Catálogos grandes, é só tocar no que você tem.</span></button>
        <button class="modecard" data-mode="paste"><span class="mi">📋</span><b>Colar listas</b>
          <span class="ms">Já tem tudo anotado? Cole suas listas (um item por linha) e eu organizo em cômodos, inventário e despensa.</span></button>
      </div>
      <p class="lead2">Leva ~2 minutos. Dá pra ajustar tudo depois na Home e no 🗺️ Mapa.</p>` },

  casa:{ ic:'🏠', title:'Sua casa', sub:'Quantos cômodos e quais áreas você tem?',
    render:()=>`
      ${counterRow('quarto','🛏️','Quartos')}
      ${counterRow('banheiro','🚿','Banheiros')}
      <div class="toglist">
        ${toggle('cozinha','🍳','Cozinha')}${toggle('sala','🛋️','Sala')}${toggle('escritorio','💻','Escritório')}
        ${toggle('lavanderia','🧺','Lavanderia')}${toggle('quintal','🌳','Quintal')}${toggle('area_caes','🐾','Área dos cães')}
        ${toggle('garagem','🚗','Garagem')}${toggle('area_externa','🧱','Área externa')}
      </div>` },

  appliances:{ ic:'🔌', title:'Eletrodomésticos', sub:'Toque no que você tem', render:()=>chips('appliances',APPLIANCES) },
  electronics:{ ic:'🎮', title:'Eletrônicos', sub:'Toque no que você tem', render:()=>chips('electronics',ELECTRONICS) },
  tools:{ ic:'🧰', title:'Ferramentas', sub:'Toque no que existe em casa', render:()=>chips('tools',TOOLS) },
  cleaning:{ ic:'🧼', title:'Produtos de limpeza', sub:'Toque no que você tem', render:()=>chips('cleaning',CLEANING) },
  food:{ ic:'🍽️', title:'Alimentos', sub:'O que tem agora? (pode deixar vazio e adicionar depois)',
    render:()=>`<div class="fgrp"><div class="glabel">🧊 Geladeira</div>${chips('fridge',FRIDGE)}</div>
      <div class="fgrp"><div class="glabel">🥫 Despensa</div>${chips('pantry',PANTRY)}</div>` },

  paste:{ ic:'📋', title:'Colar suas listas', sub:'Cole um item por linha em cada campo. Deixe vazio o que não tiver.',
    render:()=>pasteBody() },

  pets:{ ic:'🐾', title:'A matilha', sub:'Seus cães (cada um com emoji único). Edite à vontade.',
    render:()=>petsBody() },

  done:{ ic:'✅', title:'Tudo pronto!', sub:'',
    render:()=>`<p class="lead">Perfeito! Vou montar sua base agora: cômodos com tarefas, inventário separado, matilha e o resto. 🎉</p>
      <p class="lead2" id="doneSummary"></p>` },
};

/* ---------------- widgets ---------------- */
function counterRow(key,ic,label){ return `<div class="counter"><span class="cl"><span class="ci">${ic}</span>${label}</span>
  <div class="cbtns"><button data-cnt="${key}" data-d="-1">−</button><b id="cnt-${key}">${A.rooms[key]}</b><button data-cnt="${key}" data-d="1">+</button></div></div>`; }
function toggle(key,ic,label){ return `<button class="tog ${A.rooms[key]?'on':''}" data-tog="${key}"><span class="ci">${ic}</span>${label}</button>`; }
function chips(setKey,list){ const s=A[setKey];
  const known=new Set(list.map(x=>x[1]));
  const base=list.map(([ic,nm])=>`<button class="chip ${s.has(nm)?'on':''}" data-nm="${esc(nm)}"><span class="ci">${ic}</span>${nm}</button>`);
  const extras=[...s].filter(nm=>!known.has(nm)).map(nm=>`<button class="chip on" data-nm="${esc(nm)}"><span class="ci">${iconFor(nm,list,DEFAULT_IC[setKey])}</span>${nm}</button>`);
  return `<div class="chips" data-chips="${setKey}">`+base.join('')+extras.join('')+`<button class="chip add" data-add="${setKey}">＋ outro</button></div>`; }
function pasteBody(){
  const f=(k,label,ph)=>`<div class="fgrp"><div class="glabel">${label}</div>
    <textarea class="pta" data-pta="${k}" placeholder="${ph}">${(A.pasteRaw[k]||'').replace(/</g,'&lt;')}</textarea></div>`;
  return f('rooms','🏠 Cômodos (um por linha)','Quarto\nQuarto 2\nBanheiro\nCozinha\nSala\nÁrea dos cães')
    + f('appliances','🔌 Eletrodomésticos','Geladeira\nFogão\nMicro-ondas\nAir fryer')
    + f('electronics','🎮 Eletrônicos','TV\nCelular\nNotebook')
    + f('tools','🧰 Ferramentas','Furadeira\nMartelo\nChave de fenda')
    + f('cleaning','🧼 Limpeza','Detergente\nVassoura\nDesinfetante')
    + f('fridge','🧊 Geladeira (alimentos)','Ovos\nLeite\nFrango\nQueijo')
    + f('pantry','🥫 Despensa','Arroz\nFeijão\nCafé\nMacarrão')
    + f('dogs','🐾 Cães (um nome por linha)','Nina\nHector\nSansa');
}
function petsBody(){ return `<div class="pets" id="pets">`+A.dogs.map((d,i)=>`<div class="pet"><span class="pf">${d.face}</span><input value="${esc(d.nm)}" data-pi="${i}"><button class="prm" data-prm="${i}">✕</button></div>`).join('')
  +`</div><button class="addpet" id="addpet">＋ adicionar cão</button>`; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

/* ---------------- render/nav ---------------- */
let cur=0;
const el=document.getElementById('wiz');
function render(){
  const order=flow(); const key=order[cur]; const s=stepDefs[key];
  document.getElementById('bar').style.width=Math.round(cur/(order.length-1)*100)+'%';
  document.getElementById('stepn').textContent=`${cur+1}/${order.length}`;
  const nav = s.hideNav ? '' : `<div class="wnav">
      ${cur>0?`<button class="wbtn ghost" id="back">Voltar</button>`:`<span></span>`}
      <button class="wbtn primary" id="next">${cur===order.length-1?'Entrar no LifeOS ▶':'Próximo'}</button>
    </div>`;
  el.innerHTML=`<div class="whead"><span class="wic">${s.ic}</span><div><h2>${s.title}</h2>${s.sub?`<p class="wsub">${s.sub}</p>`:''}</div></div>
    <div class="wbody">${s.render()}</div>${nav}`;
  bind();
  if(key==='done') document.getElementById('doneSummary').textContent = summaryText();
}
function bind(){
  const order=flow(); const key=order[cur];
  el.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{ mode=b.dataset.mode; cur=1; render(); });
  const back=document.getElementById('back'); if(back) back.onclick=()=>{ cur=Math.max(0,cur-1); render(); };
  const next=document.getElementById('next'); if(next) next.onclick=()=>{
    if(cur===order.length-1){ finish(); return; }
    if(key==='paste') parsePaste();
    cur++; render();
  };
  el.querySelectorAll('[data-cnt]').forEach(b=>b.onclick=()=>{ const k=b.dataset.cnt; A.rooms[k]=Math.max(0,Math.min(9,A.rooms[k]+ +b.dataset.d)); document.getElementById('cnt-'+k).textContent=A.rooms[k]; });
  el.querySelectorAll('[data-tog]').forEach(b=>b.onclick=()=>{ const k=b.dataset.tog; A.rooms[k]=!A.rooms[k]; b.classList.toggle('on',A.rooms[k]); });
  el.querySelectorAll('[data-chips] .chip:not(.add)').forEach(b=>b.onclick=()=>{ const set=A[b.closest('[data-chips]').dataset.chips]; const nm=b.dataset.nm; if(set.has(nm))set.delete(nm);else set.add(nm); b.classList.toggle('on'); });
  el.querySelectorAll('[data-add]').forEach(b=>b.onclick=async()=>{ const k=b.dataset.add;
    const items=await askItems('Adicionar item(s)','Cole aqui — um item por linha (pode ser texto grande, ex.: transcrição de voz).\nEx.:\nBatedeira\nGrill');
    if(items.length){ items.forEach(nm=>A[k].add(nm)); render(); } });
  el.querySelectorAll('[data-pta]').forEach(t=>t.oninput=()=>{ A.pasteRaw[t.dataset.pta]=t.value; });
  const pets=document.getElementById('pets');
  if(pets){ pets.querySelectorAll('input[data-pi]').forEach(inp=>inp.oninput=()=>{ A.dogs[+inp.dataset.pi].nm=inp.value; });
    pets.querySelectorAll('[data-prm]').forEach(b=>b.onclick=()=>{ A.dogs.splice(+b.dataset.prm,1); render(); });
    const ap=document.getElementById('addpet'); if(ap) ap.onclick=()=>{ A.dogs.push({nm:'Novo cão', face:DOG_EMOJIS[A.dogs.length%DOG_EMOJIS.length]}); render(); };
  }
}

/* ---------------- entrada por colagem (modal) ---------------- */
function splitItems(s){ return (s||'').split(/[\n,;]+/).map(x=>x.replace(/^[\s•\-\*\d.)]+/,'').trim()).filter(Boolean); }
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

/* ---------------- parsing do modo "colar listas" ---------------- */
function splitLines(s){ return (s||'').split(/\r?\n/).map(x=>x.replace(/^[\s•\-\*\d.)]+/,'').trim()).filter(Boolean); }
function parsePaste(){
  ['appliances','electronics','tools','cleaning','fridge','pantry'].forEach(k=>{ A[k]=new Set(splitLines(A.pasteRaw[k])); });
  A.customRooms = splitLines(A.pasteRaw.rooms).map(lbl=>({label:lbl, type:matchRoomType(lbl)}));
  const dl=splitLines(A.pasteRaw.dogs);
  A.dogs = dl.length ? dl.map((nm,i)=>({nm, face:DOG_EMOJIS[i%DOG_EMOJIS.length]})) : [];
}

/* ---------------- build & save ---------------- */
function iconFor(nm, catalog, def){ const low=String(nm).trim().toLowerCase();
  for(const [ic,n] of catalog) if(n.toLowerCase()===low) return ic;
  for(const [ic,n] of ALL_ITEMS) if(n.toLowerCase()===low) return ic;
  return def||'📦'; }
function roomDefs(){
  if(mode==='paste') return A.customRooms||[];
  const defs=[];
  for(let i=1;i<=A.rooms.quarto;i++) defs.push({label:A.rooms.quarto>1?`Quarto ${i}`:'Quarto', type:'quarto'});
  for(let i=1;i<=A.rooms.banheiro;i++) defs.push({label:A.rooms.banheiro>1?`Banheiro ${i}`:'Banheiro', type:'banheiro'});
  ['cozinha','sala','escritorio','lavanderia','quintal','area_caes','garagem','area_externa'].forEach(k=>{ if(A.rooms[k]) defs.push({label:ROOM_TYPES[k].label, type:k}); });
  return defs;
}
function buildZones(){
  const list=roomDefs().map(d=>{ const t=ROOM_TYPES[d.type]; return {name:d.label, tasks:(t?t.tasks:[]).map(x=>({t:x,done:false}))}; });
  const n=list.length; if(!n) return list;
  const cols=Math.min(4,Math.max(1,Math.ceil(Math.sqrt(n)))), rows=Math.ceil(n/cols);
  const gap=2, cw=(100-gap*(cols+1))/cols, ch=(100-gap*(rows+1))/rows;
  list.forEach((z,i)=>{ const c=i%cols, r=Math.floor(i/cols);
    z.x=+(gap+c*(cw+gap)).toFixed(2); z.y=+(gap+r*(ch+gap)).toFixed(2); z.w=+cw.toFixed(2); z.h=+ch.toFixed(2);
    z.color=PAL[i%PAL.length]; });
  return list;
}
function setToList(setKey){ const cat=CATALOG[setKey]; return [...A[setKey]].map(nm=>({ic:iconFor(nm,cat,DEFAULT_IC[setKey]), nm})); }
function summaryText(){ const n=roomDefs().length;
  return `${n} cômodos · ${A.appliances.size} eletrodomésticos · ${A.electronics.size} eletrônicos · ${A.tools.size} ferramentas · ${A.cleaning.size} limpeza · ${A.fridge.size+A.pantry.size} alimentos · ${A.dogs.length} cães.`; }
function finish(){
  try{
    localStorage.setItem('lifeos_mapa', JSON.stringify({ img:null, zones:buildZones() }));
    localStorage.setItem('lifeos_inv', JSON.stringify({
      appliances: setToList('appliances').map(x=>({...x, ok:true})),
      electronics: setToList('electronics'),
    }));
    localStorage.setItem('lifeos_tools', JSON.stringify(setToList('tools')));
    localStorage.setItem('lifeos_cleaning', JSON.stringify(setToList('cleaning')));
    localStorage.setItem('lifeos_fridge', JSON.stringify(setToList('fridge').map(x=>({...x,q:'?'}))));
    localStorage.setItem('lifeos_pantry', JSON.stringify(setToList('pantry').map(x=>({...x,q:'?'}))));
    localStorage.setItem('lifeos_dogs', JSON.stringify(A.dogs.map((d,i)=>({nm:d.nm||('Cão '+(i+1)), face:d.face||DOG_EMOJIS[i%DOG_EMOJIS.length], well:9}))));
    localStorage.setItem('lifeos_onboarded','yes');
  }catch(e){}
  location.replace('painel.html');
}
render();
