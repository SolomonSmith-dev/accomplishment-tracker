"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/log", label: "+ Log" },
  { href: "/history", label: "History" },
  { href: "/resume", label: "Resume" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        height: 36,
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 20,
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 13, marginRight: 12 }}>
        tracker
      </span>
      {links.map(({ href, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              fontSize: 12,
              color: active ? "var(--text)" : "var(--text-muted)",
              borderBottom: active ? "1px solid var(--text)" : "1px solid transparent",
              paddingBottom: 1,
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
