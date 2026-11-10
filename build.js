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
footer{text-align:center;color:var(--mut);font-size:.9rem;padding:30px 20px 90px}
.topcta{display:flex;align-items:center;gap:12px;background:#e8f3ed;border:1px solid #cfe6da;border-radius:14px;padding:12px 14px;margin:14px 0 6px}.topcta img{width:44px;height:44px;border-radius:10px}.topcta div{flex:1;font-size:.95rem;line-height:1.6}[lang=ur] .topcta div{font-size:.9rem;line-height:2}.topcta a{background:var(--g);color:#fff;text-decoration:none;font-weight:700;padding:9px 14px;border-radius:999px;white-space:nowrap}.midcta{border-inline-start:4px solid var(--g);background:#fff;border-radius:10px;padding:12px 16px;margin:22px 0;box-shadow:0 1px 4px rgba(0,0,0,.06)}.midcta a{font-weight:700}.sticky{position:fixed;left:0;right:0;bottom:0;z-index:9;background:#0d3449;color:#fff;display:flex;align-items:center;gap:10px;padding:10px 14px;box-shadow:0 -2px 10px rgba(0,0,0,.2)}.sticky img{width:36px;height:36px;border-radius:8px}.sticky span{flex:1;font-size:.9rem;line-height:1.3}.sticky a{background:#fff;color:var(--gd);font-weight:700;text-decoration:none;padding:9px 16px;border-radius:999px;white-space:nowrap}@media(min-width:900px){.sticky{left:auto;right:20px;bottom:20px;border-radius:16px;max-width:380px}}
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
<nav><a href="/namaz-timings/">Prayer times</a><a href="/blog/">Blog</a><a href="${playLink('header')}" rel="noopener">Download</a></nav></div></header>
${body}
${lang === 'ur'
  ? `<div class="sticky" dir="rtl"><img src="/img/icon.png" alt=""><span><b>Islam 365</b><br>نماز، قرآن، تسبیح · مفت</span><a href="${playLink('sticky')}" rel="noopener">انسٹال کریں</a></div>`
  : `<div class="sticky"><img src="/img/icon.png" alt=""><span><b>Islam 365</b><br>Prayer times, Quran, tasbeeh · Free</span><a href="${playLink('sticky')}" rel="noopener">Install</a></div>`}
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

function midCta(body, ur) {
  const box = `<div class="midcta">${ur ? '📲 روزانہ یاد رکھنے کے لیے: <a href="' + playLink('blog_mid') + '" rel="noopener">Islam 365 مفت ڈاؤن لوڈ کریں</a>، ہر نماز سے پہلے یاد دہانی اور یہ دعائیں ایک ٹچ پر۔' : '📲 Never forget it: <a href="' + playLink('blog_mid') + '" rel="noopener">get Islam 365 free</a> for reminders before every prayer and these duas one tap away.'}</div>`;
  const i = body.indexOf('<h2>', body.indexOf('<h2>') + 1);
  return i > 0 ? body.slice(0, i) + box + body.slice(i) : body + box;
}

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
    body: `<div class="wrap"><article><h1>${p.title}</h1><small style="color:#5b6b63">${p.date}</small>
<div class="topcta"><img src="/img/icon.png" alt="Islam 365"><div>${ur ? '<b>Islam 365</b> ایپ: نماز، قرآن اور دعائیں، مفت' : 'All of this is in the <b>Islam 365</b> app: prayer times, azan reminders, Quran and duas. Free, no ads.'}</div><a href="${playLink('blog_top')}" rel="noopener">${ur ? 'انسٹال کریں' : 'Install'}</a></div>
${midCta(p.body, ur)}</article>
<div class="cta"><b>${ur ? 'Islam 365: نماز کے اوقات، قرآن، تسبیح اور دعائیں — مفت، بغیر اشتہار' : 'Islam 365: prayer times, Quran, tasbeeh and duas. Free, no ads.'}</b><br>
<a class="btn g" href="${playLink('blog_' + p.slug.slice(0, 30))}">${ur ? 'گوگل پلے سے ڈاؤن لوڈ کریں' : 'Download free on Google Play'}</a></div>
${others.length ? `<h2>${ur ? 'مزید پڑھیں' : 'Read next'}</h2><div class="list">${others.map((o) => `<a href="/blog/${o.slug}/"><b>${o.title}</b></a>`).join('')}</div>` : ''}
</div>`,
  }));
}


