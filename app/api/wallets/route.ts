import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { createWalletSchema } from "@/lib/validations/wallet";
import Wallet from "@/models/Wallet";
import { NextResponse } from "next/server";
import { formatValidationError } from "@/lib/utils";

// create a wallet
export async function POST(request: Request){
    try{

        await connectDB();
        const auth = await verifyAuth(request);
        if(auth.error){
            return NextResponse.json({
                message: auth.error
            }, {status: auth.status})
        }

        const body = await request.json();

        // validate inputs
        const result = createWalletSchema.safeParse(body);
        if(!result.success){
            return NextResponse.json({
                message: formatValidationError(result.error)
            }, { status: 400})
        }

        const { balance, currency } = result.data

        // check wallet with same currency don't exist for this user
        const walletExists = await Wallet.findOne({
            userId: auth.userId,
            currency
        })

        if(walletExists){
            return NextResponse.json({
                message: "Wallet already exists for this currency"
            }, {status: 409})
        }

        // create a wallet
        const wallet = await Wallet.create({
            userId: auth.userId,
            currency,
            balance
        })

        return NextResponse.json({
            message: "User wallet created",
            data: wallet
        }, {status: 201})


    }catch(error){
        console.log(error);
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 })
    }
}

// get all wallets
export async function GET(request: Request){
    try{
        await connectDB();
        const auth = await verifyAuth(request);
        if(auth.error){
            return NextResponse.json({
                message: auth.error
            }, {status: auth.status})
        }

        const wallets = await Wallet.find({userId: auth.userId});
        return NextResponse.json({
      message: "Wallets fetched!",
      data: wallets,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}