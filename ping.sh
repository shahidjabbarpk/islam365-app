#!/bin/sh
# Ping IndexNow (Bing, Yandex, Seznam, Naver) with every URL in the sitemap.
cd "$(dirname "$0")"
ID=$(cat indexnow-id.txt)
URLS=$(grep -o '<loc>[^<]*' site/sitemap.xml | sed 's/<loc>//' | python -c "import sys,json;print(json.dumps([l.strip() for l in sys.stdin]))")
curl -s -o /dev/null -w "indexnow %{http_code}\n" -X POST https://api.indexnow.org/indexnow -H "Content-Type: application/json; charset=utf-8" -d "{\"host\":\"islam365-app.vercel.app\",\"key\":\"$ID\",\"keyLocation\":\"https://islam365-app.vercel.app/$ID.txt\",\"urlList\":$URLS}"
