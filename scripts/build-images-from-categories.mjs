// Aggregate all category JSONs into a single images.json and refresh index.json
import fs from 'fs'
import path from 'path'

const dataRoot = path.resolve(process.cwd(), 'public', 'data')
const catDir = path.join(dataRoot, 'category')
const imagesPath = path.join(dataRoot, 'images.json')
const indexPath = path.join(dataRoot, 'index.json')

function readCategory(file) {
  try {
    const txt = fs.readFileSync(file, 'utf-8')
    const arr = JSON.parse(txt)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function main() {
  if (!fs.existsSync(catDir)) {
    console.error('Missing category directory:', catDir)
    process.exit(1)
  }
  const files = fs
    .readdirSync(catDir)
    .filter((f) => f.endsWith('.json'))
    .sort()

  const images = []
  const index = []
  for (const f of files) {
    const category = f.replace(/\.json$/, '')
    const arr = readCategory(path.join(catDir, f))
    images.push(...arr)
    index.push({ category, count: arr.length })
  }

  fs.writeFileSync(imagesPath, JSON.stringify(images))
  fs.writeFileSync(indexPath, JSON.stringify({ categories: index }))
  console.log('Wrote', imagesPath, 'with', images.length, 'items')
  console.log('Wrote', indexPath)
}

main()

