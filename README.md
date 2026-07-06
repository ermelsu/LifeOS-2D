# LifeOS 2D

Protótipo de jogo 2D de **cliques**, estilo *Life is a Game* / The Sims em versão simples.
Você anda entre cômodos (só pra frente e pra trás), clica em portas pra trocar de cena
e clica em itens pra cuidar dos status da sua vida.

## Como rodar

Não precisa instalar **nada**. É só abrir o arquivo:

```
Abra index.html no navegador (duplo clique).
```

## Controles

- **← →** ou clicar no chão → andar
- Clicar num **item** → o personagem vai até ele e usa (comer, dormir, banho, TV...)
- Clicar numa **porta** → troca de cômodo

## Status (o "sistema operacional" da vida)

`Energia · Fome · Higiene · Diversão` caem com o tempo. Usar os itens certos recupera:

| Cômodo   | Item      | Efeito            |
|----------|-----------|-------------------|
| Cozinha  | Geladeira | +Fome (comer)     |
| Cozinha  | Fogão     | +Fome (cozinhar)  |
| Sala     | Sofá + TV | +Diversão         |
| Quarto   | Cama      | +Energia (dormir) |
| Banheiro | Chuveiro  | +Higiene          |

## Como expandir (tudo é orientado a dados)

O jogo inteiro é **um arquivo** (`index.html`). Para criar um cômodo novo,
adicione uma entrada em `ROOMS` — não precisa mexer no motor:

```js
escritorio: {
  nome: 'Escritório',
  wall: '#7a7a8a', wall2: '#6a6a7a', floor: '#3a3a44',
  items: [
    { x: 60, w: 50, label:'Computador', draw:drawTV,
      use(){ apply('diversao', +10); toast('Trabalhou 💻'); } },
  ],
  doors: [ { x: 260, dest:'sala', label:'Sala' } ],
}
```

Depois é só adicionar uma porta `{ x, dest:'escritorio', label:'Escritório' }`
em outro cômodo para conseguir chegar lá.

### Próximos passos possíveis
- Dinheiro / trabalho (ganhar $ no computador, gastar comprando comida)
- Dia/noite e relógio
- Salvar progresso no `localStorage`
- Sprites de verdade (trocar as funções `draw*` por imagens `.png`)
