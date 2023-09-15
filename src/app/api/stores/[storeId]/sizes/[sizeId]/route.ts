import { NextResponse } from "next/server";

import prismaDb from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { errorResponse } from "@/lib/utils";
import { SizesFormSchema } from "@/lib/zodValidators";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await prismaDb.size.findUnique({
      where: { id: params.sizeId},
    });

    return NextResponse.json(size);
  } catch (error) {
    errorResponse("[SIZES_GET]", error, 500)
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId},
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const size = await prismaDb.size.delete({
      where: { id: params.sizeId},
    });

    return NextResponse.json(size);
  } catch (error) {
    errorResponse("[SIZES_DELETE]", error, 500)

  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const body = await req.json();
    const { name, value } = SizesFormSchema.parse(body);

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId},
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const size = await prismaDb.size.update({
      where: { id: params.sizeId},
      data: { name, value},
    });

    return NextResponse.json(size);
  } catch (error) {
    errorResponse("[SIZES_PATCH]", error, 500)
  }
}
