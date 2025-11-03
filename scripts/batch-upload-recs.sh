#!/usr/bin/env bash
set -euo pipefail

# Batch uploader + recommender builder
# - Uploads images to R2 in category batches
# - Rebuilds embeddings + neighbors at the end (or per-batch with --recs-each)
#
# Usage examples:
#   bash scripts/batch-upload-recs.sh                      # all cats, batch-size=3
#   bash scripts/batch-upload-recs.sh --limit 200 --resume # limit per cat, skip existing
#   bash scripts/batch-upload-recs.sh --batch-size 4       # 4 categories per batch
#   bash scripts/batch-upload-recs.sh --categories altar,apse
#   bash scripts/batch-upload-recs.sh --recs-each          # rebuild recs after each batch

LIMIT=""
RESUME=0
BATCH_SIZE=3
CATS=""
RECS_EACH=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --limit)
      LIMIT="$2"; shift 2 ;;
    --limit=*)
      LIMIT="${1#*=}"; shift ;;
    --resume)
      RESUME=1; shift ;;
    --batch-size)
      BATCH_SIZE="$2"; shift 2 ;;
    --batch-size=*)
      BATCH_SIZE="${1#*=}"; shift ;;
    --categories)
      CATS="$2"; shift 2 ;;
    --categories=*)
      CATS="${1#*=}"; shift ;;
    --recs-each)
      RECS_EACH=1; shift ;;
    -h|--help)
      echo "Usage: $0 [--limit N] [--resume] [--batch-size N] [--categories a,b,c] [--recs-each]"; exit 0 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Collect categories
if [[ -n "$CATS" ]]; then
  IFS=',' read -r -a cats <<< "$CATS"
else
  mapfile -t cats < <(find public/images/gallery -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort)
fi
if [[ ${#cats[@]} -eq 0 ]]; then
  echo "No categories found under public/images/gallery" >&2
  exit 1
fi

limitFlag=""; [[ -n "$LIMIT" ]] && limitFlag="--limit=$LIMIT"
resumeFlag=""; [[ "$RESUME" -eq 1 ]] && resumeFlag="--resume"

echo "Categories: ${cats[*]}"
echo "Batch size: $BATCH_SIZE  Limit: ${LIMIT:-none}  Resume: $RESUME  Recs-each: $RECS_EACH"

total=${#cats[@]}
idx=0
while [[ $idx -lt $total ]]; do
  chunk=("${cats[@]:idx:BATCH_SIZE}")
  IFS=',' read -r -a _tmp <<< "${chunk[*]}" # ensure array
  chunk_joined=$(IFS=, ; echo "${chunk[*]}")
  echo "\n==> Uploading batch: $chunk_joined"
  pnpm r2:upload --categories="$chunk_joined" $limitFlag $resumeFlag

  if [[ "$RECS_EACH" -eq 1 ]]; then
    echo "==> Building embeddings for: $chunk_joined"
    pnpm embed:build --categories="$chunk_joined" $limitFlag || true
    echo "==> Rebuilding neighbors"
    pnpm neighbors:build || true
    pnpm gallery:validate || true
  fi

  idx=$(( idx + BATCH_SIZE ))
done

if [[ "$RECS_EACH" -eq 0 ]]; then
  echo "\n==> Building embeddings for all (skips existing)"
  pnpm embed:build
  echo "==> Rebuilding neighbors"
  pnpm neighbors:build
  pnpm gallery:validate || true
fi

echo "\nAll done. Consider committing public/data and redeploying."

