"use client";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

const GoBackLink = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className='border border-gray-50 shadow hover:border-gray-100 text-gray-500 py-2 px-4 rounded-lg cursor-pointer flex items-center gap-2'
    >
      <FiArrowLeft />
      <p>Go Back</p>
    </button>
  );
};

export default GoBackLink;
