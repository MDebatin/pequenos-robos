// Peças de "Formas mágicas". `robot` indica a composição (classic = robô azul clássico; round = Robô Redondo).
// slot = posição e tamanho no viewBox 360x350 do cenário; z = ordem de desenho.
export const robotParts = [
  // Robô clássico
  { id: 'head', robot: 'classic', shape: 'circle', color: '#ef4444', colorName: 'vermelho', spoken: 'a cabeça redonda', role: 'cabeça', slot: { x: 130, y: 62, w: 100, h: 82 }, z: 4, mark: 'olhos' },
  { id: 'body', robot: 'classic', shape: 'square', color: '#3b82f6', colorName: 'azul', spoken: 'o tronco quadrado', role: 'tronco', slot: { x: 105, y: 145, w: 150, h: 112 }, z: 3, mark: 'painel' },
  { id: 'hat', robot: 'classic', shape: 'triangle', color: '#f59e0b', colorName: 'laranja', spoken: 'o chapéu triangular', role: 'chapéu', slot: { x: 134, y: 4, w: 92, h: 60 }, z: 6, mark: 'listras' },
  { id: 'legLeft', robot: 'classic', shape: 'rectangle', color: '#10b981', colorName: 'verde', spoken: 'a perna esquerda', role: 'perna esquerda', slot: { x: 112, y: 260, w: 58, h: 72 }, z: 2, mark: 'uma faixa' },
  { id: 'legRight', robot: 'classic', shape: 'rectangle', color: '#06b6d4', colorName: 'azul-claro', spoken: 'a perna direita', role: 'perna direita', slot: { x: 190, y: 260, w: 58, h: 72 }, z: 2, mark: 'duas faixas' },
  { id: 'ear', robot: 'classic', shape: 'triangle', color: '#a855f7', colorName: 'roxo', spoken: 'a antena triangular', role: 'antena', slot: { x: 48, y: 82, w: 58, h: 58 }, z: 5, mark: 'ponto' },
  { id: 'badge', robot: 'classic', shape: 'rhombus', color: '#ec4899', colorName: 'rosa', spoken: 'o emblema losango', role: 'emblema', slot: { x: 160, y: 170, w: 42, h: 42 }, z: 7, mark: 'losango' },
  { id: 'core', robot: 'classic', shape: 'star', color: '#facc15', colorName: 'amarelo', spoken: 'o coração estrela', role: 'coração', slot: { x: 160, y: 204, w: 42, h: 42 }, z: 8, mark: 'estrela' },
  // Robô Redondo: novas formas (oval, hexágono, coração, meia-lua) e outra composição
  { id: 'headB', robot: 'round', shape: 'square', color: '#10b981', colorName: 'verde', spoken: 'a cabeça quadrada', role: 'cabeça', slot: { x: 132, y: 44, w: 96, h: 88 }, z: 4, mark: 'olhos' },
  { id: 'bodyB', robot: 'round', shape: 'circle', color: '#f59e0b', colorName: 'laranja', spoken: 'o tronco redondo', role: 'tronco', slot: { x: 100, y: 132, w: 160, h: 150 }, z: 3, mark: 'barriga' },
  { id: 'hatB', robot: 'round', shape: 'hexagon', color: '#a855f7', colorName: 'roxo', spoken: 'o chapéu hexágono', role: 'chapéu', slot: { x: 142, y: 0, w: 76, h: 50 }, z: 6, mark: 'seis lados' },
  { id: 'armLeftB', robot: 'round', shape: 'oval', color: '#3b82f6', colorName: 'azul', spoken: 'o braço oval esquerdo', role: 'braço esquerdo', slot: { x: 18, y: 168, w: 84, h: 56 }, z: 2, mark: 'uma bolinha' },
  { id: 'armRightB', robot: 'round', shape: 'oval', color: '#ec4899', colorName: 'rosa', spoken: 'o braço oval direito', role: 'braço direito', slot: { x: 258, y: 168, w: 84, h: 56 }, z: 2, mark: 'duas bolinhas' },
  { id: 'footLeftB', robot: 'round', shape: 'semicircle', color: '#06b6d4', colorName: 'azul-claro', spoken: 'o pé meia-lua esquerdo', role: 'pé esquerdo', slot: { x: 106, y: 278, w: 68, h: 52 }, z: 2, mark: 'um risquinho' },
  { id: 'footRightB', robot: 'round', shape: 'semicircle', color: '#facc15', colorName: 'amarelo', spoken: 'o pé meia-lua direito', role: 'pé direito', slot: { x: 186, y: 278, w: 68, h: 52 }, z: 2, mark: 'dois risquinhos' },
  { id: 'heartB', robot: 'round', shape: 'heart', color: '#ef4444', colorName: 'vermelho', spoken: 'o coração', role: 'coração', slot: { x: 152, y: 178, w: 56, h: 56 }, z: 7, mark: 'coração' }
];
export const partById = id => robotParts.find(part => part.id === id);
