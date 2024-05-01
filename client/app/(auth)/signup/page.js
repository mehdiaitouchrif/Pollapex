"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import LoadingSpinner from "@/components/loadingSpinner";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Hide / show password
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
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

      <nav className="hidden md:flex justify-end items-center gap-4">
        <p className="text-gray-600">Already have an account?</p>
        <Link
          className="border border-gray-500 rounded-sm py-2 px-4 text-sm hover:shadow hover:bg-gray-50 duration-150 "
          href="/login"
        >
          Login
        </Link>{" "}
      </nav>

      <div className="mb-10 md:mb-auto flex flex-col align-center max-w-[340px] mx-auto -mt-12 h-full justify-center p-2">
        <div className="p-2 md:p-4 text-center">
          <Link href="/">
            <h2 className="text-[34px] mb-4 font-semibold font-mono animate-color-change">
              Pollapex
            </h2>
          </Link>
        </div>

        <form className="p-4 mb-2" onSubmit={onSubmit}>
          <div className="mb-3">
            <label
              className="block text-gray-700 text-sm font-semibold mb-1"
              htmlFor="name"
            >
              Full name
            </label>
            <input
              className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Zenitsu Agatsuma"
            />
          </div>

          <div className="mb-3">
            <label
              className="block text-gray-700 text-sm font-semibold mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="zenitsu@swordsmen.com"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
              />
              <button
                className="absolute right-0 top-0 mt-3 mr-4 focus:outline-none transform transition-transform duration-300 hover:scale-110"
                onClick={togglePasswordVisibility}
                type="button"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <input
              className="bg-black w-full cursor-pointer hover:-translate-y-1 transition duration-200 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              value="Sign up to Pollapex"
            />
          </div>
        </form>

        <hr />
        <div className="p-4">
          {/* GitHub login button */}
          <button
            className="w-full font-medium my-2 bg-gray-800 text-white px-4 py-2 rounded shadow flex items-center justify-center space-x-2 hover:bg-gray-700"
            onClick={() => signIn("github")}
          >
            <FaGithub size={24} />
            <span>Sign up with GitHub</span>
          </button>

          {/* Google login button */}
          <button
            className="w-full font-medium my-3 bg-red-600 text-white px-4 py-2 rounded shadow flex items-center justify-center space-x-2 hover:bg-red-700"
            onClick={() => signIn("google")}
          >
            <FaGoogle size={24} />
            <span>Sign up with Google</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;
