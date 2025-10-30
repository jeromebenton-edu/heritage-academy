"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type ImgItem = {
  id: string
  title: string
  category: string
  tags: string[]
  thumb: string
  full: string
}

type SimilarEntry = { id: string; score: number }

export default function ImageDetailPage() {
  const params = useParams<{ id: string }>()
  const id = (params?.id as string) ?? ""

  const [items, setItems] = React.useState<ImgItem[]>([])
  const [similar, setSimilar] = React.useState<Record<string, SimilarEntry[]>>({})
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    Promise.all([
      fetch("/data/images.json").then((r) => r.json()),
      fetch("/data/similarity.json").then((r) => r.json()),
    ])
      .then(([imgs, sim]) => {
        if (!mounted) return
        setItems(imgs)
        setSimilar(sim)
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const item = items.find((i) => i.id === id)
  const neighbors = (similar[id] || [])
    .map((n) => items.find((i) => i.id === n.id))
    .filter(Boolean) as ImgItem[]

  if (loading) {
    return <main className="max-w-5xl mx-auto px-4 py-12"><p>Loading…</p></main>
  }
  if (error) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-red-600">{error}</p>
        <Link href="/gallery" className="underline">Back to Gallery</Link>
      </main>
    )
  }
  if (!item) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">Not found</h1>
        <p className="mb-4">We couldn’t find that image.</p>
        <Link href="/gallery" className="underline">Back to Gallery</Link>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <div className="text-gray-600 dark:text-gray-300">{item.category.replace("_", " ")}</div>
        </div>
        <div className="flex gap-2">
          <Link href="/gallery">
            <Button variant="outline">Back to Gallery</Button>
          </Link>
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border bg-white dark:bg-gray-900">
        <div className="relative aspect-[16/10]">
          <Image src={item.full} alt={item.title} fill sizes="100vw" />
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Tags: {item.tags.join(", ")}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Similar images</h2>
        {neighbors.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No similar items found.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {neighbors.map((n) => (
              <li key={n.id} className="rounded-lg border overflow-hidden bg-white dark:bg-gray-900">
                <Link href={`/image/${n.id}`}>
                  <div className="relative aspect-[16/10]">
                    <Image src={n.thumb} alt={n.title} fill sizes="(max-width: 768px) 50vw, 33vw" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm text-gray-500">{n.category.replace("_", " ")}</div>
                    <div className="font-medium">{n.title}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

