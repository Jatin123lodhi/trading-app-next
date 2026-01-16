import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Wallet from "@/models/Wallet";

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
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

    const { orderId } = params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        {
          message: "Invalid order Id",
        },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // update order status to cancelled
      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: orderId,
          userId: auth.userId,
          status: "locked",
        },
        {
          status: "cancelled",
        },
        {
          new: true,
        }
      ).session(session);

      if (!updatedOrder) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            message:
              "Order not found, already cancelled, or doesn't belong to you",
          },
          { status: 400 }
        );
      }

      // update locked wallet balance
      const updateWallet = await Wallet.findOneAndUpdate(
        {
          _id: updatedOrder.walletId,
          userId: auth.userId,
        },
        {
          $inc: {
            lockedBalance: -updatedOrder.amount,
          },
        },
        { new: true }
      ).session(session);

      if (!updateWallet) {
        await session.abortTransaction();
        return NextResponse.json(
          {
            message: "Wallet update failed",
          },
          { status: 500 }
        );
      }

      await session.commitTransaction();
      return NextResponse.json(
        {
          message: "Order cancelled",
        },
        { status: 200 }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{id: string}> }
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

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Not a valid orderId",
        },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      _id: id,
      userId: auth.userId,
    });

    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found for current user",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Order details fetched!",
        data: order,
      },
      { status: 200 }
    );
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
