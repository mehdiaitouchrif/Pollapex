"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Dashboard = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/dashboard");
    },
  });

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <h1 className='text-4xl'>Dashboard Page - Requires Auth</h1>
      <h2>
        Your name is: <strong>{session?.user?.name}</strong>
      </h2>
    </div>
  );
};

export default Dashboard;
