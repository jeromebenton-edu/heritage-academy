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

function walk(dir) {
  return fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).filter(d=>d.isDirectory()).map(d=>d.name)
    : []
}
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d=>d.isFile())
    .map(d=>d.name)
    .filter(n=>/\.(jpe?g|png|gif|webp)$/i.test(n))
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
  const cats = walk(root)
  if(!cats.length){
    console.error('No categories under', root)
    process.exit(1)
  }
  fs.mkdirSync(path.join(outRoot,'category'),{recursive:true})
  const index=[]
  for(const cat of cats){
    const dir=path.join(root,cat)
    const list=files(dir)
    const out=[]
    for(const name of list){
      const filePath=path.join(dir,name)
      const key=`gallery/${cat}/${name}`
      if(dry){ out.push(toItem(cat,name,`https://public.blob.vercel-storage.com/${encodeURIComponent(key)}`)); continue }
      const buf=fs.readFileSync(filePath)
      const { url } = await put(key, buf, { access:'public', token })
      out.push(toItem(cat,name,url))
      process.stdout.write('.')
    }
    const p=path.join(outRoot,'category',`${cat}.json`)
    fs.writeFileSync(p,JSON.stringify(out,null,2))
    index.push({category:cat,count:out.length})
    console.log('\nWrote',p)
  }
  const idx=path.join(outRoot,'index.json')
  fs.writeFileSync(idx,JSON.stringify({categories:index},null,2))
  console.log('Wrote',idx)
}
main().catch(e=>{console.error(e);process.exit(1)})
