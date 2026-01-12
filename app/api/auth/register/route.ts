import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import connectDB from "@/lib/mongodb";

export async function POST(request: Request) {
  try {

    await connectDB();

    const body = await request.json();
    const { email, password, role } = body; // TODO: remove role

    // we can use validation library and properly sanitize the inputs
    if(!email || !password){
        return NextResponse.json({
            message: "Email and Password are required"
        }, {status: 400})
    }

    // check is email unique
    const existingUser = await User.findOne({email})
    if(existingUser){
        return NextResponse.json({
            message: "User already exists"
        }, {status: 409})
    }

    // create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        email,
        password: hashedPassword,
        role
    })

    return NextResponse.json({
        message: "User registered!",
        data: {
          email: user.email,
          role: user.role,
          userId: user._id
        }
    }, { status: 201 })


  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
