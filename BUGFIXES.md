# Bugs corrigidos

## Rodada 3 (revisão completa)

### Crie seu robô
- As abas Boca e Antena quebravam a atividade: o módulo buscava `createOptions.mouth` e `createOptions.antenna`, que não existiam (as chaves eram `mouths` e `antennas`). Dados e etapas foram unificados em `createSteps`, cada uma com a chave do estado que altera.
- O botão Finalizar remontava o jogo na “fase 2” e apagava o robô, porque a atividade declarava três fases para o app central. Agora tem uma única fase e a tela final aparece com o robô, animação de celebração e galeria.
- Tocar de novo na opção escolhida trocava a peça pela primeira da lista; agora a escolha é estável.
- As peças eram caracteres de texto sobre um desenho fixo; agora cabeça, olhos, boca, antena, braços, pernas, chapéu e enfeite são desenhados em SVG, com miniaturas que mostram a parte em destaque.
- Novas etapas: forma e cor da cabeça, braços, pernas. Botões Voltar, Desfazer, Surpresa, Recomeçar e Próximo sempre visíveis; os últimos seis robôs ficam guardados em “Meus robôs”.

### Descubra os sons
- Na fase 1, após a primeira rodada só restava uma figura: o filtro que evitava repetir o alvo removia a opção da tela. Agora o sorteio escolhe o alvo e, em seguida, as opções (sempre incluindo o alvo).
- O som era apenas a voz dizendo a onomatopeia. Agora cada animal tem um som sintetizado com WebAudio, seguido da onomatopeia narrada, com suporte opcional a gravações.
- Com o som desligado, o balão mostra a onomatopeia como pista visual.
- O som toca sozinho após a instrução e pode ser repetido à vontade; cinco fases com 12 animais.

### Caminho do robô
- Só a direção pré-programada era aceita, o que transformava o jogo em “aperte a seta certa”. Agora o robô anda livremente nas quatro direções; o tabuleiro impede sair da grade e atravessar obstáculos, com feedback de batida.
- Oito fases verificadas por busca em largura nos testes; dica (seta piscando) depois de 3 batidas ou de muitos passos; controle por botões em cruz, teclado e deslize no tabuleiro.
- O robô agora se move com animação entre células em vez de redesenhar a grade.

### Robôs iguais
- O enunciado da atividade anterior ficava na tela, pois a memória nunca o atualizava.
- As cartas usavam o emoji 🤖 com `color` CSS, que não muda a cor de emojis; todos os robôs pareciam iguais. Agora cada carta é um robô SVG distinto (cor, corpo, cabeça, olhos, chapéu).
- Cinco fases (2 a 6 pares), embaralhamento Fisher-Yates, pares encontrados permanecem visíveis, no máximo duas cartas abertas por tentativa, animação de virar.

### Formas mágicas
- A peça encaixada “pulava” para o canto do cenário: as animações CSS usavam `transform`, que substituía o `transform` de posicionamento do `<g>`. O grupo de posição agora é separado do grupo animado.
- Os olhos do robô eram cobertos pela cabeça encaixada (rosto desenhado antes das peças). O rosto passou a ser desenhado por cima e aparece quando a cabeça é colocada.
- Toque e clique disparavam a seleção duas vezes; ficou apenas o clique.
- Três fases novas com um segundo robô (cabeça quadrada, tronco redondo, oval, hexágono, coração e meia-lua). Em fases avançadas a dica só aparece após um erro.

### Cores dos robôs
- As opções eram sempre as primeiras cores da lista; agora são sorteadas a cada rodada, com o alvo incluído e sem repetir o alvo anterior.
- Dois modos de jogo (amostra do robô ou nome da cor) e seis fases; feedback de erro nomeia a cor tocada.

### Geral
- O feedback de um jogo permanecia na tela ao abrir outro; agora é limpo a cada montagem.
- Ao abrir uma atividade pela tela inicial, a fase não era zerada e herdava a fase da atividade anterior.
- `npm test` falhava (`node --test tests` tratava a pasta como arquivo); o script agora usa um glob.
- CSS duplicado em `components.css` e estilos de memória/criação espalhados em `path.css` foram organizados; `memory.css` criado.
- Indicador “Fase X de N”, faixa de transição entre fases, botão “Repetir fase” (repete a fase atual), botão 🔊 para ouvir a instrução, estrelas na tela inicial para atividades concluídas, favicon embutido (sem 404 no console).
- Botão de tela cheia escondido quando o navegador não suporta; fala e áudio protegidos contra navegadores sem Web Speech ou WebAudio.

## Limitações registradas

- As gravações dos animais vêm do Wikimedia Commons (licenças em `assets/audio/animals/CREDITS.md`); não havia gravação livre de leão, por isso o leão deu lugar ao elefante. A síntese fica como reserva se um arquivo falhar.
- A narração depende da voz pt-BR do navegador. No iOS, a voz só funciona após um toque (o botão Brincar já conta).
- Validação física em lousa digital e tablet depende de hardware real; o projeto foi verificado em navegador automatizado nas larguras de 390, 820 e 1280 px.

## Rodadas anteriores

### Protótipo do montador
- IDs `head`/`eyeL` ambíguos foram substituídos por `body`/`head`, com dados semânticos em `robot-parts.js`.
- A ordem da locução agora vem da lista de peças da fase.
- Losango e estrela ganharam slots-guia próprios e são encaixáveis por toque, teclado e arraste.
- Layout deixou de depender de `100vh`, `overflow:hidden`, botão de voz sobreposto e CDN.
- Fala automática na Home foi removida; a síntese aguarda uma ação da criança/professora.
- Áudio usa um único `AudioContext`, ativado no primeiro gesto.

### Protótipo do hub
- O botão Vamos brincar agora abre o hub real e as seis atividades são geradas pelo registro.
- A tela de professora é alcançável e inclui zerar progresso.
- Reinicialização, fala, som, progresso e navegação compartilham um contrato comum.
- O projeto não solicita recursos externos.

## Rodada 3.1 (retorno da professora)

- O botão Voltar em “Dicas para professores” não funcionava: o seletor pegava o botão “Início” da barra superior em vez do botão da tela. Agora o seletor é restrito ao conteúdo da tela.
- Em Robôs iguais, a carta do par encontrado desvirava e virava de novo: a animação de “pop” usava `transform` e sobrescrevia o `rotateY` da carta. A animação passou para a figura dentro da carta, o giro ficou mais curto (0,3 s) e o toque não altera mais a rotação.
- Em Descubra os sons, o som sintetizado do animal ficou mais alto, toca duas vezes e a onomatopeia narrada só entra depois dele. Ícones dos animais maiores (regra `.option span` sobrescrevia o tamanho).

## Rodada 3.2

- Descubra os sons agora toca gravações reais (12 animais, Wikimedia Commons, até 4 s, normalizadas) e só depois fala a onomatopeia. Leão trocado por elefante por falta de gravação livre.
- O botão único de som silenciava também os animais. Agora há dois botões: “Voz” (narração) e “Sons” (efeitos e animais), salvos separadamente.
- Formas mágicas: cada espaço do robô tem contorno e fundo na cor da peça (e o contorno pontilhado da forma), para a criança decidir perna esquerda ou direita pela cor, sem depender da voz.
