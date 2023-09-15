import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { ProductsFormSchema } from "@/lib/zodValidators";
import { errorResponse } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured") ? true : undefined;

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismaDb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived: false, // we don't want to load archive products when it is true
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    errorResponse("[PRODUCTS_GET]", error, 500)
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

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = ProductsFormSchema.parse(body);

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId},
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismaDb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        // images are a separate model
        images: {
          createMany: {
            data: [...images.map((image: {
              imageUrl: string;
              imagePublicId: string;
          }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    errorResponse("[PRODUCTS_POST]", error, 500)
  }
}


