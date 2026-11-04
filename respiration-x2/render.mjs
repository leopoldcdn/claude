import { chromium } from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root=process.cwd(); const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript'};
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(root,u==='/'?'scene.html':u);
 fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});r.end(d)})});
await new Promise(r=>srv.listen(0,r)); const port=srv.address().port;
const [,, mode, a, b, outdir] = process.argv; // mode: frames <from> <to> <dir> | shots t1,t2,... | cover
const FPS=30;
const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--no-sandbox']});
const page=await browser.newPage({viewport:{width:1080,height:1920}});
page.on('pageerror',e=>console.log('ERR',e.message)); page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
await page.goto(`http://localhost:${port}/scene.html${mode==='cover'?'?cover=1':''}`);
await page.waitForFunction('window.READY');
await page.evaluate(()=>document.fonts.ready);
if(mode==='shots'){fs.mkdirSync('shots',{recursive:true});for(const t of a.split(',')){await page.evaluate(t=>window.seek(t),+t);await page.screenshot({path:`shots/t${t}.png`})}}
else if(mode==='cover'){await page.evaluate(()=>window.seek(0));await page.screenshot({path:'cover.png'})}
else{fs.mkdirSync(outdir,{recursive:true});for(let f=+a;f<+b;f++){await page.evaluate(t=>window.seek(t),f/FPS);
  await page.screenshot({path:`${outdir}/f${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:93});}}
await browser.close();srv.close();
