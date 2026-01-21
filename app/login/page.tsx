"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            toast.success("Login successful");
            localStorage.setItem("token", data.token);
            const redirectTo = searchParams.get('redirect') || '/dashboard'
            router.push(redirectTo);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative text-white h-screen w-screen overflow-hidden" style={{ cursor: 'crosshair' }}>
            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center h-screen">
                <div className="flex flex-col gap-2 p-8 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 shadow-2xl text-white">
                <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent pb-1 inline-block w-full">Login</h1>
                <div className="flex flex-col items-center justify-center">
                    <Link href={'/'} className="text-center font-bold mb-2 text-xl bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent hover:from-red-600 hover:via-pink-600 hover:to-purple-600 transition-all">PredictX</Link>
                    <p className="text-sm text-center mb-4 text-gray-300">Welcome back! Please enter your details.</p>
                </div>
                <form className="flex flex-col gap-2 w-[300px] " onSubmit={handleSubmit}>
                    <Input width="full" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input width="full" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button disabled={isLoading} type="submit" className="mt-4 cursor-pointer flex items-center gap-2">
                       {isLoading ? <Spinner /> : null} 
                        Login</Button>
                </form>
                <p className="text-sm text-center mt-4">Don&apos;t have an account? <Link href="/register" className="text-pink-500 hover:text-pink-400 hover:underline transition-colors">Register</Link></p>
            </div>
            </div>
        </div>
    )
}

export default Login;