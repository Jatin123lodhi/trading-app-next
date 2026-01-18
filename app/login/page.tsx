"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
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
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <div className="flex flex-col gap-2 border p-6 rounded shadow  bg-white text-black">
                <h1 className="text-2xl font-bold text-center mb-2">Login</h1>
                <div>
                    <h2 className="text-center font-semibold mb-2">Trading app</h2>
                    <p className="text-sm text-center mb-4">Welcome back! Please enter your details.</p>
                </div>
                <form className="flex flex-col gap-2 w-[300px] " onSubmit={handleSubmit}>
                    <Input width="full" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input width="full" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" className="mt-4 cursor-pointer">Login</Button>
                </form>
                <p className="text-sm text-center mt-4">Don&apos;t have an account? <Link href="/register" className="text-blue-500">Register</Link></p>
            </div>
        </div>
    )
}

export default Login;