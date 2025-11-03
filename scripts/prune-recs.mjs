// Prune embeddings and similarity to the ids present in images.json
import fs from 'fs'
import path from 'path'

const dataRoot = path.resolve(process.cwd(), 'public', 'data')
const imagesPath = path.join(dataRoot, 'images.json')
const embPath = path.join(dataRoot, 'embeddings.json')
const simPath = path.join(dataRoot, 'similarity.json')

function readJSON(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')) } catch { return fallback }
}

function main() {
  const images = readJSON(imagesPath, [])
  const valid = new Set(images.filter(Boolean).map((i) => i.id))
  console.log('Valid ids:', valid.size)

  const emb = readJSON(embPath, {})
  const prunedEmb = {}
  let kept = 0
  for (const [id, vec] of Object.entries(emb)) {
    if (valid.has(id)) { prunedEmb[id] = vec; kept++ }
  }
  fs.writeFileSync(embPath, JSON.stringify(prunedEmb))
  console.log('Pruned embeddings -> kept', kept, 'vectors')

  if (fs.existsSync(simPath)) {
    const sim = readJSON(simPath, {})
    const prunedSim = {}
    for (const [id, arr] of Object.entries(sim)) {
      if (!valid.has(id)) continue
      const list = Array.isArray(arr) ? arr.filter((e) => e && valid.has(e.id)) : []
      prunedSim[id] = list
    }
    fs.writeFileSync(simPath, JSON.stringify(prunedSim))
    console.log('Pruned similarity map')
  }
}

main()

