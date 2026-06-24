import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "설정 및 최적화",
  description: "성능 최적화, SEO 설정 등 프로덕션 환경을 위한 설정 가이드입니다.",
}

const items = [
  {
    value: "metadata",
    title: "Metadata API (SEO)",
    content: `// src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | NextStarter',
    default: 'NextStarter',
  },
  description: '모던 웹 스타터킷',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'NextStarter',
  },
}`,
  },
  {
    value: "env",
    title: "환경 변수 설정",
    content: `# .env.local (커밋하지 않음)
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://user:pass@localhost/db

# .env.example (커밋용 — 키만 남기고 값은 비움)
NEXT_PUBLIC_API_URL=
DATABASE_URL=

# 사용법
const apiUrl = process.env.NEXT_PUBLIC_API_URL
// NEXT_PUBLIC_ 접두사가 있어야 클라이언트에서 접근 가능`,
  },
  {
    value: "image",
    title: "next/image 최적화",
    content: `import Image from 'next/image'

// 정적 이미지 (자동 크기 추론)
<Image src={heroImg} alt="히어로" priority />

// 동적 이미지 (크기 명시 필요)
<Image
  src="https://example.com/photo.jpg"
  alt="사진"
  width={1200}
  height={630}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// next.config.ts — 외부 도메인 허용
images: {
  remotePatterns: [{ hostname: 'example.com' }],
}`,
  },
  {
    value: "typescript",
    title: "TypeScript Strict 설정",
    content: `// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}`,
  },
  {
    value: "bundle",
    title: "번들 크기 분석",
    content: `# 번들 분석기 설치
npm install --save-dev @next/bundle-analyzer

# next.config.ts
import BundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)

# 실행
ANALYZE=true npm run build`,
  },
]

export default function OptimizationPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/examples">
            <ArrowLeft className="size-4" />
            예제 목록으로
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">설정 및 최적화</h1>
        <p className="text-muted-foreground mt-2">
          성능 최적화, SEO 설정 등 프로덕션 환경을 위한 설정 가이드입니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최적화 가이드</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {items.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>
                  <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm leading-relaxed">
                    <code>{item.content}</code>
                  </pre>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

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
