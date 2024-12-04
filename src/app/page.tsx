"use client";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  router.push("/dashboard");
  return <div>redirecting to dashboard...</div>;
}

export default Page;
