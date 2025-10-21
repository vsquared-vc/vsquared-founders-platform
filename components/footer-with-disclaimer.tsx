"use client";

import Link from "next/link";
import { DisclaimerModal } from "@/components/disclaimer-modal";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function FooterWithDisclaimer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>
        Powered by{" "}
        <a
          href="https://vsquared.vc"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Vsquared
        </a>
      </p>
      <DisclaimerModal>
        <button className="text-muted-foreground hover:text-foreground underline underline-offset-4 bg-transparent border-none cursor-pointer">
          Disclaimer
        </button>
      </DisclaimerModal>
      <ThemeSwitcher />
    </footer>
  );
}
