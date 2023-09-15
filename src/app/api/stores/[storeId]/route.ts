import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { errorResponse } from "@/lib/utils";
import { FormNameSchema } from "@/lib/zodValidators";

export async function PATCH(
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
    const { name } = FormNameSchema.parse(body);

    const store = await prismaDb.store.updateMany({
      where: {id: params.storeId, userId},
      data: {name},
    });

    return NextResponse.json(store);
  } catch (error) {
    errorResponse("[STORE_PATCH]", error, 500)
  }
}

export async function DELETE(
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

    const store = await prismaDb.store.deleteMany({
      where: { id: params.storeId, userId },
    });

    return NextResponse.json(store);
  } catch (error) {
    errorResponse("[STORE_DELETE]", error, 500)
  }
}
