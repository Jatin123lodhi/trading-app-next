"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-black text-white h-screen w-screen">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl font-bold">Trading App</h1>
        <p className="text-xl my-8">Welcome to the trading app</p>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/login")} className="cursor-pointer">Login</Button>
          <Button onClick={() => router.push("/register")} className="cursor-pointer">Register</Button>
        </div>
      </div>
    </div>
  );
}
