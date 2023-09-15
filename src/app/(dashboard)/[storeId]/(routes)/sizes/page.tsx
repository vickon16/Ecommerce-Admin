import { format } from "date-fns";

import prismaDb from "@/lib/prismaDb";
import { SizeColumn } from "@/components/sizes/sizesColumn";
import SizesClient from "@/components/sizes/SizesClient";


const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismaDb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return <SizesClient data={formattedSizes} />;
};

export default SizesPage;
