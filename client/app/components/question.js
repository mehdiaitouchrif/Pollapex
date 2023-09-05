"use client";
import { FaCopy, FaTrash } from "react-icons/fa";
import QuestionTypeRenderer from "./questionTypeRenderer";

const Question = ({
  question,
  index,
  handleQuestionChange,
  duplicateQuestion,
  deleteQuestion,
  addChoice,
  handleChoiceChange,
  deleteChoice,
}) => {
  return (
    <div className='bg-white p-4 text-sm md:text-base rounded-lg shadow my-8 border-t-8 border-l-4 md:border-l-8 border-l-blue-500'>
      <div className='relative z-0 w-full mb-6 group'>
        <input
          type='text'
          name='question'
          id='question'
          className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
          required
          placeholder=' '
          value={question.question}
          onChange={(e) =>
            handleQuestionChange(index, "question", e.target.value)
          }
        />
        <label
          htmlFor='question'
          className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        >
          Type your question
        </label>
      </div>

      <div className='w-full'>
        <select
          id='large'
          value={question.type}
          onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
          className='block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        >
          <option value='multipleChoice'>Multiple Choice</option>
          <option value='singleChoice'>Single Choice</option>
          <option value='paragraph'>Paragraph</option>
          <option value='text'>Short text</option>
          <option value='rating'>Rating</option>
          <option value='time'>Time</option>
          <option value='date'>Date</option>
          <option value='email'>Email</option>
          <option value='phone'>Phone</option>
        </select>
      </div>

      <QuestionTypeRenderer
        index={index}
        question={question}
        addChoice={addChoice}
        handleChoiceChange={handleChoiceChange}
        deleteChoice={deleteChoice}
      />

      {/* Footer */}
      <div className='my-3 mb-1 border-t pt-3 flex items-center justify-end text-gray-500 text-xl'>
        {/* duplicate */}
        <div
          onClick={() => duplicateQuestion(index)}
          className='p-3 rounded-full hover:bg-gray-100 transition-colors duration-200'
        >
          <FaCopy size={24} className='cursor-pointer text-gray-500' />
        </div>
        {/* delete */}
        <div
          onClick={() => deleteQuestion(index)}
          className='p-3 rounded-full hover:bg-gray-100 transition-colors duration-200'
        >
          <FaTrash size={24} className='cursor-pointer text-gray-500' />
        </div>

        <span className='mx-2'>|</span>

        <div className='flex items-center'>
          <span className='mr-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
            Required
          </span>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only peer'
              onChange={(e) =>
                handleQuestionChange(index, "optional", !e.target.checked)
              }
              checked={!question.optional}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Question;
