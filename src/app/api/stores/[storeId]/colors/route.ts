import { NextResponse } from "next/server";

import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { ColorsFormSchema } from "@/lib/zodValidators";
import { errorResponse } from "@/lib/utils";


export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const colors = await prismaDb.color.findMany({
      where: { storeId: params.storeId},
    });

    return NextResponse.json(colors);
  } catch (error) {
    errorResponse("[COLORS_GET]", error, 500)
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
    const { name, value } = ColorsFormSchema.parse(body);

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const color = await prismaDb.color.create({
      data: { name, value, storeId: params.storeId },
    });

    return NextResponse.json(color);
  } catch (error) {
    errorResponse("[COLORS_POST]", error, 500)
  }
}
