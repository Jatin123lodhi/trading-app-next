import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// weekly-volume -- total bet amount per day for 7 days
export async function GET(request: Request){
    try{
        await connectDB();
        const auth = await verifyAuth(request);
        if(auth.error){
            return NextResponse.json({
                message: auth.error
            }, { status: auth.status })
        }

        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7 );

        const data = await Order.aggregate([
            {
              $match: {
                createdAt: { $gte: sevenDaysAgo }
              }
            },
            {
              $project: {
                date: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                  }
                },
                amount: 1
              }
            },
            {
              $group: {
                _id: "$date",
                totalVolume: { $sum: "$amount" }
              }
            },
            {
              $sort: { _id: 1 }
            }
          ]);
          
        // Create array for last 7 days to fill missing days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Find data for this date
            const dayData = data.find(d => d._id === dateStr);
            
            // Use consistent day names to avoid hydration issues
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = dayNames[date.getDay()];
            
            last7Days.push({
                day: dayName,
                date: dateStr,
                volume: dayData?.totalVolume || 0,
                markets: 0 // We can calculate this later if needed
            });
        }

        return NextResponse.json({
            message: "Weekly volume data fetched successfully",
            data: last7Days
        });

    }catch(error){
        console.log(error);
        return NextResponse.json({
            message: "Something went wrong"
        }, {status: 500})
    }
}