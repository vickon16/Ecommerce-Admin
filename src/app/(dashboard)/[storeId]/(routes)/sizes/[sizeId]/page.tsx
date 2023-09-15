import { SizeForm } from "@/components/sizes/SizesForm";
import prismaDb from "@/lib/prismaDb";


const SizePage = async ({ params }: { params: { sizeId: string } }) => {

  const size = await prismaDb.size.findUnique({
    where: { id: params.sizeId},
  });

  return <SizeForm sizeData={size} />;
};

export default SizePage;
