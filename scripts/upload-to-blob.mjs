// Vercel Blob upload utility (see README for usage)
import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Missing BLOB_READ_WRITE_TOKEN')
  process.exit(1)
}

const root = path.resolve(process.cwd(), 'public', 'images', 'gallery')
const outRoot = path.resolve(process.cwd(), 'public', 'data')
const dry = process.argv.includes('--dry') || process.argv.includes('--dry-run')
const useLocal = process.argv.includes('--local')
const baseUrl = (() => {
  const b = arg('base-url') || arg('baseUrl')
  if (!b) return null
  return b.endsWith('/') ? b : b + '/'
})()

// Optional CLI flags to control Advanced Operations usage:
//   --categories=altar,apse     only process these categories
//   --limit=100                 upload at most N files per category this run
//   --resume                    reuse existing category JSON; skip already-uploaded items
function arg(name) {
  const a = process.argv.find((s) => s.startsWith(`--${name}=`))
  return a ? a.slice(name.length + 3) : null
}
const onlyCats = (arg('categories') || arg('category'))
  ?.split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const limit = Number(arg('limit') || arg('max') || '')
const resume = process.argv.includes('--resume')

function walk(dir) {
  return fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).filter(d=>d.isDirectory()).map(d=>d.name)
    : []
}
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isFile())
    .map(d => d.name)
    .filter(n => /\.(jpe?g|png|gif|webp)$/i.test(n))
    .sort((a, b) => a.localeCompare(b)) // deterministic order to match CLI sorted uploads
}
const toItem=(cat,name,url)=>({
  id:(cat+'_'+name.replace(/\.[^.]+$/,'')).replace(/[^a-zA-Z0-9_\-]/g,'_'),
  title:name.replace(/\.[^.]+$/,'').replace(/[\-_]+/g,' ').trim()||cat.replace(/_/g,' ')+' image',
  category:cat,
  tags:[cat.replace(/_/g,' ')],
  thumb:url,
  full:url,
})

async function main(){
  const cats = onlyCats && onlyCats.length ? onlyCats : walk(root)
  if(!cats.length){
    console.error('No categories under', root)
    process.exit(1)
  }
  fs.mkdirSync(path.join(outRoot,'category'),{recursive:true})
  const index=[]
  const all=[]
  for(const cat of cats){
    const dir=path.join(root,cat)
    const listAll=files(dir)
    const list = Number.isFinite(limit) && limit > 0 ? listAll.slice(0, limit) : listAll
    let out=[]

    // Resume mode: prefill from existing category JSON so we don't re-upload the same keys
    const catJsonPath = path.join(outRoot,'category',`${cat}.json`)
    const existingIds = new Set()
    if(resume && fs.existsSync(catJsonPath)){
      try {
        const prev = JSON.parse(fs.readFileSync(catJsonPath,'utf-8'))
        if(Array.isArray(prev)){
          out = prev
          for(const it of prev){ if(it && it.id){ existingIds.add(it.id); all.push(it) } }
        }
      } catch {}
    }

    let uploaded = 0
    for(const name of list){
      const filePath=path.join(dir,name)
      const key=`gallery/${cat}/${name}`
      const id=(cat+'_'+name.replace(/\.[^.]+$/,'')).replace(/[^a-zA-Z0-9_\-]/g,'_')
      if(existingIds.has(id)) { continue }
      if(dry){
        const url = baseUrl
          ? baseUrl + key
          : (useLocal
              ? `/images/${key}`
              : `https://public.blob.vercel-storage.com/${encodeURIComponent(key)}`)
        out.push(toItem(cat,name,url));
        continue
      }
      const buf=fs.readFileSync(filePath)
      const { url } = await put(key, buf, { access:'public', token })
      const item=toItem(cat,name,url)
      out.push(item)
      all.push(item)
      process.stdout.write('.')
      uploaded++
      if(Number.isFinite(limit) && limit > 0 && uploaded >= limit) break
    }
    const p=catJsonPath
    fs.writeFileSync(p,JSON.stringify(out,null,2))
    index.push({category:cat,count:out.length})
    console.log('\nWrote',p)
  }
  const idx=path.join(outRoot,'index.json')
  fs.writeFileSync(idx,JSON.stringify({categories:index},null,2))
  console.log('Wrote',idx)

  // Also write flattened images.json for pages that need the full list
  const allPath=path.join(outRoot,'images.json')
  fs.writeFileSync(allPath,JSON.stringify(all,null,2))
  console.log('Wrote',allPath)
}
main().catch(e=>{console.error(e);process.exit(1)})
