(() => {
'use strict';

/* ---------- Offline data (used when APIs are slow, blocked or need a key) ---------- */
const BANK = [
  ['abundant','existing in large quantities','plentiful'],
  ['brave','ready to face danger or pain','courageous'],
  ['candid','truthful and straightforward','frank'],
  ['diligent','showing careful and steady effort','hardworking'],
  ['eager','wanting to do something very much','keen'],
  ['fragile','easily broken or damaged','delicate'],
  ['generous','willing to give more than is expected','kind'],
  ['humble','not proud or arrogant','modest'],
  ['inevitable','certain to happen and impossible to avoid','unavoidable'],
  ['jovial','cheerful and friendly','cheerful'],
  ['lucid','clear and easy to understand','clear'],
  ['meticulous','very careful about small details','thorough'],
  ['nervous','easily worried or afraid','anxious'],
  ['obvious','easily seen or understood','evident'],
  ['patient','able to wait calmly without getting upset','tolerant'],
  ['rapid','happening very quickly','swift'],
  ['sincere','honest and genuine in feeling','genuine'],
  ['tranquil','calm and peaceful','peaceful'],
  ['unique','being the only one of its kind','singular'],
  ['vivid','strong, bright and clear','bright'],
  ['wise','having good judgment from experience','sensible'],
  ['zealous','full of strong enthusiasm','passionate'],
  ['ancient','belonging to a very distant past','aged'],
  ['barrier','something that blocks the way','obstacle'],
  ['curious','eager to know or learn something','inquisitive'],
  ['durable','able to last a long time without damage','lasting'],
  ['enormous','very large in size or amount','huge'],
  ['fortunate','having good luck','lucky'],
  ['gloomy','dark, sad or without hope','dismal'],
  ['hesitate','to pause before doing something','pause'],
  ['improve','to make or become better','enhance'],
  ['journey','an act of travelling from one place to another','trip'],
  ['knowledge','facts and skills gained through learning','understanding'],
  ['lonely','sad because of being alone','isolated'],
  ['mighty','very strong or powerful','powerful'],
  ['ordinary','normal and not special in any way','common'],
  ['peculiar','strange or unusual','odd'],
  ['reliable','able to be trusted to do what is expected','dependable'],
  ['urgent','needing immediate attention','pressing'],
  ['victory','success in a contest or battle','triumph'],
  ['weary','feeling very tired','exhausted']
].map(([w, d, s]) => ({ w, d, s }));

const GRAMMAR = [
  { q: 'She ___ to school every day.', o: ['go','goes','going','gone'], a: 1, e: 'With he/she/it in the simple present, the verb takes -s or -es.' },
  { q: 'They ___ playing football right now.', o: ['is','am','are','be'], a: 2, e: 'Use "are" with they, we and you.' },
  { q: 'I have lived here ___ 2019.', o: ['for','since','from','during'], a: 1, e: 'Use "since" with a starting point in time, "for" with a length of time.' },
  { q: 'He is ___ than his brother.', o: ['tall','taller','tallest','more tall'], a: 1, e: 'Short adjectives add -er when comparing two things.' },
  { q: 'We didn\'t ___ the movie.', o: ['enjoyed','enjoy','enjoying','enjoys'], a: 1, e: 'After "did/didn\'t", use the base form of the verb.' },
  { q: 'There aren\'t ___ apples left.', o: ['some','any','much','a'], a: 1, e: 'Use "any" in negative sentences and questions.' },
  { q: 'If it rains, we ___ at home.', o: ['stay','stayed','will stay','would stayed'], a: 2, e: 'First conditional: if + present simple, will + base verb.' },
  { q: 'This is the ___ book I have ever read.', o: ['good','better','best','most good'], a: 2, e: '"Good" becomes "best" in the superlative.' },
  { q: 'She asked me where I ___.', o: ['live','lived','am living','lives'], a: 1, e: 'In reported speech the verb usually shifts back in tense.' },
  { q: 'He doesn\'t have ___ money.', o: ['many','much','a few','several'], a: 1, e: 'Use "much" with uncountable nouns like money.' },
  { q: 'I look forward to ___ you.', o: ['see','seeing','saw','seen'], a: 1, e: '"To" in this phrase is a preposition, so use the -ing form.' },
  { q: 'The book is ___ the table.', o: ['in','on','at','by'], a: 1, e: 'Use "on" for something resting on a surface.' },
  { q: 'She is good ___ mathematics.', o: ['in','at','on','for'], a: 1, e: '"Good at" is the correct collocation for skills.' },
  { q: 'By next year, I ___ my degree.', o: ['finish','finished','will have finished','am finishing'], a: 2, e: 'Future perfect (will have + past participle) shows completion before a future time.' },
  { q: 'Neither of the boys ___ ready.', o: ['are','is','were','be'], a: 1, e: '"Neither" takes a singular verb.' },
  { q: 'I wish I ___ more time.', o: ['have','had','will have','having'], a: 1, e: 'After "wish" about the present, use the past form.' }
];

const GAMES = [
  { id: 'meaning',  ico: '🧠', name: 'Meaning Match', desc: 'Read the meaning, pick the right word.', rounds: 8 },
  { id: 'scramble', ico: '🔤', name: 'Word Scramble', desc: 'Unjumble the letters before time runs out of tries.', rounds: 8 },
  { id: 'hangman',  ico: '🪢', name: 'Hangman',       desc: 'Guess the hidden word letter by letter.', rounds: 5 },
  { id: 'synonym',  ico: '🔁', name: 'Synonym Hunt',  desc: 'Find the word with the closest meaning.', rounds: 8 },
  { id: 'grammar',  ico: '✍️', name: 'Grammar Gym',   desc: 'Fill the gap with the correct grammar.', rounds: 8 }
];

const BADGES = [
  { e: '🌱', n: 'First Steps',     d: 'Earn 10 XP',        ok: s => s.xp >= 10 },
  { e: '📚', n: 'Word Collector',  d: 'Save 5 words',      ok: s => s.saved.length >= 5 },
  { e: '🔥', n: 'On Fire',         d: '3 day streak',      ok: s => s.streak >= 3 },
  { e: '🎮', n: 'Game Master',     d: 'Finish 10 games',   ok: s => s.played >= 10 },
  { e: '🚀', n: 'Level 5',         d: 'Reach level 5',     ok: s => lvl(s.xp) >= 5 },
  { e: '👑', n: 'Perfectionist',   d: 'Get a perfect game', ok: s => s.perfect >= 1 }
];

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const lvl = xp => Math.floor(xp / 100) + 1;

async function getJSON(url, ms = 4500) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } finally { clearTimeout(t); }
}

