import { ColorForm } from "@/components/colors/ColorsForm";
import prismaDb from "@/lib/prismaDb";
import { FC } from "react";

interface ColorsIdPageProps {
  params: {
    colorId: string;
  };
}

const ColorsIdPage: FC<ColorsIdPageProps> = async ({ params }) => {
  const color = await prismaDb.color.findUnique({
    where: { id: params.colorId },
  });

  return <ColorForm colorsData={color} />;
};

export default ColorsIdPage;
