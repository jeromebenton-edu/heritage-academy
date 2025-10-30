"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type ImgItem = {
  id: string
  title: string
  category: string
  tags: string[]
  thumb: string
  full: string
}

export default function GalleryPage() {
  const [items, setItems] = React.useState<ImgItem[]>([])
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [chunked, setChunked] = React.useState(false)
  const [indexCats, setIndexCats] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(24)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    // Try chunked index first
    fetch('/data/index.json')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((idx: { categories: { category: string; count: number }[] }) => {
        if (!mounted) return
        setChunked(true)
        setIndexCats(idx.categories.map(c => c.category))
        setLoading(false)
      })
      .catch(() => {
        // Fallback to single big JSON
        fetch('/data/images.json')
          .then((r) => r.json())
          .then((data: ImgItem[]) => {
            if (mounted) setItems(data)
          })
          .catch(() => setError('Failed to load images'))
          .finally(() => setLoading(false))
      })
    return () => { mounted = false }
  }, [])

  // Load selected category when chunked
  React.useEffect(() => {
    if (!chunked) return
    if (category === 'all') { setItems([]); return }
    setLoading(true)
    fetch(`/data/category/${category}.json`)
      .then((r) => r.json())
      .then((data: ImgItem[]) => setItems(data))
      .catch(() => setError('Failed to load category'))
      .finally(() => setLoading(false))
  }, [chunked, category])

  const categories = React.useMemo(() => {
    if (chunked) return ['all', ...indexCats.sort()]
    const set = new Set(
      items
        .map((i) => i.category)
        .filter((c) => typeof c === 'string' && !c.includes('.'))
    )
    return ["all", ...Array.from(set).sort()]
  }, [items, chunked, indexCats])

  const filtered = items.filter((i) => {
    const okCat = category === "all" || i.category === category
    const q = query.trim().toLowerCase()
    const okQ = !q || i.title.toLowerCase().includes(q) || i.tags.join(" ").toLowerCase().includes(q)
    return okCat && okQ
  })

  // Reset to first page on filter changes
  React.useEffect(() => {
    setPage(1)
  }, [query, category])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pageCount)
  const startIdx = (current - 1) * pageSize
  const endIdx = Math.min(startIdx + pageSize, filtered.length)
  const pageItems = filtered.slice(startIdx, endIdx)

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-gray-600 dark:text-gray-300">Explore heritage structures. Filter or search to find examples.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/recommend"><Button>Recommend</Button></Link>
          <Link href="/"><Button variant="outline">Home</Button></Link>
        </div>
      </div>

      <div className="mb-6 flex gap-3 flex-wrap items-center">
        <Input
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles or tags..."
          className="w-full sm:w-64"
        />
        <Select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-56"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c.replace("_", " ")}
            </option>
          ))}
        </Select>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-gray-600 dark:text-gray-300">Per page</label>
          <Select
            aria-label="Items per page"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="w-24"
          >
            {[24, 48, 96].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </Select>
        </div>
      </div>

      {loading && (
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <li key={i} className="rounded-lg border overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            {chunked && category === 'all'
              ? 'Select a category to load images.'
              : <>Showing {filtered.length === 0 ? 0 : startIdx + 1}–{endIdx} of {filtered.length}{items.length !== filtered.length && (<span> (filtered from {items.length})</span>)} </>}
          </div>

          <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(chunked && category === 'all' ? [] : pageItems).map((img) => (
              <li key={img.id}>
                <Card className="overflow-hidden">
                  <Link href={`/image/${img.id}`}>
                    <div className="relative aspect-[16/10]">
                      <Image src={img.thumb} alt={img.title} fill sizes="(max-width: 768px) 50vw, 25vw" />
                    </div>
                    <div className="p-3">
                      <div className="text-sm text-gray-500">{img.category.replace("_", " ")}</div>
                      <div className="font-medium truncate">{img.title}</div>
                      <div className="mt-1 text-xs text-gray-500 truncate">{img.tags.join(", ")}</div>
                    </div>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>

          {/* Pagination controls */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              disabled={current <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page {current} of {pageCount}
            </span>
            <Button
              variant="outline"
              disabled={current >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </main>
  )
}
