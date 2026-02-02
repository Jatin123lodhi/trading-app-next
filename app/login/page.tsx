"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("Login successful");
      localStorage.setItem("token", data.token);
      router.push(searchParams.get("redirect") || "/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setIsGuestLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "user1@gmail.com",
          password: "123",
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("Logged in as guest");
      localStorage.setItem("token", data.token);
      router.push(searchParams.get("redirect") || "/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-white">
      {/* Vignette background */}
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full shadow-2xl">
        <div
          className="
            flex flex-col gap-2 p-8 rounded-2xl
            bg-card backdrop-blur-2xl
            border border-border
          "
        >
          <h1 className="text-3xl font-bold text-center mb-2 text-primary">Login</h1>

          <div className="flex flex-col items-center mb-4">
            <Link
              href="/"
              className="text-xl font-bold text-primary hover:text-gray-300 transition"
            >
              TrueSplit
            </Link>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="flex flex-col gap-3 w-[300px]" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              disabled={isLoading}
              type="submit"
              className="mt-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading && <Spinner />}
              Login
            </Button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/15" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGuestLogin}
              disabled={isGuestLoading}
              className="
                bg-transparent border border-border
                text-muted-foreground hover:text-primary
                hover:bg-card hover:border-border
                flex items-center justify-center gap-2 
                cursor-pointer
              "
            >
              {isGuestLoading && <Spinner />}
              Login as Guest
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-muted-foreground hover:underline hover:text-primary cursor-pointer"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
