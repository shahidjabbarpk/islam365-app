// node build.js  -> writes static pages into site/
const fs = require('fs');
const path = require('path');

const SITE = process.env.SITE_URL || 'https://islam365-app.vercel.app';
const PLAY = 'https://play.google.com/store/apps/details?id=com.islam365.mza';
const OUT = path.join(__dirname, 'site');
const posts = fs.readdirSync(path.join(__dirname, 'content')).filter((f) => f.endsWith('.js')).sort().flatMap((f) => require('./content/' + f));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const playLink = (src) => `${PLAY}&referrer=utm_source%3Dwebsite%26utm_medium%3D${src}`;

const css = `
:root{--g:#0b7a55;--gd:#075c40;--bg:#f6faf7;--ink:#14231c;--mut:#5b6b63;--card:#fff}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--ink);line-height:1.7}
a{color:var(--g)}header{background:#0d3449;color:#fff}header .in{max-width:1000px;margin:auto;display:flex;align-items:center;gap:12px;padding:12px 20px}
header img{width:40px;height:40px;border-radius:10px}header a{color:#fff;text-decoration:none;font-weight:700}header nav{margin-left:auto;display:flex;gap:18px}header nav a{font-weight:500;opacity:.9}
.wrap{max-width:780px;margin:auto;padding:24px 20px 60px}.hero{background:linear-gradient(135deg,#0d3449,#0b7a55);color:#fff;text-align:center;padding:56px 20px}
.hero h1{font-size:2.2rem;margin:.2em 0}.hero p{font-size:1.15rem;opacity:.95;max-width:640px;margin:auto}
.btn{display:inline-block;background:#fff;color:var(--gd);font-weight:700;padding:14px 26px;border-radius:999px;text-decoration:none;margin-top:22px}
.btn.g{background:var(--g);color:#fff}.shots{display:flex;gap:14px;overflow-x:auto;padding:28px 20px;max-width:1100px;margin:auto}
.shots img{height:440px;border-radius:18px;box-shadow:0 6px 20px rgba(0,0,0,.15)}
.feat{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;max-width:1000px;margin:auto;padding:10px 20px 30px}
.feat div{background:var(--card);border-radius:14px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,.06)}.feat b{display:block;font-size:1.05rem}
.list a{display:block;background:var(--card);border-radius:12px;padding:16px 18px;margin:12px 0;text-decoration:none;color:var(--ink);box-shadow:0 1px 4px rgba(0,0,0,.06)}
.list a b{color:var(--gd)}.list small{color:var(--mut)}
article h1{font-size:1.9rem;line-height:1.3}article h2{margin-top:1.6em;color:var(--gd)}table{border-collapse:collapse;width:100%;margin:12px 0;background:#fff}
td,th{border:1px solid #d9e5de;padding:8px 10px;text-align:start}th{background:#e8f3ed}
.cta{background:#e8f3ed;border-radius:16px;padding:22px;text-align:center;margin-top:36px}
.ar{font-family:'Amiri','Noto Naskh Arabic',serif;font-size:1.45rem;direction:rtl;line-height:2.2;background:#fff;border-radius:10px;padding:10px 14px}
[lang=ur] article,[lang=ur] .list{font-family:'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif;line-height:2.3;font-size:1.12rem}
footer{text-align:center;color:var(--mut);font-size:.9rem;padding:30px 20px}
@media(max-width:600px){.hero h1{font-size:1.7rem}.shots img{height:360px}header nav{gap:12px;font-size:.9rem}}`;

