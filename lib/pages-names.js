// 99 Names of Allah: one page per name + index (data from the app's names99.ts).
const fs = require('fs');
const src = fs.readFileSync('E:/Projects/islam365/src/data/names99.ts', 'utf8');
const NAMES = new Function(src.replace(/export const NAMES_99:[^=]+=/, 'return ').replace(/;\s*$/, ''))();

module.exports = function build({ write, page, playLink, SITE }) {
  const urls = [];
  const slugOf = (t) => t.toLowerCase().replace(/['’]/g, '').replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  const ya = (t) => 'Ya ' + t.replace(/^(Al|Ar|As|Ash|At|Ad|Adh|Az|An)-/, '');
  NAMES.forEach(([ar, tr, ur, en], i) => {
    const slug = slugOf(tr), url = `${SITE}/99-names-of-allah/${slug}/`;
    urls.push(url);
    const prev = NAMES[i - 1], next = NAMES[i + 1];
    const cta = playLink('names_' + (i + 1));
    write(`99-names-of-allah/${slug}/index.html`, page({
      title: `${tr} (${ar}) Meaning: ${en} | ${i + 1} of the 99 Names of Allah`,
      description: `${tr} (${ar}) is one of the 99 names of Allah, meaning "${en}" (Urdu: ${ur}). How to understand it and call upon Allah with it in dua.`.replace(/"/g, ''),
      keywords: `${tr.toLowerCase()} meaning, ${ya(tr).toLowerCase()} meaning, ${tr.toLowerCase()}, ${ar}, 99 names of allah, asma ul husna, ${ur}`,
      canonical: url,
      body: `<div class="wrap">
<h1>${tr}: ${en}</h1>
<div class="cta"><div class="ar" style="font-size:3rem;background:none">${ar}</div><b>${tr}</b> · ${en}<br><span dir="rtl" lang="ur" style="font-size:1.2rem">${ur}</span><br><small>Name ${i + 1} of 99</small></div>
<div class="topcta"><img src="/img/icon.png" alt="Islam 365"><div>Learn all <b>99 names of Allah</b> with meanings, one name in your daily reading, in Islam 365. Free, no ads.</div><a href="${cta}" rel="noopener">Install</a></div>
<h2>Meaning of ${tr}</h2>
<p><b>${tr}</b> (${ar}) means <b>${en}</b>. In Urdu: <span dir="rtl" lang="ur">${ur}</span>. Allah says: <em>"And to Allah belong the best names, so invoke Him by them"</em> (Quran 7:180).</p>
<h2>Calling upon Allah with this name</h2>
<p>The Prophet ﷺ taught us to call Allah by the name that matches our need. You can begin your dua with <b>${ya(tr)}</b>, then ask for what you need, with conviction and humility.</p>
<h2>Why learn the 99 names?</h2>
<p>The Prophet ﷺ said: "Allah has ninety-nine names; whoever enumerates them will enter Paradise" (Sahih Bukhari, Sahih Muslim). Scholars explain this as learning them, understanding them and living by their meaning. Read our guide: <a href="/blog/99-names-of-allah-asma-ul-husna-meaning/">how to learn the 99 names in a month</a> · <a href="/blog/asma-ul-husna-urdu-tarjuma/">اسماء الحسنیٰ اردو</a>.</p>
<p>${prev ? `← <a href="/99-names-of-allah/${slugOf(prev[1])}/">${prev[1]}</a>` : ''}${next ? ` · <a href="/99-names-of-allah/${slugOf(next[1])}/">${next[1]}</a> →` : ''} · <a href="/99-names-of-allah/">All 99 names</a></p>
</div>`,
    }));
  });
  urls.push(`${SITE}/99-names-of-allah/`);
  write('99-names-of-allah/index.html', page({
    title: '99 Names of Allah (Asma ul Husna) with Meaning in English and Urdu | Islam 365',
    description: 'All 99 names of Allah (Asma ul Husna) in Arabic with transliteration and meaning in English and Urdu. اللہ کے ۹۹ نام معنی کے ساتھ۔',
    keywords: '99 names of allah, asma ul husna, names of allah with meaning, allah ke 99 naam, 99 names of allah urdu',
    canonical: `${SITE}/99-names-of-allah/`,
    body: `<div class="wrap"><h1>99 Names of Allah (Asma ul Husna)</h1><p dir="rtl" lang="ur" style="font-size:1.2rem;margin-top:-8px">اللہ کے ننانوے نام</p>
<p>"Allah has ninety-nine names; whoever enumerates them will enter Paradise" (Bukhari, Muslim). <a href="${playLink('names_index')}">Learn them daily in Islam 365</a>.</p>
<table><tr><th>#</th><th>Arabic</th><th>Name</th><th>Meaning</th><th>اردو</th></tr>${NAMES.map(([ar, tr, ur, en], i) => `<tr><td>${i + 1}</td><td class="ar" style="background:none;padding:4px;font-size:1.3rem">${ar}</td><td><a href="/99-names-of-allah/${slugOf(tr)}/">${tr}</a></td><td>${en}</td><td dir="rtl">${ur}</td></tr>`).join('')}</table></div>`,
  }));
  return urls;
};
