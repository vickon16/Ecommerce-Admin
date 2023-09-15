import { NextResponse } from "next/server";

import { errorResponse } from "@/lib/utils";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const {searchParams} = new URL(req.url)
  const imagePublicId = searchParams.get("imagePublicId") as string;
  try {
    await cloudinary.uploader.destroy(imagePublicId);
    return new NextResponse("Deleted Successfully");
  } catch (error) {
    errorResponse("[DELETE-CLOUDINARY-IMAGE]", error, 500)
  }
}