"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Lora } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import NotificationDropdown from "./notificationDropdown";
import { usePathname } from "next/navigation";
import { BiMenu } from "react-icons/bi";

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
    <nav className='mx-auto p-4 md:px-6 flex items-center justify-between'>
      <div className='flex items-center '>
        <Link href='/'>
          <h1
            className={`text-[28px] md:text-3xl -mt-1 font-semibold  ${inter.className}`}
          >
            Pollapex
          </h1>
        </Link>

        {status === "authenticated" && (
          <>
            <div className='hidden md:flex items-center gap-4 bg-inherit ml-8 text-gray-500 font-medium hover:text-gray-600 transition-colors duration-150 ease-in-out'>
              <Link
                href='/dashboard'
                className={pathname === "/dashboard" ? "text-blue-600" : ""}
              >
                Dashboard
              </Link>
              <Link
                href='/surveys'
                className={pathname === "/surveys" ? "text-blue-600" : ""}
              >
                Surveys
              </Link>
              <Link
                href='/responses'
                className={pathname === "/responses" ? "text-blue-600" : ""}
              >
                Responses
              </Link>
            </div>
          </>
        )}
      </div>

      {status === "authenticated" && (
        <>
          <BiMenu
            size={32}
            className='md:hidden text-gray-800 font-thin cursor-pointer hover:text-gray-900'
            onClick={toggleMenu}
          />
          <div
            className={`md:hidden fixed top-0 left-0 h-full w-56 bg-white border-r transition-transform duration-300 transform ${
              showMenu ? "translate-x-0" : "-translate-x-56"
            }`}
          >
            <div className='p-4'>
              <button
                onClick={toggleMenu}
                className='text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                  ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </button>
            </div>
            <nav className='p-4'>
              <ul>
                <li>
                  <Link
                    href='/dashboard'
                    className='block py-2 text-gray-600 hover:text-gray-800'
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href='/surveys'
                    className='block py-2 text-gray-600 hover:text-gray-800'
                  >
                    Surveys
                  </Link>
                </li>
                <li>
                  <Link
                    href='/responses'
                    className='block py-2 text-gray-600 hover:text-gray-800'
                  >
                    Responses
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}

      <ul className='flex items-center ml-auto gap-2'>
        {/* {status === "loading" && (
          <button className='bg-white text-gray-800 border border-gray-200 py-2 px-4 rounded-full flex items-center justify-center space-x-2'>
            <span className='animate-spin h-5 w-5 border-t-2 border-b-2 border-gray-800 rounded-full'></span>
            <span>Login</span>
          </button>
        )} */}

        {(status === "unauthenticated" || status === "loading") && (
          <>
            <li>
              <Link
                className='py-2.5 px-5 rounded-md border border-black hover:bg-gray-100 hover:shadow'
                href='/login'
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                className='py-2.5 px-5 rounded-md bg-black text-white hover:bg-gray-800 hover:shadow'
                href='/signup'
              >
                Sign up
              </Link>
            </li>
          </>
        )}

        {status === "authenticated" && (
          <div className='flex items-center gap-4 md:gap-6'>
            <NotificationDropdown />
            <div className='relative inline-block text-left' ref={dropdownRef}>
              <div className='flex items-center gap-4'>
                <button
                  type='button'
                  onClick={toggleDropdown}
                  aria-expanded={isOpen}
                  aria-haspopup='true'
                >
                  <Image
                    src={data?.user?.picture}
                    alt='profile picture'
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                </button>
              </div>
              {isOpen && (
                <div
                  className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='dropdown-button'
                >
                  <div className='py-1' role='none'>
                    <Link
                      href='/invitations'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      role='menuitem'
                    >
                      Invitations
                    </Link>
                    <Link
                      href='/dashboard/profile'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      role='menuitem'
                    >
                      Account
                    </Link>
                    <button
                      className='inline-block w-full text-left text-red-600 font-medium px-4 py-2 text-sm hover:text-red-700 hover:bg-gray-100'
                      onClick={() => signOut()}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Header;
