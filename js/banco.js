  const KEY='lifeos_banco';
  let S=JSON.parse(localStorage.getItem(KEY)||'{"tx":[]}');
  let type='out';
  const CATS={ out:[['🛒','Mercado'],['🐾','Cães'],['🏠','Casa'],['🧾','Contas'],['🎮','Lazer'],['🚗','Transporte'],['💊','Saúde'],['📦','Outros']],
               in:[['💼','Salário'],['💻','Freela'],['🎁','Presente'],['📦','Outros']] };
  const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
  const brl=v=>'R$ '+(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const catIcon=(t,name)=>{ const f=(CATS[t]||[]).find(c=>c[1]===name); return f?f[0]:'📦'; };

  const bOut=document.getElementById('bOut'), bIn=document.getElementById('bIn'), catSel=document.getElementById('cat');
  function fillCats(){ catSel.innerHTML=CATS[type].map(c=>`<option value="${c[1]}">${c[0]} ${c[1]}</option>`).join(''); }
  function setType(t){ type=t; bOut.className=t==='out'?'on-out':''; bIn.className=t==='in'?'on-in':''; fillCats(); }
  bOut.onclick=()=>setType('out'); bIn.onclick=()=>setType('in');

  document.getElementById('add').onclick=()=>{
    const desc=document.getElementById('desc').value.trim(); const val=parseFloat(document.getElementById('val').value);
    if(!desc||!val||val<=0){ return; }
    S.tx.unshift({ id:Date.now(), d:new Date().toISOString(), desc, val:Math.abs(val), type, cat:catSel.value });
    save(); document.getElementById('desc').value=''; document.getElementById('val').value=''; render();
  };
  document.getElementById('val').addEventListener('keydown',e=>{ if(e.key==='Enter') document.getElementById('add').click(); });

  function render(){
    let inSum=0,outSum=0;
    S.tx.forEach(t=> t.type==='in'? inSum+=t.val : outSum+=t.val);
    document.getElementById('saldo').textContent=brl(inSum-outSum);
    document.getElementById('saldo').style.color=(inSum-outSum)<0?'var(--out)':'var(--gold)';
    document.getElementById('pin').textContent='▲ entradas '+brl(inSum);
    document.getElementById('pout').textContent='▼ saídas '+brl(outSum);
    const list=document.getElementById('list');
    if(!S.tx.length){ list.innerHTML='<div class="empty">Nenhum movimento ainda. Lance seu primeiro gasto ou entrada.</div>'; return; }
    list.innerHTML=S.tx.map(t=>{ const dt=new Date(t.d).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'});
      return `<div class="tx"><div class="ic">${catIcon(t.type,t.cat)}</div>
        <div class="info"><div class="d">${t.desc}</div><div class="m">${t.cat} · ${dt}</div></div>
        <div class="v ${t.type}">${t.type==='in'?'+':'−'}${brl(t.val)}</div>
        <div class="x" data-id="${t.id}">✕</div></div>`; }).join('');
    list.querySelectorAll('.x').forEach(x=>x.onclick=()=>{ S.tx=S.tx.filter(t=>t.id!=x.dataset.id); save(); render(); });
  }
  setType('out'); render();
