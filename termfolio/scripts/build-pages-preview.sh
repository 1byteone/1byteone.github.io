#!/usr/bin/env bash
set -euo pipefail

# GitHub Pages can host the rendered Termfolio preview, but it cannot execute
# Next.js route handlers. Temporarily remove server-only routes and make the
# query-driven pages static while exporting, then restore the working tree.
backup_dir="$(mktemp -d)"

restore_source() {
  if [[ -e "${backup_dir}/api" ]]; then
    rm -rf app/api
    mv "${backup_dir}/api" app/api
  fi
  for pair in \
    "${backup_dir}/icon.tsx:app/icon.tsx" \
    "${backup_dir}/robots.ts:app/robots.ts" \
    "${backup_dir}/sitemap.ts:app/sitemap.ts" \
    "${backup_dir}/blog-page.tsx:app/blog/page.tsx" \
    "${backup_dir}/post-page.tsx:app/blog/[slug]/page.tsx" \
    "${backup_dir}/ar-blog-page.tsx:app/ar/blog/page.tsx"; do
    source_path="${pair%%:*}"
    target_path="${pair#*:}"
    if [[ -e "$source_path" ]]; then
      cp "$source_path" "$target_path"
    fi
  done
  rm -rf "${backup_dir}"
}

trap restore_source EXIT

if [[ -d app/api ]]; then
  mv app/api "${backup_dir}/api"
fi
for pair in \
  "app/icon.tsx:${backup_dir}/icon.tsx" \
  "app/robots.ts:${backup_dir}/robots.ts" \
  "app/sitemap.ts:${backup_dir}/sitemap.ts" \
  "app/blog/page.tsx:${backup_dir}/blog-page.tsx" \
  "app/blog/[slug]/page.tsx:${backup_dir}/post-page.tsx" \
  "app/ar/blog/page.tsx:${backup_dir}/ar-blog-page.tsx"; do
  source_path="${pair%%:*}"
  backup_path="${pair#*:}"
  if [[ -e "$source_path" ]]; then
    cp "$source_path" "$backup_path"
  fi
done

for page in app/blog/page.tsx 'app/blog/[slug]/page.tsx' app/ar/blog/page.tsx; do
  printf '\nexport const dynamic = "force-static"\n' >> "$page"
done
for route in app/icon.tsx app/robots.ts app/sitemap.ts; do
  if [[ -e "$route" ]]; then
    mv "$route" "${backup_dir}/$(basename "$route")"
  fi
done

export TERMFOLIO_STATIC_EXPORT=1
export TERMFOLIO_BASE_PATH="${TERMFOLIO_BASE_PATH:-/themes/engineer-terminal/termfolio}"
npm run build
python3 scripts/prefix-pages-assets.py
