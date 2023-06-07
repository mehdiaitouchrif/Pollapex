import Link from "next/link";

import { Lora } from "next/font/google";

const inter = Lora({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Header = () => {
  return (
    <nav className='p-6 lg:px-24 flex items-center container mx-auto'>
      <Link href='/' className='hover:shadow-inner'>
        <h1 className={`text-3xl font-semibold  ${inter.className}`}>
          Pollapex
        </h1>
      </Link>
      <ul className='flex items-center ml-auto gap-2'>
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
      </ul>
    </nav>
  );
};

export default Header;
