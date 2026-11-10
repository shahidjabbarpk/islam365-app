// 365 Sahih Bukhari hadith pages (Arabic, English, Urdu) from the app's hadith365 set,
// source: github.com/fawazahmed0/hadith-api (Unlicense). Plus /hadith-of-the-day/.
const H = require('E:/Projects/islam365/src/data/hadith365.json');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function shortTitle(en) {
  let t = en.replace(/^Narrated [^:]+:\s*/, '').replace(/\s+/g, ' ').trim();
  const q = t.match(/(?:said|says|used to say)[^"“]*["“]([^"”]{20,})/);
  if (q) t = q[1];
  t = t.replace(/^\(|\)$/g, '');
  if (t.length > 70) t = t.slice(0, 70).replace(/\s+\S*$/, '') + '…';
  return t.replace(/"/g, '');
}

module.exports = function build({ write, page, playLink, SITE }) {
  const urls = [];
  H.forEach((h, i) => {
    const slug = `sahih-bukhari-${h.n}`, url = `${SITE}/hadith/${slug}/`;
    urls.push(url);
    const t = shortTitle(h.en);
    const prev = H[i - 1], next = H[i + 1];
    const cta = playLink('hadith_' + h.n);
    write(`hadith/${slug}/index.html`, page({
      title: `Sahih Bukhari ${h.n}: ${t} | Hadith in English & Urdu`,
      description: `Sahih al-Bukhari hadith ${h.n} in Arabic, English and Urdu: ${h.en.replace(/\s+/g, ' ').slice(0, 130)}…`,
      keywords: `sahih bukhari ${h.n}, bukhari ${h.n}, hadith ${h.n}, hadith in urdu, hadith in english, صحیح بخاری ${h.n}`,
      canonical: url,
      body: `<div class="wrap"><article>
<h1>Sahih al-Bukhari ${h.n}</h1>
<p style="color:#5b6b63;margin-top:-6px">${esc(t)}</p>
<div class="topcta"><img src="/img/icon.png" alt="Islam 365"><div>Get <b>a new hadith every day</b> with Arabic and Urdu, plus all of Bukhari, Muslim and more, in Islam 365. Free, no ads.</div><a href="${cta}" rel="noopener">Install</a></div>
<h2>English</h2><p>${esc(h.en)}</p>
<h2>اردو</h2><p dir="rtl" lang="ur" style="font-family:'Noto Nastaliq Urdu',serif;line-height:2.3;font-size:1.1rem">${esc(h.ur)}</p>
${h.ar ? `<h2>Arabic</h2><p class="ar">${esc(h.ar)}</p>` : ''}
<p><small>Source: Sahih al-Bukhari, hadith ${h.n}. Text via the open hadith-api project.</small></p>
<div class="midcta">📲 Share this hadith as a picture on WhatsApp status: <a href="${cta}" rel="noopener">open it in Islam 365</a>.</div>
<p>${prev ? `← <a href="/hadith/sahih-bukhari-${prev.n}/">Bukhari ${prev.n}</a>` : ''}${next ? ` · <a href="/hadith/sahih-bukhari-${next.n}/">Bukhari ${next.n}</a> →` : ''} · <a href="/hadith/">All hadith</a> · <a href="/hadith-of-the-day/">Hadith of the day</a></p>
</article></div>
<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap" rel="stylesheet">`,
    }));
  });
  urls.push(`${SITE}/hadith/`);
  write('hadith/index.html', page({
    title: '365 Hadith from Sahih al-Bukhari in English, Urdu and Arabic | Islam 365',
    description: 'A collection of 365 hadith from Sahih al-Bukhari, one for every day of the year, each in Arabic, English and Urdu.',
    keywords: 'sahih bukhari hadith, hadith in urdu, hadith in english, 365 hadith, daily hadith',
    canonical: `${SITE}/hadith/`,
    body: `<div class="wrap"><h1>365 Hadith from Sahih al-Bukhari</h1><p>One hadith for every day of the year, in Arabic, English and Urdu. <a href="/hadith-of-the-day/">Today's hadith</a> · <a href="${playLink('hadith_index')}">Get a daily hadith in the app</a></p>
<div class="list">${H.map((h) => `<a href="/hadith/sahih-bukhari-${h.n}/"><b>Bukhari ${h.n}</b><br><small>${esc(shortTitle(h.en))}</small></a>`).join('')}</div></div>`,
  }));
  urls.push(`${SITE}/hadith-of-the-day/`);
  const nums = H.map((h) => h.n);
  write('hadith-of-the-day/index.html', page({
    title: 'Hadith of the Day: A New Authentic Hadith Every Day | Islam 365',
    description: "Today's hadith from Sahih al-Bukhari in Arabic, English and Urdu. A new hadith every day of the year. آج کی حدیث۔",
    keywords: 'hadith of the day, daily hadith, today hadith, aaj ki hadees, hadith of the day urdu',
    canonical: `${SITE}/hadith-of-the-day/`,
    body: `<div class="wrap"><h1>Hadith of the Day</h1><p dir="rtl" lang="ur" style="font-size:1.2rem;margin-top:-8px">آج کی حدیث</p>
<div class="cta" style="text-align:start"><p id="hen">Loading…</p><p><a id="hl" href="/hadith/">Read in English, Urdu and Arabic →</a></p></div>
<div class="topcta"><img src="/img/icon.png" alt="Islam 365"><div>Get <b>a new hadith every day as a notification</b> with Islam 365. Free, no ads.</div><a href="${playLink('hadith_day')}" rel="noopener">Install</a></div></div>
<script>(function(){var n=${JSON.stringify(nums)},d=new Date(),s=new Date(d.getFullYear(),0,0),day=Math.floor((d-s)/864e5),k=n[(day-1)%n.length];
document.getElementById('hl').href='/hadith/sahih-bukhari-'+k+'/';document.getElementById('hen').innerHTML='<b>Sahih al-Bukhari '+k+'</b>';
fetch('/hadith/sahih-bukhari-'+k+'/').then(function(r){return r.text()}).then(function(t){var m=t.match(/<h2>English<\\/h2><p>([\\s\\S]*?)<\\/p>/);if(m)document.getElementById('hen').innerHTML='<b>Sahih al-Bukhari '+k+'</b><br>'+m[1];});})();</script>`,
  }));
  return urls;
};
