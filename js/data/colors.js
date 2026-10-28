export const colors = [
  { id: 'blue', name: 'azul', label: 'Azul', value: '#3b82f6' },
  { id: 'yellow', name: 'amarelo', label: 'Amarelo', value: '#ffd21f' },
  { id: 'red', name: 'vermelho', label: 'Vermelho', value: '#ef5350' },
  { id: 'green', name: 'verde', label: 'Verde', value: '#34b982' },
  { id: 'pink', name: 'rosa', label: 'Rosa', value: '#ff6f91' },
  { id: 'orange', name: 'laranja', label: 'Laranja', value: '#ff9f43' },
  { id: 'purple', name: 'roxo', label: 'Roxo', value: '#8d6ee8' },
  { id: 'brown', name: 'marrom', label: 'Marrom', value: '#8d5a3b' },
  { id: 'black', name: 'preto', label: 'Preto', value: '#2b2b33' },
  { id: 'white', name: 'branco', label: 'Branco', value: '#ffffff' }
];
export const colorById = id => colors.find(color => color.id === id);
