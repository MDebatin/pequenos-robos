import test from 'node:test';
import assert from 'node:assert/strict';
import { robotParts, partById } from '../js/data/robot-parts.js';
import { shapeLevels } from '../js/data/levels/shapes.js';
import { colors } from '../js/data/colors.js';
import { shapeInner } from '../js/ui/shapes-svg.js';

test('todas as peças citadas nas fases de formas existem e pertencem ao robô da fase', () => {
  for (const level of shapeLevels) for (const id of level.parts) {
    const part = partById(id);
    assert.ok(part, `peça ausente: ${id}`);
    assert.equal(part.robot, level.robot, `${id} não pertence ao robô ${level.robot}`);
  }
});
test('toda forma usada nas peças tem desenho', () => {
  for (const part of robotParts) assert.ok(shapeInner(part.shape, '#000').length > 0, `forma sem desenho: ${part.shape}`);
});
test('ids e nomes falados das peças são únicos', () => {
  assert.equal(new Set(robotParts.map(p => p.id)).size, robotParts.length);
  assert.equal(new Set(robotParts.map(p => p.spoken)).size, robotParts.length);
});
test('dentro de cada robô, as cores das peças são únicas', () => {
  for (const robot of new Set(robotParts.map(p => p.robot))) {
    const parts = robotParts.filter(p => p.robot === robot);
    assert.equal(new Set(parts.map(p => p.colorName)).size, parts.length, `cores repetidas no robô ${robot}`);
  }
});
test('slots de uma mesma fase e camada não se sobrepõem', () => {
  for (const level of shapeLevels) {
    const parts = level.parts.map(partById);
    for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
      if (parts[i].z !== parts[j].z) continue;
      const a = parts[i].slot, b = parts[j].slot;
      const overlap = a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
      assert.equal(overlap, false, `fase ${level.level}: ${parts[i].id} sobrepõe ${parts[j].id}`);
    }
  }
});
test('slots ficam dentro do cenário 360x350', () => {
  for (const part of robotParts) {
    const s = part.slot;
    assert.ok(s.x >= 0 && s.y >= 0 && s.x + s.w <= 360 && s.y + s.h <= 350, `${part.id} sai do cenário`);
  }
});
test('cada robô das formas tem fases com quantidade crescente de peças', () => {
  for (const robot of new Set(shapeLevels.map(l => l.robot))) {
    const levels = shapeLevels.filter(l => l.robot === robot);
    for (let i = 1; i < levels.length; i++) {
      assert.ok(levels[i].parts.length > levels[i - 1].parts.length, `fase ${levels[i].level} não aumenta`);
      for (const id of levels[i - 1].parts) assert.ok(levels[i].parts.includes(id), `fase ${levels[i].level} perdeu ${id}`);
    }
  }
});
test('fases de formas têm pelo menos 5 níveis, títulos, intro e outro', () => {
  assert.ok(shapeLevels.length >= 5);
  for (const level of shapeLevels) assert.ok(level.title && level.intro && level.outro && ['always', 'error'].includes(level.hint));
});
test('cores: ids e nomes únicos', () => {
  assert.equal(new Set(colors.map(c => c.id)).size, colors.length);
  assert.equal(new Set(colors.map(c => c.name)).size, colors.length);
});
