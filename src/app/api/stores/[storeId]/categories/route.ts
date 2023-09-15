import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { CategoryFormSchema } from "@/lib/zodValidators";
import { errorResponse } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await prismaDb.category.findMany({
      where: { storeId: params.storeId},
    });

    return NextResponse.json(categories);
  } catch (error) {
    errorResponse("[CATEGORIES_GET]", error, 500);
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
    const { name, billboardId } = CategoryFormSchema.parse(body);

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const category = await prismaDb.category.create({
      data: { name, billboardId, storeId: params.storeId },
    });

    return NextResponse.json(category);
  } catch (error) {
    errorResponse("[CATEGORIES_POST]", error, 500);
  }
}


