"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Lightbulb, ChevronDown, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { ECOMMERCE_GROUPS } from "@/lib/nav";

interface GlassmorphismNavBarProps {
  className?: string;
}

/**
 * Route-aware glassmorphism navigation (light theme).
 *
 * Een enkele "E-commerce marketing" trigger opent een submenu met twee
 * categorieën (Facebook, Instagram), elk met hun eigen pagina's. De actieve
 * indicator ("lamp") volgt de geselecteerde tab en slipt vanaf de vorige pagina
 * (via sessionStorage) in plaats van altijd vanaf Home.
 *
 * Op hover-devices opent het submenu op hover; op touch-apparaten op klik.
 */
export function GlassmorphismNavBar({ className }: GlassmorphismNavBarProps) {
  // De actieve tab wordt elke render opnieuw uit de URL berekend, zodat die op
  // een volledige page-load direct klopt (geen slide-from-Home flash).
  const activeTab = resolveActive();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [lampOn, setLampOn] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const prev = window.sessionStorage.getItem("nav-active-tab");
    const current = resolveActive();
    return prev && prev !== current ? prev : current;
  });
  const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
  const rootRef = useRef<HTMLDivElement>(null);

  function resolveActive(): string {
    if (typeof window === "undefined") return "Home";
    const path = window.location.pathname;
    // E-commerce tak: elke facebook/instagram/e-commerce marketing pagina is actief.
    if (
      path.startsWith("/facebook-marketing/") ||
      path.startsWith("/instagram-marketing/") ||
      path === "/e-commerce-marketing/"
    ) {
      return "E-commerce marketing";
    }
    if (path === "/") return "Home";
    if (path.startsWith("/inzichten/")) return "Inzichten";
    if (path.startsWith("/over/")) return "Over";
    return "Home";
  }

  // Onthoud de actieve tab voor de volgende page-load, en laat de lamp daar
  // naartoe glijden (vanaf de vorige tab in sessionStorage).
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem("nav-active-tab", activeTab);
    setLampOn(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const toggleMenu = (name: string) => setOpenMenu((prev) => (prev === name ? null : name));

  interface ListItem {
    label: string;
    url: string;
    icon: React.ElementType;
    groups?: typeof ECOMMERCE_GROUPS;
  }

  const listItems: ListItem[] = [
    { label: "Home", url: "/", icon: Home },
    { label: "E-commerce marketing", url: "/facebook-marketing/", icon: Store, groups: ECOMMERCE_GROUPS },
    { label: "Inzichten", url: "/inzichten/", icon: Lightbulb },
    { label: "Over", url: "/over/", icon: User },
  ];

  return (
    <div
      ref={rootRef}
      className={cn("fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6", className)}
    >
      <div
        className="flex items-center gap-3 py-1 px-1 rounded-full shadow-lg transition-all duration-300 bg-background/30 border border-black/5"
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        {listItems.map((item) => {
          const Icon = item.icon;
          const groups = item.groups;
          const hasChildren = !!groups && groups.length > 0;
          const isActive = activeTab === item.label;
          const isOpen = openMenu === item.label;
          const isLamp = lampOn === item.label;
          const padX = hasChildren ? "px-6" : "px-6";

          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={hasChildren && canHover ? () => setOpenMenu(item.label) : undefined}
              onMouseLeave={hasChildren && canHover ? () => setOpenMenu(null) : undefined}
            >
              <a
                href={item.url}
                aria-current={isActive ? "page" : undefined}
                aria-expanded={hasChildren ? isOpen : undefined}
                aria-haspopup={hasChildren ? "true" : undefined}
                onClick={hasChildren && !canHover ? (e) => { e.preventDefault(); toggleMenu(item.label); } : undefined}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold rounded-full transition-all duration-300 text-foreground/80 hover:text-primary inline-flex items-center gap-1.5 py-2",
                  padX,
                  isActive && "bg-black/5 text-primary"
                )}
              >
                <span className="hidden md:inline-flex items-center gap-1.5">
                  {item.label}
                  {hasChildren && (
                    <ChevronDown size={14} strokeWidth={2.5} className={cn("transition-transform", isOpen && "rotate-180")} />
                  )}
                </span>
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                {isLamp && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full rounded-full -z-10 bg-primary/5"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-primary">
                      <div className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-2 bg-primary/20" />
                      <div className="absolute w-8 h-6 rounded-full blur-md -top-1 bg-primary/20" />
                      <div className="absolute w-4 h-4 rounded-full blur-sm top-0 left-2 bg-primary/20" />
                    </div>
                  </motion.div>
                )}
              </a>

              <AnimatePresence>
                {hasChildren && isOpen && (
                  <>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full h-3 w-[560px]" />
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.75rem)] min-w-[560px] rounded-2xl bg-white shadow-xl border border-black/5 overflow-hidden"
                    >
                      <div className="grid grid-cols-3 gap-0">
                        {groups!.map((group) => (
                          <div key={group.label} className="p-2">
                            <a
                              href={group.href}
                              className="block px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-foreground hover:text-primary transition-colors"
                            >
                              {group.label}
                            </a>
                                                                                    {group.links.map((link) => {
                              const childActive =
                                typeof window !== "undefined" && window.location.pathname === link.href;
                              return (
                                <a
                                  key={link.href}
                                  href={link.href}
                                  className={cn(
                                    "block px-3 py-1.5 text-sm font-medium text-foreground/70 hover:bg-black/5 hover:text-primary rounded-lg transition-colors whitespace-nowrap",
                                    childActive && "bg-black/5 text-primary font-semibold"
                                  )}
                                >
                                  {link.label}
                                </a>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GlassmorphismNavBar;