"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import LoadingSpinner from "@/components/loadingSpinner";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      toast.error("Please enter your name");
      return;
    }
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    setLoading(true);

    // handle submit
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.errors) {
      data.errors.map((err) => toast.error(err.msg));
      setLoading(false);
    } else if (data.success) {
      setLoading(false);
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    }
  };

  const { data: session } = useSession({});

  useEffect(() => {
    if (session?.user) {
      redirect("/dashboard");
    }
  }, [session]);

  return (
    <>
      {loading && <LoadingSpinner />}

      <nav className='hidden md:flex justify-end items-center gap-4'>
        <p className='text-gray-600'>Already have an account?</p>
        <Link
          className='border border-gray-500 rounded-sm py-2 px-4 text-sm hover:shadow hover:bg-gray-50 duration-150 '
          href='/login'
        >
          Login
        </Link>{" "}
      </nav>

      <div className='mb-10 md:mb-auto flex flex-col align-center max-w-xl mx-auto md:-mt-16 h-screen justify-center p-2'>
        <div className='p-2 md:p-4 text-center'>
          <Link href='/'>
            <h2 className='text-3xl mb-4 font-semibold'>Pollapex</h2>
          </Link>
          <h4 className='text-xl md:text-2xl text-gray-500'>
            Enhance your data collection with interactive conversational surveys
            and more
          </h4>
        </div>

        <form className='p-4 mb-4 max-w-xs mx-auto' onSubmit={onSubmit}>
          <div className='mb-4'>
            <label
              className='block text-gray-700 text-sm font-semibold mb-2'
              htmlFor='name'
            >
              Full name
            </label>
            <input
              className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='name'
              type='text'
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='Zenitsu Agatsuma'
            />
          </div>

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
              value='Sign up to Pollapex'
            />
          </div>
        </form>

        <hr />

        <p className='md:hidden text-center text-gray-400 mt-2 text-sm'>
          Already have an account?{" "}
          <Link className='text-gray-500 underline' href='/login'>
            Log in
          </Link>
        </p>
      </div>
    </>
  );
};

export default Signup;
