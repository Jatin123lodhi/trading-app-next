import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Wallet from "@/models/Wallet";
import { calculatePortfolioTotals, convertCurrency } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request){
    try{
        await connectDB();
        const auth = await verifyAuth(request);

        if(auth.error){
            return NextResponse.json({
                message: auth.error
            }, { status: auth.status })
        }

        // get pagination params
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;


        // get all users orders with populated market data
        const orders = await Order.find({ userId: auth.userId })
        .populate('marketId', 'title status')
        .populate('walletId', 'currency')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        // get total count for pagination
        const totalOrders = await Order.countDocuments({ userId: auth.userId })

        // get all user's wallets
        const wallets = await Wallet.find({ userId: auth.userId })

        // Calculate overview stats (only for first page to avoid recalculating)
        let overview = null;
        if (page === 1) {
            // Get all orders for accurate statistics
            const allOrders = await Order.find({ userId: auth.userId });
            const totalOrdersCount = allOrders.length;
            const wonOrders = allOrders.filter(order => order.status === 'won').length;
            const lostOrders = allOrders.filter(order => order.status === 'lost').length;
            const pendingOrders = allOrders.filter(order => order.status === 'locked').length;

            const winRate = totalOrdersCount > 0 ? ((wonOrders / (wonOrders + lostOrders)) * 100) : 0;

            // calculate total P&L (convert to INR for consistency)
            const totalPnL = allOrders.reduce((sum, order) => {
                // Get the wallet currency for this order
                const wallet = wallets.find(w => w._id.toString() === order.walletId.toString());
                const currency = wallet ? wallet.currency : 'INR';
                const convertedAmount = convertCurrency(order.amount, currency, 'INR');
                
                if(order.status === 'won') return sum + convertedAmount;
                if(order.status === 'lost') return sum - convertedAmount;
                return sum;
            }, 0);

            // Calculate total portfolio value with currency conversion
            const portfolioTotals = calculatePortfolioTotals(wallets, 'INR');
            const { totalBalance, totalLockedBalance, totalPortfolioValue } = portfolioTotals;

            overview = {
                totalPortfolioValue,
                totalBalance,
                totalLockedBalance,
                totalPnL,
                winRate: Math.round(winRate * 100) / 100,
                totalOrders: totalOrdersCount,
                wonOrders,
                lostOrders,
                pendingOrders
            };
        }

        return NextResponse.json({
            message: "Portfolio data fetched successfully",
            data: {
                overview,
                orders,
                wallets: page === 1 ? wallets : [], // Only return wallets on first page
                pagination: {
                    page,
                    limit,
                    total: totalOrders,
                    hasMore: skip + limit < totalOrders
                }
            }
        });

    }catch(error){
        console.error(error)
        return NextResponse.json({
            message: "Internal Server Error",
        }, {status: 500})
    }
}