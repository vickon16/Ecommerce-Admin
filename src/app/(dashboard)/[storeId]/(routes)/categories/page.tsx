import { format } from "date-fns";

import prismaDb from "@/lib/prismaDb";

import type { CategoryColumn } from "@/components/categories/categoriesColumns";
import { CategoriesClient } from "@/components/categories/CategoriesClient";
import { FC } from "react";

interface CategoriesPageProps {
  params: {
    storeId: string;
  };
}

const CategoriesPage: FC<CategoriesPageProps> = async ({ params }) => {
  const categories = await prismaDb.category.findMany({
    where: { storeId: params.storeId },
    include: { billboard: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return <CategoriesClient data={formattedCategories} />;
};

export default CategoriesPage;
