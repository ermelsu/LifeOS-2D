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
- `assets/casa.png` — **mapa oficial** (padrão do app quando não há upload local). ⚠️ ainda precisa ser commitado.

## localStorage
- `lifeos_mapa = {img, zones:[{x,y,w,h,name,color,tasks:[{t,done}]}]}` (áreas em %).
- `lifeos_saude`, `lifeos_banco`, `lifeos_accounts`, `lifeos_user`.

## ⚠️ Por que o mapa "some" entre aparelhos
`lifeos_mapa` fica no navegador onde foi criado. Solução: **mapa oficial no repo** (`assets/casa.png`).
Já há fallback no código: painel e mapa usam `assets/casa.png` quando não há upload local.

## ▶️ PRÓXIMA TAREFA (o que o Emerson quer)
Fazer a **HOME ser o mapa**: a planta da casa é o centro/maior parte da interface; **cada cômodo mostra as
atividades pra fazer ali** (tocar abre a lista). Infos/streak numa faixa compacta.
1. Commitar `assets/casa.png` (a planta que o Emerson enviou). Como a imagem veio inline (sem bytes acessíveis
   ao agente), opções: (a) Emerson arrasta o PNG no GitHub → `assets/casa.png` na `main`; ou (b) recriar a
   planta como SVG fiel e commitar.
2. Pré-definir as **zonas/cômodos** sobre o mapa (commit `assets/casa-zones.json`, carregado via fetch quando
   não há zonas locais). Emerson **nomeia** os cômodos; então pré-preencher atividades por tipo (lib `SUGG`
   em `js/mapa.js`): Cozinha→tirar lixo/lavar louça; Quarto→arrumar guarda-roupa; Escritório→organizar mesa/
   backup; Canil→recolher fezes/trocar água; etc. (demanda de escritório só no escritório!).
3. `js/painel.js`: tornar o mapa o painel principal (grande no topo), áreas clicáveis abrindo suas tarefas (Sim/Não).

## 🗺️ Layout da planta do Emerson (imagem enviada; ~2.7:1, coords aprox. em %)
Casa comprida, esquerda→direita: grama na borda esq.; **cômodo grande sup-esq** (~x8–22%,y7–48%) e **estreito
abaixo** (~x8–22%,y48–64%); **faixa/corredor no topo** (~x22–56%,y7–23%); sob ela 3 cômodos **A**(x23–37%),
**estreito**(x37–42%), **B**(x42–56%), y23–64%; **cômodo grande à direita em L** (~x56–82%,y7–79%); **pátio de
tijolinho/cinza (externa)** (~x82–98%); **quintal (grama)** embaixo no meio (~x8–56%,y64–92%).
Nomes dos cômodos: **perguntar ao Emerson**.

## Convenções
Commits claros + `Co-Authored-By: Claude Opus 4.8`; push em `main`. Sem cache (metas já nas páginas).
Teste: Playwright headless (Chromium `/opt/pw-browsers/chromium`, import `/opt/node22/lib/node_modules/playwright`).
⚠️ Outra sessão pode editar `main` em paralelo → sempre `git fetch` + rebase antes do push.

## Emerson (de ficha.md)
30, Explorador, Barbalha (mudança a caminho), **20 cães**. Meta: perder peso/ganhar massa (lombar L3–L5 →
treino seguro), organizar casa/canil, casa nova + sítio 100×100m. Evoluir 1º: Disciplina. Aliados: Alisson
(irmão), João Pedro, Clice (namorada). Chefão: "O Caos".
