import React, { useState } from "react";

const DateChoice = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className='my-4'>
      <input
        type='date'
        id='date'
        disabled
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-1/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        value={selectedDate}
        placeholder='Month, day, year'
        onChange={handleDateChange}
        required
      />
    </div>
  );
};

export default DateChoice;
