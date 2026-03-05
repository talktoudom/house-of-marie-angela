import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/admin/login");

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/newsletter", label: "Newsletter" },
    { href: "/admin/messages", label: "Messages" },
  ];

  return (
    <div className="min-h-screen flex bg-[#faf8f6]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#eee] flex flex-col">
        {/* Top meta (NO brand name here) */}
        <div className="px-6 pt-6 pb-4 border-b border-[#f2f2f2]">
          <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase">
            Admin Interface
          </p>
        </div>

        {/* Navigation (adjusted padding so items are always visible) */}
        <nav className="flex-1 px-6 py-5 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block text-sm tracking-wide text-gray-600 hover:text-black transition-colors"
            >
              <span className="relative inline-block">
                {item.label}
                <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-brand-fuchsia transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-6 py-5 border-t border-[#f2f2f2]">
          {/* Keep your existing logout endpoint if you already wired one.
              If you don't have /auth/logout, tell me what route you use. */}
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="text-xs tracking-[0.2em] uppercase text-gray-400 hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-10 py-10 overflow-y-auto">{children}</main>
    </div>
  );
}