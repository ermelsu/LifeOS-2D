(function(){
  var STORAGE_KEY = 'livro-caixa:data';

  // === Camada de armazenamento (portável) ===================================
  // Dentro do Claude usa window.storage; no seu app cai para localStorage.
  // Tem backend próprio? Troque get/set por chamadas à sua API (mesma chave e
  // mesmo formato JSON: { transactions: [...], bills: [...] }).
  var Store = {
    get: function(key){
      if (window.storage && typeof window.storage.get === 'function') {
        return window.storage.get(key);
      }
      try {
        var raw = localStorage.getItem(key);
        return Promise.resolve(raw ? { key: key, value: raw } : null);
      } catch (e) { return Promise.resolve(null); }
    },
    set: function(key, value){
      if (window.storage && typeof window.storage.set === 'function') {
        return window.storage.set(key, value);
      }
      try {
        localStorage.setItem(key, value);
        return Promise.resolve({ key: key, value: value });
      } catch (e) { return Promise.reject(e); }
    }
  };
  // ===========================================================================

  var CATEGORIES = {
    entrada: [
      {name:'Salário', color:'#1FA97A'},
      {name:'Ajuda família', color:'#37C08A'},
      {name:'Ajuste', color:'#9AA1B3'},
      {name:'Outros', color:'#6FBF73'}
    ],
    saida: [
      {name:'Alimentação', color:'#F2A93B'},
      {name:'Mercado', color:'#6FBF73'},
      {name:'Moradia', color:'#3B82C4'},
      {name:'Pets', color:'#A8763E'},
      {name:'Transporte', color:'#8B7CD8'},
      {name:'Cartão', color:'#E0575B'},
      {name:'Telefonia', color:'#2FB6A6'},
      {name:'Transferência', color:'#9AA1B3'},
      {name:'Presente', color:'#E88BA0'},
      {name:'Lazer', color:'#F2C94C'},
      {name:'Seguro', color:'#4F9E8A'},
      {name:'Saúde', color:'#5B7FDB'},
      {name:'Outros', color:'#B0B4BE'}
    ]
  };

  function seedTransactions(){
    return [
      {id:1, date:'2026-06-30', type:'entrada', category:'Ajuste', desc:'Saldo trazido do controle anterior', value:1063.21, linkedBillId:null},
      {id:2, date:'2026-06-30', type:'entrada', category:'Ajuda família', desc:'Ex-sogra', value:1200.00, linkedBillId:null},
      {id:3, date:'2026-06-30', type:'entrada', category:'Ajuda família', desc:'Ex-sogro', value:1621.00, linkedBillId:null},
      {id:4, date:'2026-06-30', type:'saida', category:'Presente', desc:'Bolo (esposa do Iron)', value:40.00, linkedBillId:null},
      {id:5, date:'2026-06-30', type:'saida', category:'Alimentação', desc:'Calangos - hambúrguer', value:56.67, linkedBillId:null},
      {id:6, date:'2026-07-01', type:'saida', category:'Alimentação', desc:'Almoço', value:23.50, linkedBillId:null},
      {id:7, date:'2026-07-01', type:'saida', category:'Transferência', desc:'Pix para Cleice', value:50.00, linkedBillId:null},
      {id:8, date:'2026-07-01', type:'saida', category:'Alimentação', desc:'Calangos - lanche', value:65.83, linkedBillId:null},
      {id:9, date:'2026-07-02', type:'saida', category:'Alimentação', desc:'Padaria', value:30.50, linkedBillId:null},
      {id:10, date:'2026-07-02', type:'saida', category:'Mercado', desc:'Mercadinho Predileto', value:27.00, linkedBillId:null},
      {id:11, date:'2026-07-02', type:'saida', category:'Mercado', desc:'Mercadinho Predileto', value:9.00, linkedBillId:null},
      {id:12, date:'2026-07-02', type:'saida', category:'Mercado', desc:'Feira da semana', value:553.85, linkedBillId:null},
      {id:13, date:'2026-07-03', type:'saida', category:'Pets', desc:'Pix irmão - ração', value:1000.00, linkedBillId:null},
      {id:14, date:'2026-07-03', type:'saida', category:'Alimentação', desc:'Shopping do Bolo', value:47.50, linkedBillId:null},
      {id:15, date:'2026-07-04', type:'saida', category:'Lazer', desc:'Posto (cerveja)', value:17.00, linkedBillId:null},
      {id:16, date:'2026-07-04', type:'saida', category:'Alimentação', desc:"João's - hambúrguer/pizza", value:33.00, linkedBillId:null},
      {id:17, date:'2026-07-04', type:'saida', category:'Alimentação', desc:'Restaurante com amigo', value:133.06, linkedBillId:null},
      {id:18, date:'2026-07-04', type:'saida', category:'Transporte', desc:'Gasolina', value:100.00, linkedBillId:null},
      {id:19, date:'2026-07-04', type:'saida', category:'Alimentação', desc:'Refrigerante (almoço da mãe)', value:17.78, linkedBillId:null},
      {id:20, date:'2026-07-04', type:'saida', category:'Transporte', desc:'Gasolina', value:50.00, linkedBillId:null},
      {id:21, date:'2026-07-04', type:'saida', category:'Outros', desc:'Nordeste Empreendimento (a confirmar)', value:50.00, linkedBillId:null},
      {id:22, date:'2026-07-05', type:'saida', category:'Outros', desc:'Diversos', value:100.00, linkedBillId:null},
      {id:23, date:'2026-07-05', type:'saida', category:'Seguro', desc:'Seguro de vida', value:18.50, linkedBillId:6},
      {id:24, date:'2026-07-06', type:'entrada', category:'Salário', desc:'Salário CLT', value:3800.00, linkedBillId:null},
      {id:25, date:'2026-07-06', type:'saida', category:'Moradia', desc:'Aluguel', value:1300.00, linkedBillId:1},
      {id:26, date:'2026-07-06', type:'saida', category:'Cartão', desc:'Fatura Nubank', value:2633.57, linkedBillId:null},
      {id:27, date:'2026-07-06', type:'saida', category:'Transferência', desc:'João Pedro', value:310.00, linkedBillId:null},
      {id:28, date:'2026-07-06', type:'saida', category:'Moradia', desc:'Energia (Enel)', value:422.28, linkedBillId:2},
      {id:29, date:'2026-07-06', type:'saida', category:'Moradia', desc:'Água (Cagece)', value:114.44, linkedBillId:3},
      {id:30, date:'2026-07-06', type:'saida', category:'Telefonia', desc:'Vivo', value:80.57, linkedBillId:5}
    ];
  }
  function seedBills(){
    return [
      {id:1, name:'Aluguel', category:'Moradia', expectedValue:1300.00},
      {id:2, name:'Energia', category:'Moradia', expectedValue:422.28},
      {id:3, name:'Água', category:'Moradia', expectedValue:114.44},
      {id:4, name:'Internet', category:'Telefonia', expectedValue:124.00},
      {id:5, name:'Vivo (celular)', category:'Telefonia', expectedValue:80.57},
      {id:6, name:'Seguro de vida', category:'Seguro', expectedValue:18.50}
    ];
  }

  var state = {
    transactions: [], bills: [], activeTab: 'lancamentos',
    selectedMonth: new Date().toISOString().slice(0,7),
    panelMode: null, formType: 'saida', editingId: null,
    markPaidBillId: null, markPaidTxId: null, editingBillId: null,
    loading: true
  };

  function nextId(){ var m=0; state.transactions.forEach(function(t){ if(t.id>m) m=t.id; }); return m+1; }
  function nextBillId(){ var m=0; state.bills.forEach(function(b){ if(b.id>m) m=b.id; }); return m+1; }

  function formatBRL(n){
    var neg = n < 0; n = Math.abs(n);
    var s = n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
    var parts = s.split(','); return (neg?'-':'')+'R$ '+parts[0]+','+parts[1];
  }
  function formatBRLHero(n){
    var s = n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
    var parts = s.split(','); return 'R$ '+parts[0]+'<span class="cents">,'+parts[1]+'</span>';
  }
  function monthLabel(m){ var d=new Date(m+'-02T00:00:00'); return d.toLocaleDateString('pt-BR',{month:'long',year:'numeric'}); }
  function dateHeadLabel(d0){ var d=new Date(d0+'T00:00:00'); return d.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'}).replace('.',''); }
  function dateShort(d0){ var d=new Date(d0+'T00:00:00'); return d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}); }
  function catColor(type,name){
    var list = CATEGORIES[type]||CATEGORIES.saida;
    for(var i=0;i<list.length;i++){ if(list[i].name===name) return list[i].color; }
    return '#B0B4BE';
  }

  async function loadData(){
    try{
      var result = await Store.get(STORAGE_KEY);
      if(result && result.value){
        var parsed = JSON.parse(result.value);
        if(Array.isArray(parsed)){ state.transactions = parsed; state.bills = seedBills(); }
        else{ state.transactions = parsed.transactions || seedTransactions(); state.bills = parsed.bills || seedBills(); }
      } else {
        state.transactions = seedTransactions(); state.bills = seedBills(); await saveData();
      }
    }catch(err){
      state.transactions = seedTransactions(); state.bills = seedBills();
      try{ await saveData(); }catch(e2){ console.error('Falha ao salvar dados iniciais', e2); }
    }
    state.loading = false; render();
  }
  function setSaveStatus(s){
    var el = document.getElementById('save-status');
    if(!el) return;
    if(s==='saving'){ el.textContent = 'salvando…'; el.style.color = 'var(--ink-muted)'; }
    else if(s==='ok'){ el.textContent = '✓ salvo'; el.style.color = 'var(--positive)'; }
    else { el.textContent = '⚠ não salvou — veja o aviso abaixo'; el.style.color = 'var(--negative)'; }
  }
  function saveData(){
    setSaveStatus('saving');
    return Store.set(STORAGE_KEY, JSON.stringify({transactions:state.transactions, bills:state.bills}))
      .then(function(){ setSaveStatus('ok'); })
      .catch(function(err){ console.error('Erro ao salvar', err); setSaveStatus('err'); });
  }

  function globalBalance(){ var t=0; state.transactions.forEach(function(tx){ t += (tx.type==='entrada'?tx.value:-tx.value); }); return t; }
  function monthTotals(m){
    var inT=0,outT=0;
    state.transactions.forEach(function(t){ if(t.date.indexOf(m)===0){ if(t.type==='entrada') inT+=t.value; else outT+=t.value; } });
    return {inTotal:inT, outTotal:outT};
  }
  function categoryBreakdown(m){
    var map={};
    state.transactions.forEach(function(t){ if(t.type==='saida' && t.date.indexOf(m)===0){ map[t.category]=(map[t.category]||0)+t.value; } });
    var arr=Object.keys(map).map(function(k){return {name:k,value:map[k]};});
    arr.sort(function(a,b){return b.value-a.value;}); return arr;
  }
  function monthTransactions(m){
    return state.transactions.filter(function(t){return t.date.indexOf(m)===0;})
      .sort(function(a,b){ if(a.date!==b.date) return a.date<b.date?1:-1; return b.id-a.id; });
  }
  function findBillTransaction(billId,m){
    return state.transactions.find(function(t){return t.linkedBillId===billId && t.date.indexOf(m)===0;}) || null;
  }
  function changeMonth(delta){
    var d=new Date(state.selectedMonth+'-02T00:00:00'); d.setMonth(d.getMonth()+delta);
    state.selectedMonth = d.toISOString().slice(0,7); render();
  }

  window.appHandlers = {
    switchTab:function(tab){ state.activeTab=tab; state.panelMode=null; render(); },
    changeMonth:changeMonth,
    openAdd:function(type){ state.panelMode='transaction'; state.formType=type; state.editingId=null; render(); focusPanel('f-desc'); },
    openEdit:function(id){
      var tx=state.transactions.find(function(t){return t.id===id;}); if(!tx) return;
      state.panelMode='transaction'; state.formType=tx.type; state.editingId=id; render(); focusPanel('f-desc');
    },
    setFormType:function(type){ state.formType=type; render(); },
    closePanel:function(){ state.panelMode=null; state.editingId=null; state.markPaidBillId=null; state.markPaidTxId=null; state.editingBillId=null; render(); },
    submitForm:function(e){
      e.preventDefault();
      var desc=document.getElementById('f-desc').value.trim();
      var value=parseFloat(document.getElementById('f-value').value);
      var category=document.getElementById('f-category').value;
      var date=document.getElementById('f-date').value;
      if(!desc||!value||value<=0||!date) return;
      if(state.editingId){
        var tx=state.transactions.find(function(t){return t.id===state.editingId;});
        tx.desc=desc; tx.value=value; tx.category=category; tx.date=date; tx.type=state.formType;
      } else {
        state.transactions.push({id:nextId(), date:date, type:state.formType, category:category, desc:desc, value:value, linkedBillId:null});
      }
      state.selectedMonth=date.slice(0,7); state.panelMode=null; state.editingId=null;
      saveData(); render();
    },
    deleteTx:function(){
      if(!state.editingId) return;
      if(!confirm('Excluir este lançamento?')) return;
      state.transactions = state.transactions.filter(function(t){return t.id!==state.editingId;});
      state.panelMode=null; state.editingId=null; saveData(); render();
    },
    openMarkPaid:function(billId){
      var tx=findBillTransaction(billId, state.selectedMonth);
      state.panelMode='markPaid'; state.markPaidBillId=billId; state.markPaidTxId=tx?tx.id:null;
      render(); focusPanel('f-paid-value');
    },
    submitMarkPaid:function(e){
      e.preventDefault();
      var value=parseFloat(document.getElementById('f-paid-value').value);
      var date=document.getElementById('f-paid-date').value;
      if(!value||value<=0||!date) return;
      var bill=state.bills.find(function(b){return b.id===state.markPaidBillId;}); if(!bill) return;
      if(state.markPaidTxId){
        var tx=state.transactions.find(function(t){return t.id===state.markPaidTxId;});
        tx.value=value; tx.date=date; tx.category=bill.category; tx.desc=bill.name;
      } else {
        state.transactions.push({id:nextId(), date:date, type:'saida', category:bill.category, desc:bill.name, value:value, linkedBillId:bill.id});
      }
      state.selectedMonth=date.slice(0,7); state.panelMode=null; state.markPaidBillId=null; state.markPaidTxId=null;
      saveData(); render();
    },
    unmarkPaid:function(){
      if(!state.markPaidTxId) return;
      if(!confirm('Desmarcar esta conta como paga? Isso remove o lançamento correspondente.')) return;
      state.transactions = state.transactions.filter(function(t){return t.id!==state.markPaidTxId;});
      state.panelMode=null; state.markPaidBillId=null; state.markPaidTxId=null; saveData(); render();
    },
    openNewBillTemplate:function(){ state.panelMode='billTemplate'; state.editingBillId=null; render(); focusPanel('f-bill-name'); },
    openBillTemplate:function(billId){ state.panelMode='billTemplate'; state.editingBillId=billId; render(); focusPanel('f-bill-name'); },
    submitBillTemplate:function(e){
      e.preventDefault();
      var name=document.getElementById('f-bill-name').value.trim();
      var category=document.getElementById('f-bill-category').value;
      var expectedValue=parseFloat(document.getElementById('f-bill-value').value);
      if(!name||!expectedValue||expectedValue<=0) return;
      if(state.editingBillId){
        var bill=state.bills.find(function(b){return b.id===state.editingBillId;});
        bill.name=name; bill.category=category; bill.expectedValue=expectedValue;
      } else {
        state.bills.push({id:nextBillId(), name:name, category:category, expectedValue:expectedValue});
      }
      state.panelMode=null; state.editingBillId=null; saveData(); render();
    },
    deleteBillTemplate:function(){
      if(!state.editingBillId) return;
      if(!confirm('Excluir esta conta fixa? Pagamentos já lançados continuam no seu histórico, só param de aparecer aqui.')) return;
      state.bills = state.bills.filter(function(b){return b.id!==state.editingBillId;});
      state.panelMode=null; state.editingBillId=null; saveData(); render();
    },
    resetAll:function(){
      if(!confirm('Isso vai apagar todos os lançamentos e contas fixas salvos. Tem certeza?')) return;
      state.transactions=[]; state.bills=[]; saveData(); render();
    }
  };

  function focusPanel(fieldId){
    setTimeout(function(){
      var el=document.getElementById(fieldId); if(el) el.focus();
      var panel=document.getElementById('panel'); if(panel) panel.scrollIntoView({behavior:'smooth', block:'center'});
    }, 30);
  }
  function renderCategoryOptions(type,selected){
    return CATEGORIES[type].map(function(c){ return '<option value="'+c.name+'"'+(c.name===selected?' selected':'')+'>'+c.name+'</option>'; }).join('');
  }
  function monthNavHtml(){
    return '<span class="month-nav">'+
      '<button onclick="appHandlers.changeMonth(-1)" aria-label="Mês anterior">‹</button>'+
      '<span class="m-label">'+monthLabel(state.selectedMonth)+'</span>'+
      '<button onclick="appHandlers.changeMonth(1)" aria-label="Próximo mês">›</button>'+
    '</span>';
  }

  function renderTransactionPanel(){
    var editing = state.editingId ? state.transactions.find(function(t){return t.id===state.editingId;}) : null;
    var type = state.formType; var todayStr = new Date().toISOString().slice(0,10);
    return ''+
    '<div class="panel open" id="panel">'+
      '<h3>'+(editing?'Editar lançamento':(type==='entrada'?'Nova entrada':'Nova saída'))+'</h3>'+
      '<div class="type-toggle">'+
        '<button type="button" class="'+(type==='entrada'?'active in':'')+'" onclick="appHandlers.setFormType(\'entrada\')">↑ Entrada</button>'+
        '<button type="button" class="'+(type==='saida'?'active out':'')+'" onclick="appHandlers.setFormType(\'saida\')">↓ Saída</button>'+
      '</div>'+
      '<form onsubmit="appHandlers.submitForm(event)">'+
        '<div class="field"><label for="f-desc">Descrição</label>'+
          '<input id="f-desc" type="text" placeholder="ex: Mercado, Salário, Gasolina" value="'+(editing?editing.desc.replace(/"/g,'&quot;'):'')+'" required></div>'+
        '<div class="field"><label for="f-value">Valor (R$)</label>'+
          '<input id="f-value" type="number" step="0.01" min="0.01" placeholder="0,00" value="'+(editing?editing.value:'')+'" required></div>'+
        '<div class="field"><label for="f-category">Categoria</label>'+
          '<select id="f-category">'+renderCategoryOptions(type, editing?editing.category:CATEGORIES[type][0].name)+'</select></div>'+
        '<div class="field"><label for="f-date">Data</label>'+
          '<input id="f-date" type="date" value="'+(editing?editing.date:todayStr)+'" required></div>'+
        '<div class="panel-actions">'+
          '<button type="submit" class="btn btn-save">Salvar</button>'+
          (editing?'<button type="button" class="btn btn-delete" onclick="appHandlers.deleteTx()">Excluir</button>':'')+
          '<button type="button" class="btn btn-cancel" onclick="appHandlers.closePanel()">Cancelar</button>'+
        '</div>'+
      '</form>'+
    '</div>';
  }
  function renderMarkPaidPanel(){
    var bill = state.bills.find(function(b){return b.id===state.markPaidBillId;}); if(!bill) return '';
    var tx = state.markPaidTxId ? state.transactions.find(function(t){return t.id===state.markPaidTxId;}) : null;
    var todayStr = new Date().toISOString().slice(0,10);
    return ''+
    '<div class="panel open" id="panel">'+
      '<h3>'+bill.name+'</h3>'+
      '<p class="hint">'+bill.category+' · previsto '+formatBRL(bill.expectedValue)+'</p>'+
      '<form onsubmit="appHandlers.submitMarkPaid(event)">'+
        '<div class="field"><label for="f-paid-value">Valor pago (R$)</label>'+
          '<input id="f-paid-value" type="number" step="0.01" min="0.01" value="'+(tx?tx.value:bill.expectedValue)+'" required></div>'+
        '<div class="field"><label for="f-paid-date">Data do pagamento</label>'+
          '<input id="f-paid-date" type="date" value="'+(tx?tx.date:todayStr)+'" required></div>'+
        '<div class="panel-actions">'+
          '<button type="submit" class="btn btn-save">'+(tx?'Salvar':'Marcar como pago')+'</button>'+
          (tx?'<button type="button" class="btn btn-delete" onclick="appHandlers.unmarkPaid()">Desmarcar</button>':'')+
          '<button type="button" class="btn btn-cancel" onclick="appHandlers.closePanel()">Cancelar</button>'+
        '</div>'+
      '</form>'+
    '</div>';
  }
  function renderBillTemplatePanel(){
    var editing = state.editingBillId ? state.bills.find(function(b){return b.id===state.editingBillId;}) : null;
    return ''+
    '<div class="panel open" id="panel">'+
      '<h3>'+(editing?'Editar conta fixa':'Nova conta fixa')+'</h3>'+
      '<form onsubmit="appHandlers.submitBillTemplate(event)">'+
        '<div class="field"><label for="f-bill-name">Nome</label>'+
          '<input id="f-bill-name" type="text" placeholder="ex: Água, Energia, Internet" value="'+(editing?editing.name.replace(/"/g,'&quot;'):'')+'" required></div>'+
        '<div class="field"><label for="f-bill-category">Categoria</label>'+
          '<select id="f-bill-category">'+renderCategoryOptions('saida', editing?editing.category:CATEGORIES.saida[0].name)+'</select></div>'+
        '<div class="field"><label for="f-bill-value">Valor esperado por mês (R$)</label>'+
          '<input id="f-bill-value" type="number" step="0.01" min="0.01" value="'+(editing?editing.expectedValue:'')+'" required></div>'+
        '<div class="panel-actions">'+
          '<button type="submit" class="btn btn-save">Salvar</button>'+
          (editing?'<button type="button" class="btn btn-delete" onclick="appHandlers.deleteBillTemplate()">Excluir</button>':'')+
          '<button type="button" class="btn btn-cancel" onclick="appHandlers.closePanel()">Cancelar</button>'+
        '</div>'+
      '</form>'+
    '</div>';
  }

  function renderCategoryBlock(){
    var breakdown = categoryBreakdown(state.selectedMonth);
    if(breakdown.length===0) return '<div class="empty-state">Nenhum gasto registrado neste mês ainda.</div>';
    var max = breakdown[0].value;
    return breakdown.map(function(c){
      var color = catColor('saida', c.name);
      var pct = Math.max(6, Math.round((c.value/max)*100));
      return '<div class="cat-bar-row">'+
        '<div class="cat-bar-top"><span class="name"><span class="cat-dot" style="background:'+color+'"></span>'+c.name+'</span>'+
        '<span class="val">'+formatBRL(c.value)+'</span></div>'+
        '<div class="cat-bar-track"><div class="cat-bar-fill" style="width:'+pct+'%;background:'+color+'"></div></div>'+
      '</div>';
    }).join('');
  }
  function renderTransactions(){
    var txs = monthTransactions(state.selectedMonth);
    if(txs.length===0) return '<div class="empty-state">Nenhum lançamento em '+monthLabel(state.selectedMonth)+'. Toque em + Entrada ou + Saída para começar.</div>';
    var groups=[]; var lastDate=null;
    txs.forEach(function(t){ if(t.date!==lastDate){ groups.push({date:t.date, items:[]}); lastDate=t.date; } groups[groups.length-1].items.push(t); });
    return groups.map(function(g){
      var rows = g.items.map(function(t){
        var color = catColor(t.type, t.category);
        return '<div class="tx-row" onclick="appHandlers.openEdit('+t.id+')">'+
          '<div class="tx-main"><div class="tx-desc">'+t.desc+'</div>'+
          '<div class="tx-cat"><span class="cat-dot" style="background:'+color+'"></span>'+t.category+'</div></div>'+
          '<div class="tx-val '+(t.type==='entrada'?'in':'out')+'">'+(t.type==='entrada'?'+':'-')+' '+formatBRL(t.value)+'</div>'+
        '</div>';
      }).join('');
      return '<div class="date-group"><div class="date-head">'+dateHeadLabel(g.date)+'</div>'+rows+'</div>';
    }).join('');
  }

  function renderLancamentosMain(){
    return ''+
      '<div class="main-toolbar">'+monthNavHtml()+
        '<div class="actions-row">'+
          '<button class="btn btn-in" onclick="appHandlers.openAdd(\'entrada\')">+ Entrada</button>'+
          '<button class="btn btn-out" onclick="appHandlers.openAdd(\'saida\')">+ Saída</button>'+
        '</div>'+
      '</div>'+
      (state.panelMode==='transaction'?renderTransactionPanel():'')+
      '<div class="cards-grid">'+
        '<div class="card"><h2>Por categoria</h2>'+renderCategoryBlock()+'</div>'+
        '<div class="card"><h2>Lançamentos</h2><div class="tx-scroll">'+renderTransactions()+'</div></div>'+
      '</div>';
  }

  function renderBillsMain(){
    var totalExpected=0, totalPaid=0, totalPending=0;
    var cards = state.bills.map(function(bill){
      var tx = findBillTransaction(bill.id, state.selectedMonth);
      var paid = !!tx;
      var displayValue = paid ? tx.value : bill.expectedValue;
      totalExpected += bill.expectedValue;
      if(paid) totalPaid += tx.value; else totalPending += bill.expectedValue;
      var color = catColor('saida', bill.category);
      var statusHtml = paid
        ? '<span class="status-badge paid">Pago '+dateShort(tx.date)+'</span>'
        : '<span class="status-badge pending">Pendente</span>';
      return '<div class="bill-card" onclick="appHandlers.openMarkPaid('+bill.id+')">'+
        '<div class="bill-top">'+
          '<div><div class="bill-name"><span class="cat-dot" style="background:'+color+'"></span>'+bill.name+'</div>'+
          '<div class="bill-cat">'+bill.category+' · previsto '+formatBRL(bill.expectedValue)+'</div></div>'+
          '<button class="bill-edit-btn" onclick="event.stopPropagation(); appHandlers.openBillTemplate('+bill.id+')" aria-label="Editar conta fixa">✎</button>'+
        '</div>'+
        '<div class="bill-bottom"><span class="bill-value">'+formatBRL(displayValue)+'</span>'+statusHtml+'</div>'+
      '</div>';
    }).join('');

    var summaryHtml = '<div class="bills-summary">'+
      '<div class="stat-card"><div class="k">Soma das contas</div><div class="v">'+formatBRL(totalExpected)+'</div></div>'+
      '<div class="stat-card paid"><div class="k">Já pago</div><div class="v">'+formatBRL(totalPaid)+'</div></div>'+
      '<div class="stat-card pending"><div class="k">Falta pagar</div><div class="v">'+formatBRL(totalPending)+'</div></div>'+
    '</div>';

    var panelHtml='';
    if(state.panelMode==='markPaid') panelHtml = renderMarkPaidPanel();
    if(state.panelMode==='billTemplate') panelHtml = renderBillTemplatePanel();

    var gridHtml = state.bills.length===0
      ? '<div class="empty-state">Nenhuma conta fixa cadastrada ainda.</div>'
      : '<div class="bills-grid">'+cards+'</div>';

    return ''+
      '<div class="main-toolbar">'+monthNavHtml()+
        '<div class="actions-row"><button class="btn btn-add-bill" onclick="appHandlers.openNewBillTemplate()">+ Nova conta fixa</button></div>'+
      '</div>'+
      summaryHtml + panelHtml + gridHtml;
  }

  function render(){
    var app = document.getElementById('app');
    if(state.loading){ app.innerHTML = '<div class="loading">carregando seu livro-caixa…</div>'; return; }
    var balance = globalBalance();
    var totals = monthTotals(state.selectedMonth);

    var heroWave = '<svg class="hero-wave" viewBox="0 0 300 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">'+
      '<path d="M0,72 C40,25 60,92 100,52 C140,12 160,82 200,42 C240,12 262,70 300,32" stroke="rgba(255,255,255,0.28)" stroke-width="3" fill="none" stroke-linecap="round"/>'+
      '<path d="M0,88 C40,55 60,98 100,72 C140,46 160,92 200,62 C240,38 262,80 300,52" stroke="rgba(255,255,255,0.14)" stroke-width="3" fill="none" stroke-linecap="round"/>'+
    '</svg>';

    var sideHtml = ''+
      '<div class="brand">'+
        '<div class="brand-mark">R$</div>'+
        '<div class="brand-text"><div class="name">Livro-Caixa</div><div class="sub">controle financeiro pessoal</div></div>'+
      '</div>'+
      '<div class="hero">'+heroWave+
        '<p class="label">Saldo atual</p>'+
        '<div class="balance">'+formatBRLHero(balance)+'</div>'+
        '<div class="month-flow">'+
          '<div class="flow-item in"><span class="k">Recebido este mês</span><span class="v">'+formatBRL(totals.inTotal)+'</span></div>'+
          '<div class="flow-item out"><span class="k">Gasto este mês</span><span class="v">'+formatBRL(totals.outTotal)+'</span></div>'+
        '</div>'+
      '</div>'+
      '<div class="tabs">'+
        '<button class="tab-btn '+(state.activeTab==='lancamentos'?'active':'')+'" onclick="appHandlers.switchTab(\'lancamentos\')">Lançamentos</button>'+
        '<button class="tab-btn '+(state.activeTab==='fixas'?'active':'')+'" onclick="appHandlers.switchTab(\'fixas\')">Contas Fixas</button>'+
      '</div>';

    app.innerHTML = ''+
      '<div class="shell">'+
        '<div class="col-side">'+sideHtml+'</div>'+
        '<div class="col-main">'+(state.activeTab==='lancamentos'?renderLancamentosMain():renderBillsMain())+'</div>'+
      '</div>'+
      '<footer class="foot">'+
        '<span id="save-status" style="font-weight:600;">✓ salvo</span> · '+
        'Seus lançamentos são salvos automaticamente na sua conta. '+
        '<button onclick="appHandlers.resetAll()">Apagar todos os dados</button>'+
      '</footer>';
  }

  loadData();
})();
