  const KEY='lifeos_saude';
  const DEF={ goals:{peso:78,cintura:88,gordura:18,core:8}, current:{peso:null,cintura:null,gordura:null,core:2},
    starts:{peso:null,cintura:null,gordura:null,core:2}, mood:3, water:0, waterGoal:8, log:[] };
  let S=Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY)||'{}'));
  S.goals=Object.assign({},DEF.goals,S.goals); S.current=Object.assign({},DEF.current,S.current);
  S.starts=Object.assign({},DEF.starts,S.starts); S.log=S.log||[];
  const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
  const MOODS=['😫','😕','😐','🙂','😄'];
  const today=()=>new Date().toISOString().slice(0,10);
  document.getElementById('dt').textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit'});

  /* humor */
  const moodsEl=document.getElementById('moods');
  moodsEl.innerHTML=MOODS.map((e,i)=>`<button data-m="${i}" class="${i===S.mood?'on':''}">${e}</button>`).join('');
  moodsEl.onclick=e=>{ const b=e.target.closest('button'); if(!b)return; S.mood=+b.dataset.m; save();
    moodsEl.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); };

  /* medidas */
  const MEAS=[ {k:'peso',nm:'Peso',u:'kg',lower:true}, {k:'cintura',nm:'Cintura',u:'cm',lower:true},
    {k:'gordura',nm:'% Gordura',u:'%',lower:true}, {k:'core',nm:'Força de core',u:'/10',lower:false} ];
  function measPct(m){ const cur=S.current[m.k], goal=S.goals[m.k], start=S.starts[m.k];
    if(cur==null||goal==null) return 0; const st=(start==null?cur:start);
    if(st===goal) return 100; return Math.max(0,Math.min(100,Math.round((st-cur)/(st-goal)*100))); }
  function renderMeas(){ document.getElementById('meas').innerHTML=MEAS.map(m=>{
    const cur=S.current[m.k], goal=S.goals[m.k];
    const val= cur!=null? `${cur}${m.u}` : '—'; const gl= goal!=null? `→ ${goal}${m.u}` : '';
    return `<div class="meas"><div class="l"><span>${m.nm}</span><b>${val} <span class="g">${gl}</span></b></div>
      <div class="track"><i data-w="${measPct(m)}%"></i></div></div>`; }).join('');
    requestAnimationFrame(()=>document.querySelectorAll('#meas [data-w]').forEach(el=>el.style.width=el.dataset.w)); }

  /* água */
  function renderWater(){ const cups=document.getElementById('cups');
    cups.innerHTML=Array.from({length:S.waterGoal},(_,i)=>`<span class="cup ${i<S.water?'on':''}">🥤</span>`).join('');
    document.getElementById('wlbl').textContent=`${S.water}/${S.waterGoal} copos`; }
  document.getElementById('wplus').onclick=()=>{ S.water=Math.min(S.waterGoal,S.water+1); save(); renderWater(); };
  document.getElementById('wminus').onclick=()=>{ S.water=Math.max(0,S.water-1); save(); renderWater(); };

  /* registrar medição */
  document.getElementById('save').onclick=()=>{
    const g=id=>{ const v=document.getElementById(id).value; return v===''?null:+v; };
    const e={ d:today(), peso:g('i_peso'), cintura:g('i_cintura'), gordura:g('i_gordura'), sono:g('i_sono'), humor:S.mood };
    // atualiza atuais (e define start na 1a vez)
    ['peso','cintura','gordura'].forEach(k=>{ if(e[k]!=null){ if(S.starts[k]==null) S.starts[k]=e[k]; S.current[k]=e[k]; } });
    // substitui entrada do mesmo dia
    S.log=S.log.filter(x=>x.d!==e.d); S.log.push(e); S.log.sort((a,b)=>a.d<b.d?-1:1);
    save(); renderMeas(); renderChart();
    document.getElementById('msg').textContent='✅ Registrado! '+new Date().toLocaleDateString('pt-BR');
    ['i_peso','i_cintura','i_gordura','i_sono'].forEach(id=>document.getElementById(id).value='');
  };

  /* gráfico de peso */
  function renderChart(){ const pts=S.log.filter(x=>x.peso!=null).map(x=>({d:x.d,v:x.peso}));
    const c=document.getElementById('chart');
    if(pts.length<2){ c.innerHTML='<div class="chartlbl">Registre pelo menos 2 medições de peso pra ver a linha de evolução. 📉</div>'; return; }
    const W=560,H=130,pad=24; const vs=pts.map(p=>p.v); let min=Math.min(...vs),max=Math.max(...vs);
    if(min===max){min-=1;max+=1;} const goal=S.goals.peso;
    const X=i=>pad+i/(pts.length-1)*(W-pad*2); const Y=v=>H-pad-(v-min)/(max-min)*(H-pad*2);
    const line=pts.map((p,i)=>`${i?'L':'M'}${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
    const area=`M${X(0)},${H-pad} `+pts.map((p,i)=>`L${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ')+` L${X(pts.length-1)},${H-pad} Z`;
    const goalY = (goal>=min&&goal<=max)? Y(goal):null;
    c.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#54d98c55"/><stop offset="1" stop-color="#54d98c00"/></linearGradient></defs>
      ${goalY!=null?`<line x1="${pad}" y1="${goalY}" x2="${W-pad}" y2="${goalY}" stroke="#ffc94d" stroke-dasharray="4 4" stroke-width="1"/>
        <text x="${W-pad}" y="${goalY-4}" fill="#ffc94d" font-size="9" text-anchor="end">meta ${goal}kg</text>`:''}
      <path d="${area}" fill="url(#g)"/>
      <path d="${line}" fill="none" stroke="#54d98c" stroke-width="2"/>
      ${pts.map((p,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="3" fill="#54d98c"/>`).join('')}
      <text x="${pad}" y="12" fill="#9fb0bd" font-size="9">${pts[0].v}kg</text>
      <text x="${W-pad}" y="12" fill="#eaf1f6" font-size="9" text-anchor="end">${pts[pts.length-1].v}kg</text>
    </svg>`;
  }

  renderMeas(); renderWater(); renderChart();
