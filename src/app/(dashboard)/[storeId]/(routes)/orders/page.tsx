import { format } from "date-fns";

import prismaDb from "@/lib/prismaDb";
import { FC } from "react";
import { OrdersColumn } from "@/components/orders/ordersColumn";
import OrdersClient from "@/components/orders/OrdersClient";
import { formatter } from "@/lib/utils";

interface OrdersPageProps {
  params: {
    storeId: string;
  };
}

const OrdersPage: FC<OrdersPageProps> = async ({ params }) => {
  const orders = await prismaDb.order.findMany({
    where: { storeId: params.storeId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrdersColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return <OrdersClient data={formattedOrders} />;
};

export default OrdersPage;
