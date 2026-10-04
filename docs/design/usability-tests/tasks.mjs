import puppeteer from 'puppeteer-core';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const defaultPage = resolve(dirname(fileURLToPath(import.meta.url)), '../wireframes.html');
const require_path = (p) => resolve(p);const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const page = await browser.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => m.type() === 'error' && errors.push(m.text()));
await page.setViewport({ width: 1440, height: 900 });
await page.goto('file://' + (process.argv[2] ? require_path(process.argv[2]) : defaultPage));
const results = [];
let taps = 0;
const T = (name, fn) => async () => { taps = 0; let ok = false, note = ''; try { [ok, note] = await fn(); } catch (e) { note = 'ERROR ' + e.message.split('\n')[0]; } results.push({ name, ok, taps, note }); };
// tap by visible text inside the device screen (or action bar); this is what a first-time user can do
const tap = async (text, scope = '#screen') => {
  const h = await page.evaluateHandle((text, scope) => [...document.querySelectorAll(scope + ' button, ' + scope + ' summary, ' + scope + ' .check-row, ' + scope + ' label')].find(b => b.offsetParent && b.textContent.trim().replace(/\s+/g, ' ').includes(text) && !b.disabled), text, scope);
  const el = h.asElement(); if (!el) throw new Error('no visible control "' + text + '"');
  await el.click(); taps++;
};
const key = async (k) => { await page.evaluate(k => document.querySelector(`[data-pin="${k}"]`).click(), k); taps++; };
const go = (f, s) => page.evaluate((f, s) => go(FLOWS.findIndex(x => x.id === f), s), f, s);
const rows = () => page.evaluate(() => [...document.querySelectorAll('#screen [data-tags]')].filter(r => !r.hidden).length);
const text = (sel = '#screen') => page.evaluate(sel => document.querySelector(sel).innerText, sel);
const step = () => page.evaluate(() => document.getElementById('stepTitle').textContent);
const type = async (sel, v) => { await page.focus(sel); await page.evaluate(sel => document.querySelector(sel).select(), sel); await page.keyboard.press('Backspace'); if (v) await page.keyboard.type(v); taps++; };

