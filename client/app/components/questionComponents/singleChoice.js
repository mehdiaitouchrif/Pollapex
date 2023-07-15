import { useState } from "react";

const SingleChoice = () => {
  const [options, setOptions] = useState(["Option 1"]);

  const addOption = (newOption) => {
    setOptions((prev) => [...prev, newOption]);
  };

  const handleChange = (e, idx) => {
    const updatedOptions = [...options];

    updatedOptions[idx] = e.target.value;

    setOptions(updatedOptions);
  };
  return (
    <div>
      {options.map((op, idx) => (
        <div key={idx} className='flex gap-4 items-center my-4'>
          <input
            disabled
            type='radio'
            checked={false}
            className='w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
          <div className='relative z-0 w-full group mb-3'>
            <input
              type='text'
              name='title'
              id='title'
              className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              value={op}
              onChange={(e) => handleChange(e, idx)}
              required
            />
          </div>
        </div>
      ))}

      <button
        className='bg-black text-white rounded shadow py-3 px-6 my-4'
        onClick={() => addOption(`Option ${options.length + 1}`)}
      >
        Add option
      </button>
    </div>
  );
};

export default SingleChoice;
