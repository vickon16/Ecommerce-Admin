import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { errorResponse } from "@/lib/utils";
import { ProductsFormSchema } from "@/lib/zodValidators";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismaDb.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    errorResponse("[PRODUCTS_GET]", error, 500);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const body = await req.json();
    const {
      name,
      price,
      categoryId,
      images,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = ProductsFormSchema.parse(body);

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // we first of all updated the data and deleted the images
    await prismaDb.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    // we then update the images
    const product = await prismaDb.product.update({
      where: { id: params.productId },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map(
                (image: { imageUrl: string; imagePublicId: string }) => image
              ),
            ],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    errorResponse("[PRODUCTS_PATCH]", error, 500);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismaDb.product.delete({
      where: { id: params.productId },
      include: { images: true },
    });

    // delete public key from cloudinary
    await Promise.all(
      product.images.map((image) =>
        cloudinary.uploader.destroy(image.imagePublicId)
      )
    );

    return NextResponse.json(product);
  } catch (error) {
    errorResponse("[PRODUCTS_DELETE]", error, 500);
  }
}
