// import Navbar from "@/components/custom/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AppSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="visible md:hidden">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarProvider>
    </>
  );
}
