"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaGithub, FaGoogle } from "react-icons/fa";
import LoadingSpinner from "@/components/loadingSpinner";

const Login = () => {
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
    setLoading(true);

    // handle submit
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result.error) {
      JSON.parse(result.error).map((err) => toast.error(err.msg));
      setLoading(false);
    } else {
      setLoading(false);
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
    <div className="flex flex-col align-center max-w-[340px] mx-auto -mt-8 md:-mt-20 h-screen justify-center p-2">
      {loading && <LoadingSpinner />}
      <div className="p-4 text-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <h2 className="text-[34px] mb-4 font-semibold animate-color-change">
            Pollapex
          </h2>
        </Link>
        <h4 className="text-xl text-gray-500">Hello, who{"'"}s this?</h4>
      </div>

      <form className="p-4 mb-4" onSubmit={onSubmit}>
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
        <div>
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
              type="password"
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
        <Link
          href="/forgotpassword"
          className="inline-block mb-6 underline text-gray-600"
        >
          Forgot password?
        </Link>
        <div className="flex items-center justify-between">
          <input
            className="bg-black w-full cursor-pointer hover:-translate-y-1 transition duration-200 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            value="Log in to Pollapex"
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
          <span>Login with GitHub</span>
        </button>

        {/* Google login button */}
        <button
          className="w-full font-medium my-3 bg-red-600 text-white px-4 py-2 rounded shadow flex items-center justify-center space-x-2 hover:bg-red-700"
          onClick={() => signIn("google")}
        >
          <FaGoogle size={24} />
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
