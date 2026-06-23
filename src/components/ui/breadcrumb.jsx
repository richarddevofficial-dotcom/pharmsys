"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
      <Link
        href="/dashboard"
        className="hover:text-orange-600 flex items-center gap-1 flex-shrink-0"
      >
        <Home className="h-3 w-3" />
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-orange-600 truncate">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium truncate">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
