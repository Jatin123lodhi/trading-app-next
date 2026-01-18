import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Market from "@/models/Market";
import connectDB from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import Wallet from "@/models/Wallet";
import Order from "@/models/Order";
import { orderPlacementSchema } from "@/lib/validations/order";

// placing an order
export async function POST(request: Request) {

  try {
    await connectDB();

    const auth = await verifyAuth(request);
    if(auth.error){
      return NextResponse.json({
        message: auth.error
      }, { status: auth.status })
    }


    const body = await request.json();

    // input validation
    const result = orderPlacementSchema.safeParse(body);
    if(result.error){
      return NextResponse.json({
        message: result.error.issues
      }, {status: 422})
    }
    const { marketId, amount, outcome, walletId } = result.data;

    const session = await mongoose.startSession()
    session.startTransaction();

    try{
        const marketExists  = await Market.findById(marketId).session(session);
        if(!marketExists){
          await session.abortTransaction();
          return NextResponse.json({ // is this good or not ?
            message: "Market does not exists"
          }, {status: 404})
        }

        if(marketExists.status !== 'open'){
          await session.abortTransaction();
          return NextResponse.json({
            message: 'Market is not in open state'
          }, {status: 400})
        }

        const { userId } = auth;
        // check amount 
        const wallet = await Wallet.findOne({_id: walletId}).session(session)
        if(!wallet){
          await session.abortTransaction()
          return NextResponse.json({
            message: 'Wallet not found'
          }, {status: 404})
        }

        if(wallet.balance - wallet.lockedBalance  < amount){
          await session.abortTransaction();
          return NextResponse.json({
            message: 'Insufficient balance'
          }, {status: 400})
        }

        // lock the balance
        await Wallet.findOneAndUpdate(
          {
            _id: wallet._id,
            userId: auth.userId
          }, {
          $inc: {
            lockedBalance: amount
          }
        }, {session})

        // market is open, balance is there, create order
        const order = await Order.create([{
          marketId,
          userId,
          walletId,
          amount,
          outcome,
          status: 'locked'
        }], { session })

        await session.commitTransaction()

        return NextResponse.json({
          message: 'Order created!',
          data: order
        })
    }catch(error){
        await session.abortTransaction()
        throw error;
    }finally{
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


// get all orders
export async function GET(request: Request){
  try{
    await connectDB();
    const auth = await verifyAuth(request);
    if(auth.error){
      return NextResponse.json({
        message: auth.error
      }, {status: auth.status})
    }

    const { searchParams } = new URL(request.url);
    const marketId = searchParams.get('marketId')
    console.log(marketId, '--------marketId')
    // build filter
    const filters: Record<string, string> = {};
    if(marketId) filters.marketId = marketId;
    
    const orders = await Order.find({userId: auth.userId,...filters}); 
    console.log(orders,' ---order in route')
    return NextResponse.json({
      message: "Order fetched!",
      data: orders
    }, {status: 200})

  }catch(error){
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error"
    }, {status: 500})
  }
}