const LoadingSpinner = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='absolute inset-0 bg-gray-500 opacity-50'></div>
      <div className='z-10 p-4 rounded-lg shadow-lg'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500'></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
