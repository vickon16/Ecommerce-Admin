import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { errorResponse } from "@/lib/utils";
import { CategoryFormSchema } from "@/lib/zodValidators";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const category = await prismaDb.category.findUnique({
      where: {id: params.categoryId},
      include: {billboard: true},
    });

    return NextResponse.json(category);
  } catch (error) {
    errorResponse("[CATEGORIES_GET]", error, 500);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const body = await req.json();
    const { name, billboardId } = CategoryFormSchema.parse(body);

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId},
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const category = await prismaDb.category.update({
      where: { id: params.categoryId},
      data: { name, billboardId },
    });

    return NextResponse.json(category);
  } catch (error) {
    errorResponse("[CATEGORIES_PATCH]", error, 500);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    // make sure the user is deleting from his own store
    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId},
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const category = await prismaDb.category.delete({
      where: { id: params.categoryId},
    });

    return NextResponse.json(category);
  } catch (error) {
    errorResponse("[CATEGORIES_DELETE]", error, 500);

  }
}


