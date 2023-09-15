import { format } from "date-fns";

import prismaDb from "@/lib/prismaDb";
import { FC } from "react";
import { ColorsColumn } from "@/components/colors/colorsColumn";
import ColorsClient from "@/components/colors/ColorsClient";

interface ColorsPageProps {
  params: {
    storeId: string;
  };
}

const ColorsPage: FC<ColorsPageProps> = async ({ params }) => {
  const colors = await prismaDb.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedColors: ColorsColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return <ColorsClient data={formattedColors} />;
};

export default ColorsPage;
