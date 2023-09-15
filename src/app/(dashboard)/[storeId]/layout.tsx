import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { FC } from "react";
import Navbar from "@/components/Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}

const DashboardLayout: FC<DashboardLayoutProps> = async ({
  children,
  params,
}) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in")

  const store = await prismaDb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) redirect("/")

  return (
    <>
      <Navbar />
      <section className="space-y-4 p-8">
        {children}
      </section>
    </>
  );
};

export default DashboardLayout
