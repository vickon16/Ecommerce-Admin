"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, OrdersColumn } from "./ordersColumn";
import { DataTable } from "../ui/data-table";
import { FC } from "react";

interface OrderClientProps {
  data: OrdersColumn[];
}

const OrdersClient: FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};

export default OrdersClient;
