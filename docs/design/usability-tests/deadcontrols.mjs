import puppeteer from 'puppeteer-core';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const defaultPage = resolve(dirname(fileURLToPath(import.meta.url)), '../wireframes.html');
const require_path = (p) => resolve(p);const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('file://' + (process.argv[2] ? require_path(process.argv[2]) : defaultPage));
const flows = await page.evaluate(() => FLOWS.map(f => ({ id: f.id, steps: f.steps.length })));
const dead = [], small = [], overflow = [];
for (let fi = 0; fi < flows.length; fi++) for (let si = 0; si < flows[fi].steps; si++) {
  await page.evaluate((a, b) => go(a, b), fi, si);
  const label = `${flows[fi].id}:${si}`;
  // layout checks on this screen
  const info = await page.evaluate(() => {
    const scr = document.getElementById('screen'), dev = document.getElementById('device');
    const out = { over: scr.scrollWidth > scr.clientWidth + 1, tiny: [] };
    scr.querySelectorAll('button, input, select, textarea, label.check-row').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height && (r.height < 36 || r.width < 36) && !el.closest('.keypad')) out.tiny.push((el.textContent || el.id || el.tagName).trim().slice(0, 24) + ` ${Math.round(r.width)}x${Math.round(r.height)}`);
    });
    out.count = scr.querySelectorAll('button:not(:disabled), input, select, textarea, summary').length;
    return out;
  });
  if (info.over) overflow.push(label);
  if (info.tiny.length) small.push(label + ' ' + info.tiny.slice(0, 3).join('; '));
  // click every enabled control, one at a time on a fresh render, and see if anything changes
  for (let i = 0; i < info.count; i++) {
    await page.evaluate((a, b) => go(a, b), fi, si);
    const res = await page.evaluate((i) => {
      const scr = document.getElementById('screen');
      const el = [...scr.querySelectorAll('button:not(:disabled), input, select, textarea, summary')][i];
      const name = (el.textContent || el.placeholder || el.id || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 30);
      const before = scr.innerHTML + '|' + location.hash + document.getElementById('stepTitle').textContent;
      if (el.tagName === 'INPUT' && el.type === 'text' || el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && !el.type.match(/checkbox|radio/))) { el.focus(); return { name, kind: 'field' }; }
      if (el.tagName === 'SELECT' || el.tagName === 'SUMMARY') { el.click(); return { name, kind: 'native' }; }
      el.click();
      const after = scr.innerHTML + '|' + location.hash + document.getElementById('stepTitle').textContent;
      // pressed-state or checked changes live in attributes that innerHTML captures
      return { name, kind: 'btn', changed: before !== after };
    }, i);
    if (res.kind === 'btn' && !res.changed) dead.push(`${label}  "${res.name}"`);
  }
}
console.log('SCREENS', flows.reduce((a, f) => a + f.steps, 0));
console.log('\nDEAD CONTROLS (click changes nothing):', dead.length); dead.forEach(d => console.log('  ' + d));
console.log('\nHORIZONTAL OVERFLOW:', overflow.length, overflow.join(', '));
console.log('\nSMALL TARGETS (<36px):', small.length); small.forEach(s => console.log('  ' + s));
await browser.close();
