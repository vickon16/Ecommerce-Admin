"use client";

import { ColumnDef } from "@tanstack/react-table";
import BillboardCellAction from "@/components/billboards/BillboardCellAction";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <BillboardCellAction billboardData={row.original} />,
  },
];
