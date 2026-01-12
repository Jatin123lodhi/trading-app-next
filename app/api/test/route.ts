import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await connectDB();
        return NextResponse.json({ message: 'Connected!' })
    }catch(error){
        console.log(error)
        return NextResponse.json(
            { error: 'Failed' },
            {  status: 500 }
        )
    }
}