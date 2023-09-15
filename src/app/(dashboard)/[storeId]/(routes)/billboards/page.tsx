import { format } from "date-fns";

import prismaDb from "@/lib/prismaDb";

import { BillboardColumn } from "@/components/billboards/billboardColumns";
import BillboardClient from "@/components/billboards/BillboardClient";
import { FC } from "react";

interface BillBoardPageProps {
  params: {
    storeId: string;
  };
}

const BillboardsPage: FC<BillBoardPageProps> = async ({ params }) => {
  const billboards = await prismaDb.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  });

  // billboards && console.log(billboards);

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return <BillboardClient data={formattedBillboards} />;
};

export default BillboardsPage;
