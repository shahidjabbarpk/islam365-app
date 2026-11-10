// Interactive tool pages: Hijri date today, online tasbeeh counter, Zakat calculator.
module.exports = function build({ write, page, playLink, SITE }) {
  const urls = [];
  const box = (src, en) => `<div class="topcta"><img src="/img/icon.png" alt="Islam 365"><div>${en}</div><a href="${playLink(src)}" rel="noopener">Install</a></div>`;

  // ----- Hijri date today -----
  urls.push(`${SITE}/hijri-date-today/`);
  write('hijri-date-today/index.html', page({
    title: 'Hijri Date Today: Islamic Date in Pakistan, Saudi Arabia and Worldwide | Islam 365',
    description: "Today's Islamic (Hijri) date according to the Umm al-Qura calendar, the usual one-day difference in Pakistan and India, and the Islamic months. آج کی اسلامی تاریخ۔",
    keywords: 'hijri date today, islamic date today, aaj islami tarikh kya hai, today islamic date pakistan, chand ki tarikh, آج اسلامی تاریخ',
    canonical: `${SITE}/hijri-date-today/`,
    body: `<div class="wrap"><h1>Hijri Date Today</h1>
<p style="font-size:1.2rem;margin-top:-8px" dir="rtl" lang="ur">آج کی اسلامی (ہجری) تاریخ</p>
<div class="cta"><div class="big" id="hd">…</div><div id="gd"></div><div id="ur" dir="rtl" lang="ur" style="font-size:1.3rem;margin-top:6px"></div></div>
${box('hijri', 'See the Hijri date every day on your home screen, plus Ramadan, Eid and Islamic dates, with <b>Islam 365</b>. Free.')}
<h2>Why Pakistan's date can be one day different</h2>
<p>The date above follows the <b>Umm al-Qura</b> calendar used in Saudi Arabia. In Pakistan, India and Bangladesh each month starts when the new moon is sighted locally, which is often <b>one day later</b>. So if today is the 15th here, it may be the 14th in Pakistan. For Ramadan and Eid, always follow your local moon-sighting committee (Ruet-e-Hilal in Pakistan).</p>
<h2>The 12 Islamic months</h2>
<p>Muharram · Safar · Rabi' al-Awwal · Rabi' al-Thani · Jumada al-Ula · Jumada al-Akhirah · Rajab · Sha'ban · Ramadan · Shawwal · Dhul Qa'dah · Dhul Hijjah. <a href="/blog/islamic-months-hijri-calendar-names-meaning/">Read about each month</a>.</p>
<p>White days (13th, 14th, 15th) are sunnah fasts: <a href="/blog/fasting-monday-thursday-white-days/">learn more</a>.</p>
</div><style>.big{font-size:2.2rem;font-weight:800;color:var(--gd)}</style>
<script>(function(){var d=new Date();
try{document.getElementById('hd').textContent=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(d);
document.getElementById('ur').textContent=new Intl.DateTimeFormat('ur-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(d);}catch(e){document.getElementById('hd').textContent='Open in a modern browser';}
document.getElementById('gd').textContent=d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});})();</script>`,
  }));

  // ----- Online tasbeeh counter -----
  urls.push(`${SITE}/online-tasbeeh-counter/`);
  write('online-tasbeeh-counter/index.html', page({
    title: 'Online Tasbeeh Counter: Free Digital Tasbih for Zikr (33, 99, 100) | Islam 365',
    description: 'A free online tasbeeh counter: tap or press space to count SubhanAllah, Alhamdulillah, Allahu Akbar, Astaghfirullah or durood, with targets of 33, 99, 100 or your own. ڈیجیٹل تسبیح۔',
    keywords: 'online tasbeeh counter, digital tasbeeh, tasbih counter online, zikr counter, tasbeeh online, تسبیح کاؤنٹر',
    canonical: `${SITE}/online-tasbeeh-counter/`,
    body: `<div class="wrap" style="text-align:center"><h1>Online Tasbeeh Counter</h1>
<p dir="rtl" lang="ur" style="font-size:1.2rem;margin-top:-8px">آن لائن تسبیح کاؤنٹر</p>
<select id="z" style="font-size:1.05rem;padding:8px;border-radius:10px;margin:6px">
<option>SubhanAllah · سُبْحَانَ ٱللَّٰهِ</option><option>Alhamdulillah · ٱلْحَمْدُ لِلَّٰهِ</option><option>Allahu Akbar · ٱللَّٰهُ أَكْبَرُ</option><option>Astaghfirullah · أَسْتَغْفِرُ ٱللَّٰهَ</option><option>La ilaha illallah · لَا إِلَٰهَ إِلَّا ٱللَّٰهُ</option><option>Durood · ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ</option></select>
<select id="tg" style="font-size:1.05rem;padding:8px;border-radius:10px;margin:6px"><option value="33">Target 33</option><option value="34">Target 34</option><option value="99">Target 99</option><option value="100">Target 100</option><option value="0">No target</option></select>
<button id="tap" style="display:block;margin:18px auto;width:240px;height:240px;border-radius:50%;border:0;background:radial-gradient(circle at 35% 30%,#16a374,#0b7a55);color:#fff;font-size:4rem;font-weight:800;box-shadow:0 10px 30px rgba(11,122,85,.35);cursor:pointer;-webkit-tap-highlight-color:transparent">0</button>
<div id="info" style="color:#5b6b63">Tap the circle or press the space bar · Round <b id="rd">0</b> · Total <b id="tot">0</b></div>
<button id="rs" style="margin-top:12px;padding:8px 18px;border-radius:999px;border:1px solid #cfe6da;background:#fff;cursor:pointer">Reset</button>
${box('tasbeeh_tool', 'Take your tasbeeh everywhere: the <b>Islam 365</b> app counts with vibration, keeps daily streaks and works offline. Free.')}
<div style="text-align:start"><h2>Sunnah tasbeeh to start with</h2>
<ul><li><b>After every fard prayer:</b> SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 33 (Sahih Muslim). <a href="/blog/what-to-recite-after-every-salah/">Full adhkar after salah</a></li>
<li><b>Before sleeping (Tasbeeh-e-Fatima):</b> SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34 (Bukhari, Muslim).</li>
<li><b>Daily:</b> Astaghfirullah 100 times, as the Prophet ﷺ did (Sahih Muslim). <a href="/blog/istighfar-ki-fazilat-astaghfirullah/">Virtues of istighfar</a></li></ul></div>
</div>
<script>(function(){var n=0,r=0,tot=+(localStorage.tb_tot||0),b=document.getElementById('tap'),tg=document.getElementById('tg');
function show(){b.textContent=n;document.getElementById('rd').textContent=r;document.getElementById('tot').textContent=tot;}
function tap(){n++;tot++;localStorage.tb_tot=tot;var t=+tg.value;if(t&&n>=t){r++;n=0;if(navigator.vibrate)navigator.vibrate([80,60,80]);}else if(navigator.vibrate)navigator.vibrate(15);show();}
b.onclick=tap;document.addEventListener('keydown',function(e){if(e.code==='Space'){e.preventDefault();tap();}});
document.getElementById('rs').onclick=function(){n=0;r=0;show();};document.getElementById('z').onchange=function(){n=0;r=0;show();};show();})();</script>`,
  }));

  // ----- Zakat calculator -----
  urls.push(`${SITE}/zakat-calculator/`);
  write('zakat-calculator/index.html', page({
    title: 'Zakat Calculator 2026: Calculate Zakat on Gold, Silver, Cash and Savings | Islam 365',
    description: 'Free Zakat calculator: enter your gold, silver, cash, savings, business stock and debts, choose gold or silver nisab, and get the 2.5% Zakat due. Works in any currency. زکوٰۃ کیلکولیٹر۔',
    keywords: 'zakat calculator, zakat calculator pakistan, how much zakat do i owe, zakat on gold calculator, zakat calculator 2026, زکوٰۃ کیلکولیٹر',
    canonical: `${SITE}/zakat-calculator/`,
    body: `<div class="wrap"><h1>Zakat Calculator</h1>
<p dir="rtl" lang="ur" style="font-size:1.2rem;margin-top:-8px">زکوٰۃ کیلکولیٹر</p>
<p>Enter amounts in your own currency (PKR, SAR, AED, GBP, USD…). Enter today's market price of gold and silver per gram.</p>
<style>.zk label{display:flex;justify-content:space-between;gap:10px;align-items:center;margin:8px 0}.zk input{width:46%;padding:9px;border:1px solid #cfe6da;border-radius:10px;font-size:1rem}</style>
<div class="zk cta" style="text-align:start">
<label>Gold price per gram<input id="gp" type="number" inputmode="decimal" placeholder="e.g. 25000"></label>
<label>Silver price per gram<input id="sp" type="number" inputmode="decimal" placeholder="e.g. 300"></label>
<label>Gold you own (grams)<input id="gg" type="number" inputmode="decimal"></label>
<label>Silver you own (grams)<input id="sg" type="number" inputmode="decimal"></label>
<label>Cash at home and in bank<input id="cash" type="number" inputmode="decimal"></label>
<label>Business stock / goods for sale<input id="biz" type="number" inputmode="decimal"></label>
<label>Money others owe you<input id="rec" type="number" inputmode="decimal"></label>
<label>Debts you must pay now<input id="debt" type="number" inputmode="decimal"></label>
<label>Nisab<select id="nis" style="width:46%;padding:9px;border-radius:10px"><option value="s">Silver (612.36 g) — recommended</option><option value="g">Gold (87.48 g)</option></select></label>
<div id="out" style="font-size:1.15rem;margin-top:12px"></div></div>
${box('zakat_tool', 'Keep a Zakat calculator in your pocket, plus prayer times and the Quran, with <b>Islam 365</b>. Free, no ads.')}
<h2>How this calculator works</h2>
<p>Zakat is 2.5% of your net zakatable wealth if it is at or above the nisab for one lunar year: 87.48 g of gold (7.5 tola) or 612.36 g of silver (52.5 tola). Your home, car and personal items are not counted. Read the full guide: <a href="/blog/zakat-calculator-nisab-gold-silver-guide/">how to calculate Zakat</a>. For complex cases, ask a qualified mufti.</p>
</div>
<script>(function(){var ids=['gp','sp','gg','sg','cash','biz','rec','debt','nis'];function v(i){return +document.getElementById(i).value||0}
function calc(){var assets=v('gg')*v('gp')+v('sg')*v('sp')+v('cash')+v('biz')+v('rec'),net=assets-v('debt'),nis=document.getElementById('nis').value==='g'?87.48*v('gp'):612.36*v('sp'),o=document.getElementById('out'),f=function(x){return Math.round(x).toLocaleString()};
if(!nis){o.innerHTML='Enter the gold or silver price to work out the nisab.';return;}
o.innerHTML='Net zakatable wealth: <b>'+f(net)+'</b><br>Nisab: <b>'+f(nis)+'</b><br>'+(net>=nis?'Zakat due (2.5%): <b style="font-size:1.4rem;color:#075c40">'+f(net*0.025)+'</b>':'Below nisab: <b>no Zakat due</b>');}
ids.forEach(function(i){document.getElementById(i).addEventListener('input',calc)});calc();})();</script>`,
  }));
  return urls;
};
