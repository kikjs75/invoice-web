import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Button variant="ghost" size="sm" className="mb-8 -ml-2" asChild>
        <Link href="/">
          <ArrowLeft className="size-4" />
          홈으로
        </Link>
      </Button>

      <h1 className="mb-2 text-3xl font-bold">개인정보처리방침</h1>
      <p className="text-muted-foreground mb-8 text-sm">최종 수정일: 2026년 6월 23일</p>

      <div className="max-w-none space-y-8 text-sm leading-7">
        <section>
          <h2 className="mb-3 text-xl font-semibold">1. 개인정보 수집 목적</h2>
          <p className="text-muted-foreground">
            NextStarter는 서비스 제공 및 개선을 위해 최소한의 개인정보를 수집합니다. 수집된 정보는
            명시된 목적 외에 사용되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">2. 수집하는 개인정보 항목</h2>
          <p className="text-muted-foreground">
            이메일 주소, 이름, 서비스 이용 기록 등을 수집할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">3. 개인정보 보유 기간</h2>
          <p className="text-muted-foreground">
            서비스 이용 계약 종료 시까지 보유하며, 이후 지체 없이 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">4. 문의</h2>
          <p className="text-muted-foreground">
            개인정보 관련 문의는 서비스 운영자에게 연락하시기 바랍니다.
          </p>
        </section>
      </div>
    </div>
  )
}
