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

  const inU=document.getElementById('u'), inP=document.getElementById('p');

  function login(){
    const u=inU.value.trim().toLowerCase(), p=inP.value;
    if(!u){ msg('Digite seu nome de usuário.'); inU.focus(); return; }
    const a=accs(), acc=a[u];
    if(!acc){ msg('Usuário não encontrado. Toque em "Criar conta".'); return; }
    if(acc.pass && acc.pass!==p){ msg('Senha incorreta.'); return; }
    localStorage.setItem(CUR,u); location.href= acc.ficha?'painel.html':'questionario.html';
  }
  function register(){
    const n=inU.value.trim(), p=inP.value;
    if(!n){ msg('Digite um nome de usuário.'); inU.focus(); return; }
    if(p.length<3){ msg('Crie uma senha (mín. 3 caracteres).'); inP.focus(); return; }
    const a=accs(), key=n.toLowerCase();
    if(a[key]){ msg('Já existe uma conta com esse nome. Toque em "Entrar".'); return; }
    a[key]={ name:n, pass:p, ficha:false }; save(a); localStorage.setItem(CUR,key); location.href='questionario.html';
  }
  document.getElementById('btnLogin').onclick=login;
  document.getElementById('btnReg').onclick=register;
  inP.addEventListener('keydown',e=>{ if(e.key==='Enter') login(); });
  inU.addEventListener('keydown',e=>{ if(e.key==='Enter') inP.focus(); });