function page({ title, description, keywords = '', lang = 'en', canonical, body, jsonld, image = `${SITE}/img/feature-graphic.png` }) {
  const fonts = lang === 'ur'
    ? '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Amiri&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">'
    : '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Amiri&display=swap" rel="stylesheet">';
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ur' ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ''}
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/img/icon.png">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image">
<meta name="google-play-app" content="app-id=com.islam365.mza">
${fonts}
<style>${css}</style>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
<header><div class="in" dir="ltr"><img src="/img/icon.png" alt="Islam 365 icon"><a href="/">Islam 365</a>
<nav><a href="/blog/">Blog</a><a href="${playLink('header')}" rel="noopener">Download</a></nav></div></header>
${body}
<footer dir="ltr">© 2026 Islam 365 · Free · No ads · <a href="/blog/">Blog</a> · <a href="/privacy.html">Privacy policy</a> · <a href="${PLAY}">Google Play</a></footer>
</body></html>`;
}

const write = (rel, html) => {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
};

// ---------- Home ----------
const features = [
  ['🕌 Prayer times', 'Accurate namaz times for your location, auto method (Karachi, Umm al-Qura, ISNA…) and Hanafi/Shafi Asr.'],
  ['🔔 Azan reminders', 'Before prayer, at prayer time, and before time runs out. Jumu\'ah Surah Kahf reminder.'],
  ['📖 Quran Majeed', 'Full Quran offline with Urdu & English, 5 more languages, and Alafasy recitation.'],
  ['📿 Digital tasbeeh', 'Tap-anywhere counter with vibration, targets 33/99/100, rounds and your own zikr.'],
  ['📚 Hadees & Sunnat', 'Bukhari, Muslim, Tirmidhi, Abu Dawud and more. Hadith of the day.'],
  ['🤲 Azkar & duas', 'Morning & evening azkar and daily duas from Hisn al-Muslim with meaning.'],
  ['🧭 Qibla compass', 'Points to the Kaaba with the distance to Makkah.'],
  ['🌙 Hijri, Zakat & more', 'Islamic calendar, Ramadan sehri/iftar, Zakat calculator, 99 Names, mosques near me.'],
];
const shots = ['01-home', '02-namaz', '03-quran', '05-tasbeeh', '07-qibla', '06-daily', '08-share'];
const latest = posts.slice(0, 6);
write('index.html', page({
  title: 'Islam 365: Prayer Times, Quran, Tasbeeh & Qibla App (Free, No Ads)',
  description: 'Islam 365 is a free, ad-free Islamic app: namaz times with azan reminders, Qibla, full Quran with Urdu translation, digital tasbeeh, duas, hadith and Hijri calendar.',
  keywords: 'islam 365, islamic app, namaz timing app, prayer times, quran urdu, tasbeeh counter, qibla',
  canonical: `${SITE}/`,
  jsonld: {
    '@context': 'https://schema.org', '@type': 'MobileApplication', name: 'Islam 365', operatingSystem: 'Android',
    applicationCategory: 'LifestyleApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    downloadUrl: PLAY, image: `${SITE}/img/icon.png`,
    description: 'Prayer times with azan reminders, Qibla, Quran, tasbeeh, duas and hadith. Free and ad-free.',
  },
  body: `
<section class="hero"><img src="/img/icon.png" alt="" width="96" height="96" style="border-radius:22px">
<h1>Islam 365</h1><p>Namaz times with azan reminders, Quran with Urdu translation, digital tasbeeh, Qibla, duas and hadith. All in one app, <b>free and without ads</b>.</p>
<a class="btn" href="${playLink('hero')}" rel="noopener">▶ Get it on Google Play</a></section>
<div class="shots">${shots.map((s) => `<img src="/img/${s}.png" alt="Islam 365 screenshot ${s.slice(3)}" loading="lazy">`).join('')}</div>
<section class="feat">${features.map(([t, d]) => `<div><b>${t}</b>${d}</div>`).join('')}</section>
<div class="wrap"><h2>From the blog</h2><div class="list">
${latest.map((p) => `<a href="/blog/${p.slug}/" lang="${p.lang}" dir="${p.lang === 'ur' ? 'rtl' : 'ltr'}"><b>${p.title}</b><br><small>${p.description}</small></a>`).join('\n')}
</div><p><a href="/blog/">All articles →</a></p>
<div class="cta"><b>Ad-free. No sign-up. Your data stays on your phone.</b><br><a class="btn g" href="${playLink('home_bottom')}">Download Islam 365</a></div></div>`,
}));

// ---------- Blog index ----------
write('blog/index.html', page({
  title: 'Islam 365 Blog: Namaz, Quran, Azkar, Zakat and Daily Islamic Guides',
  description: 'Simple guides on prayer times, Qibla, tasbeeh, morning and evening azkar, Jumu\'ah sunnahs, Zakat and the 99 Names of Allah, in English and Urdu.',
  canonical: `${SITE}/blog/`,
  body: `<div class="wrap"><h1>Islam 365 Blog</h1><p>Simple guides for everyday deen, in English and اردو.</p><div class="list">
${posts.map((p) => `<a href="/blog/${p.slug}/" lang="${p.lang}" dir="${p.lang === 'ur' ? 'rtl' : 'ltr'}"><b>${p.title}</b><br><small>${p.description}</small></a>`).join('\n')}
</div></div>`,
}));

// ---------- Posts ----------
for (const p of posts) {
  const url = `${SITE}/blog/${p.slug}/`;
  const ur = p.lang === 'ur';
  const others = posts.filter((o) => o.slug !== p.slug && o.lang === p.lang).slice(0, 3);
  write(`blog/${p.slug}/index.html`, page({
    title: `${p.title} | Islam 365`, description: p.description, keywords: p.keywords, lang: p.lang, canonical: url,
    jsonld: { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description,
      datePublished: p.date, inLanguage: p.lang, mainEntityOfPage: url, image: `${SITE}/img/feature-graphic.png`,
      author: { '@type': 'Organization', name: 'Islam 365' }, publisher: { '@type': 'Organization', name: 'Islam 365', logo: { '@type': 'ImageObject', url: `${SITE}/img/icon.png` } } },
    body: `<div class="wrap"><article><h1>${p.title}</h1><small style="color:#5b6b63">${p.date}</small>${p.body}</article>
<div class="cta"><b>${ur ? 'Islam 365: نماز کے اوقات، قرآن، تسبیح اور دعائیں — مفت، بغیر اشتہار' : 'Islam 365: prayer times, Quran, tasbeeh and duas. Free, no ads.'}</b><br>
<a class="btn g" href="${playLink('blog_' + p.slug.slice(0, 30))}">${ur ? 'گوگل پلے سے ڈاؤن لوڈ کریں' : 'Download free on Google Play'}</a></div>
${others.length ? `<h2>${ur ? 'مزید پڑھیں' : 'Read next'}</h2><div class="list">${others.map((o) => `<a href="/blog/${o.slug}/"><b>${o.title}</b></a>`).join('')}</div>` : ''}
</div>`,
  }));
}

// ---------- sitemap / robots / vercel ----------
const urls = [`${SITE}/`, `${SITE}/blog/`, ...posts.map((p) => `${SITE}/blog/${p.slug}/`), `${SITE}/privacy.html`];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${u}</loc><lastmod>2026-11-09</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`built ${posts.length} posts -> ${OUT}`);
