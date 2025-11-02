// Build CLIP embeddings for local gallery images using @xenova/transformers
// Usage examples:
//   pnpm embed:build                      # embed all categories
//   pnpm embed:build --categories=altar,apse --limit=200
//   pnpm embed:build --force              # recompute existing ids

import fs from 'fs'
import path from 'path'
import { pipeline } from '@xenova/transformers'

const galleryRoot = path.resolve(process.cwd(), 'public', 'images', 'gallery')
const dataRoot = path.resolve(process.cwd(), 'public', 'data')
const outEmbPath = path.join(dataRoot, 'embeddings.json')

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }) }
function arg(name) {
  const a = process.argv.find((s) => s.startsWith(`--${name}=`))
  return a ? a.slice(name.length + 3) : null
}
const onlyCats = (arg('categories') || arg('category'))?.split(',').map((s) => s.trim()).filter(Boolean)
const limit = Number(arg('limit') || '')
const force = process.argv.includes('--force')

function walk(dir) {
  return fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : []
}
function files(dir) {
  return fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isFile())
        .map((d) => d.name)
        .filter((n) => /\.(jpe?g|png|gif|webp|avif)$/i.test(n))
        .sort((a, b) => a.localeCompare(b))
    : []
}
const toId = (cat, name) => (cat + '_' + name.replace(/\.[^.]+$/, '')).replace(/[^a-zA-Z0-9_\-]/g, '_')

function l2norm(vec) {
  const n = Math.sqrt(vec.reduce((s, x) => s + x * x, 0)) || 1
  return vec.map((x) => x / n)
}
const round4 = (arr) => arr.map((x) => Math.round(x * 1e4) / 1e4)

async function main() {
  const cats = onlyCats && onlyCats.length ? onlyCats : walk(galleryRoot)
  if (!cats.length) {
    console.error('No categories found under', galleryRoot)
    process.exit(1)
  }

  ensureDir(dataRoot)
  let embeddings = {}
  if (fs.existsSync(outEmbPath)) {
    try {
      embeddings = JSON.parse(fs.readFileSync(outEmbPath, 'utf-8'))
    } catch {}
  }

  // Load CLIP image feature extractor (quantized for speed)
  const extractor = await pipeline('image-feature-extraction', 'Xenova/clip-vit-base-patch32', { quantized: true })

  let processed = 0
  for (const cat of cats) {
    const dir = path.join(galleryRoot, cat)
    const listAll = files(dir)
    const list = Number.isFinite(limit) && limit > 0 ? listAll.slice(0, limit) : listAll
    for (const name of list) {
      const id = toId(cat, name)
      if (!force && embeddings[id]) continue
      const imgPath = path.join(dir, name)
      try {
        // Pass the absolute file path directly to the pipeline (Node runtime decodes via sharp)
        const output = await extractor(imgPath, { pooling: 'mean', normalize: true })
        const vec = Array.from(output.data)
        const norm = l2norm(vec)
        embeddings[id] = round4(norm)
        processed++
        if (processed % 10 === 0) process.stdout.write('.')
      } catch (e) {
        console.error(`\nFailed to embed ${imgPath}:`, e?.message || e)
      }
    }
  }

  fs.writeFileSync(outEmbPath, JSON.stringify(embeddings))
  console.log(`\nWrote ${outEmbPath} with ${Object.keys(embeddings).length} vectors`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
