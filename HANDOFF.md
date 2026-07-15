# 🔄 HANDOFF — LifeOS RPG (continuar daqui)

> Em uma janela nova: **"Leia o HANDOFF.md do repositório (branch main) e continue de onde paramos."**
> A memória do projeto está no repo — não depende do histórico do chat.

## O jogo
LifeOS RPG: a vida real do **Emerson** vira um painel/RPG. HTML/JS puro (o JS agora fica em `js/*.js`).
Publicado no **GitHub Pages** a partir de **`main`**. O jogo 2D visual antigo está na branch **`game-2d`**.
- URL: `https://ermelsu.github.io/LifeOS-2D/` · Login: **Emerson / 12345** (seed em `js/index.js`).

## Arquivos (branch main)
- `index.html`+`js/index.js` — login. `painel.html`+`js/painel.js` — painel principal.
- `dieta.html`+`js/dieta.js` — **Nutrição: Projeto 6 Semanas Mais Magro** (foco tirzepatida). Abas **Hoje / Semana**.
  Hoje: refeição time-aware ("agora/próxima" com preparo), metas (kcal/proteína/água em anéis), plano de 5 refeições
  (acordeão), regras de ouro + manejo de efeitos + alertas, progressão semana 1–6, exercício seguro p/ lombar, disclaimer.
  Semana: plano base de 7 dias (rotação frango/carne/peixe) + meal prep. Horários p/ rotina 8h–15h (06:45/10:30/15:00/17:30/20:30).
  Alvos: ~1700 kcal, ~160g proteína, 3L água. localStorage `lifeos_dieta={start,done{date:{mealId}},water{date}}`.
  ⏳ Próximo: **módulo de estoque** (despensa/geladeira/eletrodomésticos → o que tem × o que comprar p/ as receitas).
  Emerson vai mandar áudio com o que tem em casa → aí trocar os itens das receitas pelo que ele tem.

## 📱 REFATORAÇÃO MOBILE (iPhone 12) — em fases (decisões do Emerson)
Entrega **por fases** · financeiro **mantém os dados** do ZIP · matilha **mantém 20 cães** c/ emoji único.
- **F1 ✅ (feito):** Home reordenada (1º Ficha, 2º Sua Casa, 3º resto). Mapa saiu da Home → **Sua Casa vira lista
  priorizada** (🔥≥3 / 🟡1-2 / 🟢0 pendentes, ordenada por urgência, tarefas como chips, toque abre modal Sim/Não).
  Mapa/planta continua interno em `mapa.html`. Removidos **Aliados** e **Recursos**. Cada cão com **emoji único** (`DOG_EMOJIS`).
- **F1.1 ✅ correção:** o mapa saía **só no mobile** — na Home o "Sua Casa" é responsivo: `.casa-map` (planta) no
  desktop e `.casa-list` (lista priorizada) em ≤680px. Ambos usam o mesmo modal. Botão **🔄 Atualizar app** no login (`index.html`).
- **F2 ✅ (feito):** Financeiro — `banco.html` reescrito (dark LifeOS, fontes do sistema, topbar de nav) + `js/banco.js`
  (IIFE do `livro-caixa`, intacto). Persistência localStorage `livro-caixa:data`, **dados do seed mantidos** (saldo R$400,16,
  25 lançamentos jul, 6 contas fixas). Abas Lançamentos/Contas Fixas. Chip **🏦 Financeiro** no painel.
- **F3 ✅ (feito):** `setup.html`+`js/setup.js` — wizard 9 passos (boas-vindas→casa→eletrodom.→eletrôn.→ferramentas→
  limpeza→alimentos→pets→fim). Escreve o banco em localStorage: `lifeos_mapa` (zones c/ auto-grid de coords + tarefas),
  `lifeos_inv` {appliances, electronics}, `lifeos_tools`, `lifeos_cleaning`, `lifeos_fridge`, `lifeos_pantry`, `lifeos_dogs`,
  `lifeos_onboarded='yes'`. Gate no topo do `painel.js`: 1ª utilização→setup; quem já tem zones é migrado (grandfather).
  Pets pré-preenchidos c/ os 20 cães (emoji único), editável. **Falta:** painel LER essas chaves (F4/F5).
- **F4 ✅ (feito):** painel lê do localStorage (`lsGet`, com fallback grandfather). Inventário separado em painéis
  **Eletrônicos** e **Eletrodomésticos** + **Ferramentas** + **Produtos de limpeza** (do onboarding). Removido o grid
  "Inventário" genérico e o painel "Eletrônicos" que misturava fogão/geladeira. Geladeira/Despensa/matilha também via localStorage.
- **F5 (próx):** botão **"Recomeçar do zero"** (limpa lifeos_mapa/inv/tools/cleaning/fridge/pantry/dogs/onboarded → volta pro setup).
  Geladeira/Despensa já começam vazias pra quem passou pelo onboarding (feito na F4).
Anexos do Emerson em `scratchpad/zips/` (screenshots + modulo-financeiro). ZIP financeiro é tema claro → re-tematizar.

