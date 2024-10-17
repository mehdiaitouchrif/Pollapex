const SkeletonBox = ({ styleClasses, rowNumber = 3, hideFull = false }) => {
  return (
    <div
      role="status"
      className={`p-6 space-y-6 border border-gray-200 rounded-xl shadow-lg bg-white animate-pulse dark:bg-gray-800 dark:border-gray-700 ${styleClasses}`}
    >
      {Array.from({ length: rowNumber }, (_, index) => index + 1).map((row) => (
        <div key={row} className="flex items-center justify-between space-x-4">
          <div className="flex-grow space-y-2">
            <div className="w-36 h-3 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
            <div className="w-full h-4 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
          </div>
          <div
            className={`h-4 bg-gray-300 rounded-lg dark:bg-gray-600 w-16 ${
              hideFull && "hidden"
            }`}
          ></div>
        </div>
      ))}

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SkeletonBox;
