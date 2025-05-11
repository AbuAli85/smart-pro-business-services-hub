"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Bell, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

type Notification = {
  id: string
  title: string
  description: string
  read: boolean
  created_at: string
}

export function HeaderWithNotifications() {
  const { user, profile, signOut } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return

      try {
        const supabase = createClientComponentClient<Database>()

        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) throw error

        if (data) {
          setNotifications(data)
        } else {
          // Fallback to demo data if no notifications found
          setNotifications([
            {
              id: "1",
              title: "New message",
              description: "You have a new message from Jane",
              read: false,
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              title: "Appointment reminder",
              description: "Tax Planning Session tomorrow at 4:00 PM",
              read: false,
              created_at: new Date().toISOString(),
            },
            {
              id: "3",
              title: "Document uploaded",
              description: "Financial Report Q2.xlsx has been uploaded",
              read: true,
              created_at: new Date().toISOString(),
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
        // Set demo data on error
        setNotifications([
          {
            id: "1",
            title: "New message",
            description: "You have a new message from Jane",
            read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Appointment reminder",
            description: "Tax Planning Session tomorrow at 4:00 PM",
            read: false,
            created_at: new Date().toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/auth/login"
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <>
      <Link href="/provider/dashboard" className="flex items-center gap-2">
        <span className="font-bold">SmartPRO</span>
        <span className="rounded bg-primary px-1.5 py-0.5 text-[0.625rem] font-medium text-primary-foreground">
          PROVIDER
        </span>
      </Link>

      <div className="hidden md:flex flex-1 items-center gap-4 md:ml-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full bg-muted pl-8 focus-visible:ring-primary" />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
                    <div className="flex w-full justify-between">
                      <span className="font-medium">{notification.title}</span>
                      {!notification.read && <span className="h-2 w-2 rounded-full bg-primary"></span>}
                    </div>
                    <span className="text-sm text-muted-foreground">{notification.description}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center">
                  <Link href="/provider/notifications">View all notifications</Link>
                </DropdownMenuItem>
              </>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <p>No notifications</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                <AvatarFallback>{profile?.full_name?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{profile?.full_name || "User"}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/provider/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/provider/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
