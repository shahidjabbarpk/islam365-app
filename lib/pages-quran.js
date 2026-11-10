// 114 surah pages: Arabic text (Tanzil Uthmani, with attribution) + facts + app CTA.
// Translations are NOT published on the site (Tanzil translation licences are non-commercial); they are in the app.
const QURAN = require('E:/Projects/islam365/src/data/quran.json');

const VIRTUE = {
  1: 'The Prophet ﷺ called Al-Fatiha the greatest surah in the Quran and "the seven oft-repeated verses" (Sahih Bukhari). No prayer is valid without it.',
  2: '"Do not make your houses graves. Satan flees from a house in which Surah Al-Baqarah is recited" (Sahih Muslim). Its last two verses suffice whoever recites them at night (Bukhari, Muslim).',
  18: 'Whoever reads Surah Al-Kahf on Friday will have light between the two Fridays (al-Hakim, al-Bayhaqi), and whoever memorises its first ten verses is protected from the Dajjal (Sahih Muslim).',
  32: 'The Prophet ﷺ would not sleep until he had recited Surah As-Sajdah and Surah Al-Mulk (Jami\' at-Tirmidhi).',
  67: 'A surah of thirty verses interceded for a man until he was forgiven: Tabarakalladhi biyadihil-mulk (Tirmidhi, Abu Dawud). The Prophet ﷺ recited it every night before sleeping.',
  103: 'Imam ash-Shafi\'i said that if people reflected on this surah alone, it would be enough for them.',
  112: 'The Prophet ﷺ said Surah Al-Ikhlas is equal to one third of the Quran (Sahih Bukhari).',
  113: 'Recite Al-Ikhlas, Al-Falaq and An-Nas three times morning and evening: they will suffice you against everything (Abu Dawud, Tirmidhi). The Prophet ﷺ recited them before sleeping (Sahih Bukhari).',
  114: 'With Al-Falaq, these are the best surahs for seeking refuge with Allah (Sahih Muslim), recited three times morning and evening and before sleep.',
};
const ALIASES = { 36: 'yasin, yaseen, ya-sin', 55: 'rahman, ar rahman', 56: 'waqiah, al waqia', 67: 'mulk, tabarak', 18: 'kahf, kahaf', 112: 'ikhlas', 1: 'fatiha, alhamd', 2: 'baqarah, baqara', 113: 'falaq', 114: 'nas, naas', 97: 'qadr', 108: 'kausar, kawthar', 110: 'nasr', 109: 'kafirun, kafiroon', 105: 'feel, fil', 106: 'quraish', 107: 'maun', 73: 'muzammil', 48: 'fath', 12: 'yusuf', 19: 'maryam', 62: 'jumuah, juma', 78: 'naba', 94: 'alam nashrah, inshirah' };
const LINKS = { 2: '<a href="/blog/surah-baqarah-last-two-ayat-amanar-rasul/">The last two ayat of Al-Baqarah</a> · <a href="/blog/ayatul-kursi-english-meaning-benefits/">Ayatul Kursi (2:255)</a>', 18: '<a href="/blog/surah-kahf-four-stories-lessons/">The four stories of Surah Al-Kahf</a>', 67: '<a href="/blog/surah-mulk-benefits-before-sleep/">Why the Prophet ﷺ recited Surah Al-Mulk every night</a>' };
const AR_DIGITS = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

