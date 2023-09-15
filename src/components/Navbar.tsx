import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import prismaDb from "@/lib/prismaDb";
import { MainNav } from "@/components/MainNav";
import StoreSwitcher from "./StoreSwitcher";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismaDb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="flex h-16 items-center px-4 border-b w-full">
      <StoreSwitcher items={stores} />
      <MainNav className="mx-6" />
      <div className="ml-auto flex items-center space-x-4">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;