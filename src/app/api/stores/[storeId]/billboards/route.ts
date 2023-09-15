import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { BillboardFormSchema } from "@/lib/zodValidators";
import { errorResponse } from "@/lib/utils";


export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const billboards = await prismaDb.billboard.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    errorResponse("[BILLBOARDS_GET]", error, 500);
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
    const { label, imageData } = BillboardFormSchema.parse(body);

    // making sure we have the user with the storeId in the database
    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const billboard = await prismaDb.billboard.create({
      data: {
        label,
        imageUrl: imageData.imageUrl,
        imagePublicId: imageData.imagePublicId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    errorResponse("[BILLBOARDS_POST]", error, 500);
  }
}

