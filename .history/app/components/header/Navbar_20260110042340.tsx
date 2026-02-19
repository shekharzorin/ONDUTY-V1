"use client";

import Logo from "@/app/images/od_logo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export const navLinks = [
  { name: "Features", id: "#features" },
  { name: "Workflow", id: "#workflow" },
  { name: "Projects", path: "/projects" },
  { name: "Reports", path: "/reports" },
  { name: "Settings", path: "/settings" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const isActivePath = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isNavOpen]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all ${
        isScrolled
          ? "bg-transparent backdrop-blur-sm border-gray-200/50 shadow-lg py-0"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-2 flex items-center justify-between">
        <div className="flex gap-2 lg:gap-3 items-center">
          <Image
            src={Logo}
            alt="Onduty Logo"
            height={60}
            width={60}
            className="flex h-10 w-10 md:h-12 md:w-12 lg:h-15 lg:w-15"
          />
          <h1 className="text-xl md:text-[22px] lg:text-2xl font-bold">
            OnDuty
          </h1>
        </div>

        {/* Desktop Navbar */}
        <nav className="hidden lg:flex gap-6">
          {navLinks.map((item) => {
            // SCROLL ITEM
            if (item.id) {
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative lg:font-semibold xl:font-bold text-lg transition-colors duration-300
                     after:absolute after:left-0 after:-bottom-1 after:h-1
                     after:rounded-full after:bg-(--color-primary)
                     after:w-0 hover:after:w-full after:duration-300"
                >
                  {item.name}
                </button>
              );
            }

            // ROUTE ITEM
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path!}
                className={`relative lg:font-semibold xl:font-bold text-lg transition-colors duration-300
                  after:absolute after:left-0 after:-bottom-1 after:h-1
                  after:rounded-full after:bg-(--color-primary)
                  after:transition-all after:duration-300
                  ${
                    isActive
                      ? "text-(--color-primary) after:w-full"
                      : "after:w-0 hover:after:w-full"
                  }
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-3">
          <Button
            title="Login"
            onClick={() => alert("not yet")}
            className="w-25 p-0 lg:p-3 rounded-full text-xl"
          />

          <div
            onClick={() => setIsNavOpen(true)}
            className="flex p-1 lg:hidden bg-(--color-secondary) rounded-full border-gray-100 border-4 justify-center items-center"
          >
            <MdMenu size={28} className="opacity-10 animate-pulse" />
          </div>

          <AnimatePresence>
            {isNavOpen && (
              <motion.div
                className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-end h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Drawer */}
                <motion.div
                  className="relative w-[70%] md:w-[60%] bg-(--color-sidebar) h-full flex items-center"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  onClick={(e: any) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setIsNavOpen(false)}
                    className="absolute top-7.25 right-4 md:right-8 lg:hidden z-20 flex p-1 bg-(--color-secondary) rounded-full border-gray-100 border-4 justify-center items-center"
                  >
                    <MdClose size={28} className="opacity-10 animate-pulse" />
                  </button>

                  {/* Mobile Navbar */}
                  <nav className="flex flex-col gap-10 p-10 mt-10">
                    {navLinks.map((item) => {
                      if (item.id) {
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              scrollToSection(item.id);
                              setIsNavOpen(false);
                            }}
                            className="text-lg font-semibold md:font-bold text-left"
                          >
                            {item.name}
                          </button>
                        );
                      }

                      const isActive = pathname === item.path;

                      return (
                        <Link
                          key={item.path}
                          href={item.path!}
                          onClick={() => setIsNavOpen(false)}
                          className={`relative text-lg font-semibold md:font-bold
                            ${isActive ? "text-(--color-primary)" : ""}
                          `}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
