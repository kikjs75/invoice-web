"use client"

import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

type Post = {
  id: number
  title: string
  body: string
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
  if (!res.ok) throw new Error("데이터를 불러오는 데 실패했습니다.")
  return res.json()
}

export default function DataFetchingPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["example-posts"],
    queryFn: fetchPosts,
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/examples">
            <ArrowLeft className="size-4" />
            예제 목록으로
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">데이터 페칭</h1>
            <p className="mt-2 text-muted-foreground">
              TanStack Query로 API 데이터를 불러오는 예제입니다.
            </p>
          </div>
          <Button onClick={() => refetch()} disabled={isFetching} variant="outline" className="shrink-0">
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            리페치
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}

      {data && (
        <div className="space-y-4">
          {data.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">#{post.id}</span>
                  <CardTitle className="text-base capitalize">{post.title}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2">{post.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12">
        <Button variant="outline" asChild>
          <Link href="/examples">
            <ArrowLeft className="size-4" />
            예제 목록
          </Link>
        </Button>
      </div>
    </div>
  )
}
