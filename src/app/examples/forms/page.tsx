"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const schema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
  role: z.string().min(1, "역할을 선택해주세요"),
})

type FormValues = z.infer<typeof schema>

export default function FormsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", role: "" },
  })

  const onSubmit = (data: FormValues) => {
    toast.success("폼이 성공적으로 제출되었습니다!", {
      description: `${data.name}님의 정보가 저장되었습니다.`,
    })
    reset()
  }

  return (
    <div className="container mx-auto max-w-xl px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/examples">
            <ArrowLeft className="size-4" />
            예제 목록으로
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">폼 예제</h1>
        <p className="mt-2 text-muted-foreground">react-hook-form과 zod를 활용한 유효성 검사 폼입니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>회원 정보 입력</CardTitle>
          <CardDescription>모든 필드를 입력해주세요. 유효성 검사가 적용되어 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">이름</Label>
              <Input id="name" placeholder="홍길동" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="example@email.com" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" placeholder="8자 이상 입력" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>역할</Label>
              <Select onValueChange={(value) => setValue("role", value, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="역할을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">관리자</SelectItem>
                  <SelectItem value="editor">편집자</SelectItem>
                  <SelectItem value="viewer">뷰어</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              제출하기
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
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
