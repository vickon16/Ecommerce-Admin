import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { errorResponse } from "@/lib/utils";
import { BillboardFormSchema } from "@/lib/zodValidators";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismaDb.billboard.findUnique({
      where: { id: params.billboardId },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    errorResponse("[BILLBOARDS_ID_GET]", error, 500);
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const body = await req.json();
    const { label, imageData } = BillboardFormSchema.parse(body);

    // check if the user is trying to update a billboard in his own store
    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId},
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const billboard = await prismaDb.billboard.update({
      where: {id: params.billboardId},
      data: {
        label,
        imageUrl: imageData.imageUrl,
        imagePublicId: imageData.imagePublicId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    errorResponse("[BILLBOARDS_ID_PATCH]", error, 500);
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    // Make sure the user have a store to be able to delete a billboard
    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const billboard = await prismaDb.billboard.delete({
      where: { id: params.billboardId },
    });

    // delete public key from cloudinary
    await cloudinary.uploader.destroy(billboard.imagePublicId);

    return NextResponse.json(billboard);
  } catch (error) {
    errorResponse("[BILLBOARDS_ID_DELETE]", error, 500);
  }
}

