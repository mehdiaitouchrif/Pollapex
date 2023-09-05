"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Lora } from "next/font/google";

const inter = Lora({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Header = () => {
  const { status } = useSession();

  return (
    <nav className='p-4 md:px-8 flex items-center xl:container mx-auto'>
      <Link href='/'>
        <h1
          className={`text-2xl md:text-3xl font-semibold  ${inter.className}`}
        >
          Pollapex
        </h1>
      </Link>
      <ul className='flex items-center ml-auto gap-2'>
        {status === "loading" && (
          <button className='bg-white text-gray-800 border border-gray-200 py-2 px-4 rounded-full flex items-center justify-center space-x-2'>
            <span className='animate-spin h-5 w-5 border-t-2 border-b-2 border-gray-800 rounded-full'></span>
            <span>Loading</span>
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
          <>
            <li>
              <Link
                className='py-2.5 px-5 rounded-md hover:underline hover:text-black'
                href='/dashboard'
              >
                Dashboard
              </Link>
              <button
                className='py-2.5 px-5 rounded-md bg-black text-white hover:bg-gray-800 hover:shadow'
                onClick={() => signOut()}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
