import prismaDb from "@/lib/prismaDb";

import CategoryForm from "@/components/categories/CategoryForm";
import { FC } from "react";

interface CategoryIdPageProps {
  params: { categoryId: string; storeId: string };
}

const CategoryIdPage : FC<CategoryIdPageProps> = async ({ params }) => {
  // get the category with the particular Id
  const category = await prismaDb.category.findUnique({
    where: {id: params.categoryId},
  });

  // get all the billboards in that store.
  const billboards = await prismaDb.billboard.findMany({
    where: {storeId: params.storeId},
  });

  return <CategoryForm billboards={billboards} categoryData={category} />;
};

export default CategoryIdPage;
