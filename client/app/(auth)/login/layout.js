import Link from "next/link";

export const metadata = {
  title: "Login | Pollapex",
};

const LoginLayout = ({ children }) => {
  return (
    <>
      <nav className="hidden md:flex justify-end items-center gap-4 p-2">
        <p className="text-gray-600">{"Don't"} have an account?</p>
        <Link
          className="border border-gray-500 rounded-sm py-2 px-4 text-sm hover:shadow hover:bg-gray-50 duration-150 "
          href="/signup"
        >
          Sign up
        </Link>{" "}
      </nav>
      {children}
    </>
  );
};

export default LoginLayout;
