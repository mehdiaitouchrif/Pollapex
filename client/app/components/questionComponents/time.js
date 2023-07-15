import { useState } from "react";

const TimeChoice = () => {
  const [selectedTime, setSelectedTime] = useState("");

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  return (
    <div className='my-4'>
      <input
        type='time'
        id='time'
        disabled
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-1/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        value={selectedTime}
        onChange={handleTimeChange}
        required
      />
    </div>
  );
};

export default TimeChoice;
