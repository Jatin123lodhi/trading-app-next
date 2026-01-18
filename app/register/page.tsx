"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, password, role: "user" }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            toast.success("Registration successful");
            router.push("/login");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        }
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col gap-2 border p-6 rounded shadow">
                <h1 className="text-2xl font-bold text-center mb-2">Register</h1>
                <div>
                    <h2 className="text-center font-semibold mb-2">Trading app</h2>
                    <p className="text-sm text-center mb-4">Welcome! Please enter your details.</p>
                </div>
                <form className="flex flex-col gap-2 w-[300px] " onSubmit={handleSubmit}>
                    <Input width="full" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input width="full" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" className="mt-4 cursor-pointer">Register</Button>
                    <p className="text-sm text-center mt-2">Already have an account? <Link href="/login" className="text-blue-500 ">Login</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Register;