/* ---------- saved state ---------- */
const KEY = 'lingoquest.v1';
const DEFAULTS = { xp: 0, streak: 0, lastDay: '', saved: [], played: 0, perfect: 0, best: {} };
let S = load();
function load() {
  try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}')); }
  catch { return { ...DEFAULTS, saved: [], best: {} }; }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage blocked */ } }

function dayStr(d) { return d.toLocaleDateString('en-CA'); }
function updateStreak() {
  const now = new Date(); const today = dayStr(now);
  if (S.lastDay === today) return;
  const y = new Date(now); y.setDate(y.getDate() - 1);
  S.streak = S.lastDay === dayStr(y) ? S.streak + 1 : 1;
  S.lastDay = today; save();
}

function addXp(n) {
  const before = lvl(S.xp);
  S.xp += n; save(); renderStats();
  if (lvl(S.xp) > before) { toast(`Level up! You are now level ${lvl(S.xp)}`); confetti(); }
}

function renderStats() {
  $$('[data-stat="streak"]').forEach(e => e.textContent = S.streak);
  $$('[data-stat="level"]').forEach(e => e.textContent = lvl(S.xp));
  $$('[data-stat="xpin"]').forEach(e => e.textContent = S.xp % 100);
  const bar = $('#xpbar'); if (bar) bar.style.width = (S.xp % 100) + '%';
}

let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- confetti ---------- */
function confetti() {
  const cv = $('#confetti'), ctx = cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ['#7c5cff', '#ff5cae', '#22d3ee', '#fbbf24', '#34d399'];
  const ps = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 3,
    s: Math.random() * 8 + 4, c: cols[Math.floor(Math.random() * cols.length)], r: Math.random() * 6
  }));
  let f = 0;
  (function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.r += .2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore(); });
    if (++f < 130) requestAnimationFrame(tick); else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

