// Build top-K similarity neighbors from embeddings.json
// Usage:
//   pnpm neighbors:build             # default k=12
//   pnpm neighbors:build --k=16

import fs from 'fs'
import path from 'path'

const dataRoot = path.resolve(process.cwd(), 'public', 'data')
const embPath = path.join(dataRoot, 'embeddings.json')
const outPath = path.join(dataRoot, 'similarity.json')

function arg(name) {
  const a = process.argv.find((s) => s.startsWith(`--${name}=`))
  return a ? a.slice(name.length + 3) : null
}
const K = Number(arg('k') || '12')

function dot(a, b) {
  const L = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < L; i++) s += a[i] * b[i]
  return s
}

const round4 = (x) => Math.round(x * 1e4) / 1e4

async function main() {
  if (!fs.existsSync(embPath)) {
    console.error('Missing embeddings at', embPath, '— run pnpm embed:build first')
    process.exit(1)
  }
  const embeddings = JSON.parse(fs.readFileSync(embPath, 'utf-8'))
  const ids = Object.keys(embeddings)
  console.log(`Loaded ${ids.length} embeddings`)

  const out = {}
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]
    const vi = embeddings[id]
    const scores = []
    for (let j = 0; j < ids.length; j++) {
      if (i === j) continue
      const idj = ids[j]
      const vj = embeddings[idj]
      const s = dot(vi, vj) // vectors are normalized -> cosine = dot
      scores.push([idj, s])
    }
    scores.sort((a, b) => b[1] - a[1])
    out[id] = scores.slice(0, K).map(([nid, s]) => ({ id: nid, score: round4(s) }))
    if (i % 50 === 0) process.stdout.write('.')
  }

  fs.writeFileSync(outPath, JSON.stringify(out))
  console.log(`\nWrote ${outPath}`)
}

main().catch((e) => { console.error(e); process.exit(1) })

