// City prayer times, Ramadan timetables, Qibla pages and tools.
// Called from build.js: require('./lib/pages-cities')({ write, page, playLink, SITE, MONTHS }) -> list of URLs.
const PT = require('./praytimes');
const cities = require('./cities');

module.exports = function build({ write, page, playLink, SITE, MONTHS }) {
  const urls = [];
  const _n = new Date(Date.now() + 5 * 36e5);
  const BUILD_DAY = Date.UTC(_n.getUTCFullYear(), _n.getUTCMonth(), _n.getUTCDate());
  const byCountry = {};
  for (const c of cities) (byCountry[c[3]] = byCountry[c[3]] || []).push(c);
  const compass = (b) => ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'][Math.round(b / 45) % 8];
  const dayRow = (d0, i, c) => {
    const d = new Date(d0 + i * 864e5);
    return { d, t: PT.compute(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), c[4], c[5], c[6], PT.METHODS[c[7]]) };
  };
  const nearLinks = (c, base, label) => {
    const near = byCountry[c[3]].filter((o) => o[0] !== c[0]).slice(0, 12);
    return near.length ? `<h2>${label} in other cities in ${c[3]}</h2><p>${near.map((o) => `<a href="/${base}/${o[0]}/">${o[1]}</a>`).join(' · ')}</p>` : '';
  };
  const style = '<style>table.month td,table.month th{padding:6px 4px;font-size:.85rem;text-align:center}table.month tr.today{background:#fff4c8;font-weight:700}#tt td{padding:6px 10px}.big{font-size:2.4rem;font-weight:800;color:var(--gd)}</style>';

  for (const c of cities) {
    const [slug, name, urName, country, lat, lng, tz, mkey] = c;
    const m = PT.METHODS[mkey];
    const hanafiDefault = m.asr === 2;
    const q = PT.qibla(lat, lng);
    const cta = playLink('city_' + slug);

    // ----- prayer times -----
    const rows = [];
    for (let i = 0; i < 30; i++) {
      const { d, t } = dayRow(BUILD_DAY, i, c);
      rows.push(`<tr data-d="${d.toISOString().slice(0, 10)}"><td>${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}</td>${['fajr', 'sunrise', 'dhuhr', 'asr', 'asrHanafi', 'maghrib', 'isha'].map((k) => `<td>${PT.fmt(t[k])}</td>`).join('')}</tr>`);
    }
    const url = `${SITE}/namaz-timings/${slug}/`;
    urls.push(url);
    write(`namaz-timings/${slug}/index.html`, page({
      title: `${name} Prayer Times Today – Namaz Timings ${name} | Islam 365`,
      description: `Today's prayer times in ${name}, ${country}: Fajr, Sunrise, Dhuhr, Asr (Hanafi & Shafi'i), Maghrib and Isha, plus a 30-day namaz timetable and Qibla direction. ${urName} نماز کے اوقات۔`,
      keywords: `${name.toLowerCase()} prayer times, namaz timing ${name.toLowerCase()}, ${name.toLowerCase()} namaz time today, azan time ${name.toLowerCase()}, salah times ${name.toLowerCase()}, ${urName} نماز کے اوقات`,
      canonical: url,
      body: `<div class="wrap">
<h1>${name} Prayer Times Today</h1>
<p style="font-size:1.2rem;margin-top:-8px" dir="rtl" lang="ur">${urName} میں آج نماز کے اوقات</p>
<div class="cta" style="text-align:start;margin-top:10px"><b id="next">Today in ${name}</b><table id="tt" style="margin-top:10px"></table></div>
<div class="topcta"><img src="/img/icon.png" alt="Islam 365"><div>Get <b>azan reminders for ${name}</b> before every prayer with the free Islam 365 app. No ads.</div><a href="${cta}" rel="noopener">Install</a></div>
<h2>${name} namaz timetable (next 30 days)</h2>
<table class="month"><tr><th>Date</th><th>Fajr</th><th>Sunrise</th><th>Dhuhr</th><th>Asr (Shafi'i)</th><th>Asr (Hanafi)</th><th>Maghrib</th><th>Isha</th></tr>${rows.join('')}</table>
<p><small>Fajr/Isha: ${m.name.replace(' · Hanafi Asr', '')}. Most masajid in ${country} follow the ${hanafiDefault ? 'Hanafi' : "standard (Shafi'i)"} Asr time. Times can differ by 1–2 minutes from your local masjid.</small></p>
<div class="midcta">📲 These times change every day. <a href="${cta}" rel="noopener">Install Islam 365</a> for the exact times at your street, a reminder before each prayer, the Qibla compass and the Quran, all free.</div>
<h2>Qibla direction from ${name}</h2>
<p>The Qibla from ${name} is <b>${q.bearing.toFixed(1)}° from true north</b> (towards the ${compass(q.bearing)}), and the Kaaba is about <b>${Math.round(q.km).toLocaleString('en')} km</b> away. <a href="/qibla-direction/${slug}/">Qibla direction details</a>.</p>
<p>Ramadan 2027: <a href="/ramadan-2027/${slug}/">${name} sehri and iftar timetable</a>.</p>
${nearLinks(c, 'namaz-timings', 'Prayer times')}
<p><a href="/namaz-timings/">All cities →</a></p>
</div>${style}
<script src="/praytimes.js"></script>
<script>(function(){var c=${JSON.stringify([lat, lng, tz, mkey])},m=PrayTimes.METHODS[c[3]];
var p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:c[2],hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'}).formatToParts(new Date()).filter(function(x){return x.type!=='literal'}).map(function(x){return [x.type,+x.value]}));
var t=PrayTimes.compute(p.year,p.month,p.day,c[0],c[1],c[2],m),h=p.hour%24+p.minute/60,names={fajr:'Fajr',sunrise:'Sunrise',dhuhr:'Dhuhr',asrUsed:'Asr',maghrib:'Maghrib',isha:'Isha'},next=null,html='';
for(var k in names){html+='<tr><td>'+names[k]+'</td><td><b>'+PrayTimes.fmt(t[k])+'</b></td></tr>';if(!next&&k!=='sunrise'&&t[k]>h)next=k;}
document.getElementById('tt').innerHTML=html;
var iso=p.year+'-'+String(p.month).padStart(2,'0')+'-'+String(p.day).padStart(2,'0'),r=document.querySelector('tr[data-d="'+iso+'"]');if(r)r.className='today';
if(next){var mins=Math.round((t[next]-h)*60);document.getElementById('next').textContent='Next in ${name}: '+names[next]+' at '+PrayTimes.fmt(t[next])+' (in '+Math.floor(mins/60)+'h '+(mins%60)+'m)';}})();</script>`,
    }));

    // ----- Ramadan 2027 -----
    const RS = Date.UTC(2027, 1, 8);
    const rrows = [];
    for (let i = 0; i < 30; i++) {
      const { d, t } = dayRow(RS, i, c);
      rrows.push(`<tr><td>${i + 1}</td><td>${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}</td><td><b>${PT.fmt(t.fajr)}</b></td><td><b>${PT.fmt(t.maghrib)}</b></td></tr>`);
    }
    const rurl = `${SITE}/ramadan-2027/${slug}/`;
    urls.push(rurl);
    const rcta = playLink('ramadan_' + slug);
    write(`ramadan-2027/${slug}/index.html`, page({
      title: `Ramadan 2027 ${name} Sehri & Iftar Timetable | Ramzan Calendar ${name}`,
      description: `Ramadan 1448 (2027) sehri and iftar times for ${name}, ${country}: full 30-day Ramzan timetable from the expected start on 8 February 2027. ${urName} رمضان ۲۰۲۷ سحری و افطار۔`,
      keywords: `ramadan 2027 ${name.toLowerCase()}, sehri time ${name.toLowerCase()}, iftar time ${name.toLowerCase()}, ramzan calendar 2027 ${name.toLowerCase()}, ${urName} سحری افطار`,
      canonical: rurl,
      body: `<div class="wrap">
<h1>Ramadan 2027 Sehri &amp; Iftar Timetable: ${name}</h1>
<p style="font-size:1.2rem;margin-top:-8px" dir="rtl" lang="ur">${urName}: رمضان ۲۰۲۷ سحری و افطار کے اوقات</p>
<div class="topcta"><img src="/img/icon.png" alt="Islam 365"><div>Get <b>sehri and iftar times for ${name}</b> on your phone every day of Ramadan with the free Islam 365 app.</div><a href="${rcta}" rel="noopener">Install</a></div>
<p>Ramadan 1448 is <b>expected to begin on 8 February 2027</b> (first fast), subject to the sighting of the moon in ${country}. If Ramadan starts a day later, use the next row.</p>
<table class="month"><tr><th>Roza</th><th>Date</th><th>Sehri ends (Fajr)</th><th>Iftar (Maghrib)</th></tr>${rrows.join('')}</table>
<p><small>Calculation: ${m.name}. Many local calendars stop sehri a few minutes before Fajr as a precaution; follow your local masjid.</small></p>
<div class="midcta">📲 <a href="${rcta}" rel="noopener">Install Islam 365</a> to see today's sehri and iftar on your home screen and read the Quran with translation throughout Ramadan.</div>
<h2>Ramadan guides</h2>
<p><a href="/blog/sehri-iftar-ki-dua-roza/">Dua for breaking the fast</a> · <a href="/blog/laylatul-qadr-ki-dua-aakhri-ashra/">Laylatul Qadr dua</a> · <a href="/blog/ramadan-2027-preparation-checklist/">Ramadan checklist</a> · <a href="/blog/zakat-al-fitr-fitrana-guide/">Zakat al-Fitr</a></p>
<p><a href="/namaz-timings/${slug}/">${name} prayer times today</a></p>
${nearLinks(c, 'ramadan-2027', 'Ramadan timetable')}
</div>${style}`,
    }));

    // ----- Qibla -----
    const qurl = `${SITE}/qibla-direction/${slug}/`;
    urls.push(qurl);
    write(`qibla-direction/${slug}/index.html`, page({
      title: `Qibla Direction in ${name}: ${q.bearing.toFixed(1)}° from North | Islam 365`,
      description: `The Qibla direction from ${name}, ${country} is ${q.bearing.toFixed(1)}° from true north (${compass(q.bearing)}). Distance to the Kaaba in Makkah: ${Math.round(q.km)} km. ${urName} سے قبلہ کا رخ۔`,
      keywords: `qibla direction ${name.toLowerCase()}, qibla ${name.toLowerCase()}, ${name.toLowerCase()} qibla angle, kaaba direction from ${name.toLowerCase()}, ${urName} قبلہ`,
      canonical: qurl,
      body: `<div class="wrap">
<h1>Qibla Direction in ${name}</h1>
<p style="font-size:1.2rem;margin-top:-8px" dir="rtl" lang="ur">${urName} سے قبلہ کا رخ</p>
<div class="cta"><div class="big">${q.bearing.toFixed(1)}°</div>from true north, towards the <b>${compass(q.bearing)}</b><br>Distance to the Kaaba: <b>${Math.round(q.km).toLocaleString('en')} km</b></div>
<div class="topcta"><img src="/img/icon.png" alt="Islam 365"><div>Find the Qibla in seconds with the <b>Islam 365 compass</b>, at home, in a hotel or at work. Free, no ads.</div><a href="${playLink('qibla_' + slug)}" rel="noopener">Install</a></div>
<h2>How to use this angle</h2>
<ol><li>Open a compass and hold your phone flat.</li><li>Turn until the compass reads <b>${Math.round(q.bearing)}°</b>.</li><li>That is the Qibla. Phone compasses show magnetic north, which can differ from true north by a few degrees; a Qibla app corrects for your location.</li></ol>
<p>Read our step-by-step guide: <a href="/blog/how-to-find-qibla-direction-on-your-phone/">how to find the Qibla on your phone</a>.</p>
<p><a href="/namaz-timings/${slug}/">${name} prayer times today</a></p>
${nearLinks(c, 'qibla-direction', 'Qibla direction')}
</div>${style}`,
    }));
  }

  // ----- index pages -----
  const indexPage = (base, title, desc, h1, intro, label) => {
    write(`${base}/index.html`, page({
      title, description: desc, canonical: `${SITE}/${base}/`,
      body: `<div class="wrap"><h1>${h1}</h1><p>${intro}</p>
${Object.entries(byCountry).map(([country, list]) => `<h2>${country}</h2><div class="list">${list.map((c) => `<a href="/${base}/${c[0]}/"><b>${c[1]} ${label}</b> <span dir="rtl" lang="ur"> · ${c[2]}</span></a>`).join('')}</div>`).join('\n')}</div>`,
    }));
    urls.push(`${SITE}/${base}/`);
  };
  indexPage('namaz-timings', 'Namaz Timings Today: Prayer Times for Pakistan, Saudi Arabia, UAE, UK, USA | Islam 365',
    'Accurate prayer times today for ' + cities.length + ' cities: Karachi, Lahore, Islamabad, Makkah, Dubai, London, New York and more, with 30-day timetables.',
    'Namaz Timings Today', `Choose your city for today's prayer times and a 30-day timetable. For your exact location and reminders, <a href="${playLink('city_index')}">install Islam 365</a> (free).`, 'prayer times');
  indexPage('ramadan-2027', 'Ramadan 2027 Calendar: Sehri & Iftar Times by City | Islam 365',
    'Ramadan 1448 (2027) sehri and iftar timetables for ' + cities.length + ' cities in Pakistan, Saudi Arabia, UAE, India, UK, USA and more. Expected start 8 February 2027.',
    'Ramadan 2027 Sehri &amp; Iftar Timetables', `Ramadan 1448 is expected to begin on <b>8 February 2027</b>, depending on the moon. <a href="${playLink('ramadan_index')}">Install Islam 365</a> for daily sehri and iftar on your phone.`, 'Ramadan timetable');
  indexPage('qibla-direction', 'Qibla Direction by City: Angle and Distance to the Kaaba | Islam 365',
    'Qibla direction (degrees from north) and distance to the Kaaba for ' + cities.length + ' cities worldwide.',
    'Qibla Direction by City', `Find the Qibla angle for your city, or <a href="${playLink('qibla_index')}">install Islam 365</a> for a live Qibla compass.`, 'Qibla direction');
  return urls;
};