/* ---------- router ---------- */
const VIEWS = ['home', 'learn', 'games', 'play', 'progress'];
function route() {
  const parts = (location.hash.replace(/^#\/?/, '') || 'home').split('/');
  let v = VIEWS.includes(parts[0]) ? parts[0] : 'home';
  VIEWS.forEach(x => $('#view-' + x).classList.toggle('on', x === v));
  $$('nav a').forEach(a => a.classList.toggle('on', a.dataset.nav === (v === 'play' ? 'games' : v)));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (v === 'progress') renderProgress();
  if (v === 'play') {
    const g = GAMES.find(x => x.id === parts[1]);
    if (g) startGame(g.id); else location.hash = '#/games';
  }
}

/* ---------- home ---------- */
function renderHome() {
  const idx = Math.floor(Date.now() / 86400000) % BANK.length;
  const w = BANK[idx];
  $('#wotd-word').textContent = w.w;
  $('#wotd-syn').textContent = 'Similar: ' + w.s;
  $('#wotd-def').textContent = w.d.charAt(0).toUpperCase() + w.d.slice(1) + '.';
  $('#wotd-btn').onclick = () => { location.hash = '#/learn'; lookup(w.w); };
}

function renderGameGrid() {
  $('#game-grid').innerHTML = GAMES.map(g => `
    <a class="card tilt" href="#/play/${g.id}">
      <div class="ico">${g.ico}</div><h3>${g.name}</h3><p>${g.desc}</p>
      <span class="tag">Best: ${S.best[g.id] || 0} pts</span>
    </a>`).join('');
}

/* ---------- learn ---------- */
async function lookup(word) {
  word = (word || '').trim().toLowerCase();
  const out = $('#learn-out');
  if (!/^[a-z][a-z' -]{0,40}$/.test(word)) { out.innerHTML = '<div class="empty">Please type a single English word using letters only.</div>'; return; }
  $('#search-input').value = word;
  out.innerHTML = '<div class="skeleton" style="width:40%;height:40px"></div><div class="skeleton"></div><div class="skeleton" style="width:80%"></div>';
  try {
    const [data, syn, ant] = await Promise.all([
      getJSON('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word)),
      getJSON('https://api.datamuse.com/words?rel_syn=' + encodeURIComponent(word) + '&max=10').catch(() => []),
      getJSON('https://api.datamuse.com/words?rel_ant=' + encodeURIComponent(word) + '&max=8').catch(() => [])
    ]);
    renderEntry(data[0], syn.map(x => x.word), ant.map(x => x.word));
  } catch (err) {
    const local = BANK.find(b => b.w === word);
    if (local) {
      out.innerHTML = `<div class="word-head"><h2>${esc(local.w)}</h2></div><div class="meaning"><p>${esc(local.d)}.</p><div class="chips"><span class="chip">${esc(local.s)}</span></div></div><p class="empty">Live dictionary is not reachable right now. Showing built-in data.</p>`;
    } else {
      out.innerHTML = '<div class="empty">No definition found. Check the spelling, or the dictionary service may be busy. Try again in a moment.</div>';
    }
  }
}

function renderEntry(e, syn, ant) {
  const out = $('#learn-out');
  const phon = e.phonetic || (e.phonetics.find(p => p.text) || {}).text || '';
  let audio = (e.phonetics.find(p => p.audio) || {}).audio || '';
  if (audio.startsWith('//')) audio = 'https:' + audio;
  const meanings = e.meanings.slice(0, 4).map(m => `
    <div class="meaning">
      <span class="pos">${esc(m.partOfSpeech)}</span>
      <ol>${m.definitions.slice(0, 3).map(d => `<li>${esc(d.definition)}${d.example ? `<div class="ex">"${esc(d.example)}"</div>` : ''}</li>`).join('')}</ol>
    </div>`).join('');
  const own = [...new Set(e.meanings.flatMap(m => [...(m.synonyms || []), ...m.definitions.flatMap(d => d.synonyms || [])]))];
  const synAll = [...new Set([...syn, ...own])].slice(0, 12);
  const antAll = [...new Set([...ant, ...e.meanings.flatMap(m => m.antonyms || [])])].slice(0, 8);
  const saved = S.saved.some(x => x.w === e.word.toLowerCase());
  out.innerHTML = `
    <div class="word-head">
      <h2>${esc(e.word)}</h2>
      <span class="phon">${esc(phon)}</span>
      ${audio ? '<button class="icon-btn" id="play-audio" title="Hear it" aria-label="Play pronunciation">🔊</button>' : ''}
      <button class="btn small ${saved ? 'ghost' : 'primary'}" id="save-word">${saved ? 'Saved' : 'Save word'}</button>
    </div>
    ${meanings}
    ${synAll.length ? `<div class="meaning"><span class="pos">Synonyms</span><div class="chips">${synAll.map(s => `<button class="chip" data-w="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>` : ''}
    ${antAll.length ? `<div class="meaning"><span class="pos">Antonyms</span><div class="chips">${antAll.map(s => `<button class="chip ant" data-w="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>` : ''}`;
  const pa = $('#play-audio'); if (pa) pa.onclick = () => new Audio(audio).play().catch(() => toast('Audio could not play'));
  $$('.chip[data-w]', out).forEach(c => c.onclick = () => lookup(c.dataset.w));
  $('#save-word').onclick = () => {
    const w = e.word.toLowerCase();
    if (S.saved.some(x => x.w === w)) { S.saved = S.saved.filter(x => x.w !== w); toast('Removed from My Words'); }
    else { S.saved.push({ w, d: e.meanings[0].definitions[0].definition }); addXp(5); toast('Saved! +5 XP'); }
    save(); renderEntry(e, syn, ant);
  };
  if (!sessionStorage.getItem('lq-look-' + e.word)) { sessionStorage.setItem('lq-look-' + e.word, '1'); addXp(2); }
}

async function randomWord() {
  try {
    const r = await getJSON('https://random-word-api.herokuapp.com/word', 3000);
    lookup(r[0]);
  } catch { lookup(BANK[Math.floor(Math.random() * BANK.length)].w); }
}

/* ---------- game engine ---------- */
let G = null;
const FN = {};

function startGame(id) {
  const meta = GAMES.find(g => g.id === id);
  G = { id, round: 0, total: meta.rounds, score: 0, correct: 0, used: new Set() };
  nextRound();
}
function nextRound() {
  if (G.round >= G.total) return endGame();
  G.round++; FN[G.id]();
}
function take(filter = () => true) {
  let pool = BANK.filter(b => !G.used.has(b.w) && filter(b));
  if (!pool.length) pool = BANK.filter(filter);
  const w = pool[Math.floor(Math.random() * pool.length)];
  G.used.add(w.w); return w;
}
function frame(inner) {
  $('#game-area').innerHTML = `
    <div class="game-head"><span>Round ${G.round}/${G.total}</span>
    <div class="bar"><i style="width:${((G.round - 1) / G.total) * 100}%"></i></div>
    <span id="score">Score ${G.score}</span></div>${inner}<div id="fb"></div>`;
}
function result(ok, msg) {
  if (ok) { G.score += 10; G.correct++; addXp(10); }
  $('#score').textContent = 'Score ' + G.score;
  const last = G.round >= G.total;
  $('#fb').innerHTML = `<div class="fb ${ok ? 'ok' : 'no'}">${ok ? '✅ Correct! +10 XP' : '❌ Not quite.'} ${esc(msg)}
    <div class="row"><button class="btn primary" id="next-btn">${last ? 'See results' : 'Next'}</button></div></div>`;
  const nb = $('#next-btn'); nb.onclick = nextRound; nb.focus();
}
function bindOptions(correct, msg) {
  const btns = $$('.opt');
  btns.forEach(b => b.onclick = () => {
    const i = +b.dataset.i; btns.forEach(x => x.disabled = true);
    btns[correct].classList.add('right');
    if (i !== correct) b.classList.add('wrong');
    result(i === correct, msg);
  });
}
const optHTML = list => `<div class="opts">${list.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;

FN.meaning = () => {
  const w = take();
  const opts = shuffle([w, ...shuffle(BANK.filter(x => x !== w)).slice(0, 3)]);
  frame(`<p class="q-label">What does this mean?</p><h2 class="q">${esc(w.d)}</h2>${optHTML(opts.map(o => o.w))}`);
  bindOptions(opts.indexOf(w), `${w.w}: ${w.d}.`);
};

FN.grammar = () => {
  if (!G.gq) G.gq = shuffle(GRAMMAR);
  const q = G.gq[G.round - 1];
  frame(`<p class="q-label">Choose the correct word</p><h2 class="q">${esc(q.q)}</h2>${optHTML(q.o)}`);
  bindOptions(q.a, q.e);
};

FN.synonym = async () => {
  const w = take();
  frame(`<p class="q-label">Pick the closest meaning</p><h2 class="q">${esc(w.w)}</h2><div class="skeleton"></div>`);
  let right = w.s;
  try {
    const r = await getJSON('https://api.datamuse.com/words?rel_syn=' + encodeURIComponent(w.w) + '&max=6', 2500);
    const c = r.find(x => /^[a-z]+$/.test(x.word));
    if (c) right = c.word;
  } catch { /* offline data is used */ }
  const bad = shuffle(BANK.filter(x => x.w !== w.w && x.w !== right && x.s !== right && x.s !== w.s)).slice(0, 3).map(x => x.w);
  const opts = shuffle([right, ...bad]);
  if (G.id !== 'synonym') return; // player left the game while loading
  frame(`<p class="q-label">Pick the closest meaning</p><h2 class="q">${esc(w.w)}</h2>${optHTML(opts)}`);
  bindOptions(opts.indexOf(right), `${w.w} is close to ${right}.`);
};

FN.scramble = () => {
  const w = take(x => x.w.length >= 5);
  let s; do { s = shuffle([...w.w]).join(''); } while (s === w.w);
  let tries = 0;
  frame(`<p class="q-label">Unscramble the word</p>
    <div class="tiles">${[...s].map((c, i) => `<span class="tile" style="--d:${i * 70}ms">${esc(c)}</span>`).join('')}</div>
    <div class="hint" id="hint"></div>
    <div class="row"><input id="ans" type="text" autocomplete="off" spellcheck="false" placeholder="Your answer" maxlength="20">
    <button class="btn ghost" id="hint-btn">Hint</button><button class="btn primary" id="check">Check</button></div>`);
  const inp = $('#ans'); inp.focus();
  $('#hint-btn').onclick = () => { $('#hint').textContent = 'Meaning: ' + w.d; };
  const check = () => {
    const v = inp.value.trim().toLowerCase(); if (!v) return;
    if (v === w.w) { $('#check').disabled = inp.disabled = true; result(true, `${w.w}: ${w.d}.`); return; }
    tries++; inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake');
    if (tries >= 3) { $('#check').disabled = inp.disabled = true; result(false, `The word was "${w.w}": ${w.d}.`); }
    else $('#hint').textContent = `Try again. ${3 - tries} ${3 - tries === 1 ? 'try' : 'tries'} left.`;
  };
  $('#check').onclick = check;
  inp.onkeydown = e => { if (e.key === 'Enter') check(); };
};

FN.hangman = () => {
  const w = take(x => x.w.length >= 5 && x.w.length <= 9), word = w.w;
  const guessed = new Set(); let wrong = 0, done = false;
  const keys = 'abcdefghijklmnopqrstuvwxyz'.split('').map(c => `<button class="key" data-k="${c}">${c}</button>`).join('');
  frame(`<p class="q-label">Hint: ${esc(w.d)}</p>
    <div class="hang">
      <svg viewBox="0 0 120 140" aria-hidden="true">
        <path d="M10 130H70M30 130V10H85V25"/>
        <circle class="part" cx="85" cy="38" r="13"/>
        <path class="part" d="M85 51V90"/><path class="part" d="M85 60L67 78"/>
        <path class="part" d="M85 60L103 78"/><path class="part" d="M85 90L68 118"/><path class="part" d="M85 90L102 118"/>
      </svg>
      <div><div class="hword" id="word"></div><div id="lives" class="hint"></div></div>
    </div><div class="keys">${keys}</div>`);
  const draw = () => {
    $('#word').textContent = [...word].map(c => guessed.has(c) ? c : '_').join(' ');
    $$('.part').forEach((p, i) => p.style.opacity = i < wrong ? 1 : 0);
    $('#lives').textContent = 'Lives: ' + '♥'.repeat(6 - wrong) + '♡'.repeat(wrong);
  };
  draw();
  const press = k => {
    if (done || guessed.has(k)) return;
    guessed.add(k);
    const btn = $(`.key[data-k="${k}"]`); btn.disabled = true;
    if (word.includes(k)) btn.classList.add('hit'); else { btn.classList.add('miss'); wrong++; }
    draw();
    const won = [...word].every(c => guessed.has(c));
    if (won || wrong >= 6) {
      done = true; $$('.key').forEach(x => x.disabled = true);
      document.removeEventListener('keydown', onKey);
      result(won, `${won ? '' : 'The word was "' + word + '". '}${word}: ${w.d}.`);
    }
  };
  const onKey = e => { if (/^[a-z]$/i.test(e.key) && !e.ctrlKey && !e.metaKey && !done && $('.key')) press(e.key.toLowerCase()); };
  document.addEventListener('keydown', onKey);
  $$('.key').forEach(b => b.onclick = () => press(b.dataset.k));
  G.cleanup = () => document.removeEventListener('keydown', onKey);
};

function endGame() {
  const pct = G.correct / G.total;
  S.played++;
  if (G.score > (S.best[G.id] || 0)) S.best[G.id] = G.score;
  let bonus = 0;
  if (G.correct === G.total) { bonus = 20; S.perfect++; }
  save(); if (bonus) addXp(bonus); else renderStats();
  if (pct >= 0.7) confetti();
  const emoji = pct === 1 ? '👑' : pct >= .7 ? '🎉' : pct >= .4 ? '👍' : '💪';
  const line = pct === 1 ? 'Perfect game! +20 bonus XP' : pct >= .7 ? 'Great work!' : pct >= .4 ? 'Good effort. Practice makes it stick.' : 'Keep going. Try the Learn page, then come back.';
  $('#game-area').innerHTML = `<div class="end"><div class="big-emoji">${emoji}</div><h2>${G.correct} / ${G.total} correct</h2>
    <p>${line}<br>Score: ${G.score} points. Best: ${S.best[G.id]}.</p>
    <div class="row" style="justify-content:center"><button class="btn primary big" id="again">Play again</button><a class="btn ghost big" href="#/games">All games</a></div></div>`;
  const id = G.id;
  $('#again').onclick = () => startGame(id);
}

/* ---------- progress ---------- */
function renderProgress() {
  const cards = [['Total XP', S.xp], ['Level', lvl(S.xp)], ['Day streak', S.streak], ['Games played', S.played], ['Words saved', S.saved.length]];
  $('#stat-cards').innerHTML = cards.map(([l, n]) => `<div class="card stat"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
  $('#badges').innerHTML = BADGES.map(b => `<div class="badge ${b.ok(S) ? 'on' : ''}"><div class="e">${b.e}</div><b>${b.n}</b><small>${b.d}</small></div>`).join('');
  const sl = $('#saved-list');
  sl.innerHTML = S.saved.length
    ? S.saved.map(x => `<span class="chip" title="${esc(x.d)}"><span data-open="${esc(x.w)}">${esc(x.w)}</span><span class="x" data-del="${esc(x.w)}" title="Remove">&times;</span></span>`).join('')
    : '<div class="empty" style="width:100%">No saved words yet. Search a word in Learn and press Save.</div>';
  $$('[data-open]', sl).forEach(e => e.onclick = () => { location.hash = '#/learn'; lookup(e.dataset.open); });
  $$('[data-del]', sl).forEach(e => e.onclick = () => { S.saved = S.saved.filter(x => x.w !== e.dataset.del); save(); renderProgress(); });
}

/* ---------- tilt effect ---------- */
function bindTilt() {
  document.addEventListener('pointermove', e => {
    const el = e.target.closest && e.target.closest('.tilt');
    $$('.tilt').forEach(t => { if (t !== el) t.style.transform = ''; });
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  document.addEventListener('pointerleave', () => $$('.tilt').forEach(t => t.style.transform = ''));
}

/* ---------- init ---------- */
function init() {
  updateStreak(); renderStats(); renderHome(); renderGameGrid(); bindTilt();
  $('#search-form').onsubmit = e => { e.preventDefault(); lookup($('#search-input').value); };
  $('#random-btn').onclick = randomWord;
  $('#reset-btn').onclick = () => {
    if (confirm('Delete all XP, streak, badges and saved words on this device?')) {
      S = { ...DEFAULTS, saved: [], best: {} }; save(); updateStreak(); renderStats(); renderGameGrid(); renderProgress(); toast('Progress reset');
    }
  };
  window.addEventListener('hashchange', () => { if (G && G.cleanup) G.cleanup(); renderGameGrid(); route(); });
  route();
}
init();
})();
