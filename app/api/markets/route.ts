import { verifyAuth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { createMarketSchema } from "@/lib/validations/market";
import Market from "@/models/Market";
import { NextResponse } from "next/server";
import { formatValidationError } from "@/lib/utils";

// creating a market
export async function POST(request: Request) {
  try {
    await connectDB();
    // validate the token and role
    const auth = await verifyAuth(request, "admin");
    if (auth.error) {
      return NextResponse.json(
        {
          message: auth.error,
        },
        { status: auth.status }
      );
    }

    const body = await request.json();

    // validate the inputs
    const result = createMarketSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: formatValidationError(result.error)
        },
        { status: 422 }
      ); // invalid input
    }

    // parsed data
    const { title, description, category, endDate } = result.data;

    // check title is unique
    const existingMarket = await Market.findOne({ title });
    if (existingMarket) {
      return NextResponse.json(
        {
          message: "Market with this title already exists",
        },
        { status: 409 }
      ); // conflict
    }

    // create the market
    const market = await Market.create({
      title,
      description,
      endDate,
      category,
    });

    return NextResponse.json(
      {
        message: "Market created!",
        data: market,
      },
      { status: 201 }
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

// get markets
export async function GET(request: Request) {
  try {
    await connectDB();
    
    // it is public route

    // how to extract query params ?
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    const skip = (page-1)*pageSize

    // create filters
    const filters: Record<string, string> = {};
    if(category) filters.category = category;
    if(status) filters.status = status

    const total = await Market.countDocuments(filters)
    const totalPages = Math.ceil(total/pageSize)


    const markets = await Market.find(filters)
    .skip(skip)
    .limit(pageSize);

    return NextResponse.json({
      message: "Markets fetched!",
      data: markets,
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    });
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
