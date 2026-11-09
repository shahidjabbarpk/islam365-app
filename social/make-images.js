// node social/make-images.js -> social/img/*.png (1080x1080) via headless Edge
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const dir = __dirname;
const out = path.join(dir, 'img');
fs.mkdirSync(out, { recursive: true });
const icon = 'file:///' + path.join(dir, '..', 'site', 'img', 'icon.png').replace(/\\/g, '/');
const shot = (n) => 'file:///' + path.join(dir, '..', 'site', 'img', n + '.png').replace(/\\/g, '/');

const cards = [
  { id: '01-launch', top: 'NOW ON GOOGLE PLAY', title: 'Islam 365', sub: 'Namaz times · Azan reminders · Quran · Tasbeeh · Qibla · Duas', foot: '100% Free · No Ads', img: '01-home' },
  { id: '02-noads', top: 'FINALLY', title: 'An Islamic app<br>with <u>zero</u> ads', sub: 'No pop-ups while you read the Quran. No sign-up. Your data stays on your phone.', foot: 'Islam 365 · Free on Google Play', img: '03-quran' },
  { id: '03-reminder', urdu: true, top: 'نماز کبھی قضا نہ ہو', title: 'نماز سے پہلے<br>یاد دہانی', sub: 'وقت شروع ہونے سے پہلے، وقت پر، اور وقت ختم ہونے سے پہلے', foot: 'Islam 365 · مفت · بغیر اشتہار', img: '02-namaz' },
  { id: '04-tasbeeh', top: 'DIGITAL TASBEEH', title: 'SubhanAllah 33<br>Alhamdulillah 33<br>Allahu Akbar 34', sub: 'Tap anywhere to count, with vibration and daily streaks', foot: 'Islam 365 · Free on Google Play', img: '05-tasbeeh' },
  { id: '05-qibla', top: 'TRAVELLING?', title: 'Qibla + prayer times<br>follow you', sub: 'New city, new time zone: Islam 365 updates automatically', foot: 'Islam 365 · Free · No Ads', img: '07-qibla' },
  { id: '06-jumma', urdu: true, top: 'جمعہ مبارک', title: 'آج سورۃ الکہف<br>پڑھنا نہ بھولیں', sub: 'جو جمعہ کے دن سورۃ الکہف پڑھے، اس کے لیے دو جمعوں کے درمیان نور روشن کر دیا جاتا ہے', foot: 'Islam 365 · ہر جمعہ یاد دہانی', img: '04-surah' },
  { id: '07-share', top: 'SHARE KHAIR', title: 'Ayah, hadith & dua<br>as a WhatsApp status', sub: 'One tap to share a beautiful picture with family', foot: 'Islam 365 · Free on Google Play', img: '08-share' },
  { id: '08-ramadan', top: 'RAMADAN 2027 IS COMING', title: 'Start preparing<br>today', sub: 'Sehri & iftar times, Quran with Urdu translation, Zakat calculator', foot: 'Islam 365 · Free · No Ads', img: '06-daily' },
];

for (const c of cards) {
  const font = c.urdu ? "'Noto Nastaliq Urdu',serif" : "system-ui,Segoe UI,sans-serif";
  const html = `<!DOCTYPE html><html dir="${c.urdu ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@700&display=swap" rel="stylesheet">
<style>html,body{margin:0;width:1080px;height:1080px;overflow:hidden;background:#0c6450}
body{background:linear-gradient(150deg,#0d3449 0%,#0b7a55 100%);color:#fff;font-family:${font};display:flex;position:relative}
.l{width:600px;padding:70px 40px 70px 70px;display:flex;flex-direction:column;justify-content:center}
.top{letter-spacing:3px;font-weight:700;color:#a8f0cf;font-size:${c.urdu ? 36 : 26}px;margin-bottom:24px}
h1{font-size:${c.urdu ? 54 : 64}px;line-height:${c.urdu ? 1.9 : 1.15};margin:0 0 28px}
p{font-size:${c.urdu ? 28 : 30}px;line-height:${c.urdu ? 2 : 1.45};opacity:.92;margin:0}
.r{width:480px;display:flex;align-items:center;justify-content:center}
.r img{height:860px;border-radius:40px;box-shadow:0 30px 60px rgba(0,0,0,.4);border:8px solid #0a2433}
.foot{position:absolute;bottom:46px;${c.urdu ? 'right' : 'left'}:70px;display:flex;align-items:center;gap:18px;font-size:28px;font-weight:700;font-family:system-ui,'Noto Nastaliq Urdu'}
.foot img{width:64px;height:64px;border-radius:16px}</style></head>
<body><div class="l"><div class="top">${c.top}</div><h1>${c.title}</h1><p>${c.sub}</p></div>
<div class="r"><img src="${shot(c.img)}"></div><div class="foot"><img src="${icon}">${c.foot}</div></body></html>`;
  const f = path.join(out, c.id + '.html');
  fs.writeFileSync(f, html);
  execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1080,1080', '--virtual-time-budget=6000',
    `--screenshot=${path.join(out, c.id + '.png')}`, 'file:///' + f.replace(/\\/g, '/')], { stdio: 'ignore' });
  fs.unlinkSync(f);
  console.log('made', c.id);
}
