"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

type ImgItem = {
  id: string
  title: string
  category: string
  tags: string[]
  thumb: string
  full: string
}

type Embeddings = Record<string, number[]>

function normalize(v: number[]): number[] {
  const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1
  return v.map((x) => x / n)
}

function dot(a: number[], b: number[]): number {
  const L = Math.min(a.length, b.length)
  let s = 0
  for (let i = 0; i < L; i++) s += a[i] * b[i]
  return s
}

function cosine(a: number[], b: number[]): number {
  return dot(normalize(a), normalize(b))
}

export default function RecommendPage() {
  const [items, setItems] = React.useState<ImgItem[]>([])
  const [emb, setEmb] = React.useState<Embeddings>({})
  const [selected, setSelected] = React.useState<string[]>([])
  const [k, setK] = React.useState(8)
  // Candidate browser state
  const [cat, setCat] = React.useState('all')
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(24)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const recRef = React.useRef<HTMLDivElement | null>(null)
  const [chunked, setChunked] = React.useState(false)
  const [indexCats, setIndexCats] = React.useState<string[]>([])

  React.useEffect(() => {
    let mounted = true
    // Try chunked index; always load embeddings small file
    fetch('/data/index.json')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((idx: { categories: { category: string }[] }) => {
        if (!mounted) return
        setChunked(true)
        setIndexCats(idx.categories.map(c=>c.category))
      })
      .catch(() => {
        // fallback to single big list
        fetch('/data/images.json')
          .then((r)=>r.json())
          .then((imgs: ImgItem[]) => setItems(imgs))
          .catch(()=>setError('Failed to load images'))
          .finally(()=>setLoading(false))
      })

    fetch('/data/embeddings.json')
      .then((r)=>r.json())
      .then((embs: Embeddings)=> setEmb(embs))
      .catch(()=>{})

    return () => { mounted = false }
  }, [])

  React.useEffect(() => {
    if (!chunked) return
    if (cat === 'all') { setItems([]); setLoading(false); return }
    setLoading(true)
    fetch(`/data/category/${cat}.json`).then(r=>r.json()).then((imgs: ImgItem[])=> setItems(imgs)).catch(()=>setError('Failed to load category')).finally(()=>setLoading(false))
  }, [chunked, cat])

  const addSelected = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const removeSelected = (id: string) => {
    setSelected((prev) => prev.filter((x) => x !== id))
  }

  const selectedEmb = React.useMemo(() => {
    if (selected.length === 0) return null
    const vecs = selected.map((id) => emb[id]).filter(Boolean) as number[][]
    if (vecs.length === 0) return null
    const dim = vecs[0].length
    const sum = new Array(dim).fill(0)
    for (const v of vecs) {
      for (let i = 0; i < dim; i++) sum[i] += v[i]
    }
    return normalize(sum)
  }, [selected, emb])

  const itemMap = React.useMemo(() => new Map(items.map((i) => [i.id, i] as const)), [items])

  const selectedWithEmb = React.useMemo(() => selected.filter((id) => !!emb[id]), [selected, emb])
  const usingFallback = selected.length > 0 && selectedWithEmb.length === 0

  const recommendations = React.useMemo(() => {
    const out: { item: ImgItem; score: number }[] = []
    if (selectedEmb) {
      for (const it of items) {
        if (selected.includes(it.id)) continue
        const v = emb[it.id]
        if (!v) continue
        out.push({ item: it, score: cosine(selectedEmb, v) })
      }
      out.sort((a, b) => b.score - a.score)
      return out.slice(0, k)
    }
    // Fallback: no embeddings for selected items -> show same-category items
    if (usingFallback) {
      const cats = new Set(
        selected
          .map((id) => itemMap.get(id)?.category)
          .filter((x): x is string => !!x)
      )
      for (const it of items) {
        if (selected.includes(it.id)) continue
        if (!cats.has(it.category)) continue
        out.push({ item: it, score: 1 })
        if (out.length >= k) break
      }
    }
    return out
  }, [items, emb, selectedEmb, selected, k, usingFallback, itemMap])

  const categories = React.useMemo(() => {
    if (chunked) return ['all', ...indexCats.sort()]
    const set = new Set(items.map(i=>i.category).filter(c=> typeof c==='string' && !c.includes('.')))
    return ['all', ...Array.from(set).sort()]
  }, [items, chunked, indexCats])

  const remaining = React.useMemo(
    () => items.filter((i) => !selected.includes(i.id)),
    [items, selected]
  )

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return remaining.filter((i) => {
      const okCat = cat === 'all' || i.category === cat
      const okQ = !q || i.title.toLowerCase().includes(q) || i.tags.join(' ').toLowerCase().includes(q)
      return okCat && okQ
    })
  }, [remaining, cat, search])

  React.useEffect(() => { setPage(1) }, [cat, search])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * pageSize
  const end = Math.min(start + pageSize, filtered.length)
  const pageItems = React.useMemo(() => filtered.slice(start, end), [filtered, start, end])

  if (loading) return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Recommender</h1>
          <p className="text-gray-600 dark:text-gray-300">Pick one or more images; we’ll find similar ones directly in your browser.</p>
        </div>
      </div>
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <li key={i} className="rounded-lg border overflow-hidden">
            <Skeleton className="aspect-[16/10] w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
  if (error) return <main className="max-w-7xl mx-auto px-4 py-12 text-red-600">{error}</main>

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Recommender</h1>
          <p className="text-gray-600 dark:text-gray-300">Pick one or more images; we’ll find similar ones directly in your browser.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/gallery"><Button variant="outline">Gallery</Button></Link>
          <Link href="/"><Button>Home</Button></Link>
        </div>
      </div>

      <section className="mb-8">
        <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">Selected: {selected.length} item(s)</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map((id) => {
            const it = items.find((x) => x.id === id)
            if (!it) return null
            return (
              <button key={id} onClick={() => removeSelected(id)} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                <span>{it.title}</span>
                <span className="text-gray-500">(remove)</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles or tags..."
            className="w-full sm:w-64"
          />
          <Select
            aria-label="Category"
            className="w-full sm:w-56"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All categories' : c.replace('_', ' ')}
              </option>
            ))}
          </Select>

          <Select
            className="w-full sm:w-80"
            onChange={(e) => addSelected(e.target.value)}
            value=""
          >
            <option value="" disabled>
              Add an image to query… (from current page)
            </option>
            {pageItems.map((i) => (
              <option key={i.id} value={i.id}>
                {i.title} — {i.category.replace('_', ' ')}
              </option>
            ))}
          </Select>

          <label className="text-sm text-gray-600 dark:text-gray-300">Top K</label>
          <input
            type="number"
            min={1}
            max={24}
            value={k}
            onChange={(e) => setK(Math.max(1, Math.min(24, Number(e.target.value) || 1)))}
            className="w-20 rounded-md border px-3 py-2"
          />
          <Button variant="outline" onClick={() => setSelected([])}>Clear</Button>
          <Button
            onClick={() => recRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            disabled={selected.length === 0}
          >
            Show Recommendations
          </Button>
        </div>

        {/* Candidate browser grid */}
        <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
          {chunked && cat === 'all' ? 'Select a category to browse candidates' : <>Showing {filtered.length === 0 ? 0 : start + 1}–{end} of {filtered.length}</>}
        </div>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
          {(chunked && cat === 'all' ? [] : pageItems).map((i) => (
            <li key={i.id}>
              <Card className="overflow-hidden">
                <button onClick={() => addSelected(i.id)} className="w-full text-left">
                  <div className="relative aspect-[16/10]">
                    <Image src={i.thumb} alt={i.title} fill sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm text-gray-500">{i.category.replace('_', ' ')}</div>
                    <div className="font-medium truncate">{i.title}</div>
                    <div className="mt-1 text-xs text-gray-500">Click to add</div>
                  </div>
                </button>
              </Card>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-center gap-3 mb-8">
          <Button variant="outline" disabled={current<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</Button>
          <span className="text-sm text-gray-600 dark:text-gray-300">Page {current} of {pageCount}</span>
          <Button variant="outline" disabled={current>=pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))}>Next</Button>
          <label className="ml-4 text-sm text-gray-600 dark:text-gray-300">Per page</label>
          <select className="w-24 rounded-md border px-3 py-2" value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))}>
            {[24,48,96].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </section>

      {selected.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Select at least one image to see recommendations.</p>
      ) : (
        <section ref={recRef}>
          <h2 className="text-xl font-semibold mb-2">Recommended</h2>
          {usingFallback && (
            <Alert variant="warning" className="mb-4" title="Fallback recommendations">
              Showing similar items by category because embeddings are unavailable for the selected images.
            </Alert>
          )}
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map(({ item, score }) => (
              <li key={item.id}>
                <Card className="overflow-hidden">
                  <Link href={`/image/${item.id}`}>
                    <div className="relative aspect-[16/10]">
                      <Image src={item.thumb} alt={item.title} fill sizes="(max-width: 768px) 50vw, 25vw" />
                    </div>
                    <div className="p-3">
                      <div className="text-sm text-gray-500">{item.category.replace("_", " ")}</div>
                      <div className="font-medium">{item.title}</div>
                      {!usingFallback && (
                        <div className="mt-1 text-xs text-gray-500">Similarity: {(score).toFixed(2)}</div>
                      )}
                    </div>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
          {recommendations.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300">No recommendations yet. Add at least one image to the selection.</p>
          )}
        </section>
      )}
    </main>
  )
}
