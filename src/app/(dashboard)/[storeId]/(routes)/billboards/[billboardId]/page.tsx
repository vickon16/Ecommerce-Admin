import prismaDb from "@/lib/prismaDb";

import BillboardForm from "@/components/billboards/BillboardForm";
import { FC } from "react";

interface BillBoardPageProps {
  params: {
    billboardId: string;
  };
}

const BillboardPage: FC<BillBoardPageProps> = async ({ params }) => {
  const billboard = await prismaDb.billboard.findUnique({
    where: { id: params.billboardId },
  });

  return <BillboardForm billboardData={billboard} />;
};

export default BillboardPage;
