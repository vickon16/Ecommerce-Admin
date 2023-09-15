import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { errorResponse } from "@/lib/utils";
import { ColorsFormSchema } from "@/lib/zodValidators";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const color = await prismaDb.color.findUnique({
      where: { id: params.colorId},
    });

    return NextResponse.json(color);
  } catch (error) {
    errorResponse("[COLORS_ID_GET]", error, 500)
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const body = await req.json();
    const { name, value } = ColorsFormSchema.parse(body);

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId},
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const color = await prismaDb.color.update({
      where: { id: params.colorId },
      data: { name, value },
    });

    return NextResponse.json(color);
  } catch (error) {
    errorResponse("[COLORS_ID_PATCH]", error, 500)
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: { id: params.storeId, userId},
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const color = await prismaDb.color.delete({
      where: { id: params.colorId },
    });

    return NextResponse.json(color);
  } catch (error) {
    errorResponse("[COLORS_ID_DELETE]", error, 500)
  }
}

