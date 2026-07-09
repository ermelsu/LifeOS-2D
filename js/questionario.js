/* dados do questionário: b=bloco, q=[id, texto, tipo] ; tipo: 'scale' | 'text' | 'area' */
const BLOCKS=[
 {t:'🧝 Identidade', s:'Quem é o herói desta história.', q:[
   [1,'Como quer ser chamado no jogo?','text'],
   [2,'Idade (ou faixa etária)?','text'],
   [3,'Em uma frase: quem é você hoje?','area'],
   [4,'Que classe combina com você? (Guerreiro, Mago/Estudioso, Artista, Explorador, Curandeiro, Empreendedor, Bardo… ou invente)','text'],
   [5,'Qual o capítulo atual da sua vida? (recomeço, construção, transição, caos, estabilidade…)','text'],
   [6,'Onde você vive e com quem?','text'],
 ]},
 {t:'💪 Corpo (Vitalidade)', s:'Saúde física, sono, energia.', q:[
   [7,'Saúde física hoje','scale'],
   [8,'Sono (horas e qualidade)?','text'],
   [9,'Exercício: com que frequência?','text'],
   [10,'Alimentação: como descreveria?','text'],
   [11,'Energia num dia comum','scale'],
   [12,'Alguma dor/condição de saúde relevante?','text'],
 ]},
 {t:'🧠 Mente (Clareza)', s:'Saúde mental, foco, humor.', q:[
   [13,'Saúde mental/emocional hoje','scale'],
   [14,'Estresse/ansiedade (0 = calmo, 10 = no talo)','scale'],
   [15,'Como está seu foco/concentração?','text'],
   [16,'Humor predominante nas últimas semanas?','text'],
   [17,'Autoestima/autoconfiança','scale'],
   [18,'O que mais pesa na sua cabeça ultimamente?','area'],
 ]},
 {t:'💰 Recursos (Ouro)', s:'Finanças e estabilidade.', q:[
   [19,'Situação financeira hoje','scale'],
   [20,'Tem renda estável? De quê?','text'],
   [21,'Está com dívidas ou aperto?','text'],
   [22,'Consegue poupar/investir?','text'],
   [23,'Um objetivo financeiro concreto?','text'],
 ]},
 {t:'⚒️ Ofício (Trabalho/Estudos)', s:'Carreira e propósito profissional.', q:[
   [24,'Satisfação com trabalho/estudos','scale'],
   [25,'O que você faz hoje (trabalho/estudo)?','text'],
   [26,'Sente que está no caminho certo? Por quê?','area'],
   [27,'Produtividade num dia típico','scale'],
   [28,'Sonho profissional / próxima conquista?','text'],
 ]},
 {t:'❤️ Vínculos (Relações)', s:'Família, amigos, amor.', q:[
   [29,'Vida social / relacionamentos','scale'],
   [30,'Família: como está essa relação?','text'],
   [31,'Amizades: tem uma rede próxima?','text'],
   [32,'Vida amorosa hoje?','text'],
   [33,'Se sente mais sozinho ou acompanhado?','text'],
   [34,'Quem é um aliado que te apoia?','text'],
 ]},
 {t:'📚 Sabedoria (Conhecimento)', s:'Aprendizado e crescimento.', q:[
   [35,'Quanto está aprendendo/crescendo','scale'],
   [36,'Está estudando/desenvolvendo alguma habilidade?','text'],
   [37,'Hobbies que te fazem crescer?','text'],
   [38,'Uma skill que quer destravar?','text'],
 ]},
 {t:'🔥 Espírito (Propósito & Lazer)', s:'Sentido, valores, alegria.', q:[
   [39,'Sentido/propósito na vida','scale'],
   [40,'O que te dá alegria de verdade?','area'],
   [41,'Tempo pra lazer/diversão','scale'],
   [42,'Tem fé, espiritualidade ou valores que te guiam?','text'],
   [43,'Se a vida fosse um jogo, qual seu objetivo final (a grande missão)?','area'],
 ]},
 {t:'⏳ Disciplina (Tempo & Hábitos)', s:'Rotina e hábitos.', q:[
   [44,'Organização/rotina','scale'],
   [45,'Um hábito bom que te fortalece (buff ✨)?','text'],
   [46,'Um hábito ruim que te atrapalha (debuff ☠️)?','text'],
   [47,'Como é um dia normal seu, resumido?','area'],
 ]},
 {t:'🗺️ Missões (Metas)', s:'Onde você quer chegar.', q:[
   [48,'1 meta pra ESTA semana','text'],
   [49,'1 meta pros próximos 3 meses','text'],
   [50,'1 meta grande pro próximo 1–2 anos','text'],
   [51,'Qual meta, se realizada, mudaria tudo?','area'],
 ]},
 {t:'🐉 Chefões (Desafios)', s:'O que está no seu caminho.', q:[
   [52,'Seu maior chefão atual (o maior obstáculo)?','area'],
   [53,'O que sempre te faz recuar/procrastinar?','text'],
   [54,'Um medo que te trava?','text'],
 ]},
 {t:'🎒 Inventário & Aliados', s:'O que você já tem a favor.', q:[
   [55,'Recursos a seu favor (habilidades, apoio, tempo, grana, ferramentas)?','area'],
   [56,'Aliados e mentores?','text'],
 ]},
 {t:'🎛️ Preferências do Jogo', s:'Como você quer jogar.', q:[
   [57,'Tom do jogo: motivador e leve, ou durão/realista?','text'],
   [58,'Qual atributo evoluir primeiro?','text'],
   [59,'Missões diárias curtas ou desafios semanais maiores?','text'],
   [60,'Algo que eu (o Mestre) preciso saber pra deixar o jogo do seu jeito?','area'],
 ]},
];

