"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/loadingSpinner";
import { forgotPassword } from "../utils/apiUtils/auth";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // handle submit
    try {
      const result = await forgotPassword(email);
      setLoading(false);
      if (result.success) {
        toast.success(result.data);
      } else {
        toast.error(result.errors[0].msg);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong. Try again later");
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      <nav className='hidden md:flex justify-end items-center gap-4 p-2'>
        <p className='text-gray-600'>{"Don't"} have an account?</p>
        <Link
          className='border border-gray-500 rounded-sm py-2 px-4 text-sm hover:shadow hover:bg-gray-50 duration-150 '
          href='/signup'
        >
          Sign up
        </Link>{" "}
      </nav>
      <div className='flex flex-col align-center max-w-xs mx-auto md:mt-20  h-screen  p-2'>
        <div className='p-4 text-center'>
          <Link href='/'>
            <h2 className='text-3xl mb-4 font-semibold'>Pollapex</h2>
          </Link>
          <h4 className='text-xl text-gray-500'>Forgot password?</h4>
        </div>

        <form className='p-4 mb-4' onSubmit={onSubmit}>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-semibold mb-2'
              htmlFor='email'
            >
              Email
            </label>
            <input
              className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='email'
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder='zenitsu@swordsmen.com'
            />
          </div>

          <p className='text-gray-700 text-sm mb-6'>
            Type the address linked to your account and {"we'll"} send you
            password reset instructions. They might end up in your spam folder,
            so please check there as well.
          </p>

          <div className='flex items-center justify-between'>
            <input
              className='bg-black w-full cursor-pointer hover:-translate-y-1 transition duration-200 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='submit'
              value='Send instructions'
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
