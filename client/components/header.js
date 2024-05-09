"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Lora } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import NotificationLink from "./notificationLink";
import { usePathname } from "next/navigation";

const inter = Lora({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Header = () => {
  const { data, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  // Navigation menu
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  // Get pathname
  const pathname = usePathname();

  useEffect(() => {
    window.addEventListener("click", closeDropdown);

    return () => {
      window.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <nav className="mx-auto p-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center ">
        <Link href="/">
          <h1
            className={`text-[28px] md:text-3xl -mt-1 font-semibold  ${inter.className}`}
          >
            Pollapex
          </h1>
        </Link>

        {/* Nav auth links - desktop */}
        {status === "authenticated" && (
          <div className="hidden md:flex items-center gap-4 bg-inherit ml-8 text-gray-500 font-medium hover:text-gray-600 transition-colors duration-150 ease-in-out">
            <Link
              href="/dashboard"
              className={pathname === "/dashboard" ? "text-blue-600" : ""}
            >
              Dashboard
            </Link>
            <Link
              href="/surveys"
              className={pathname === "/surveys" ? "text-blue-600" : ""}
            >
              Surveys
            </Link>
            <Link
              href="/responses"
              className={pathname === "/responses" ? "text-blue-600" : ""}
            >
              Responses
            </Link>
          </div>
        )}
      </div>

      {/* Unauthenticated links */}
      {(status === "unauthenticated" || status === "loading") && (
        <ul className="flex items-center ml-auto gap-2">
          <li>
            <Link
              className="py-2.5 px-5 rounded-md border border-black hover:bg-gray-100 hover:shadow"
              href="/login"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              className="py-2.5 px-5 rounded-md bg-black text-white hover:bg-gray-800 hover:shadow"
              href="/signup"
            >
              Sign up
            </Link>
          </li>
        </ul>
      )}

      {/* Profile dropdown */}
      {status === "authenticated" && (
        <div className="flex items-center ml-auto gap-2">
          <div className="flex items-center gap-4 md:gap-6">
            <NotificationLink />
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <Image
                    src={data?.user?.picture}
                    alt="profile picture"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </button>
              </div>
              {isOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="dropdown-button"
                >
                  <ul className="py-1" role="none">
                    <li>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li className="md:hidden">
                      <Link
                        href="/surveys"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Surveys
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        Account
                      </Link>
                    </li>
                    <li>
                      <button
                        className="inline-block w-full text-left text-red-600 font-medium px-4 py-2 text-sm hover:text-red-700 hover:bg-gray-100"
                        onClick={() => signOut()}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
