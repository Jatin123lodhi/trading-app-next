import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    // sanitize the inputs
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email or Password is requred" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return NextResponse.json(
        { message: "Email or Password invalid" },
        { status: 401 }
      );
    }

    // now check password by comparing
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Email or Password invalid" },
        { status: 401 }
      );
    }

    // all good then generate jwt token and send response
    const payload = {
      userId: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      message: "Login Successful!",
      token,
      data: {
        email: existingUser.email,
        role: existingUser.role,
        userId: existingUser._id,
      },
    });

    // store token in cookie
    // response.cookies.set("token", token, {
    //   httpOnly: true, // JS cannot access (XSS protection)
    //   secure: true, // HTTPS only in production
    //   sameSite: "strict", // CSRF protection
    //   maxAge: 60 * 60 * 24 * 7, // 7 days
    // });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
