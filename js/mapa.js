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

  let bgLoaded=false;
  function loadBg(){ const src=S.img||'assets/casa.png';   // foto do Emerson; senão cai pro SVG oficial
    bg.onload=()=>{ bgLoaded=true; bg.style.display=''; ph.style.display='none'; renderAreas(); };
    bg.onerror=()=>{ if(!S.img){ const s=bg.getAttribute('src')||'';
        if(s.indexOf('casa.png')>=0){ bg.src='assets/casa.jpg'; return; }
        if(s.indexOf('casa.jpg')>=0){ bg.src='assets/casa.svg'; return; } }
      bgLoaded=false; bg.style.display='none'; ph.style.display=''; };
    bg.src=src; }
  document.getElementById('file').onchange=e=>{ const f=e.target.files[0]; if(!f)return;
    const r=new FileReader(); r.onload=()=>{ S.img=r.result; save(); loadBg(); }; r.readAsDataURL(f); };
  document.getElementById('phUp').onclick=()=>document.getElementById('file').click();

  // ---- desenhar área (marquee) ----
  let drag=null, marq=null, sel=-1, form=null;
  const openZones=new Set();
  function pct(e){ const r=mapbox.getBoundingClientRect();
    return { x:Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)), y:Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100)) }; }
  mapbox.addEventListener('pointerdown',e=>{
    if(form) return;
    if(e.target.closest('.area')) return;        // clicar numa área é tratado nela
    if(!bgLoaded) return;                        // precisa de um mapa carregado
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
    S.zones.forEach((z,i)=>{ const pl=z.tasks.filter(t=>!t.done); const pend=pl.length;
      const el=document.createElement('div'); el.className='area'+(i===sel?' sel':'')+(pend?' pend':' done'); el.style.borderColor=z.color;
      el.style.left=z.x+'%'; el.style.top=z.y+'%'; el.style.width=z.w+'%'; el.style.height=z.h+'%';
      el.style.background= pend? `rgba(255,180,90,${Math.min(.07+pend*0.025,.22).toFixed(3)})` : 'rgba(84,217,140,.12)';
      const items = pend? pl.slice(0,7).map(t=>`<i>${t.t}</i>`).join('')+(pend>7?`<i class="more">+${pend-7}…</i>`:'') : '<i class="ok">em ordem ✨</i>';
      el.innerHTML=`<span class="tag" style="background:${z.color}">${z.name}</span><span class="badge ${pend?'':'ok'}">${pend?'⚠ '+pend:'✓'}</span><span class="atasks">${items}</span><div class="del">✕</div>`;
      el.onclick=ev=>{ ev.stopPropagation(); selectArea(i); };
      el.querySelector('.del').onclick=ev=>{ ev.stopPropagation(); S.zones.splice(i,1); sel=-1; save(); renderAreas(); renderZones(); };
      mapbox.appendChild(el); }); }

  function renderZones(){ if(!S.zones.length){ zonesEl.innerHTML='<div class="hint">Nenhuma área ainda.</div>'; return; }
    zonesEl.innerHTML='';
    S.zones.forEach((z,zi)=>{ const el=document.createElement('div'); el.className='zone'+(openZones.has(zi)?' open':'');
      const have=z.tasks.map(t=>t.t.toLowerCase());
      const sug=suggFor(z.name).filter(s=>!have.includes(s.toLowerCase()));
      const pend=z.tasks.filter(t=>!t.done).length;
      el.innerHTML=`<div class="zh"><span class="dot" style="background:${z.color}"></span><span class="nm">${z.name}</span>
        <span class="cnt ${pend?'pend':'ok'}">${pend?'⚠ '+pend:'✓'}</span>
        <span class="ren" title="renomear cômodo">✎</span><span class="x" title="excluir área">✕</span><span class="cx">▸</span></div>
        <div class="zbody"><div class="tks"></div>
        <div class="addt"><textarea rows="1" placeholder="+ nova tarefa (pode colar várias, uma por linha)"></textarea><button>+</button></div>
        ${sug.length?`<div class="suggwrap"><div class="suggh">💡 sugestões (toque pra adicionar):</div><div class="sugg">${sug.map(s=>`<span class="chip" data-s="${s.replace(/"/g,'&quot;')}">+ ${s}</span>`).join('')}</div></div>`:''}</div>`;
      const tks=el.querySelector('.tks');
      z.tasks.forEach((t)=>{ const d=document.createElement('div'); d.className='zt '+(t.done?'done':'');
        d.innerHTML=`<div class="box">${t.done?'✔':''}</div><span>${t.t}</span>`;
        d.onclick=()=>{ t.done=!t.done; save(); renderZones(); renderAreas(); }; tks.appendChild(d); });
      el.querySelector('.zh').onclick=(e)=>{ if(e.target.closest('.ren')||e.target.closest('.x')) return;
        if(openZones.has(zi)) openZones.delete(zi); else openZones.add(zi); el.classList.toggle('open'); };
      el.querySelector('.ren').onclick=()=>{ const nv=prompt('Novo nome do cômodo:', z.name); if(nv==null) return; const t=nv.trim(); if(!t) return; z.name=t; save(); renderZones(); renderAreas(); };
      el.querySelector('.x').onclick=()=>{ openZones.delete(zi); S.zones.splice(zi,1); sel=-1; save(); renderZones(); renderAreas(); };
      const inp=el.querySelector('.addt textarea'), addb=el.querySelector('.addt button');
      const add=()=>{ const items=inp.value.split(/[\n,;]+/).map(s=>s.replace(/^[\s•\-\*\d.)]+/,'').trim()).filter(Boolean);
        if(!items.length)return; items.forEach(t=>z.tasks.push({t,done:false})); inp.value=''; openZones.add(zi); save(); renderZones(); renderAreas(); };
      addb.onclick=add;
      // Enter envia; Shift+Enter quebra linha (pra colar várias de uma vez)
      inp.onkeydown=e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); add(); } };
      el.querySelectorAll('.sugg .chip').forEach(c=>c.onclick=()=>{ z.tasks.push({t:c.dataset.s,done:false}); openZones.add(zi); save(); renderZones(); renderAreas(); });
      zonesEl.appendChild(el); }); }

  document.getElementById('clear').onclick=()=>{ if(confirm('Apagar todas as áreas? (o mapa continua)')){ S.zones=[]; sel=-1; save(); renderAreas(); renderZones(); } };

  // ---- exportar / importar (pra levar o mapa+zonas pro repositório) ----
  function download(name, blob){ const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1500); }
  function dataURLtoBlob(d){ const parts=d.split(','); const mime=(parts[0].match(/:(.*?);/)||[])[1]||'image/png'; const bin=atob(parts[1]); const u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return new Blob([u],{type:mime}); }
  document.getElementById('exp').onclick=()=>{
    download('casa-zones.json', new Blob([JSON.stringify({zones:S.zones},null,2)],{type:'application/json'}));
    if(S.img){ const ext=((S.img.match(/^data:image\/(\w+)/)||[])[1]||'png').toLowerCase(); download('casa.'+(ext==='jpeg'?'jpg':ext), dataURLtoBlob(S.img)); }
    else alert('Você ainda não subiu uma imagem sua (está usando o mapa padrão). Suba o seu mapa antes, se quiser exportar o casa.png.');
  };
  document.getElementById('imp').onchange=e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader();
    r.onload=()=>{ try{ const j=JSON.parse(r.result); if(Array.isArray(j.zones)){ S.zones=j.zones; if(j.img) S.img=j.img; openZones.clear(); save(); loadBg(); renderAreas(); renderZones(); alert('Backup importado ✔'); } else alert('Arquivo sem "zones".'); }catch(err){ alert('JSON inválido.'); } };
    r.readAsText(f); e.target.value=''; };
  bg.onload=renderAreas;
  // sem áreas locais? carrega as zonas oficiais do repo (planta padrão)
  async function ensureZones(){ if(S.zones.length) return;
    try{ const r=await fetch('assets/casa-zones.json',{cache:'no-store'}); if(r.ok){ const j=await r.json();
      if(j&&Array.isArray(j.zones)&&j.zones.length){ S.zones=j.zones; save(); } } }catch(e){} }
  (async()=>{ await ensureZones(); loadBg(); renderAreas(); renderZones(); })();
