"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    // handle submit
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result.error) {
      JSON.parse(result.error).map((err) => toast.error(err.msg));
    } else {
      window.location = "dashboard";
    }
  };

  const { data: session } = useSession({});

  useEffect(() => {
    if (session?.user) {
      redirect("/dashboard");
    }
  }, [session]);

  return (
    <div className='flex flex-col align-center max-w-xs mx-auto -mt-16 h-screen justify-center p-2'>
      <div className='p-4 text-center'>
        <Link href='/'>
          <h2 className='text-3xl mb-4 font-semibold'>Pollapex</h2>
        </Link>
        <h4 className='text-xl text-gray-500'>Hello, who{"'"}s this?</h4>
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
        <div className='mb-6'>
          <label
            className='block text-gray-700 text-sm font-semibold mb-2'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline'
            id='password'
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder='************'
          />
        </div>
        <div className='flex items-center justify-between'>
          <input
            className='bg-black w-full cursor-pointer hover:-translate-y-1 transition duration-200 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
            value='Log in to Pollapex'
          />
        </div>
      </form>

      <p className='text-center text-gray-400 mt-2 text-sm'>
        Don{"'"}t have an account?{" "}
        <Link className='text-gray-500 underline' href='/signup'>
          Sign up
        </Link>{" "}
      </p>
    </div>
  );
};

export default Login;
