import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";

import { FC } from "react";
import { SettingsForm } from "@/components/SettingsForm";

interface SettingPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: FC<SettingPageProps> = async ({ params }) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const store = await prismaDb.store.findFirst({
    where: { id: params.storeId, userId },
  });

  if (!store) redirect("/");

  return <SettingsForm storeData={store} />;
};

export default SettingsPage;
