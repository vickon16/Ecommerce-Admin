import { format } from "date-fns";

import prismaDb from "@/lib/prismaDb";
import { formatter } from "@/lib/utils";

import { FC } from "react";
import { ProductsColumn } from "@/components/products/productColumn";
import ProductsClient from "@/components/products/ProductsClient";

interface ProductsPageProps {
  params: {
    storeId: string;
  };
}

const ProductsPage: FC<ProductsPageProps> = async ({ params }) => {

  const products = await prismaDb.product.findMany({
    where: { storeId: params.storeId },
    include: { category: true, size: true, color: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts: ProductsColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return <ProductsClient data={formattedProducts} />;
};

export default ProductsPage;
