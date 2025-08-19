"use client"

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
  SidebarFooter
} from "@/components/ui/sidebar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import UserDetailsFetcher from "@/lib/userDetailsFetcher"
import { LogOut } from "lucide-react"
import { Button } from "./ui/button"
import Cookies from "js-cookie"

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
    {
      title: "Friends",
      url: "#",
      items: [
        {
          title: "Friend List",
          url: "/friends",
        },
        {
          title: "Pending Requests",
          url: "/friends?status=pending",
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
      <SidebarFooter>
        <Logout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}


const Logout = () => {
  const [currentUser, setCurrentUser] = React.useState({})
  const router = useRouter()

  React.useEffect(() => {
    const data = UserDetailsFetcher()
    setCurrentUser(data)
  }, [])

  const handleLogout = () => {
    Cookies.remove('access')
    Cookies.remove('refresh')
    router.replace('/login')
  }

  return (
    <div className="p-4 flex flex-row justify-between items-center">
      {currentUser?.username}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon" className="size-8">
            <LogOut className="text-red-700" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will log you out.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className={'bg-red-700'} onClick={handleLogout}>Log Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  )
}