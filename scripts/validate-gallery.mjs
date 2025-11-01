// Validate gallery data integrity
// - Ensures IDs in similarity.json exist in images.json
// - Reports missing/duplicate IDs and orphans
import fs from 'fs'
import path from 'path'

const dataRoot = path.resolve(process.cwd(), 'public', 'data')
const imagesPath = path.join(dataRoot, 'images.json')
const similarityPath = path.join(dataRoot, 'similarity.json')

function readJson(p) {
  if (!fs.existsSync(p)) return null
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch (e) {
    console.error('Failed to parse JSON at', p)
    throw e
  }
}

function main() {
  const images = readJson(imagesPath) || []
  const sim = readJson(similarityPath) || {}

  const ids = new Set()
  const dupes = new Set()
  for (const it of images) {
    if (!it || typeof it.id !== 'string') continue
    if (ids.has(it.id)) dupes.add(it.id)
    ids.add(it.id)
  }

  const missingKeys = []
  const missingNeighbors = []
  for (const [k, arr] of Object.entries(sim)) {
    if (!ids.has(k)) missingKeys.push(k)
    if (Array.isArray(arr)) {
      for (const n of arr) {
        const nid = n && n.id
        if (typeof nid === 'string' && !ids.has(nid)) missingNeighbors.push(`${k} -> ${nid}`)
      }
    }
  }

  // Orphan images are those that never appear in similarity keys
  const orphanImages = []
  for (const id of ids) {
    if (!Object.prototype.hasOwnProperty.call(sim, id)) orphanImages.push(id)
  }

  const summary = {
    imagesCount: images.length,
    uniqueIds: ids.size,
    duplicateIds: [...dupes],
    similarityKeys: Object.keys(sim).length,
    missingSimilarityKeys: missingKeys,
    missingNeighbors,
    orphanImages,
  }

  console.log(JSON.stringify(summary, null, 2))

  // Exit non-zero if critical issues found
  if (dupes.size || missingKeys.length) process.exit(2)
}

main()

