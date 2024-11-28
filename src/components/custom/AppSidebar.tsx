"use client";

import { Home, MessageSquare, Settings, LogOut, LogIn } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="text-[#051D39]">
      <SidebarHeader className="p-4">
        <h1
          className={`text-xl text-center font-bold transition-opacity duration-200 ${
            state === "collapsed" ? "opacity-80" : "opacity-100"
          }`}
        >
          {state === "expanded" && "Anonymous Feedback"}
          {state === "collapsed" && (
            <div className="flex items-center justify-center space-x-4">
              <Avatar
                className={`transition-all duration-200 ${
                  state === "collapsed" ? "h-7 w-7" : "h-10 w-10"
                }`}
              >
                <AvatarFallback>{"AF"}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <SidebarTrigger />
                    <span className="mr-0">
                      {state === "expanded" && "Collapse"}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MessageSquare />
                  <span>Posts</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a href="/posts/new-post">New Post</a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a href="/posts">View Previous Posts</a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    {!user ? (
                      <SidebarMenuSubButton asChild>
                        <a href="/signin">
                          <LogIn className="mr-2 h-4 w-4" />
                          <span>Sign in</span>
                        </a>
                      </SidebarMenuSubButton>
                    ) : (
                      <SidebarMenuSubButton onClick={() => signOut()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </SidebarMenuSubButton>
                    )}
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar
            className={`transition-all duration-200 ${
              state === "collapsed" ? "h-7 w-7" : "h-10 w-10"
            }`}
          >
            <AvatarImage src={user?.image || "https://github.com/shadcn.png"} />
            <AvatarFallback>{user?.username || "U"}</AvatarFallback>
          </Avatar>
          <div
            className={`transition-opacity duration-200 ${
              state === "collapsed"
                ? "opacity-0 w-0 overflow-hidden"
                : "opacity-100"
            }`}
          >
            {state === "expanded" && (
              <>
                <p className="text-sm font-medium">
                  {user?.username || "User"}
                </p>
              </>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
