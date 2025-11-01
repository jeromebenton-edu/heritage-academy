// Cloudflare R2 upload utility (S3-compatible)
// Usage:
//   node scripts/upload-to-r2.mjs           # upload images under public/images/gallery
//   node scripts/upload-to-r2.mjs --dry     # print URLs and write JSON, no upload
// Optional flags:
//   --categories=altar,apse   only process specific categories
//   --limit=100               max files per category for this run
//   --resume                  reuse existing JSON to skip previously uploaded files
//   --local                   generate local URLs instead of remote (dry-run)
//   --base-url=https://cdn.example.com/   base for URLs in dry-run

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_ENDPOINT,
  R2_PUBLIC_BASE_URL,
} = process.env

const dry = process.argv.includes('--dry') || process.argv.includes('--dry-run')
const useLocal = process.argv.includes('--local')

function arg(name) {
  const a = process.argv.find((s) => s.startsWith(`--${name}=`))
  return a ? a.slice(name.length + 3) : null
}
const onlyCats = (arg('categories') || arg('category'))?.split(',').map((s) => s.trim()).filter(Boolean)
const limit = Number(arg('limit') || arg('max') || '')
const baseUrl = (() => {
  const b = arg('base-url') || arg('baseUrl')
  if (!b) return null
  return b.endsWith('/') ? b : b + '/'
})()

// Fail fast if required env vars missing (unless dry run)
if (!dry) {
  const missing = [
    ['R2_ACCESS_KEY_ID', R2_ACCESS_KEY_ID],
    ['R2_SECRET_ACCESS_KEY', R2_SECRET_ACCESS_KEY],
    ['R2_BUCKET_NAME', R2_BUCKET_NAME],
  ].filter(([_, v]) => !v)
  if (missing.length) {
    console.error('Missing required env vars:', missing.map(([k]) => k).join(', '))
    process.exit(1)
  }
}

const endpoint = R2_ENDPOINT || (R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined)

const root = path.resolve(process.cwd(), 'public', 'images', 'gallery')
const outRoot = path.resolve(process.cwd(), 'public', 'data')

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }) }
function walk(dir) {
  return fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : []
}
function files(dir) {
  return fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isFile())
        .map((d) => d.name)
        .filter((n) => /\.(jpe?g|png|gif|webp|avif)$/i.test(n))
        .sort((a, b) => a.localeCompare(b))
    : []
}
function contentType(name) {
  const ext = name.toLowerCase().replace(/^.*\./, '')
  switch (ext) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'png': return 'image/png'
    case 'gif': return 'image/gif'
    case 'webp': return 'image/webp'
    case 'avif': return 'image/avif'
    default: return 'application/octet-stream'
  }
}
const toItem = (cat, name, url) => ({
  id: (cat + '_' + name.replace(/\.[^.]+$/, '')).replace(/[^a-zA-Z0-9_\-]/g, '_'),
  title: name.replace(/\.[^.]+$/, '').replace(/[\-_]+/g, ' ').trim() || cat.replace(/_/g, ' ') + ' image',
  category: cat,
  tags: [cat.replace(/_/g, ' ')],
  thumb: url,
  full: url,
})

function buildPublicUrl(key) {
  if (baseUrl) return baseUrl + key
  if (R2_PUBLIC_BASE_URL) return R2_PUBLIC_BASE_URL.replace(/\/$/, '') + '/' + key
  if (R2_ACCOUNT_ID && R2_BUCKET_NAME) return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`
  return key
}

async function uploadFile(client, key, filePath) {
  const Body = fs.readFileSync(filePath)
  const ContentType = contentType(filePath)
  await client.send(new PutObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key, Body, ContentType }))
}

async function main() {
  const cats = onlyCats && onlyCats.length ? onlyCats : walk(root)
  if (!cats.length) {
    console.error('No categories under', root)
    process.exit(1)
  }

  const client = dry
    ? null
    : new S3Client({
        region: 'auto',
        endpoint,
        forcePathStyle: true,
        credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
      })

  ensureDir(path.join(outRoot, 'category'))
  const index = []
  const all = []

  for (const cat of cats) {
    const dir = path.join(root, cat)
    const listAll = files(dir)
    const list = Number.isFinite(limit) && limit > 0 ? listAll.slice(0, limit) : listAll
    let out = []

    // Resume mode: prefill from existing category JSON
    const catJsonPath = path.join(outRoot, 'category', `${cat}.json`)
    const existingIds = new Set()
    if (process.argv.includes('--resume') && fs.existsSync(catJsonPath)) {
      try {
        const prev = JSON.parse(fs.readFileSync(catJsonPath, 'utf-8'))
        if (Array.isArray(prev)) {
          out = prev
          for (const it of prev) { if (it && it.id) { existingIds.add(it.id); all.push(it) } }
        }
      } catch {}
    }

    let uploaded = 0
    for (const name of list) {
      const filePath = path.join(dir, name)
      const key = `gallery/${cat}/${name}`
      const id = (cat + '_' + name.replace(/\.[^.]+$/, '')).replace(/[^a-zA-Z0-9_\-]/g, '_')
      if (existingIds.has(id)) continue

      if (dry || useLocal) {
        const url = useLocal ? `/images/${key}` : buildPublicUrl(key)
        const item = toItem(cat, name, url)
        out.push(item)
        if (!useLocal) all.push(item)
        continue
      }

      await uploadFile(client, key, filePath)
      const url = buildPublicUrl(key)
      const item = toItem(cat, name, url)
      out.push(item)
      all.push(item)
      process.stdout.write('.')
      uploaded++
      if (Number.isFinite(limit) && limit > 0 && uploaded >= limit) break
    }

    const p = catJsonPath
    fs.writeFileSync(p, JSON.stringify(out, null, 2))
    index.push({ category: cat, count: out.length })
    console.log('\nWrote', p)
  }

  const idx = path.join(outRoot, 'index.json')
  fs.writeFileSync(idx, JSON.stringify({ categories: index }, null, 2))
  console.log('Wrote', idx)

  const allPath = path.join(outRoot, 'images.json')
  fs.writeFileSync(allPath, JSON.stringify(all, null, 2))
  console.log('Wrote', allPath)
}

main().catch((e) => { console.error(e); process.exit(1) })

