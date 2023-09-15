import prismaDb from "@/lib/prismaDb";

import ProductsForm from "@/components/products/ProductsForm";
import { FC } from "react";

interface ProductsIdPageProps {
  params: { productId: string; storeId: string };
}

const ProductsIdPage: FC<ProductsIdPageProps> = async ({ params }) => {
  const product = await prismaDb.product.findUnique({
    where: { id: params.productId },
    include: { images: true },
  });

  const categories = await prismaDb.category.findMany({
    where: { storeId: params.storeId },
  });

  const sizes = await prismaDb.size.findMany({
    where: { storeId: params.storeId },
  });

  const colors = await prismaDb.color.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <ProductsForm
      categories={categories}
      colors={colors}
      sizes={sizes}
      productsData={product}
    />
  );
};

export default ProductsIdPage;
