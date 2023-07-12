import Link from "next/link";
import { FaRocket } from "react-icons/fa";

const CreateSurveyBox = () => {
  return (
    <div className='bg-white py-4 px-6 my-4 md:mt-16 h-fit rounded-lg shadow flex flex-col items-center text-center order-1 md:order-2'>
      <FaRocket size={32} color='blue' className='mt-3' />
      <h5 className='text-lg font-semibold my-2'>Create new survey</h5>
      <p className='text-sm text-gray-400 my-2'>
        Click the button bellow and start collecting responses in minutes
      </p>

      <Link
        href='/surveys/create'
        className='inline-block w-full rounded-lg shadow py-3 px-6 my-4 text-white font-semibold bg-blue-600 hover:bg-blue-700 duration-150 hover:ease-in-out'
      >
        Create survey
      </Link>
    </div>
  );
};

export default CreateSurveyBox;
