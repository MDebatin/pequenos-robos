// Etapas e opções de "Crie seu robô". Cada etapa altera uma chave do estado do robô.
// As formas são desenhadas por js/ui/robot-svg.js; aqui ficam apenas ids, rótulos e cores.
export const palette = [
  { id: 'blue', label: 'Azul', value: '#3b82f6' },
  { id: 'yellow', label: 'Amarelo', value: '#ffd21f' },
  { id: 'pink', label: 'Rosa', value: '#ff6f91' },
  { id: 'green', label: 'Verde', value: '#34b982' },
  { id: 'purple', label: 'Roxo', value: '#8d6ee8' },
  { id: 'red', label: 'Vermelho', value: '#ef5350' },
  { id: 'orange', label: 'Laranja', value: '#ff9f43' },
  { id: 'teal', label: 'Azul-claro', value: '#22b8cf' },
  { id: 'cream', label: 'Creme', value: '#ffe29a' },
  { id: 'gray', label: 'Cinza', value: '#c9d6e2' }
];

export const createSteps = [
  { key: 'body', label: 'Corpo', icon: '🟦', prompt: 'Escolha o formato do corpo do seu robô!', region: 'body', options: [
    { id: 'rounded', label: 'Quadrado' }, { id: 'oval', label: 'Redondo' }, { id: 'tall', label: 'Alto' }, { id: 'hex', label: 'Hexágono' }, { id: 'heart', label: 'Coração' }
  ] },
  { key: 'color', label: 'Cor', icon: '🎨', prompt: 'Qual cor o corpo vai ter?', region: 'body', isColor: true, options: palette },
  { key: 'head', label: 'Cabeça', icon: '🙂', prompt: 'Escolha a forma da cabeça!', region: 'head', options: [
    { id: 'round', label: 'Redonda' }, { id: 'square', label: 'Quadrada' }, { id: 'dome', label: 'Arredondada' }
  ] },
  { key: 'headColor', label: 'Cor da cabeça', icon: '🖍️', prompt: 'E a cabeça, de que cor vai ser?', region: 'head', isColor: true, options: palette },
  { key: 'eyes', label: 'Olhos', icon: '👀', prompt: 'Como são os olhos do seu robô?', region: 'face', options: [
    { id: 'round', label: 'Redondos' }, { id: 'big', label: 'Grandes' }, { id: 'happy', label: 'Felizes' }, { id: 'cyclops', label: 'Um olho' }, { id: 'visor', label: 'Visor' }, { id: 'sleepy', label: 'Soninho' }
  ] },
  { key: 'mouth', label: 'Boca', icon: '😄', prompt: 'Escolha a boca!', region: 'face', options: [
    { id: 'smile', label: 'Sorriso' }, { id: 'open', label: 'Risada' }, { id: 'surprise', label: 'Surpresa' }, { id: 'grille', label: 'Grade' }, { id: 'tongue', label: 'Língua' }
  ] },
  { key: 'antenna', label: 'Antena', icon: '📡', prompt: 'Que antena o robô vai usar?', region: 'top', options: [
    { id: 'none', label: 'Sem antena' }, { id: 'ball', label: 'Bolinha' }, { id: 'double', label: 'Duas' }, { id: 'ray', label: 'Raio' }, { id: 'spring', label: 'Mola' }
  ] },
  { key: 'arms', label: 'Braços', icon: '💪', prompt: 'Agora os braços!', region: 'arms', options: [
    { id: 'straight', label: 'Retos' }, { id: 'claw', label: 'Garras' }, { id: 'wave', label: 'Acenando' }, { id: 'strong', label: 'Fortes' }, { id: 'none', label: 'Sem braços' }
  ] },
  { key: 'legs', label: 'Pernas', icon: '🦿', prompt: 'Como o robô vai andar?', region: 'legs', options: [
    { id: 'boots', label: 'Botas' }, { id: 'wheels', label: 'Rodas' }, { id: 'springs', label: 'Molas' }, { id: 'tank', label: 'Esteira' }, { id: 'long', label: 'Compridas' }
  ] },
  { key: 'hat', label: 'Chapéu', icon: '🎩', prompt: 'Quer um chapéu ou enfeite na cabeça?', region: 'head', options: [
    { id: 'none', label: 'Nada' }, { id: 'hat', label: 'Chapéu' }, { id: 'crown', label: 'Coroa' }, { id: 'bow', label: 'Laço' }, { id: 'headphones', label: 'Fones' }, { id: 'helmet', label: 'Capacete' }, { id: 'glasses', label: 'Óculos' }, { id: 'flower', label: 'Flor' }
  ] },
  { key: 'chest', label: 'Peito', icon: '⭐', prompt: 'Para terminar, um enfeite no peito!', region: 'body', options: [
    { id: 'none', label: 'Nada' }, { id: 'heart', label: 'Coração' }, { id: 'star', label: 'Estrela' }, { id: 'ray', label: 'Raio' }, { id: 'gear', label: 'Engrenagem' }, { id: 'screen', label: 'Telinha' }, { id: 'buttons', label: 'Botões' }
  ] }
];

export const defaultRobot = { body: 'rounded', color: 'blue', head: 'round', headColor: 'cream', eyes: 'round', mouth: 'smile', antenna: 'ball', arms: 'straight', legs: 'boots', hat: 'none', chest: 'none' };

export const colorValue = id => palette.find(color => color.id === id)?.value || palette[0].value;

// Converte o estado (ids) em uma especificação de desenho (cores em hexadecimal).
export const robotSpec = state => ({ ...state, color: colorValue(state.color), headColor: colorValue(state.headColor) });

export function randomRobot() {
  const random = list => list[Math.floor(Math.random() * list.length)].id;
  return Object.fromEntries(createSteps.map(step => [step.key, random(step.options)]));
}
