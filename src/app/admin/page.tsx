import Link from "next/link";
import { AlertTriangle, BadgeCheck, Building2, Flag, Shield } from "lucide-react";

const adminLinks = [
  { href: "/admin/entities", label: "Entities", icon: Building2 },
  { href: "/admin/ratings", label: "Ratings", icon: Shield },
  { href: "/admin/claims", label: "Claims", icon: BadgeCheck },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/fraud", label: "Fraud", icon: AlertTriangle },
];

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Panel bazë për moderim, pretendime, raporte dhe aktivitet të dyshimtë.
        Në Firebase, hyrja kufizohet me role në koleksionin users dhe rules.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {adminLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm hover:border-stone-300"
            >
              <Icon size={22} />
              <div className="mt-3 font-semibold">{item.label}</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
