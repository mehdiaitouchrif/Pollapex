import Link from "next/link";
import { useState } from "react";

const SurveyBox = ({ survey, makeBorderTransparent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleDropdownToggle = (event) => {
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className={`py-2 my-2 border-b flex justify-between gap-8 ${
        makeBorderTransparent ? "border-b-transparent" : "border-b-gray-100"
      }`}
    >
      <Link href={`/survey/${survey._id}`} className='w-2/3'>
        <h4 className='mb-2 font-semibold'>{survey.title}</h4>
        <p className='mb-4 text-gray-500'>{survey.description}</p>
        <div className='my-2'>
          {survey.active && (
            <span className='p-2 rounded bg-green-400'>Active</span>
          )}
          {!survey.active && (
            <span className='p-2 rounded bg-red-400'>Inactive</span>
          )}
        </div>
      </Link>

      <div className='hs-dropdown flex flex-col items-end relative'>
        <button
          onClick={handleDropdownToggle}
          type='button'
          className='p-3 h-fit inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800'
        >
          <svg
            className='w-4 h-4 text-gray-600'
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z' />
          </svg>
        </button>

        <div
          className={`transition-[opacity,margin] duration absolute top-10 z-10 ${
            !isDropdownOpen && "hidden opacity-0"
          } w-[10rem] bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-gray-800 dark:border dark:border-gray-700'`}
        >
          <Link
            className='flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            href={`/surveys/${survey._id}`}
          >
            Overview
          </Link>
          <Link
            className='flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            href={`/surveys/questions/${survey._id}`}
          >
            Questions
          </Link>
          <Link
            className='flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            href={`/surveys/responses/${survey._id}`}
          >
            Responses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SurveyBox;
