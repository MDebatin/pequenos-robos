# Pequenos Robôs, Grandes Descobertas

Projeto educativo da EBAS para crianças de 3 a 6 anos: seis brincadeiras em uma página web, sem dependências externas, telemetria, login ou requisições a CDN. Os únicos arquivos de mídia são as gravações de animais em `assets/audio/animals/`, do Wikimedia Commons (ver `CREDITS.md`).

## Como abrir

Como o projeto usa módulos ES, não abra `index.html` diretamente com `file://`. No VS Code, use Live Server. Alternativa sem dependências:

```powershell
python -m http.server 8000
```

Depois abra `http://localhost:8000/`.

## As seis brincadeiras

| Jogo | Fases | O que a criança faz |
| --- | --- | --- |
| 🎨 Cores dos robôs | 6 | Fases 1-2: vê um robô colorido e toca na amostra igual. Fases 3-4: ouve o nome da cor e toca no robô daquela cor. Fases 5-6: alterna os dois modos com até 8 opções. |
| 🔺 Formas mágicas | 8 | Encaixa formas no robô (toque na peça e depois no espaço, ou arraste). Fases 1-5 montam o robô clássico; fases 6-8 montam o Robô Redondo com oval, hexágono, coração e meia-lua. |
| 🧭 Caminho do robô | 8 | Move o robô livremente (cima, baixo, esquerda, direita) até a estrela, desviando de obstáculos. Controle por botões, teclado e deslizar no tabuleiro. Dica automática depois de 3 batidas ou muitos passos. |
| 👀 Robôs iguais | 5 | Jogo da memória com 2 a 6 pares de robôs visualmente distintos. |
| 🔊 Descubra os sons | 5 | Ouve a gravação do animal (depois a onomatopeia narrada) e escolhe a figura. Começa com gato e cachorro e chega a 12 animais. |
| 🛠️ Crie seu robô | 11 etapas | Escolhe corpo, cor, cabeça, cor da cabeça, olhos, boca, antena, braços, pernas, chapéu e enfeite. Tem desfazer, surpresa, recomeçar, celebração final e galeria dos últimos robôs. |

## Estrutura

- `index.html`: shell sem lógica inline.
- `css/`: tokens, base, layout, componentes e um arquivo por atividade em `css/games/`.
- `js/core/app.js`: tela inicial, dicas para a professora, montagem das atividades, indicador de fase, transições, feedback e tela final.
- `js/data/`: dados puros (cores, sons, peças, opções de criação, textos, fases em `levels/`).
- `js/services/`: voz (`speech.js`), efeitos sonoros (`audio.js`), sons de animais sintetizados (`animal-sounds.js`) e confete.
- `js/ui/robot-svg.js`: renderizador de robôs em SVG compartilhado por Crie seu robô, Robôs iguais e Cores dos robôs.
- `js/games/`: uma atividade por pasta, registrada em `registry.js`; `helpers.js` tem sorteio e embaralhamento; `path/solver.js` tem a busca em largura.
- `legacy/`: protótipos originais preservados sem alteração.
- `tests/`: validações de dados executáveis com `npm test`.

## Contrato de uma atividade

Cada módulo exporta `{ id, title, icon, description, levels, mount(container, ctx) }`. `mount` devolve uma função de limpeza. O `ctx` oferece:

- `level`, `totalLevels`, `soundEnabled`, `t`, `storage`, `sfx`, `reducedMotion`
- `setPrompt(texto, {speak})`, `speak(texto)`, `setFeedback(texto, 'good' | 'bad' | '')`, `setProgress(feitas, total, rótulo)`
- `levelComplete()` (confete e som), `finishLevel()` (mostra “Próxima fase” ou a tela final), `restart()`

## Como ampliar

- **Nova fase de cores, memória ou sons**: acrescente uma entrada em `js/data/levels/activities.js`.
- **Nova fase do caminho**: acrescente grade, início, meta e obstáculos em `activityLevels.path`; o teste verifica que a fase tem solução.
- **Nova fase de formas**: adicione uma entrada em `js/data/levels/shapes.js` com `robot`, `parts`, `hint`, `intro` e `outro`. Para uma nova peça, cadastre-a em `js/data/robot-parts.js` (forma, cor, slot). Formas disponíveis em `js/ui/shapes-svg.js`.
- **Nova opção em Crie seu robô**: desenhe a variante em `js/ui/robot-svg.js` e cadastre a opção na etapa correspondente em `js/data/create-options.js`.
- **Novo animal**: coloque a gravação em `assets/audio/animals/<id>.mp3` (até 4 s, créditos em `CREDITS.md`), cadastre em `js/data/sounds.js` e crie um padrão de reserva em `js/services/animal-sounds.js`, usado se o arquivo falhar.
- **Nova atividade**: crie `js/games/<id>/index.js` seguindo o contrato e registre em `js/games/registry.js`.

## Decisões

- Nada é falado antes de um gesto da criança; a voz usa o pt-BR do navegador e o botão 🔊 ao lado do enunciado repete a instrução.
- “Voz” (narração) e “Sons” (efeitos e animais) são botões independentes. Com os sons desligados, Descubra os sons mostra a onomatopeia no balão.
- O progresso (estrelas na tela inicial) e a galeria de robôs ficam salvos apenas no aparelho (`localStorage`).
- Animações respeitam `prefers-reduced-motion`.
