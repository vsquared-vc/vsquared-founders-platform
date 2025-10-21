"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ClientAuthButton } from "@/components/client-auth-button";

export function Navigation() {
  const pathname = usePathname();
  const isOnFundsPage = pathname === '/funds';

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-none flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"} className="flex items-center">
            <Image
              src="/vsqrd_logo.svg"
              alt="Vsquared Logo"
              width={80}
              height={80}
              className="dark:block hidden"
            />
            <Image
              src="/vsquared_black.png"
              alt="Vsquared Logo"
              width={80}
              height={80}
              className="dark:hidden block"
            />
          </Link>
          <Link href={isOnFundsPage ? "/" : "/funds"} className="text-sm font-normal hover:underline">
            {isOnFundsPage ? "Home" : "Fund Ecosystem"}
          </Link>
        </div>
        <ClientAuthButton />
      </div>
    </nav>
  );
}