const KEY='lifeos_rpg_answers';
const form=document.getElementById('form');
const saved=JSON.parse(localStorage.getItem(KEY)||'{}');
const Q={}; // id -> {text, type}

BLOCKS.forEach(b=>{
  const sec=document.createElement('section'); sec.className='block';
  sec.innerHTML='<h2>'+b.t+'</h2><div class="sub">'+b.s+'</div>';
  b.q.forEach(([id,text,type])=>{
    Q[id]={text,type};
    const d=document.createElement('div'); d.className='q';
    const lbl='<label><b>'+id+'.</b>'+text+'</label>';
    let field='';
    const v=saved[id]||'';
    if(type==='scale'){
      const val=v===''?5:v;
      field='<div class="scale"><span class="muted">0</span>'+
        '<input type="range" min="0" max="10" step="1" data-id="'+id+'" value="'+val+'">'+
        '<span class="muted">10</span><span class="val" id="val'+id+'">'+val+'</span></div>';
    } else if(type==='area'){
      field='<textarea data-id="'+id+'">'+escapeHtml(v)+'</textarea>';
    } else {
      field='<input type="text" data-id="'+id+'" value="'+escapeAttr(v)+'">';
    }
    d.innerHTML=lbl+field;
    sec.appendChild(d);
  });
  form.appendChild(sec);
});

function escapeHtml(s){ return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
function escapeAttr(s){ return String(s).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

let saveTimer=0;
form.addEventListener('input',e=>{
  const id=e.target.dataset.id; if(!id) return;
  if(e.target.type==='range'){ document.getElementById('val'+id).textContent=e.target.value; }
  saved[id]=e.target.value;
  clearTimeout(saveTimer); saveTimer=setTimeout(()=>localStorage.setItem(KEY,JSON.stringify(saved)),250);
  document.getElementById('saveMsg').textContent='salvo automaticamente';
});

function buildText(){
  let out='📜 FICHA — LifeOS RPG\n\n';
  BLOCKS.forEach(b=>{
    out+='== '+b.t+' ==\n';
    b.q.forEach(([id,text,type])=>{
      let v=saved[id];
      if(type==='scale'){ v=(v===undefined||v==='')?'—':(v+'/10'); }
      else { v=(v===undefined||v==='')?'—':v; }
      out+=id+'. '+text+'\n   → '+v+'\n';
    });
    out+='\n';
  });
  return out.trim();
}
async function copyOut(text){ try{ await navigator.clipboard.writeText(text); return true; }catch(e){ return false; } }

const dlg=document.getElementById('dlg'), outEl=document.getElementById('out');
document.getElementById('btnCopy').onclick=async()=>{
  const t=buildText(); outEl.value=t; dlg.showModal();
  const ok=await copyOut(t);
  document.getElementById('saveMsg').textContent = ok?'copiado! ✅':'selecione e copie manualmente';
};
document.getElementById('btnCopy2').onclick=async()=>{ const ok=await copyOut(outEl.value); if(!ok){ outEl.focus(); outEl.select(); } };
document.getElementById('btnClose').onclick=()=>dlg.close();
document.getElementById('btnPrint').onclick=()=>window.print();
document.getElementById('btnClear').onclick=()=>{ if(confirm('Apagar todas as respostas?')){ localStorage.removeItem(KEY); location.reload(); } };