const tasks = [
 T('T1 Nurse: unlock, filter to urgent, open the urgent child, reach weight entry', async () => {
   await go('signin', 0); for (const k of [1, 2, 3, 4]) await key(k); await new Promise(r => setTimeout(r, 400));
   if ((await step()) !== 'Queue') return [false, 'PIN did not unlock to the queue'];
   const all = await rows(); await tap('Urgent'); const urg = await rows();
   if (all !== 4 || urg !== 1) return [false, `filter shows ${all} then ${urg} rows (want 4 then 1)`];
   await tap('Sample child'); await tap('Enter measurements'); return [(await step()) === 'Weight and temperature', 'ended on ' + (await step())];
 }),
 T('T2 Filters: every chip shows only its rows, All restores the list', async () => {
   await go('signin', 1); const out = [];
   for (const [c, want] of [['Urgent', 1], ['Has card', 3], ['No card', 1], ['All', 4]]) { await tap(c, '[data-qchips]'); out.push(await rows()); if (out.at(-1) !== want) return [false, `${c}: ${out.at(-1)} rows, want ${want}`]; }
   return [true, 'counts ' + out.join(' → ')];
 }),
 T('T3 Queue: all four rows lead somewhere', async () => {
   const dests = [];
   for (const n of ['Sample child', 'Nakato', 'Sample adult', 'Walk-in']) { await go('signin', 1); await tap(n); dests.push(n.split(' ')[0] + '→' + (await step())); }
   return [dests.every(d => !d.endsWith('→Queue')), dests.join(' · ')];
 }),
 T('T4 Clerk: wrong code shows an error and a way out; right code opens the card', async () => {
   await go('clerk', 0); await type('#code', '0000'); const bad = await text('#lookup');
   if (!/No card for code 0000/.test(bad)) return [false, 'no error for 0000: ' + bad.slice(0, 40)];
   const disabled = await page.evaluate(() => document.querySelector('.actionbar .primary').disabled);
   await type('#code', '7306'); const good = await text('#lookup');
   return [disabled && /Sample adult/.test(good), `error shown, Open record ${disabled ? 'disabled' : 'ENABLED'}, 7306 → found`];
 }),
 T('T5 Clinician: tick pneumonia via search and close the visit', async () => {
   await go('clinician', 1); await type('#dxsearch', 'pneu');
   const vis = await page.evaluate(() => [...document.querySelectorAll('.dxrow')].filter(r => !r.hidden).length);
   if (vis !== 2) return [false, `search "pneu" left ${vis} rows (want 2: Pneumonia and No pneumonia)`];
   await tap('Pneumonia'); const c = await text('[data-count]');
   if (!/3 selected/.test(c)) return [false, 'count says: ' + c];
   await tap('Next: Malaria'); await tap('Next: Treatment'); await type('#med', 'Amoxicillin'); await tap('Next: Outcome'); await tap('Review and close'); await tap('Close visit #014');
   return [(await step()) === 'Visit closed', 'ended on ' + (await step())];
 }),
 T('T6 Treatment total recalculates', async () => {
   await go('clinician', 3); await type('#units', '5'); const t = await text('[data-total]'); return [/30 units/.test(t), t];
 }),
 T('T7 Nurse: out-of-range temperature is caught on blur and clears when fixed', async () => {
   await go('nurse', 1); await type('#temp', '99'); await page.click('#wt'); const e1 = await text('.nfe:not([hidden])').catch(() => 'none');
   await type('#temp', '38.6'); await page.click('#wt'); const gone = await page.evaluate(() => ![...document.querySelectorAll('.nfe')].some(x => !x.hidden));
   return [/30 to 45/.test(e1) && gone, `message "${e1.trim()}", cleared=${gone}`];
 }),
 T('T8 Scribe: flagged field blocks save; empty confirm is refused; fix then save', async () => {
   await go('scribe', 2); const dis = await page.evaluate(() => document.querySelector('.actionbar .primary').disabled);
   await tap('Temperature'); await tap('Clear value'); await tap('Confirm');
   const refused = (await step()) === 'Check the flagged field' && (await page.evaluate(() => !document.getElementById('tconf-need').hidden));
   await type('#tconf', '38.5'); await tap('Confirm');
   return [dis && refused && (await step()) === 'Saved', `save disabled=${dis}, empty confirm refused=${refused}, final=${await step()}`];
 }),
 T('T9 Scribe: a drafted (unflagged) field can be edited and keeps its unit', async () => {
   await go('scribe', 4); await page.click('.frows .frow:nth-child(2) .frhead'); taps++; await type('.frows .frow:nth-child(2) .fredit input', '62'); await page.click('.frows .frow:nth-child(2) [data-edit-save]'); taps++;
   const t = await page.evaluate(() => document.querySelector('.frows .frow:nth-child(2)').innerText.replace(/\s+/g, ' ')); return [/62 kg/.test(t) && /Edited/.test(t), 'weight row now: ' + t.slice(0, 40)];
 }),
 T('T10 Register: search finds a patient and keeps the continuation line', async () => {
   await go('register', 0); await type('#regsearch', 'nakato'); const v = await page.evaluate(() => [...document.querySelectorAll('.regrow')].filter(r => !r.hidden).length);
   await type('#regsearch', 'zzz'); const none = await page.evaluate(() => [...document.querySelectorAll('.regrow')].filter(r => !r.hidden).length);
   return [v === 2 && none === 0, `"nakato" → ${v} rows (row + continuation), "zzz" → ${none}`];
 }),
 T('T11 Tally: each section chip shows its own table', async () => {
   await go('register', 1); const seen = [];
   for (const c of ['1.1 to 1.3', '1.4 TB', '1.5 Nutrition', 'Risky']) { await tap(c); seen.push(await page.evaluate(() => { const p = [...document.querySelectorAll('[data-tp]')].filter(d => !d.hidden); return p.length + ':' + p[0].querySelector('code').textContent; })); }
   return [seen.join() === '1:OA01,1:TP01,1:NA01a,1:RB01', seen.join(' · ')];
 }),
 T('T12 Export: Save file gives feedback', async () => {
   await go('register', 2); await tap('Save file'); const shown = await page.evaluate(() => !document.getElementById('toast').hidden); return [shown, 'toast shown=' + shown];
 }),
 T('T13 Death outcome shows a check message; sensitive rows are clinician-only', async () => {
   await go('clinician', 4); await tap('Died'); const w = await page.evaluate(() => !document.getElementById('diedwarn').hidden); await tap('Record a sensitive'); const open = await page.evaluate(() => document.querySelector('details.sens').open);
   return [w && open, `death warning=${w}, sensitive panel open=${open}`];
 }),
];
for (const t of tasks) await t();
// layout at 375 and 1280 for the staff screens
const layout = [];
for (const w of [375, 1280]) { await page.setViewport({ width: w, height: 800 }); for (const f of ['signin', 'card', 'clinician', 'scribe', 'register']) { await go(f, 1); layout.push({ w, f, over: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1) }); } }
console.log('TASKS'); results.forEach(r => console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}\n      taps=${r.taps}  ${r.note}`));
console.log('\nPAGE OVERFLOW:', layout.filter(l => l.over).map(l => `${l.f}@${l.w}`).join(', ') || 'none at 375 or 1280');
console.log('JS ERRORS:', errors.length ? errors.join(' | ') : 'none');
await browser.close();
