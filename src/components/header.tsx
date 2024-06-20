"use client";

import {cn} from "@/lib/cn";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {HomeIcon} from "./icons";

const Header = () => {
  const linkClassName =
    "px-6 pt-3.5 pb-2.5 rounded-full text-xl text-white shadow-md text-center bg-gray-300 h-12 flex items-center border-b-4 border-b-transparent transition-colors";

  const pathname = usePathname();

  return (
    <header className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 w-[360px] max-w-full shadow-lg border border-neutral-200 rounded-full">
      <div className="flex items-center justify-center gap-3 w-full">
        <Link
          href={"/"}
          className={cn(linkClassName, "bg-primary", {
            "border-b-black/40": pathname === "/",
          })}
        >
          <div className="w-6 h-6">
            <HomeIcon />
          </div>
        </Link>
        <Link
          href={"/trivia"}
          className={cn(linkClassName, "bg-yellow-500 border-b-transparent transition-colors", {
            "border-b-black/40": pathname === "/trivia",
          })}
        >
          Trivia
        </Link>
        <div className={cn(linkClassName, "")}>Coming Soon</div>
      </div>
    </header>
  );
};

export default Header;
