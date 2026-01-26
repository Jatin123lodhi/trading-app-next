"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateMarket = () => {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [endDate, setEndDate] = useState(new Date());

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/markets", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                method: "POST",
                body: JSON.stringify({ title, description, category, endDate }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                
                // Handle validation errors (array of issues from Zod)
                if (Array.isArray(errorData.message)) {
                    const errorMessages = errorData.message.map((issue: { message: string }) => issue.message).join(", ");
                    throw new Error(errorMessages);
                }
                
                // Handle regular string error messages
                throw new Error(errorData.message || "Something went wrong");
            }
            toast.success("Market created successfully");
            router.push("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        }
    }

    return (
    <div className="p-4">
        <h1 className="text-2xl font-bold">Create Market</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4 ">
            <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
        <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input type="date" id="endDate" value={endDate.toISOString().split('T')[0]} onChange={(e) => setEndDate(new Date(e.target.value))} />
        </div>
        <Button type="submit" className="mt-4 cursor-pointer">Create Market</Button>
    </form>
    </div>
  );
};

export default CreateMarket;