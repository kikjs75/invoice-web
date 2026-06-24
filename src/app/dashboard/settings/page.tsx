import { Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">설정</h1>
        <p className="text-muted-foreground text-sm">애플리케이션 환경을 관리합니다.</p>
      </div>

      <Separator />

      <div className="flex max-w-2xl flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Settings className="text-muted-foreground size-5" />
            <div>
              <CardTitle className="text-base">일반 설정</CardTitle>
              <CardDescription>기본 애플리케이션 설정을 관리합니다.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">준비 중입니다.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">알림 설정</CardTitle>
            <CardDescription>알림 수신 방식을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">준비 중입니다.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
