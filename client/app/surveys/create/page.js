"use client";
import QuestionComposer from "@/app/components/questionComponents/questionComposer";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const CreateSurveyPage = () => {
  const [survey, setSurvey] = useState({
    title: "",
    description: "",
    theme: "blue",
    active: false,
    published: false,
    backgroundImage: "",
    collaborators: [],
    questions: [],
  });

  const handleChange = (e) => {
    setSurvey((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDuplicate = (data) => {
    alert("todo soon");
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      {/* survey initials */}
      <div className='bg-white p-4 rounded-lg shadow my-8 border-t-8 border-t-blue-500 border-l-8 focus:border-l-purple-500'>
        <div className='relative z-0 w-full mb-6 group'>
          <input
            type='text'
            name='title'
            id='title'
            value={survey.title}
            onChange={handleChange}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
          />
          <label
            htmlFor='title'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Title
          </label>
        </div>

        <div className='relative z-0 w-full mb-6 group'>
          <textarea
            type='text'
            name='description'
            id='description'
            value={survey.description}
            onChange={handleChange}
            rows={4}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
          />
          <label
            htmlFor='description'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Description
          </label>
        </div>
      </div>

      {/* questions */}
      <QuestionComposer handleDuplicate={handleDuplicate} />

      <button
        style={{ top: "30%", right: "20%" }}
        className='inline-block fixed bg-white p-4 rounded-full shadow-lg border-2 border-transparent hover:border-2 hover:border-blue-500 focus:bg-none focus:outline-none'
      >
        <FaPlus size={24} className='text-gray-600' />
      </button>
    </div>
  );
};

export default CreateSurveyPage;
