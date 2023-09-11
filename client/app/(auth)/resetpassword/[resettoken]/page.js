"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/loadingSpinner";
import { resetPassword } from "@/utils/apiUtils/auth";
import { useParams } from "next/navigation";

const ResetPasswordPage = () => {
  const { resettoken } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in the fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    setLoading(true);

    // handle submit
    try {
      const result = await resetPassword(resettoken, password);
      setLoading(false);
      if (result.success) {
        toast.success("Password reset. You can login now!");
      } else {
        toast.error(result.errors[0].msg);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Invalid reset link");
    }
  };

  useEffect(() => {
    console.log(resettoken);
  }, [resettoken]);

  return (
    <div>
      {loading && <LoadingSpinner />}
      <nav className='hidden md:flex justify-end items-center gap-4 p-2'>
        <p className='text-gray-600'>Log back in</p>
        <Link
          className='border border-gray-500 rounded-sm py-2 px-4 text-sm hover:shadow hover:bg-gray-50 duration-150 '
          href='/login'
        >
          Login
        </Link>{" "}
      </nav>
      <div className='flex flex-col align-center max-w-xs mx-auto md:mt-20  h-screen  p-2'>
        <div className='p-4 text-center'>
          <Link href='/'>
            <h2 className='text-3xl mb-4 font-semibold'>Pollapex</h2>
          </Link>
          <h4 className='text-xl text-gray-500'>Reset your password</h4>
        </div>

        <form className='p-4 mb-4' onSubmit={onSubmit}>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-semibold mb-2'
              htmlFor='password'
            >
              Password
            </label>
            <input
              className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder='New Password'
            />
          </div>

          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-semibold mb-2'
              htmlFor='confirmPassword'
            >
              Confirm Password
            </label>
            <input
              className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder='Confirm New Password'
            />
          </div>

          <div className='flex items-center justify-between'>
            <input
              className='bg-black w-full cursor-pointer hover:-translate-y-1 transition duration-200 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='submit'
              value='Reset password'
            />
          </div>

          <hr />
          <Link
            href='forgotpassword'
            className='inline-block my-6 text-gray-600 underline text-center'
          >
            Get a new password reset link{" "}
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
