import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { SizesFormSchema } from "@/lib/zodValidators";
import { errorResponse } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const sizes = await prismaDb.size.findMany({
      where: { storeId: params.storeId},
    });

    return NextResponse.json(sizes);
  } catch (error) {
    errorResponse("[SIZES_GET]", error, 500)
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const body = await req.json();
    const { name, value } = SizesFormSchema.parse(body);

    console.log(typeof value);


    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId},
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const size = await prismaDb.size.create({
      data: { name, value, storeId: params.storeId},
    });

    return NextResponse.json(size);
  } catch (error) {
    errorResponse("[SIZES_POST]", error, 500)
  }
}


