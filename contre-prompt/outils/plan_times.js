// Affiche en JSON les instants de changement de scène (balayages) d'une vidéo : node plan_times.js <dossier source>
const vm = require('vm'), fs = require('fs'), path = require('path');
const dir = path.resolve(process.argv[2] || '.');
const ctx = vm.createContext({ window: {}, console, Math, document: { createElement: () => ({ getContext: () => ({}) }) } });
vm.runInContext(fs.readFileSync(path.join(dir, 'timing.js'), 'utf8'), ctx);
ctx.TIMING = ctx.window.TIMING;
vm.runInContext(fs.readFileSync(path.join(dir, 'lib.js'), 'utf8') + '\n' + fs.readFileSync(path.join(dir, 'scenes.js'), 'utf8') + '\nthis.__plan = plan;', ctx);
const pl = ctx.__plan();
console.log(JSON.stringify({ wipes: pl.filter(p => p.wipe).map(p => +p.t.toFixed(3)), cues: ctx.TIMING.cues, video_end: ctx.TIMING.video_end, voice_end: ctx.TIMING.voice_end }));
