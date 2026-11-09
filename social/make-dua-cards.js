// node social/make-dua-cards.js -> social/dua-cards/*.png (1080x1350, portrait for status/Instagram)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const out = path.join(__dirname, 'dua-cards');
fs.mkdirSync(out, { recursive: true });
const icon = 'file:///' + path.join(__dirname, '..', 'site', 'img', 'icon.png').replace(/\\/g, '/');

const cards = [
  { id: '01-azan', head: 'اذان کے بعد کی دعا', ar: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ', ur: 'جو یہ دعا پڑھے، قیامت کے دن اس کے لیے نبی ﷺ کی شفاعت واجب ہو جاتی ہے', ref: 'صحیح بخاری' },
  { id: '02-ghar', head: 'گھر سے نکلنے کی دعا', ar: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', ur: 'اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا، اللہ کے بغیر نہ کوئی طاقت ہے نہ قوت', ref: 'سنن ابی داؤد، ترمذی' },
  { id: '03-sona', head: 'سونے کی دعا', ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', ur: 'اے اللہ! تیرے نام کے ساتھ میں مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں', ref: 'صحیح بخاری' },
  { id: '04-safar', head: 'سفر کی دعا', ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ', ur: 'پاک ہے وہ جس نے اسے ہمارے قابو میں کر دیا، ورنہ ہم اسے قابو میں نہ لا سکتے، اور ہمیں اپنے رب کی طرف لوٹنا ہے', ref: 'سورۃ الزخرف: ۱۳-۱۴' },
  { id: '05-pareshani', head: 'پریشانی اور غم کی دعا', ar: 'لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ', ur: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی ظالموں میں سے تھا (حضرت یونس علیہ السلام کی دعا)', ref: 'سورۃ الانبیاء: ۸۷' },
  { id: '06-walidain', head: 'والدین کے لیے دعا', ar: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', ur: 'اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے بچپن میں مجھے پالا', ref: 'سورۃ بنی اسرائیل: ۲۴' },
  { id: '07-rabbana', head: 'نبی ﷺ کی سب سے زیادہ مانگی جانے والی دعا', ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', ur: 'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی، اور ہمیں آگ کے عذاب سے بچا', ref: 'سورۃ البقرہ: ۲۰۱ · صحیح بخاری' },
  { id: '08-shifa', head: 'مریض کے لیے شفا کی دعا', ar: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا', ur: 'اے لوگوں کے رب! تکلیف دور فرما، شفا دے، تو ہی شفا دینے والا ہے، ایسی شفا جو کوئی بیماری نہ چھوڑے', ref: 'صحیح بخاری، صحیح مسلم' },
  { id: '09-wuzu', head: 'وضو کے بعد کی دعا', ar: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ', ur: 'اس کے لیے جنت کے آٹھوں دروازے کھول دیے جاتے ہیں، جس سے چاہے داخل ہو', ref: 'صحیح مسلم' },
  { id: '10-qadr', head: 'لیلۃ القدر کی دعا', ar: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', ur: 'اے اللہ! تو بہت معاف کرنے والا ہے، معافی کو پسند کرتا ہے، پس مجھے معاف فرما دے', ref: 'جامع ترمذی' },
  { id: '11-khana', head: 'کھانے کے بعد کی دعا', ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ', ur: 'تمام تعریفیں اللہ کے لیے جس نے مجھے یہ کھلایا اور میری کسی طاقت کے بغیر یہ رزق دیا', ref: 'سنن ابی داؤد، ترمذی' },
  { id: '12-namaz', head: 'ہر نماز کے بعد', ar: 'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', ur: 'اے اللہ! اپنے ذکر، اپنے شکر اور اپنی اچھی عبادت پر میری مدد فرما', ref: 'سنن ابی داؤد، نسائی' },
];

for (const c of cards) {
  const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
<style>html,body{margin:0;width:1080px;height:1350px;overflow:hidden;background:#0c5a48}
body{background:linear-gradient(160deg,#0d3449 0%,#0b7a55 100%);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative}
.frame{position:absolute;inset:36px;border:3px solid rgba(255,255,255,.25);border-radius:36px}
.head{font-family:'Noto Nastaliq Urdu',serif;font-weight:700;font-size:52px;color:#a8f0cf;margin:0 90px 40px;line-height:1.9}
.ar{font-family:'Amiri',serif;font-size:${c.ar.length > 90 ? 60 : 72}px;line-height:1.9;margin:0 90px;font-weight:700}
.ur{font-family:'Noto Nastaliq Urdu',serif;font-size:38px;line-height:2.1;margin:44px 110px 0;opacity:.95}
.ref{font-family:'Noto Nastaliq Urdu',serif;font-size:30px;color:#a8f0cf;margin-top:26px}
.foot{position:absolute;bottom:70px;display:flex;align-items:center;gap:18px;font-family:system-ui,Segoe UI;font-size:30px;font-weight:700;direction:ltr}
.foot img{width:66px;height:66px;border-radius:16px}.foot small{display:block;font-weight:400;font-size:22px;opacity:.85}</style></head>
<body><div class="frame"></div><div class="head">${c.head}</div><div class="ar">${c.ar}</div><div class="ur">${c.ur}</div><div class="ref">(${c.ref})</div>
<div class="foot"><img src="${icon}"><div>Islam 365<small>Free on Google Play · No ads</small></div></div></body></html>`;
  const f = path.join(out, c.id + '.html');
  fs.writeFileSync(f, html);
  execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1080,1350', '--virtual-time-budget=8000',
    `--screenshot=${path.join(out, c.id + '.png')}`, 'file:///' + f.replace(/\\/g, '/')], { stdio: 'ignore' });
  fs.unlinkSync(f);
  console.log('made', c.id);
}
