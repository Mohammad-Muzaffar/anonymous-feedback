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
        <div
          className={`flex items-center justify-center space-x-4 transition-opacity duration-200 ${
            state === "collapsed" ? "opacity-80" : "opacity-100"
          }`}
        >
          {state === "expanded" && (
            <h1 className="text-xl font-bold">Anonymous Feedback</h1>
          )}
          {state === "collapsed" && (
            <Avatar
              className={`transition-all duration-200 ${
                state === "collapsed" ? "h-7 w-7" : "h-10 w-10"
              }`}
            >
              <AvatarFallback>{"AF"}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Collapse Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="p-0.5">
                  <a href="#" className="flex justify-start items-center">
                    <SidebarTrigger />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Dashboard Link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard" className="flex items-center">
                    <Home className="mr-2" />
                    <span
                      className={`transition-opacity duration-200 ${
                        state === "collapsed" ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      Dashboard
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Posts Section */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <MessageSquare className="mr-2" />
                    <span
                      className={`transition-opacity duration-200 ${
                        state === "collapsed" ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      Posts
                    </span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a href="/posts/new-post">
                        <span
                          className={`transition-opacity duration-200 ${
                            state === "collapsed" ? "opacity-0" : "opacity-100"
                          }`}
                        >
                          New Post
                        </span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a href="/posts">
                        <span
                          className={`transition-opacity duration-200 ${
                            state === "collapsed" ? "opacity-0" : "opacity-100"
                          }`}
                        >
                          All Posts
                        </span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              {/* Settings Section */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <Settings className="mr-2" />
                    <span
                      className={`transition-opacity duration-200 ${
                        state === "collapsed" ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      Settings
                    </span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    {!user ? (
                      <SidebarMenuSubButton asChild>
                        <a href="/signin" className="flex items-center">
                          <LogIn className="mr-2 h-4 w-4" />
                          <span
                            className={`transition-opacity duration-200 ${
                              state === "collapsed"
                                ? "opacity-0"
                                : "opacity-100"
                            }`}
                          >
                            Sign in
                          </span>
                        </a>
                      </SidebarMenuSubButton>
                    ) : (
                      <SidebarMenuSubButton onClick={() => signOut()}>
                        <a href="/signin" className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span
                            className={`transition-opacity duration-200 ${
                              state === "collapsed"
                                ? "opacity-0"
                                : "opacity-100"
                            }`}
                          >
                            Sign out
                          </span>
                        </a>
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
              <p className="text-sm font-medium">{user?.username || "User"}</p>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
