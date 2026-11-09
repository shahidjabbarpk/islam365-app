# Islam 365: marketing plan aur status (2026-11-09)

## ✅ Ho chuka hai
1. **Website + blog live:** https://islam365-app.vercel.app (Vercel, shahidjabbarpk account, project `islam365-app`)
   - 43 SEO articles (English + Urdu): namaz ka tarika, Qibla, Tahajjud, Witr, Istikhara, Umrah, Zakat, Ramadan, azkar, duas, janaza, qaza namaz waghera
   - Har article mein Play Store ka download button (UTM tracking ke saath), sitemap.xml, robots.txt, Google ke liye structured data
   - Privacy policy bhi yahan hosted hai: https://islam365-app.vercel.app/privacy.html
2. **Bing + Yandex** ko IndexNow se saare pages bhej diye (accepted).
3. **GitHub public page:** https://github.com/shahidjabbarpk/islam365-app (README mein features, screenshots, Play link, blog links + topics). Is se backlink milta hai.
4. **Dua cards:** `social/dua-cards/` mein 12 portrait images (WhatsApp status/Instagram).
5. **Social media pack:** `social/img/` mein 8 images (1080×1080) aur `social/POSTS.md` mein Urdu/English captions + 14 din ka schedule.

## ✅ 2026-11-09 (Chrome se)
- Google Search Console verified (shahidjabbarpk), sitemap submitted, 16 pages mile
- Blogger: https://islam365-guides.blogspot.com, 20 posts live (Search Console mein bhi add, sitemap submitted)
- Play Console: website link = islam365-app.vercel.app (live); title + short description review mein

## ⏳ Baqi kaam
1. **Facebook page "Islam 365"** banayein, `social/POSTS.md` ke mutabiq roz 1 post. Islamic groups mein share karein (group rules ke mutabiq).
2. **Instagram + TikTok/YouTube Shorts:** app ka 15 second screen-recording (tasbeeh, Qibla, share feature). Ye sab se zyada installs laata hai.
3. **WhatsApp:** khud apne status pe post 1 lagayein aur family groups mein bhejein. Shuru ke 50–100 installs aur reviews yahin se aate hain.

## 📈 Play Store ASO (listing behtar karna)
- **Title:** `Islam 365: Namaz, Quran, Qibla` (2026-11-09 review ke liye bheja). Short description bhi update hui. Play "free/ad-free" jaise words ko promotion samajhta hai, short description mein na daalein.
- Full description mein ye words 3–5 baar natural tareeqe se aane chahiye: *namaz timing, prayer times, azan, quran urdu tarjuma, qibla direction, tasbeeh counter, islamic app*.
- **Reviews:** app pehle se ek dafa review maangti hai. Family/dost asli use kar ke 5-star + likhi hui review dein (fake reviews se account ban hota hai, woh nahi karna).
- **Urdu store listing** (Play Console → Translations → Urdu) add karein. Pakistan mein Urdu listing pe conversion behtar hota hai.

## 🚫 Jo main nahi karunga
- Doosri websites ya logon ke posts pe spam comments: account ban hote hain, Google bhi site ko neeche kar deta hai.
- Naye accounts banana, fake reviews, paid ads (bina aap ki ijazat ke).

## Naya article kaise add karein
`content/posts-*.js` mein naya object add karein → `node build.js` → `cd site && vercel deploy --prod --yes`.
