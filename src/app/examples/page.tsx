import type { Metadata } from "next"
import Link from "next/link"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "예제",
  description: "실제 동작하는 예제를 통해 스타터킷의 모든 기능을 탐색하세요.",
}

const examples = [
  {
    icon: Settings,
    title: "설정 및 최적화",
    description: "성능 최적화, SEO 설정, PWA 구현 등 프로덕션 환경을 위한 설정들입니다.",
    tags: ["최적화", "SEO"],
    href: "/examples/optimization",
  },
]

export default function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">예제 모음</h1>
        <p className="text-muted-foreground max-w-xl">
          실제 동작하는 예제를 통해 스타터킷의 모든 기능을 탐색해보세요. 각 예제는 소스 코드와 함께
          제공됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example) => (
          <Card key={example.title} className="flex flex-col">
            <CardHeader className="gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-muted flex size-10 items-center justify-center rounded-lg border">
                  <example.icon className="text-muted-foreground size-5" />
                </div>
                <CardTitle className="text-lg">{example.title}</CardTitle>
              </div>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-0">
              <div className="flex flex-wrap gap-1.5">
                {example.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button asChild className="w-full">
                <Link href={example.href}>예제 보기</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-muted-foreground mt-12 text-center text-sm">
        각 예제는 실제 코드와 함께 제공되며 자유롭게 복사하여 사용할 수 있습니다.
      </p>
    </div>
  )
}
