"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { routes } from "@/lib/data";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6 flex-wrap", className)}
      {...props}
    >
      {routes.map((route) => {
        const routeHref = `/${params.storeId}${route.href}`;

        return (
          <Link
            key={route.label}
            href={routeHref}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === routeHref
                ? "!text-black/80 font-semibold dark:text-white"
                : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
