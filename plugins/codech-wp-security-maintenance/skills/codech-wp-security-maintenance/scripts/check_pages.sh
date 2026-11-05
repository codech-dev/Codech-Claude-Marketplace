#!/usr/bin/env bash
# Snapshot key pages, bypassing the page cache with a unique query string.
# Usage: bash check_pages.sh https://example.com pages.txt > snapshot.tsv
#   pages.txt = one path per line (homepage, each language homepage, one page per template,
#               a listing/product page, the contact form, /wp-login.php). Lines starting with # are skipped.
# Output columns: page, status, bytes, <img> count, <a> count, PHP-error flag, <title>.
set -u
BASE=${1:?base url, e.g. https://example.com}; LIST=${2:?file with one path per line}
BASE=${BASE%/}
printf "page\tstatus\tbytes\timgs\tlinks\tphp_err\ttitle\n"
grep -v -E '^\s*(#|$)' "$LIST" | while read -r p; do
  f=$(mktemp)
  sep='?'; [[ "$p" == *\?* ]] && sep='&'
  code=$(curl -s -o "$f" -w '%{http_code}' --max-time 90 -A 'Codech-check' "$BASE$p${sep}cdxcheck=$RANDOM$RANDOM")
  bytes=$(wc -c < "$f" | tr -d ' ')
  imgs=$(grep -o '<img' "$f" | wc -l | tr -d ' ')
  links=$(grep -o '<a ' "$f" | wc -l | tr -d ' ')
  err=$(grep -c -i -E 'fatal error|critical error|parse error|Warning</b>:|There has been a critical error' "$f")
  title=$(grep -o -m1 '<title>[^<]*' "$f" | sed 's/<title>//' | tr -s ' ' | cut -c1-70)
  printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\n" "$p" "$code" "$bytes" "$imgs" "$links" "$err" "$title"
  rm -f "$f"
done
