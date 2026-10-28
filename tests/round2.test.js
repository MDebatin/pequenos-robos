import test from 'node:test';
import assert from 'node:assert/strict';
import { colors } from '../js/data/colors.js';
import { activityLevels } from '../js/data/levels/activities.js';
import { createSteps, defaultRobot, randomRobot, robotSpec } from '../js/data/create-options.js';
import { robotSvg, robotPartOptions, robotRegions } from '../js/ui/robot-svg.js';
import { sounds, soundById } from '../js/data/sounds.js';
import { animalPatterns } from '../js/services/animal-sounds.js';
import { solve, isBlocked } from '../js/games/path/solver.js';
import { memoryRobots } from '../js/games/memory/index.js';
import { drawRound, shuffle } from '../js/games/helpers.js';

const rgb = hex => { const n = hex.slice(1); return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16)); };
const distance = (a, b) => Math.sqrt(rgb(a).reduce((sum, value, index) => sum + (value - rgb(b)[index]) ** 2, 0));

test('cores são visualmente distintas entre si', () => {
  for (let i = 0; i < colors.length; i++) for (let j = i + 1; j < colors.length; j++) assert.ok(distance(colors[i].value, colors[j].value) >= 35, `${colors[i].name} e ${colors[j].name} são muito próximas`);
});
test('fases de cores: pelo menos 5, dificuldade crescente e opções disponíveis', () => {
  const levels = activityLevels.colors;
  assert.ok(levels.length >= 5);
  for (let i = 0; i < levels.length; i++) {
    assert.ok(levels[i].options >= 2 && levels[i].options <= colors.length);
    assert.ok(['swatch', 'robot', 'mixed'].includes(levels[i].mode));
    if (i) assert.ok(levels[i].options >= levels[i - 1].options);
  }
  assert.equal(levels[0].options, 2, 'a primeira fase começa com duas opções');
});
test('drawRound inclui o alvo, não repete o anterior e devolve a quantidade pedida', () => {
  for (let i = 0; i < 200; i++) {
    const { target, options } = drawRound(colors, 4, 'blue');
    assert.notEqual(target.id, 'blue');
    assert.equal(options.length, 4);
    assert.ok(options.includes(target));
    assert.equal(new Set(options.map(o => o.id)).size, 4);
  }
  assert.equal(drawRound(colors.slice(0, 2), 2, 'blue').target.id, 'yellow');
});
test('shuffle preserva os elementos', () => {
  const list = [1, 2, 3, 4, 5];
  assert.deepEqual([...shuffle(list)].sort(), list);
});

test('caminho: pelo menos 5 fases, todas solucionáveis, com início e meta livres e distintos', () => {
  const levels = activityLevels.path;
  assert.ok(levels.length >= 5);
  for (const [i, level] of levels.entries()) {
    assert.ok(!isBlocked(level, level.start), `fase ${i + 1}: início bloqueado`);
    assert.ok(!isBlocked(level, level.goal), `fase ${i + 1}: meta bloqueada`);
    assert.notDeepEqual(level.start, level.goal);
    const path = solve(level);
    assert.ok(path && path.length > 0, `fase ${i + 1} não tem solução`);
    assert.ok(level.theme, 'fase sem tema de obstáculo');
    for (const obstacle of level.obstacles) assert.ok(obstacle.c < level.grid.cols && obstacle.r < level.grid.rows, `fase ${i + 1}: obstáculo fora da grade`);
  }
});
test('caminho: as fases ficam mais longas ou maiores, nunca mais fáceis que a primeira', () => {
  const levels = activityLevels.path;
  const first = solve(levels[0]).length;
  for (const level of levels) assert.ok(solve(level).length >= first);
  assert.ok(solve(levels.at(-1)).length > first + 3, 'a última fase deve exigir bem mais passos');
  assert.ok(levels.some(level => { const path = solve(level); return path.includes('down') || path.includes('left'); }), 'alguma fase deve exigir descer ou ir à esquerda');
});
test('caminho: solve a partir de qualquer célula livre devolve um caminho (dicas funcionam)', () => {
  for (const level of activityLevels.path) for (let c = 0; c < level.grid.cols; c++) for (let r = 0; r < level.grid.rows; r++) {
    if (isBlocked(level, { c, r })) continue;
    assert.ok(solve(level, { c, r }) !== null, `célula ${c},${r} sem saída`);
  }
});

test('memória: há robôs distintos suficientes para a maior fase e as fases crescem', () => {
  const levels = activityLevels.memory;
  assert.ok(levels.length >= 5);
  assert.ok(memoryRobots.length >= Math.max(...levels.map(l => l.pairs)));
  assert.equal(new Set(memoryRobots.map(r => r.id)).size, memoryRobots.length);
  assert.equal(new Set(memoryRobots.map(r => r.spec.color)).size, memoryRobots.length, 'cada robô da memória tem uma cor própria');
  for (let i = 1; i < levels.length; i++) assert.ok(levels[i].pairs > levels[i - 1].pairs);
});

test('sons: fases citam sons cadastrados, com pool suficiente e começando por gato e cachorro', () => {
  const levels = activityLevels.sounds;
  assert.ok(levels.length >= 5);
  assert.deepEqual(levels[0].pool, ['gato', 'cachorro']);
  for (const level of levels) {
    assert.ok(level.pool.length >= level.options, 'pool menor que a quantidade de opções');
    for (const id of level.pool) assert.ok(soundById(id), `som ausente: ${id}`);
  }
  for (const sound of sounds) assert.ok(animalPatterns.includes(sound.id), `sem som sintetizado para ${sound.id}`);
  assert.equal(new Set(sounds.map(s => s.id)).size, sounds.length);
});

test('criação: etapas cobrem cabeça, corpo, olhos, boca, antena, braços, pernas e cores', () => {
  const keys = createSteps.map(step => step.key);
  for (const key of ['body', 'color', 'head', 'headColor', 'eyes', 'mouth', 'antenna', 'arms', 'legs']) assert.ok(keys.includes(key), `etapa ausente: ${key}`);
  for (const step of createSteps) {
    assert.ok(step.options.length >= 2 && step.prompt && step.label);
    assert.equal(new Set(step.options.map(o => o.id)).size, step.options.length);
    assert.ok(robotRegions[step.region], `região de miniatura inválida: ${step.region}`);
    if (!step.isColor) for (const option of step.options) assert.ok(robotPartOptions[step.key].includes(option.id), `${step.key}:${option.id} não tem desenho`);
    assert.ok(step.options.some(option => option.id === defaultRobot[step.key]), `padrão inválido em ${step.key}`);
  }
});
test('criação: todo robô (padrão e aleatório) renderiza um SVG com todas as camadas', () => {
  for (const state of [defaultRobot, randomRobot(), randomRobot(), randomRobot()]) {
    const svg = robotSvg(robotSpec(state));
    assert.ok(svg.startsWith('<svg') && svg.trim().endsWith('</svg>'));
    for (const layer of ['robot-legs', 'robot-arms', 'robot-body', 'robot-head', 'robot-eyes']) assert.ok(svg.includes(layer), `falta ${layer}`);
    assert.ok(!svg.includes('undefined'), 'SVG com valor indefinido');
  }
});
