const SkeletonBox = ({ styleClasses, rowNumber = 3, hideFull = false }) => {
  return (
    <div
      role='status'
      className={`p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 ${styleClasses}`}
    >
      {Array.from({ length: rowNumber }, (_, index) => index + 1).map((row) => (
        <div key={row} className='flex items-center justify-between'>
          <div>
            <div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 mb-2.5'></div>
            <div className='w-72 h-2 bg-gray-200 rounded-full dark:bg-gray-600'></div>
          </div>
          <div
            className={`h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-12 ${
              hideFull && "hidden"
            }`}
          ></div>
        </div>
      ))}

      <span className='sr-only'>Loading...</span>
    </div>
  );
};

export default SkeletonBox;
