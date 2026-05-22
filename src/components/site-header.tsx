import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AuthButton } from "@/components/auth-button";

const nav = [
  { href: "/search", label: "Kërko" },
  { href: "/rankings", label: "Renditje" },
  { href: "/create", label: "Krijo vend" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#fbfbf9]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#c91f37] text-white">
            <ShieldCheck size={20} />
          </span>
          <span>
            <span className="block text-lg font-semibold leading-5">
              Vlereso
            </span>
            <span className="hidden text-xs text-stone-500 sm:block">
              Vlerësime të verifikuara
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <AuthButton />
      </div>
    </header>
  );
}
