export const metadata = {
  title: "Sign up | Pollapex",
};
import Image from "next/image";

const LoginLayout = ({ children }) => {
  return (
    <div className='grid grid-cols-7'>
      <div className='hidden col-span-3 p-4 z-0 bg-black h-screen md:flex flex-col items-center justify-center text-white'>
        <h2 className='mb-8 text-4xl text-center leading-10 -mt-6'>
          Sign up <span className='block'>and come on in</span>
        </h2>
        <Image
          className='block my-4 rounded-md shadow-2xl shadow-gray-800'
          width={360}
          height={310}
          src='/img/survey.avif'
          alt='papers data'
        />
        <p className='absolute bottom-10'>&copy; Pollapex</p>
      </div>
      <div className='col-span-7 md:col-span-4  p-3 z-10 rounded-lg'>
        {children}
      </div>
    </div>
  );
};

export default LoginLayout;
