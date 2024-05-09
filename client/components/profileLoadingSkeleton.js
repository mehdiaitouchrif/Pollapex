const ProfileLoadingSkeleton = () => {
  return (
    <div className="max-w-[380px] mx-auto">
      <div className="animate-pulse flex flex-col items-center justify-center">
        <div className="w-20 h-20 my-4 bg-gray-300 rounded-full"></div>
        <h3 className="text-xl font-semibold text-gray-300">Loading...</h3>
        <p className="text-gray-300">Joined Loading...</p>
      </div>

      <div className="p-4 shadow-sm mt-6">
        {/* Update details */}
        <form className="mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Full name
            </label>
            <div className="bg-gray-300 rounded w-full py-2 px-3 mb-2"></div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <div className="bg-gray-300 rounded w-full py-2 px-3 mb-2"></div>
            <p className="text-gray-300 text-xs my-4">
              <span className="text-red-700">*</span> Loading...
            </p>
          </div>

          <button
            type="button"
            className="inline-block py-2 px-4 rounded-lg shadow mb-4 bg-gray-300 text-gray-600 font-medium cursor-not-allowed"
            disabled
          >
            Loading...
          </button>
        </form>

        {/* Password update */}
        <form className="mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Loading...
            </label>
            <div className="bg-gray-300 rounded w-full py-2 px-3 mb-2"></div>
            <button
              className="absolute right-0 top-0 mt-3 mr-4 focus:outline-none transform transition-transform duration-300 hover:scale-110"
              type="button"
              disabled
            >
              {/* Icon */}
            </button>
          </div>

          <div className="bg-gray-300 rounded w-full py-2 px-3 mb-2"></div>
          <p className="text-sm text-gray-300">Loading...</p>

          <div className="bg-gray-300 rounded w-full py-2 px-3 mt-2 mb-4"></div>
          <button
            className="inline-block py-2 px-4 mt-2 rounded-md shadow bg-gray-300 text-gray-600 font-medium cursor-not-allowed"
            disabled
          >
            Loading...
          </button>
        </form>

        {/* Danger Zone */}
        <div>
          <h2 className="text-2xl font-semibold my-4 mt-12 pb-4 border-b text-gray-300">
            Danger Zone
          </h2>
          <button
            className="inline-block py-2 px-4 rounded-lg shadow bg-gray-300 text-gray-600 font-medium cursor-not-allowed"
            disabled
          >
            Loading...
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileLoadingSkeleton;
