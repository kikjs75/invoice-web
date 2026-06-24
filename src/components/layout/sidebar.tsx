"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const iconMap: Record<string, React.ElementType> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/settings": Settings,
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="border-border bg-background hidden w-56 flex-col border-r md:flex">
      {/* 로고 */}
      <div className="border-border flex h-14 items-center border-b px-4">
        <Link href="/" className="text-foreground font-bold">
          {siteConfig.name}
        </Link>
      </div>

      {/* 네비게이션 */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-2">
          {siteConfig.dashboardNav.map((item) => {
            const Icon = iconMap[item.href] ?? LayoutDashboard
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn("justify-start gap-2", isActive && "font-medium")}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="size-4" />
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />
    </aside>
  )
}