// ---------- Prayer time city pages ----------
const PT = require('./lib/praytimes');
const cities = require('./lib/cities');
const BUILD_DAY = new Date(Date.UTC(2026, 10, 10));
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const cityUrls = [];
for (const [slug, name, urName, country, lat, lng, tz, mkey] of cities) {
  const m = PT.METHODS[mkey];
  const rows = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(BUILD_DAY.getTime() + i * 864e5);
    const t = PT.compute(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), lat, lng, tz, m);
    rows.push(`<tr data-d="${d.toISOString().slice(0, 10)}"><td>${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}</td>${['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map((k) => `<td>${PT.fmt(t[k])}</td>`).join('')}</tr>`);
  }
  const url = `${SITE}/namaz-timings/${slug}/`;
  cityUrls.push(url);
  const near = cities.filter((c) => c[3] === country && c[0] !== slug).slice(0, 8);
  const cta = playLink('city_' + slug);
  write(`namaz-timings/${slug}/index.html`, page({
    title: `${name} Prayer Times Today – Namaz Timings ${name} | Islam 365`,
    description: `Today's prayer times in ${name}, ${country}: Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha (${m.name}), plus the full 30-day namaz timetable. ${urName} نماز کے اوقات۔`,
    keywords: `${name.toLowerCase()} prayer times, namaz timing ${name.toLowerCase()}, ${name.toLowerCase()} namaz time today, azan time ${name.toLowerCase()}, ${urName} نماز کے اوقات`,
    canonical: url,
    body: `<div class="wrap">
<h1>${name} Prayer Times Today</h1>
<p style="font-size:1.2rem;margin-top:-8px" dir="rtl" lang="ur">${urName} میں آج نماز کے اوقات</p>
<div id="today" class="cta" style="text-align:start;margin-top:10px"><b id="next">Today in ${name}</b><table id="tt" style="margin-top:10px"></table></div>
<div class="topcta"><img src="/img/icon.png" alt="Islam 365"><div>Get <b>azan reminders for ${name}</b> before every prayer with the free Islam 365 app. No ads.</div><a href="${cta}" rel="noopener">Install</a></div>
<h2>${name} namaz timetable (next 30 days)</h2>
<table class="month"><tr><th>Date</th><th>Fajr</th><th>Sunrise</th><th>Dhuhr</th><th>Asr</th><th>Maghrib</th><th>Isha</th></tr>${rows.join('')}</table>
<p><small>Calculation: ${m.name}. Times can differ by 1–2 minutes from your local masjid; follow your masjid's timetable for jama'at.</small></p>
<div class="midcta">📲 These times change every day. <a href="${cta}" rel="noopener">Install Islam 365</a> to get the exact times for your street, a reminder before each prayer, Qibla direction and the Quran, all free.</div>
<h2>About prayer times in ${name}</h2>
<p>Fajr begins at dawn, Dhuhr just after midday, Asr in the afternoon${m.asr === 2 ? ' (Hanafi method, when an object\'s shadow is twice its length, as followed in most masajid in the region)' : ''}, Maghrib at sunset and Isha when the twilight disappears. Read more: <a href="/blog/prayer-time-calculation-methods-hanafi-shafi-asr/">why prayer times differ between apps</a>.</p>
${near.length ? `<h2>Prayer times in other cities in ${country}</h2><p>${near.map((c) => `<a href="/namaz-timings/${c[0]}/">${c[1]}</a>`).join(' · ')}</p>` : ''}
<p><a href="/namaz-timings/">All cities →</a></p>
</div>
<style>table.month td,table.month th{padding:6px 5px;font-size:.88rem;text-align:center}table.month tr.today{background:#fff4c8;font-weight:700}#tt td{padding:6px 10px}</style>
<script src="/praytimes.js"></script>
<script>(function(){var lat=${lat},lng=${lng},tz=${tz},m=PrayTimes.METHODS['${mkey}'];
var now=new Date(Date.now()+tz*36e5),y=now.getUTCFullYear(),mo=now.getUTCMonth()+1,d=now.getUTCDate();
var t=PrayTimes.compute(y,mo,d,lat,lng,tz,m),names={fajr:'Fajr',sunrise:'Sunrise',dhuhr:'Dhuhr',asr:'Asr',maghrib:'Maghrib',isha:'Isha'},h=now.getUTCHours()+now.getUTCMinutes()/60,next=null,html='';
for(var k in names){html+='<tr><td>'+names[k]+'</td><td><b>'+PrayTimes.fmt(t[k])+'</b></td></tr>';if(!next&&k!=='sunrise'&&t[k]>h)next=k;}
document.getElementById('tt').innerHTML=html;
var iso=now.toISOString().slice(0,10),r=document.querySelector('tr[data-d="'+iso+'"]');if(r)r.className='today';
if(next){var mins=Math.round((t[next]-h)*60);document.getElementById('next').textContent='Next in ${name}: '+names[next]+' at '+PrayTimes.fmt(t[next])+' (in '+Math.floor(mins/60)+'h '+(mins%60)+'m)';}
else document.getElementById('next').textContent='Today in ${name} ('+d+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][mo-1]+')';})();</script>`,
  }));
}
const byCountry = {};
for (const c of cities) (byCountry[c[3]] = byCountry[c[3]] || []).push(c);
write('namaz-timings/index.html', page({
  title: 'Namaz Timings Today: Prayer Times for Pakistan, Saudi Arabia, UAE, India | Islam 365',
  description: 'Accurate prayer times today for Karachi, Lahore, Islamabad, Makkah, Madinah, Dubai, Delhi and more, with a 30-day namaz timetable for each city.',
  keywords: 'namaz timings, prayer times today, namaz time pakistan, prayer times saudi arabia, azan time',
  canonical: `${SITE}/namaz-timings/`,
  body: `<div class="wrap"><h1>Namaz Timings Today</h1><p>Choose your city for today's prayer times and a 30-day timetable. For your exact location and reminders before every prayer, <a href="${playLink('city_index')}">install Islam 365</a> (free).</p>
${Object.entries(byCountry).map(([country, list]) => `<h2>${country}</h2><div class="list">${list.map((c) => `<a href="/namaz-timings/${c[0]}/"><b>${c[1]} prayer times</b> <span dir="rtl" lang="ur"> · ${c[2]}</span></a>`).join('')}</div>`).join('\n')}</div>`,
}));

// ---------- sitemap / robots / vercel ----------
const urls = [`${SITE}/`, `${SITE}/blog/`, ...posts.map((p) => `${SITE}/blog/${p.slug}/`), `${SITE}/namaz-timings/`, ...cityUrls, `${SITE}/privacy.html`];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${u}</loc><lastmod>2026-11-10</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.copyFileSync(path.join(__dirname, 'lib', 'praytimes.js'), path.join(OUT, 'praytimes.js'));
console.log(`built ${posts.length} posts -> ${OUT}`);
