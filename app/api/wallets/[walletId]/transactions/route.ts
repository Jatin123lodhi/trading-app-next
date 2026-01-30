import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import Wallet from "@/models/Wallet";
import { formatValidationError } from "@/lib/utils";

// add balance // I think this endpoint will be called by some payment service
export async function POST(  
  request: Request,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    await connectDB();

    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json(
        {
          message: auth.error,
        },
        { status: auth.status }
      );
    }

    const { walletId } = await params;
    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      return NextResponse.json(
        {
          message: "Invalid wallet id",
        },
        { status: 400 }
      );
    }

    // sanitize the payload/body
    const body = await request.json();
    const addBalanceSchema = z.object({
      amount: z.number().min(1),
    //   type: z.enum(["CREDIT"]),  we can use this while updating transaction model
    //   reason: z.enum(["ADD_BALANCE"]),
    });
    const result = addBalanceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: formatValidationError(result.error),
        },
        { status: 400 }
      );
    }
    const { amount } = result.data;


    // now update the wallet
    const updatedWallet = await Wallet.findOneAndUpdate(
      {
        _id: walletId,
        userId: auth.userId,
      },
      {
        $inc: {
          balance: amount,
        },
      },
      {
        new: true
      }
    );

    if (!updatedWallet) {
        return NextResponse.json(
          {
            message: "Wallet not found",
          },
          { status: 404 }
        );
      }

    return NextResponse.json({
        message: "Wallet updated successfully",
        data: updatedWallet
    }, { status: 200 })

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
