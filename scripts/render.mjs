#!/usr/bin/env node
// Browser renderer; project colors are supplied by the caller, never defaulted here.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const help = `Usage: node render.mjs INPUT.svg|INPUT.html|URL [--vars roles.json] [--out output-prefix] [--width CSS_PX] [--height CSS_PX] [--selector CSS] [--chrome executable]\nOutputs PREFIX.1x.png and PREFIX.3x.png. --vars is a JSON object mapping CSS custom property names (including --) to CSS values.\nRequires playwright or playwright-core (install locally or expose via NODE_PATH), and Chrome (CHROME_PATH or --chrome). Width/height default to SVG intrinsic size, or 1200x720 for a page.`;
async function main() {
 const args = process.argv.slice(2);
 if (!args.length || args.includes('--help')) { console.log(help); return; }
 const input = args.shift(), opts = {};
 for (let i=0;i<args.length;i+=2) {
  const key=args[i];
  if (!['--vars','--out','--width','--height','--selector','--chrome'].includes(key) || !args[i+1]) throw Error(`Invalid option: ${key}\n${help}`);
  opts[key.slice(2)]=args[i+1];
 }
 const remote=/^https?:\/\//.test(input);
 const url=remote?input:pathToFileURL(path.resolve(input)).href;
 const prefix=path.resolve(opts.out || (remote?'page':input.replace(/\.[^.\/]+$/,'')));
 const vars=opts.vars?JSON.parse(await fs.readFile(opts.vars,'utf8')):{};
 if (!vars || Array.isArray(vars) || typeof vars!=='object' || Object.entries(vars).some(([k,v])=>!/^--[\w-]+$/.test(k)||typeof v!=='string'||!v.trim())) throw Error('--vars must map CSS custom property names to nonempty CSS strings');
 for (const k of ['width','height']) if (opts[k] && (!/^\d+$/.test(opts[k]) || +opts[k]<1)) throw Error(`Invalid --${k}`);
 let chromium;
 for (const name of ['playwright','playwright-core']) { try { chromium=require(name).chromium; break; } catch {} }
 if (!chromium) throw Error('Install playwright/playwright-core or expose its package directory via NODE_PATH.');
 let executablePath=opts.chrome||process.env.CHROME_PATH;
 if (!executablePath) for (const candidate of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser']) { try { await fs.access(candidate); executablePath=candidate; break; } catch {} }
 const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{} )});
 try {
  let width=+(opts.width||1200),height=+(opts.height||720);
  async function prepare(scale) {
   const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:scale,reducedMotion:'reduce'});
   const page=await context.newPage();
   await page.goto(url,{waitUntil:'load',timeout:30000});
   await page.evaluate(values=>{
    for(const [k,v] of Object.entries(values)) document.documentElement.style.setProperty(k,v,'important');
   },vars);
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   await page.evaluate(()=>{const style=document.createElementNS(document.documentElement.namespaceURI,'style');style.textContent='*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';document.documentElement.appendChild(style);});
   await page.evaluate(()=>{document.querySelectorAll('svg').forEach(s=>s.pauseAnimations?.());});
   // Inspect actual source expressions. Check per element, so locally scoped variables work.
   const missing=await page.evaluate(()=>{
    const missing=new Set();
    for(const el of document.querySelectorAll('*')) {
     const expressions=[...el.attributes].map(a=>a.value);
     if(el.tagName.toLowerCase()==='style') expressions.push(el.textContent);
     for(const expression of expressions) for(const m of expression.matchAll(/var\(\s*(--[\w-]+)\s*([,)])/g)) {
      if(m[2]===')'&&!getComputedStyle(el.tagName.toLowerCase()==='style'?document.documentElement:el).getPropertyValue(m[1]).trim()) missing.add(m[1]);
     }
    }
    return [...missing];
   });
   if(missing.length) {await context.close();throw Error(`Unresolved CSS variables: ${missing.join(', ')}. Supply --vars; no fallback colors are invented.`);}
   return {page,context};
  }
  const first=await prepare(1);
  const svgDocument=await first.page.evaluate(()=>document.documentElement.localName==='svg');
  const selector=opts.selector||(svgDocument?'svg':'body');
  if(svgDocument && (!opts.width||!opts.height)) {
   const size=await first.page.evaluate(()=>{
    const s=document.documentElement,v=s.viewBox.baseVal;
    const w=s.width.baseVal.unitType===1?s.width.baseVal.value:v.width;
    const h=s.height.baseVal.unitType===1?s.height.baseVal.value:v.height;
    return {width:w,height:h};
   });
   if(!opts.width) width=Math.ceil(size.width||width);
   if(!opts.height) height=Math.ceil(size.height||height);
  }
  await first.context.close();
  await fs.mkdir(path.dirname(prefix),{recursive:true});
  for(const scale of [1,3]) {
   const {page,context}=await prepare(scale);
   try {
    if(svgDocument) await page.evaluate(({width,height})=>{Object.assign(document.documentElement.style,{width:`${width}px`,height:`${height}px`,display:'block'});},{width,height});
    const target=page.locator(selector);
    if(await target.count()!==1) throw Error(`--selector must match exactly one element: ${selector}`);
    const file=`${prefix}.${scale}x.png`;
    await target.screenshot({path:file,animations:'disabled',timeout:30000});
    console.log(file);
   } finally {await context.close();}
  }
 } finally {await browser.close();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
