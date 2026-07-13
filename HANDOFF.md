# 🔄 HANDOFF — LifeOS RPG (continuar daqui)

> Em uma janela nova: **"Leia o HANDOFF.md do repositório (branch main) e continue de onde paramos."**
> A memória do projeto está no repo — não depende do histórico do chat.

## O jogo
LifeOS RPG: a vida real do **Emerson** vira um painel/RPG. HTML/JS puro (o JS agora fica em `js/*.js`).
Publicado no **GitHub Pages** a partir de **`main`**. O jogo 2D visual antigo está na branch **`game-2d`**.
- URL: `https://ermelsu.github.io/LifeOS-2D/` · Login: **Emerson / 12345** (seed em `js/index.js`).

## Arquivos (branch main)
- `index.html`+`js/index.js` — login. `painel.html`+`js/painel.js` — painel principal.
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
