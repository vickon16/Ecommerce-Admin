import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismaDb from "@/lib/prismaDb";
import { FC } from "react";

interface SetupLayoutProps {
  children: React.ReactNode;
}

const SetupLayout: FC<SetupLayoutProps> = async ({ children }) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  // check if the user has any store at all
  const store = await prismaDb.store.findFirst({
    where: { userId },
  });

  // if he does, redirect to the storeid page
  if (store) redirect(`/${store.id}`);

  return <>{children}</>;
};

export default SetupLayout;
