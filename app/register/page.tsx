"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
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
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-white">

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full shadow-2xl">
        <div
          className="
            flex flex-col gap-2 p-8 rounded-2xl
            bg-card backdrop-blur-2xl
            border border-border
          "
        >
          <h1 className="text-3xl font-bold text-center mb-2 text-primary">
            Register
          </h1>

          <div className="flex flex-col items-center mb-4">
            <Link
              href="/"
              className="text-xl font-bold text-primary hover:text-gray-300 transition"
            >
              TrueSplit
            </Link>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Start your prediction trading journey today.
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
              Create Account
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-muted-foreground hover:underline  hover:text-primary cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
