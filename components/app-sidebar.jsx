
import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        }
      ],
    },
    {
      title: "Notebooks",
      url: "#",
      items: [
        {
          title: "My Notebooks",
          url: "/notebook",
        },
        {
          title: "My Collaborations",
          url: "/notebook?collab=true",
        }
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {

  const pathname = usePathname()
  const searchParams = useSearchParams();

  const currentFullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex flex-row gap-4 justify-start items-center">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <h1 className="font-bold text-xl">AT Notebook</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.url === currentFullPath}>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
