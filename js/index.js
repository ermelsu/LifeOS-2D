  // patinhas flutuando
  const bg=document.querySelector('.bg');
  for(let i=0;i<8;i++){ const s=document.createElement('div'); s.className='drift'; s.textContent='🐾';
    s.style.left=(6+i*12)+'%'; s.style.animationDuration=(16+Math.random()*14)+'s'; s.style.animationDelay=(-Math.random()*20)+'s';
    s.style.fontSize=(18+Math.random()*18)+'px'; bg.appendChild(s); }

  const ACC='lifeos_accounts', CUR='lifeos_user';
  const accs=()=>JSON.parse(localStorage.getItem(ACC)||'{}');
  const save=a=>localStorage.setItem(ACC,JSON.stringify(a));
  (function seed(){ const a=accs(); a['emerson']={name:'Emerson',pass:'12345',ficha:true}; save(a); })();
  const msg=t=>document.getElementById('msg').textContent=t;

  const tL=document.getElementById('tabLogin'), tR=document.getElementById('tabReg');
  const fL=document.getElementById('formLogin'), fR=document.getElementById('formReg');
  tL.onclick=()=>{ tL.classList.add('on'); tR.classList.remove('on'); fL.style.display=''; fR.style.display='none'; msg(''); };
  tR.onclick=()=>{ tR.classList.add('on'); tL.classList.remove('on'); fR.style.display=''; fL.style.display='none'; msg(''); };

  document.getElementById('btnLogin').onclick=()=>{
    const u=document.getElementById('lu').value.trim().toLowerCase(), p=document.getElementById('lp').value;
    if(!u){ msg('Digite seu nome de usuário.'); return; }
    const a=accs(), acc=a[u];
    if(!acc){ msg('Usuário não encontrado. Crie uma conta.'); return; }
    if(acc.pass && acc.pass!==p){ msg('Senha incorreta.'); return; }
    localStorage.setItem(CUR,u); location.href= acc.ficha?'painel.html':'questionario.html';
  };
  document.getElementById('btnReg').onclick=()=>{
    const n=document.getElementById('rn').value.trim(), p=document.getElementById('rp').value;
    if(!n){ msg('Digite seu nome.'); return; } if(p.length<3){ msg('Senha muito curta.'); return; }
    const a=accs(), key=n.toLowerCase();
    if(a[key]){ msg('Já existe uma conta com esse nome.'); return; }
    a[key]={ name:n, pass:p, ficha:false }; save(a); localStorage.setItem(CUR,key); location.href='questionario.html';
  };
