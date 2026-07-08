# 🎲 LifeOS — RPG Textual da Vida Real

Um RPG de texto onde o **tabuleiro é a sua vida real**. Em vez de um personagem
fictício, o herói é você: seus atributos são seus status de vida de verdade
(corpo, mente, dinheiro, trabalho, relações, propósito...), suas **missões** são
suas metas reais e os **chefões** são seus obstáculos.

Eu (o Mestre / GM) conduzo a história por texto. Você toma as decisões, cumpre
missões no mundo real e evolui de nível conforme sua vida melhora.

> Esta é a versão **textual** do projeto. O jogo 2D visual (com editor de casa,
> personagens e texturas) continua vivo na branch **`game-2d`**.

## Como jogar

1. **Criação de personagem** — abra o [`questionario.html`](questionario.html) (formulário
   com um campo por pergunta, salva sozinho e tem botão pra copiar as respostas) ou leia
   as perguntas em [`questionario.md`](questionario.md). São perguntas sobre os status
   reais da sua vida.
2. **Ficha** — a partir das suas respostas eu monto a sua ficha de personagem
   (atributos de 0–10, missões, inventário, aliados e chefões).
3. **A campanha** — a gente joga por texto: eu descrevo situações e proponho
   missões; você age na vida real e me conta o resultado; seus atributos sobem.

## Os 8 atributos (os status da sua vida)

| Atributo | O que mede |
|---|---|
| 💪 **Corpo** | saúde física, sono, energia, alimentação, exercício |
| 🧠 **Mente** | saúde mental, foco, humor, estresse, autoestima |
| 💰 **Recursos** | finanças, renda, estabilidade, poupança |
| ⚒️ **Ofício** | trabalho/estudos, propósito profissional, produtividade |
| ❤️ **Vínculos** | família, amizades, amor, vida social |
| 📚 **Sabedoria** | aprendizado, habilidades, crescimento |
| 🔥 **Espírito** | sentido de vida, valores, lazer, alegria |
| ⏳ **Disciplina** | rotina, hábitos, gestão do tempo |

## Estrutura (páginas)

- `index.html` — **tela de entrada** (Life OS): fundo artístico, botão *Jogar* e login/senha (local).
- `painel.html` — **o painel do jogo**: status, atributos, matilha, cômodos, treino, medidas, humor, receitas, chefão…
- `mapa.html` — **mapa da casa**: suba uma imagem e marque as tarefas (o que fazer e onde).
- `questionario.html` — formulário de criação de personagem.
- `ficha.md` — a ficha do Emerson (gerada das respostas).

> Login é **local** (só no navegador, sem servidor) — é um protótipo. O Emerson já tem ficha;
> novos jogadores criam conta e preenchem o questionário.

O jogo também roda **por conversa** — a "campanha" continua no chat.
