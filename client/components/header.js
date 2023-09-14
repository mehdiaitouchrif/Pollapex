"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Lora } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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

  useEffect(() => {
    window.addEventListener("click", closeDropdown);
    return () => {
      window.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <nav className='mx-auto p-4 md:px-6 flex items-center justify-between'>
      <Link href='/'>
        <h1
          className={`text-[28px] md:text-3xl font-semibold  ${inter.className}`}
        >
          Pollapex
        </h1>
      </Link>

      <ul className='flex items-center ml-auto gap-2'>
        {status === "loading" && (
          <button className='bg-white text-gray-800 border border-gray-200 py-2 px-4 rounded-full flex items-center justify-center space-x-2'>
            <span className='animate-spin h-5 w-5 border-t-2 border-b-2 border-gray-800 rounded-full'></span>
            <span>Login</span>
          </button>
        )}

        {status === "unauthenticated" && (
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
          <div className='relative inline-block text-left' ref={dropdownRef}>
            <div className='flex items-center gap-4'>
              <p>{data?.user?.name} </p>
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
                    href='/dashboard'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    role='menuitem'
                  >
                    Dashboard
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
        )}
      </ul>
    </nav>
  );
};

export default Header;
