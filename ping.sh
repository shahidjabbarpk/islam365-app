#!/bin/sh
# Ping IndexNow (Bing, Yandex, Seznam, Naver) with every URL in the sitemap.
cd "$(dirname "$0")"
ID=$(cat indexnow-id.txt)
python -I -c "
import json,re,sys
urls=re.findall(r'<loc>([^<]+)</loc>',open('site/sitemap.xml',encoding='utf-8').read())
json.dump({'host':'islam365-app.vercel.app','key':sys.argv[1],'keyLocation':'https://islam365-app.vercel.app/'+sys.argv[1]+'.txt','urlList':urls},open('.indexnow.json','w'))
print(len(urls),'urls')" "$ID"
curl -s -o /dev/null -w "indexnow %{http_code}\n" -X POST https://api.indexnow.org/indexnow -H "Content-Type: application/json; charset=utf-8" --data-binary @.indexnow.json
