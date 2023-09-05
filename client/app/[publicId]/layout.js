import Link from "next/link";

// export const metadata = {
//   title: "Fill Survey | Pollapex",
// };

import { Lora } from "next/font/google";

const inter = Lora({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const PublicResponseLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-orange-50 flex flex-col'>
      <div>{children}</div>
      <div className='text-center mb-8 mt-auto'>
        <hr className='mb-4' />
        <Link href='/'>
          <h1 className={`text-3xl font-semibold  ${inter.className}`}>
            Pollapex
          </h1>
        </Link>{" "}
      </div>
    </div>
  );
};

export default PublicResponseLayout;
