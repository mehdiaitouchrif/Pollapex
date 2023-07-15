import { useState } from "react";

const RatingChoice = () => {
  const [startValue, setStartValue] = useState(1);
  const [endValue, setEndValue] = useState(5);

  const handleStartChange = (e) => {
    setStartValue(e.target.value);
  };

  const handleEndChange = (e) => {
    setEndValue(e.target.value);
  };

  return (
    <div className='flex items-center my-4'>
      <select
        value={startValue}
        disabled
        onChange={handleStartChange}
        className='mr-2 p-2 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        <option value='1'>1</option>
      </select>
      <p className='mr-2'>To</p>
      <select
        value={endValue}
        onChange={handleEndChange}
        className='p-2 bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        {Array.from({ length: 9 }, (_, index) => (
          <option key={index + 2} value={index + 2}>
            {index + 2}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RatingChoice;
