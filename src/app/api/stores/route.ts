import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { FormNameSchema } from "@/lib/zodValidators";
import { errorResponse } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name } = FormNameSchema.parse(body);

    const store = await prismaDb.store.create({
      data: { name, userId },
    });

    return NextResponse.json(store);
  } catch (error) {
    errorResponse("[STORES_POST]", error, 500);
  }
}
