#!/usr/bin/env bash
# Take a fresh snapshot and compare it with the "before" one.
# Usage: bash compare_pages.sh https://example.com pages.txt pages.before.tsv
# Flags: status change, any PHP error, title change, size / img / link count change > 10 %.
# Exit code 1 when any page needs a look.
set -u
BASE=${1:?base url}; LIST=${2:?pages file}; BEFORE=${3:?before snapshot (from check_pages.sh)}
NOW=$(mktemp)
bash "$(dirname "$0")/check_pages.sh" "$BASE" "$LIST" > "$NOW"
awk -F'\t' 'NR==FNR { if (FNR>1) { s[$1]=$2; b[$1]=$3; i[$1]=$4; l[$1]=$5; t[$1]=$7 } next }
FNR>1 {
  p=$1; msg=""
  if ($2!=s[p]) msg=msg " STATUS " s[p] "->" $2
  if ($6>0) msg=msg " PHP_ERRORS=" $6
  if ($7!=t[p]) msg=msg " TITLE_CHANGED"
  if (b[p]>0) { d=($3-b[p])/b[p]*100; if (d>10||d<-10) msg=msg sprintf(" SIZE %+.0f%%", d) }
  if (i[p]>0) { d=($4-i[p])/i[p]*100; if (d>10||d<-10) msg=msg sprintf(" IMGS %d->%d", i[p], $4) }
  if (l[p]>0) { d=($5-l[p])/l[p]*100; if (d>10||d<-10) msg=msg sprintf(" LINKS %d->%d", l[p], $5) }
  printf "%-62s %s\n", p, (msg=="" ? "ok" : "CHECK:" msg); if (msg!="") bad++
}
END { print (bad ? bad " page(s) need a look" : "ALL PAGES OK"); exit (bad ? 1 : 0) }' "$BEFORE" "$NOW"
rc=$?
cp "$NOW" "pages.last.tsv"; rm -f "$NOW"
exit $rc
