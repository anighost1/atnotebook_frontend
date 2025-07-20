"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'

export default function SideAndHeader({ children }) {

    const pathname = usePathname()

    const hideSidebarRoutes = ['/login', '/register']
    const shouldHide = hideSidebarRoutes.includes(pathname)

    if (shouldHide) {
        return children // Don't render sidebar/layout on login/register
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
