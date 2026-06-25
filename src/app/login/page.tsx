import type { Metadata } from "next"
import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "로그인",
  description: "계정에 로그인하세요.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100svh-8rem)] items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  )
}
