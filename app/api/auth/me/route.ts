import { verifyAuth } from "@/lib/auth";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // verify the user
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json(
        {
          message: auth.error,
        },
        { status: auth.status }
      );
    }

    // then get the user detials
    const user = await User.findOne({ email: auth.email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User is authenticated",
        data: {
          email: user.email,
          userId: user._id,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
