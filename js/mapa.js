  const KEY='lifeos_mapa';
  let S=JSON.parse(localStorage.getItem(KEY)||'null'); if(!S||!Array.isArray(S.zones)) S={img:null,zones:[]};
  S.zones=S.zones||[];
  const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
  const PAL=['#ffc94d','#54d98c','#5bb8ff','#ff6b6b','#b98cff','#ff9f5b','#7ee0d0','#ff8fd0'];
  // sugestões detalhadas de tarefas por tipo de cômodo (por palavra-chave no nome)
  const SUGG=[
    {kw:['canil','cão','cao','cachorr','pet','matilha'], list:['Recolher fezes','Trocar a água dos bebedouros','Encher os potes de ração','Lavar os bebedouros/comedouros','Varrer o chão','Passar pano com desinfetante','Trocar a forração/caminha','Verificar pulgas e carrapatos','Checar se todos estão bem']},
    {kw:['cozinha'], list:['Lavar a louça','Limpar o fogão','Limpar a bancada','Tirar o lixo','Varrer e passar pano','Guardar comida/organizar geladeira','Preparar marmita/refeição','Checar validade dos alimentos']},
    {kw:['quarto','dormir','cama'], list:['Arrumar a cama','Recolher roupas do chão','Trocar os lençóis','Varrer/aspirar','Organizar a mesa de cabeceira','Guardar roupas limpas']},
    {kw:['banheir','lavabo','wc'], list:['Limpar o vaso','Limpar a pia','Passar pano no chão','Limpar o box/chuveiro','Repor papel higiênico','Trocar a toalha','Recolher lixo']},
    {kw:['sala','estar','tv','living'], list:['Organizar objetos','Passar pano nos móveis','Aspirar o sofá','Varrer o chão','Organizar fios/controles','Regar plantas']},
    {kw:['jardim','quintal','extern','área','patio','pátio','horta','gramad'], list:['Recolher fezes dos cães','Aparar o mato/grama','Varrer folhas','Regar as plantas','Recolher entulho/lixo','Verificar cercas e portões','Organizar ferramentas','Limpar ralos/escoamento']},
    {kw:['lavand','serviç','servic','tanque'], list:['Lavar roupa','Estender/recolher','Dobrar e guardar','Limpar o tanque','Varrer o chão']},
    {kw:['escritóri','escritori','office','trabalho'], list:['Organizar a mesa','Fazer backup dos arquivos','Limpar o computador','Organizar cabos','Anotar pendências']},
    {kw:['garagem','carro'], list:['Varrer','Organizar ferramentas','Recolher lixo','Verificar o carro']},
  ];
  const DEF_SUGG=['Organizar','Limpar o chão','Tirar o lixo','Ver o que está faltando'];
  function suggFor(name){ const n=(name||'').toLowerCase();
    for(const s of SUGG){ if(s.kw.some(k=>n.includes(k))) return s.list; } return DEF_SUGG; }
  const mapbox=document.getElementById('mapbox'), bg=document.getElementById('bg'), ph=document.getElementById('ph'), zonesEl=document.getElementById('zones');

  function loadBg(){ if(S.img){ bg.src=S.img; bg.style.display=''; ph.style.display='none'; } else { bg.style.display='none'; ph.style.display=''; } }
  document.getElementById('file').onchange=e=>{ const f=e.target.files[0]; if(!f)return;
    const r=new FileReader(); r.onload=()=>{ S.img=r.result; save(); loadBg(); }; r.readAsDataURL(f); };
  document.getElementById('phUp').onclick=()=>document.getElementById('file').click();

  // ---- desenhar área (marquee) ----
  let drag=null, marq=null, sel=-1, form=null;
  function pct(e){ const r=mapbox.getBoundingClientRect();
    return { x:Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)), y:Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100)) }; }
  mapbox.addEventListener('pointerdown',e=>{
    if(form) return;
    if(e.target.closest('.area')) return;        // clicar numa área é tratado nela
    if(!S.img) return;                           // precisa de mapa
    e.preventDefault(); selectArea(-1);
    const p=pct(e); drag={x0:p.x,y0:p.y,x1:p.x,y1:p.y}; mapbox.setPointerCapture(e.pointerId);
    marq=document.createElement('div'); marq.className='marquee'; mapbox.appendChild(marq); updMarq();
  });
  mapbox.addEventListener('pointermove',e=>{ if(!drag)return; const p=pct(e); drag.x1=p.x; drag.y1=p.y; updMarq(); });
  mapbox.addEventListener('pointerup',e=>{ if(!drag)return; const d=drag; drag=null; if(marq){ marq.remove(); marq=null; }
    const R=rectOf(d); if(R.w<3||R.h<3) return; openForm(R,e); });
  function rectOf(d){ return { x:Math.min(d.x0,d.x1), y:Math.min(d.y0,d.y1), w:Math.abs(d.x1-d.x0), h:Math.abs(d.y1-d.y0) }; }
  function updMarq(){ if(!marq)return; const R=rectOf(drag); marq.style.left=R.x+'%'; marq.style.top=R.y+'%'; marq.style.width=R.w+'%'; marq.style.height=R.h+'%'; }

  function openForm(R,e){
    if(form) form.remove();
    const d=document.createElement('div'); d.className='areaform';
    d.style.left=Math.min(window.innerWidth-270, e.clientX)+'px'; d.style.top=Math.min(window.innerHeight-230, e.clientY)+'px';
    d.innerHTML=`<input id="an" placeholder="nome da área (ex: Canil)">
      <textarea id="at" placeholder="tarefas típicas (uma por linha):&#10;varrer&#10;trocar água&#10;recolher fezes"></textarea>
      <div class="r"><button class="no" id="c">cancelar</button><button class="ok" id="k">criar área</button></div>`;
    document.body.appendChild(d); form=d; d.querySelector('#an').focus();
    d.querySelector('#c').onclick=()=>{ d.remove(); form=null; };
    d.querySelector('#k').onclick=()=>{ const nm=d.querySelector('#an').value.trim()||'Área';
      const tasks=d.querySelector('#at').value.split('\n').map(s=>s.trim()).filter(Boolean).map(t=>({t,done:false}));
      S.zones.push({ ...R, name:nm, color:PAL[S.zones.length%PAL.length], tasks }); save(); d.remove(); form=null; renderAreas(); renderZones(); };
  }

  function selectArea(i){ sel=i; mapbox.querySelectorAll('.area').forEach((el,idx)=>el.classList.toggle('sel',idx===i)); }
  function renderAreas(){ mapbox.querySelectorAll('.area').forEach(a=>a.remove());
    S.zones.forEach((z,i)=>{ const pend=z.tasks.filter(t=>!t.done).length;
      const el=document.createElement('div'); el.className='area'+(i===sel?' sel':''); el.style.borderColor=z.color;
      el.style.left=z.x+'%'; el.style.top=z.y+'%'; el.style.width=z.w+'%'; el.style.height=z.h+'%'; el.style.background=z.color+'22';
      el.innerHTML=`<span class="tag" style="background:${z.color}">${z.name}</span>${pend?`<span class="badge">👾 ${pend}</span>`:''}<div class="del">✕</div>`;
      el.onclick=ev=>{ ev.stopPropagation(); selectArea(i); };
      el.querySelector('.del').onclick=ev=>{ ev.stopPropagation(); S.zones.splice(i,1); sel=-1; save(); renderAreas(); renderZones(); };
      mapbox.appendChild(el); }); }

  function renderZones(){ if(!S.zones.length){ zonesEl.innerHTML='<div class="hint">Nenhuma área ainda.</div>'; return; }
    zonesEl.innerHTML='';
    S.zones.forEach((z,zi)=>{ const el=document.createElement('div'); el.className='zone';
      const have=z.tasks.map(t=>t.t.toLowerCase());
      const sug=suggFor(z.name).filter(s=>!have.includes(s.toLowerCase()));
      el.innerHTML=`<div class="zh"><span class="dot" style="background:${z.color}"></span><span class="nm">${z.name}</span><span class="x" title="excluir área">✕</span></div><div class="tks"></div>
        <div class="addt"><input placeholder="+ nova tarefa"><button>+</button></div>
        ${sug.length?`<div class="suggwrap"><div class="suggh">💡 sugestões (toque pra adicionar):</div><div class="sugg">${sug.map(s=>`<span class="chip" data-s="${s.replace(/"/g,'&quot;')}">+ ${s}</span>`).join('')}</div></div>`:''}`;
      const tks=el.querySelector('.tks');
      z.tasks.forEach((t)=>{ const d=document.createElement('div'); d.className='zt '+(t.done?'done':'');
        d.innerHTML=`<div class="box">${t.done?'✔':''}</div><span>${t.t}</span>`;
        d.onclick=()=>{ t.done=!t.done; save(); renderZones(); renderAreas(); }; tks.appendChild(d); });
      el.querySelector('.x').onclick=()=>{ S.zones.splice(zi,1); sel=-1; save(); renderZones(); renderAreas(); };
      const inp=el.querySelector('.addt input'), addb=el.querySelector('.addt button');
      const add=()=>{ const v=inp.value.trim(); if(!v)return; z.tasks.push({t:v,done:false}); inp.value=''; save(); renderZones(); renderAreas(); };
      addb.onclick=add; inp.onkeydown=e=>{ if(e.key==='Enter')add(); };
      el.querySelectorAll('.sugg .chip').forEach(c=>c.onclick=()=>{ z.tasks.push({t:c.dataset.s,done:false}); save(); renderZones(); renderAreas(); });
      zonesEl.appendChild(el); }); }

  document.getElementById('clear').onclick=()=>{ if(confirm('Apagar todas as áreas? (o mapa continua)')){ S.zones=[]; sel=-1; save(); renderAreas(); renderZones(); } };
  bg.onload=renderAreas;
  loadBg(); renderAreas(); renderZones();
