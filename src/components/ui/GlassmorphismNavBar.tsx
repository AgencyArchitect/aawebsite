"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, MessageCircle, Camera, Lightbulb, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavChild {
  name: string;
  url: string;
}

export interface NavItem {
  name: string;
  url: string;
  icon: React.ElementType;
  children?: NavChild[];
}

interface GlassmorphismNavBarProps {
  items?: NavItem[];
  className?: string;
}

/**
 * Route-aware glassmorphism navigation (light theme). The active tab is derived
 * from the current path on mount and follows clicks afterwards. Framer Motion
 * drives the animated "lamp" pill; lucide-react provides the icons.
 *
 * Items with a `children` array render as an expandable dropdown. The hover
 * handlers live on the wrapping <div> (which contains both the pill link and
 * the dropdown panel), so moving the cursor from the link down into the panel
 * keeps the dropdown open instead of closing it.
 */
export function GlassmorphismNavBar({
  items = [
    { name: "Home", url: "/", icon: Home },
    {
      name: "Facebook",
      url: "/facebook-marketing/",
      icon: MessageCircle,
      children: [
        { name: "Facebook marketing", url: "/facebook-marketing/" },
        { name: "Facebook strategie", url: "/facebook-marketing/strategie/" },
        { name: "Facebook advertising", url: "/facebook-marketing/adverteren/" },
        { name: "Facebook funnels", url: "/facebook-marketing/funnels/" },
        { name: "Facebook copywriting", url: "/facebook-marketing/copywriting/" },
        { name: "Facebook organisch", url: "/facebook-marketing/organisch/" },
      ],
    },
    {
      name: "Instagram",
      url: "/instagram-marketing/",
      icon: Camera,
      children: [
        { name: "Instagram marketing", url: "/instagram-marketing/" },
        { name: "Instagram strategie", url: "/instagram-marketing/strategie/" },
        { name: "Instagram advertising", url: "/instagram-marketing/adverteren/" },
        { name: "Instagram funnels", url: "/instagram-marketing/funnels/" },
        { name: "Instagram copywriting", url: "/instagram-marketing/copywriting/" },
        { name: "Instagram organisch", url: "/instagram-marketing/organisch/" },
      ],
    },
    { name: "Inzichten", url: "/inzichten/", icon: Lightbulb },
    { name: "Over", url: "/over/", icon: User },
  ],
  className,
}: GlassmorphismNavBarProps) {
  // Resolve the active tab synchronously from the current URL so the lamp is
  // already on the right tab at first paint (no slide-from-Home flash).
  const resolveActive = (): string => {
    if (typeof window === "undefined") return items[0]?.name ?? "";
    const path = window.location.pathname;
    const matches = items
      .filter((item) => item.url !== "#")
      .filter((item) => (item.url === "/" ? path === "/" : path.startsWith(item.url)))
      .sort((a, b) => b.url.length - a.url.length);
    return matches[0]?.name ?? items[0]?.name ?? "";
  };

  const [activeTab, setActiveTab] = useState<string>(() => resolveActive());
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // The lamp animates from the PREVIOUS page's active tab (remembered in
  // sessionStorage) to the current one, so on navigation it slides from where
  // the user actually was — not from Home every time.
  const [lampOn, setLampOn] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const prev = window.sessionStorage.getItem("nav-active-tab");
    const current = resolveActive();
    return prev && prev !== current ? prev : current;
  });

  // Whether the device supports hover. On hover devices the dropdown opens on
  // hover and a click on the parent navigates normally; on touch devices (no
  // hover) the click toggles the dropdown open.
  const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
  const rootRef = useRef<HTMLDivElement>(null);

  // Remember the active tab for the next page load, then move the lamp from
  // the remembered position to the current one.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem("nav-active-tab", activeTab);
    setLampOn(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Close the dropdown when clicking outside the nav.
  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
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

  const toggleMenu = (name: string) => {
    setOpenMenu((prev) => (prev === name ? null : name));
  };

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
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          // The lamp tracks `lampOn` (the slide position). On first paint after a
          // navigation it sits on the previous page's tab, then animates to the
          // current one via framer-motion's shared layoutId.
          const isLamp = lampOn === item.name;
          const isOpen = openMenu === item.name;
          const hasChildren = !!item.children?.length;

          // Items with a dropdown get a bit more room so the active glass pill
          // wraps the label plus the chevron, instead of cramping it.
          const padX = hasChildren ? "px-7" : "px-6";

          return (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={hasChildren && canHover ? () => setOpenMenu(item.name) : undefined}
              onMouseLeave={hasChildren && canHover ? () => setOpenMenu(null) : undefined}
            >
              <a
                href={item.url}
                aria-current={isActive ? "page" : undefined}
                aria-expanded={hasChildren ? isOpen : undefined}
                aria-haspopup={hasChildren ? "true" : undefined}
                onClick={
                  hasChildren && !canHover
                    ? (e) => {
                        e.preventDefault();
                        toggleMenu(item.name);
                      }
                    : undefined
                }
                className={cn(
                  "relative cursor-pointer text-sm font-semibold rounded-full transition-all duration-300 text-foreground/80 hover:text-primary",
                  padX,
                  "py-2",
                  isActive && "bg-black/5 text-primary"
                )}
              >
                <span className="hidden md:inline-flex items-center gap-1.5">
                  {item.name}
                  {hasChildren && (
                    <ChevronDown
                      size={14}
                      strokeWidth={2.5}
                      className={cn("transition-transform", isOpen && "rotate-180")}
                    />
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
                    {/* Invisible bridge that keeps the menu open while the
                        cursor crosses the gap between the pill and the panel. */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full h-3 w-[220px]" />
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.75rem)] min-w-[220px] rounded-2xl bg-white shadow-xl border border-black/5 overflow-hidden"
                    >
                      {item.children!.map((child) => {
                        const childActive =
                          typeof window !== "undefined" && window.location.pathname === child.url;
                        return (
                          <a
                            key={child.name}
                            href={child.url}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                              "block px-5 py-2.5 text-sm font-medium text-foreground/80 hover:bg-black/5 hover:text-primary transition-colors whitespace-nowrap",
                              childActive && "bg-black/5 text-primary"
                            )}
                          >
                            {child.name}
                          </a>
                        );
                      })}
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