## 🚀 v1.0 — marco zero
App em uso diário a partir de agora. Painel = mapa da casa (real, do Emerson) + módulos. Nutrição no ar.
Próximo módulo: **estoque/despensa** ligado às receitas da dieta (gera lista de compras do que falta p/ as 6 semanas).
- `mapa.html`+`js/mapa.js` — editor do mapa (sobe imagem/desenha, cria áreas com tarefas; tem sugestões por cômodo).
- `saude.html`+`js/saude.js` — espelho (humor, medidas, água, peso). `banco.html`+`js/banco.js` — finanças.
- `questionario.html`+`js/questionario.js` — criação de personagem. `ficha.md` — ficha do Emerson.
- `assets/casa.svg` — **planta oficial** recriada em SVG (padrão do app). `assets/casa.png` — opcional: se o Emerson
  subir a foto real, ela sobrepõe o SVG (o código tenta `.png` e cai pro `.svg`).
- `assets/casa-zones.json` — **zonas/cômodos oficiais** sobre a planta (carregado via fetch quando não há áreas locais).

## localStorage
- `lifeos_mapa = {img, zones:[{x,y,w,h,name,color,tasks:[{t,done}]}]}` (áreas em %).
- `lifeos_saude`, `lifeos_banco`, `lifeos_accounts`, `lifeos_user`.

## ⚠️ Por que o mapa "some" entre aparelhos
`lifeos_mapa` fica no navegador onde foi criado. Solução: **planta oficial no repo** (`assets/casa.svg` +
`assets/casa-zones.json`). Painel e mapa carregam o SVG e as zonas por fetch quando não há dados locais.

## ✅ FEITO — a HOME agora é o mapa (build v9)
1. **Planta recriada em SVG** (`assets/casa.svg`, viewBox 1836×686 ≈ 2.7:1) fiel à imagem do Emerson: grama
   à esquerda + fundo, cômodos bege com parede de madeira, pátio de tijolinho à direita, quintal embaixo.
2. **10 zonas pré-definidas** em `assets/casa-zones.json`, alinhadas ao SVG, com atividades por tipo (SUGG):
   Quarto, Banheiro, Corredor, Sala, Lavanderia, Cozinha, Escritório, Área externa (pátio), Quintal dos cães
   (canil → recolher fezes/trocar água), Jardim.
3. **`painel.html`/`js/painel.js`**: faixa compacta no topo (herói + streak + meta + "Casa em ordem %"); **mapa
   herói** grande (col-12) logo abaixo; cada cômodo é clicável e abre um **modal** com as tarefas em Sim/Não
   (persiste no localStorage). Barra de progresso da casa sob o mapa.
4. `js/mapa.js`: mesmo fallback (SVG + zones.json); editor mostra as 10 zonas de cara.
Testado com Playwright (10 áreas, modal, Sim/Não persistindo, % subindo). Sem erros de JS.

## 📤 Mapa real do Emerson (export/import)
O Emerson subiu a **planta real (RPG Maker)** e redesenhou/renomeou os cômodos — mas isso ficou só no
`localStorage` do PC dele (não no repo). Por isso outros aparelhos caíam no SVG. Solução no editor `mapa.html`:
botão **💾 Exportar** baixa `casa.png` (a imagem subida) + `casa-zones.json` (as zonas dele); ele commita os
dois em `assets/` na `main` e vira o mapa oficial em todo lugar. **📂 Importar** carrega um backup `.json`.
Fallback de imagem no código: `assets/casa.png` → `assets/casa.jpg` → `assets/casa.svg` → placeholder.
⏳ Pendente: Emerson exportar e commitar `assets/casa.png` + `assets/casa-zones.json` reais.

## ▶️ PRÓXIMA TAREFA / pendências
- **Nomes dos cômodos são provisórios** — o Emerson quer confirmar/renomear. Renomear no editor `mapa.html`
  **ainda não é suportado** (só criar/excluir); ou (a) editar `assets/casa-zones.json` com os nomes que ele
  passar (e regenerar as tarefas por tipo via SUGG), ou (b) adicionar botão de renomear zona no `js/mapa.js`.
- Opcional: Emerson pode subir a **foto real** em `assets/casa.png` (sobrepõe o SVG automaticamente).
- Ao trocar nomes/zonas oficiais, quem já abriu o app tem as zonas **semeadas no localStorage** — pra pegar as
  novas precisa limpar as áreas no editor (botão "apagar áreas") ou limpar `lifeos_mapa`.

## 🗺️ Coords das zonas (em % do viewBox, pra referência)
Quarto x8.17/y7/w14.27/h43.73 · Banheiro x8.17/y50.73/w14.27/h13.41 · Corredor x22.33/y7/w34.86/h14.58 ·
Sala x22.33/y21.57/w14.71/h43.29 · Lavanderia x37.04/y21.57/w5.01/h43.29 · Cozinha x42.05/y21.57/w15.14/h43.29 ·
Escritório x57.19/y7/w24.62/h71.72 · Área externa x81.81/y7/w15.74/h86.01 · Quintal dos cães x8.17/y64.87/w49.02/h28.57 ·
Jardim x2.61/y6.56/w5.56/h86.88.

## Convenções
Commits claros + `Co-Authored-By: Claude Opus 4.8`; push em `main`. Sem cache (metas já nas páginas).
Teste: Playwright headless (Chromium `/opt/pw-browsers/chromium`, import `/opt/node22/lib/node_modules/playwright`).
⚠️ Outra sessão pode editar `main` em paralelo → sempre `git fetch` + rebase antes do push.

## Emerson (de ficha.md)
30, Explorador, Barbalha (mudança a caminho), **20 cães**. Meta: perder peso/ganhar massa (lombar L3–L5 →
treino seguro), organizar casa/canil, casa nova + sítio 100×100m. Evoluir 1º: Disciplina. Aliados: Alisson
(irmão), João Pedro, Clice (namorada). Chefão: "O Caos".
