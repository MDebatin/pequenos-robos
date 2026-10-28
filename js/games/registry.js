import shapes from './shapes/index.js';
import colors from './colors/index.js';
import path from './path/index.js';
import memory from './memory/index.js';
import sounds from './sounds/index.js';
import create from './create/index.js';
export const registry = [colors, shapes, path, memory, sounds, create];
export const gameById = id => registry.find(game => game.id === id);