module.exports = function build({ write, page, playLink, SITE }) {
  const urls = [];
  const slugOf = (s) => 'surah-' + s.en.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  QURAN.forEach((s, i) => {
    const slug = slugOf(s), url = `${SITE}/quran/${slug}/`;
    urls.push(url);
    const type = s.type === 'M' ? 'Makki (revealed in Makkah)' : 'Madani (revealed in Madinah)';
    const paras = [...new Set(s.a.map((x) => x[2]))];
    const cta = playLink('quran_' + s.n);
    const prev = QURAN[i - 1], next = QURAN[i + 1];
    const text = s.a.map((x, k) => `${x[0]} <span class="an">﴿${AR_DIGITS(k + 1)}﴾</span>`).join(' ');
    write(`quran/${slug}/index.html`, page({
      title: `Surah ${s.en} (${s.n}) Arabic Text: ${s.meaning} | Read with Urdu Translation`,
      description: `Read Surah ${s.en} (${s.name}), surah ${s.n} of the Quran: ${s.a.length} verses, ${s.type === 'M' ? 'Makki' : 'Madani'}, para ${paras.join('-')}. Full Arabic text; listen and read with Urdu and English translation in the free Islam 365 app.`,
      keywords: `surah ${s.en.toLowerCase()}, ${s.en.toLowerCase()}, surah ${s.n}, ${s.en.toLowerCase()} arabic, ${s.en.toLowerCase()} urdu translation, ${ALIASES[s.n] || ''}`,
      canonical: url,
      body: `<div class="wrap">
<h1>Surah ${s.en} (${s.n})</h1>
<p class="ar" style="text-align:center;font-size:2rem;background:none">${s.name}</p>
<table><tr><th>Meaning</th><td>${s.meaning}</td></tr><tr><th>Surah number</th><td>${s.n} of 114</td></tr><tr><th>Verses (ayat)</th><td>${s.a.length}</td></tr><tr><th>Revelation</th><td>${type}</td></tr><tr><th>Para (Juz)</th><td>${paras.join(', ')}</td></tr></table>
<div class="topcta"><img src="/img/icon.png" alt="Islam 365"><div>Read Surah ${s.en} with <b>Urdu and English translation</b> and listen to <b>Mishary Alafasy</b> ayah by ayah in Islam 365. Free, offline, no ads.</div><a href="${cta}" rel="noopener">Install</a></div>
${VIRTUE[s.n] ? `<h2>Virtue</h2><p>${VIRTUE[s.n]}</p>` : ''}
${LINKS[s.n] ? `<p>Related: ${LINKS[s.n]}</p>` : ''}
<h2>Arabic text</h2>
${s.n !== 1 && s.n !== 9 ? '<p class="ar" style="text-align:center;font-size:1.7rem;background:none">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>' : ''}<div class="ar qt">${text}</div>
<p><small>Quran text: Tanzil Project (tanzil.net), Uthmani script.</small></p>
<div class="midcta">📲 Want the meaning? <a href="${cta}" rel="noopener">Open Surah ${s.en} in Islam 365</a> with Urdu (Jalandhry) and English translation, recitation, bookmarks and "continue reading".</div>
<p>${prev ? `← <a href="/quran/${slugOf(prev)}/">Surah ${prev.en} (${prev.n})</a>` : ''} ${next ? ` · <a href="/quran/${slugOf(next)}/">Surah ${next.en} (${next.n})</a> →` : ''}</p>
<p><a href="/quran/">All 114 surahs</a></p>
</div><style>.qt{line-height:2.6;font-size:1.6rem;text-align:justify}.an{color:var(--g);font-size:1.1rem}th{width:40%}</style>`,
    }));
  });
  urls.push(`${SITE}/quran/`);
  write('quran/index.html', page({
    title: 'Quran: All 114 Surahs with Arabic Text | Read with Urdu Translation | Islam 365',
    description: 'All 114 surahs of the Holy Quran with full Arabic text, number of verses, Makki or Madani and para. Read with Urdu and English translation and recitation in the free Islam 365 app.',
    keywords: 'quran online, quran surah list, 114 surahs, quran arabic text, quran with urdu translation',
    canonical: `${SITE}/quran/`,
    body: `<div class="wrap"><h1>The Holy Quran: 114 Surahs</h1><p>Choose a surah for its full Arabic text. For Urdu and English translation and recitation, <a href="${playLink('quran_index')}">install Islam 365</a> (free, works offline).</p>
<div class="list">${QURAN.map((s) => `<a href="/quran/${slugOf(s)}/"><b>${s.n}. Surah ${s.en}</b> <span class="ar" style="background:none;padding:0;font-size:1.2rem">${s.name}</span><br><small>${s.meaning} · ${s.a.length} verses · ${s.type === 'M' ? 'Makki' : 'Madani'}</small></a>`).join('')}</div></div>`,
  }));
  return urls;
};
