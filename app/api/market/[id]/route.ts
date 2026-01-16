import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Market from "@/models/Market";
import { verifyAuth } from "@/lib/auth";
import { z } from "zod";
import Order from "@/models/Order";
import Wallet from "@/models/Wallet";
import PlatformRevenue from "@/models/PlatformRevenue";

// get a single market
export async function GET(
  request: Request,
  {params} : { params: Promise<{id: string}> }
) {
  try {
    await connectDB();

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid market ID",
        },
        { status: 400 }
      );
    }
    const market = await Market.findOne({ _id: id });
    if (!market) {
      return NextResponse.json(
        {
          message: "Market not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Market fetched!",
        data: market,
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

// settle the market
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await verifyAuth(request, "admin");
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
          message: "Invalid market ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const marketSettleSchema = z.object({
      winningOutcome: z.enum(["Yes", "No"]),
    });
    const result = marketSettleSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { winningOutcome } = result.data;

    // settle market, update order and wallet
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // check market exists
      const market = await Market.findById(id).session(session)
      if(!market){
        await session.abortTransaction();
        return NextResponse.json({
            message: "Market not found",
        }, { status: 404 })
      }

      if(market.status === 'settled'){
        await session.abortTransaction();
        return NextResponse.json({
            message: "Market is already settled"
        }, { status: 400})
      }


      await Market.findOneAndUpdate(
        { 
            _id: id, 
        },
        { status: "settled", winningOutcome },
        { new: true }
      ).session(session);
      

      const lockedOrders = await Order.find({
        marketId: id,
        status: "locked",
      });

      const winningOrders = lockedOrders.filter(
        (o) => o.outcome === winningOutcome
      );
      const loosingOrders = lockedOrders.filter(
        (o) => o.outcome !== winningOutcome
      );

      const winningPool = winningOrders.reduce((acc, curr) => {
        return acc + parseFloat(curr.amount);
      }, 0);

      const loosingPool = loosingOrders.reduce((acc, curr) => {
        return acc + parseFloat(curr.amount);
      }, 0);

      if (winningPool === 0 && loosingPool === 0) {
        // should we do with transaction here abort or commit
        return NextResponse.json(
          {
            message: "No orders to settle",
          },
          { status: 200 }
        );
      }

      const orderUpdates = [];
      const walletUpdates: Parameters<typeof Wallet.bulkWrite>[0] = [];

      if (winningPool === 0 || loosingPool === 0) {
        // unlock the balance and cancel the orders
        lockedOrders.map((order) => {
          const orderAmt = parseFloat(order.amount);
          orderUpdates.push({
            updateOne: {
              filter: {
                userId: order.userId,
              },
              update: {
                $inc: {
                  lockedBalance: -orderAmt,
                },
              },
            },
          });
        });

        await Wallet.bulkWrite(walletUpdates, { session });

        // order ids
        const orderIds = lockedOrders.map((o) => o._id);
        await Order.updateMany(
          { _id: { $in: orderIds } },
          { status: "cancelled" }
        ).session(session);

        return;
      }

      // calculate platform fee
      const feePercentage = 0.02; // 2 percent
      const platformFee = loosingPool * feePercentage;

      const distributablePool = loosingPool - platformFee;

      // wallet update , order update
      if (platformFee > 0) {
        await PlatformRevenue.create(
          [
            {
              marketId: id,
              revenue: platformFee,
              feePercentage,
              settlementDate: new Date(),
              currency: "INR", // for now let's consider only INR
            },
          ],
          { session }
        );
      }

      winningOrders.forEach((order) => {
        const orderAmt = order.amount;
        const userShare = orderAmt / distributablePool;
        const winnings = distributablePool * userShare;

        walletUpdates.push({
          updateOne: {
            filter: {
              _id: order.walletId,
            },
            update: {
              $inc: {
                balance: winnings,
                lockedBalance: -orderAmt,
              },
            },
          },
        });
      });

      loosingOrders.forEach((order) => {
        const orderAmt = parseFloat(order.amount);
        walletUpdates.push({
          updateOne: {
            filter: {
              _id: order.walletId,
            },
            update: {
              $inc: {
                balance: -orderAmt,
                lockedBalance: -orderAmt,
              },
            },
          },
        });
      });

      const orderIds = lockedOrders.map((o) => o._id);

      await Wallet.bulkWrite(walletUpdates);
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { status: "settled" },
        { session }
      );

      await session.commitTransaction();
      return NextResponse.json({
        message: "Market settled!",
      });
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
