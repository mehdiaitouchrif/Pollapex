"use client";

import SkeletonBox from "@/components/skeleton";
import {
  changePassword,
  deleteAccount,
  getUser,
  updateDetails,
} from "@/utils/apiUtils/auth";
import { timeAgo } from "@/utils/helpers";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/dashboard");
    },
  });

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  //   Update details form
  const handleUpdateDetails = async (e) => {
    e.preventDefault();

    try {
      const result = await updateDetails(data?.user?.token, {
        name,
        email,
      });
      if (result.success) {
        toast.success("Updated successfuly");
        setUser({ ...user, name: result.data.name, email: result.data.email });
        return;
      }
      if (result.errors) {
        toast.error(result.errors[0].msg);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  //   Password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    try {
      const result = await changePassword(data?.user?.token, newPassword);
      if (result.success) {
        toast.success("Password changed with success!");
        return;
      }
      if (result.errors) {
        toast.error(errors[0].msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Try later");
    }
  };

  //   Delete account
  const handleAccountDeletion = async () => {
    if (confirm("Are you sure? This action is irreversible.")) {
      try {
        const isDeleted = await deleteAccount(data?.user?.token);
        if (isDeleted) {
          signOut();
        }
        if (!isDeleted) {
          toast.error("Couldn't delete account. Try later");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong. Try later");
      }
    }
  };
  useEffect(() => {
    if (data?.user) {
      getUser(data.user.token).then(({ data }) => {
        setUser(data);
        setEmail(data.email);
        setName(data.name);
      });
    }
  }, [data?.user]);

  return (
    <div className='max-w-md mx-auto p-4'>
      {(status === "loading" || !user) && <SkeletonBox />}
      {user && (
        <div>
          <div className='flex flex-col items-center justify-center'>
            <div className='w-20 my-4 bg-inherit'>
              <Image
                src={user.picture}
                alt='profile picture'
                width={100}
                height={100}
                className='w-full rounded-full shadow bg-inherit'
              />
            </div>
            <h3 className='text-xl font-semibold'>{user.name} </h3>
            <p>Joined {timeAgo(new Date(user.createdAt))}</p>
          </div>

          <div className='p-4 shadow-sm mt-6'>
            {/* Update details */}
            <form className='mb-4' onSubmit={handleUpdateDetails}>
              <div>
                <label
                  className='block text-gray-700 text-sm font-semibold mb-2'
                  htmlFor='name'
                >
                  Full name
                </label>
                <input
                  className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline'
                  id='name'
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:hover:cursor-not-allowed'
                  id='email'
                  type='email'
                  value={email}
                  disabled={user.oauth && !user.password}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {!user.password && (
                  <p className='text-gray-500 text-xs my-4'>
                    <span className='text-red-700'>*</span> Since you logged in
                    with a social account, You have to setup a password to be
                    able to change your email.
                  </p>
                )}
              </div>

              <button
                type='submit'
                className='inline-block py-2 px-4 rounded-lg shadow mb-4 bg-blue-500 hover:bg-blue-600 text-white font-medium'
              >
                Update Info
              </button>
            </form>

            <form className='mb-4' onSubmit={handlePasswordUpdate}>
              <div>
                <label
                  className='block text-gray-700 text-sm font-semibold mb-2'
                  htmlFor='password'
                >
                  {user.password ? "Change password" : "Set up a password"}
                </label>
                <input
                  className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline'
                  id='password'
                  type='password'
                  value={newPassword}
                  placeholder='********'
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>

              {newPassword.length > 0 && newPassword.length < 6 && (
                <p className='text-sm text-red-700'>
                  Password should be at least 6 characters long
                </p>
              )}
              {newPassword.length > 6 && (
                <button className='inline-block py-2 px-4 mt-2 rounded-md shadow bg-blue-500 hover:bg-blue-600 text-white font-medium'>
                  Update Password
                </button>
              )}
            </form>

            <h2 className='text-2xl font-semibold my-4 mt-12 pb-4 border-b'>
              Danger Zone
            </h2>
            <button
              onClick={handleAccountDeletion}
              className='inline-block py-2 px-4 rounded-lg shadow bg-red-500 text-white font-medium'
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
