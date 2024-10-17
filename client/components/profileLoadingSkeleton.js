const ProfileLoadingSkeleton = () => {
  return (
    <div className="max-w-[400px] mx-auto p-4 mt-6 space-y-6 animate-pulse">
      {/* Skeleton for Avatar and Name */}
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Skeleton Avatar */}
        <div className="w-24 h-24 rounded-full bg-gray-300 shadow-lg"></div>

        {/* Skeleton Name */}
        <div className="w-32 h-6 bg-gray-300 rounded-full"></div>

        {/* Skeleton Joined Date */}
        <div className="w-32 h-4 bg-gray-300 rounded-full"></div>
      </div>

      {/* Skeleton for Update Form */}
      <div className="p-3 bg-white rounded-lg shadow-lg space-y-4">
        {/* Skeleton for Name Input */}
        <div>
          <div className="w-1/2 h-5 bg-gray-300 rounded-full mb-2"></div>
          <div className="w-full h-9 bg-gray-200 rounded"></div>
        </div>

        {/* Skeleton for Email Input */}
        <div>
          <div className="w-1/2 ll h-5 bg-gray-300 rounded-full mb-2"></div>
          <div className="w-full h-9 bg-gray-200 rounded"></div>
        </div>

        {/* Skeleton for Button */}
        <div className="w-1/2 h-11 bg-blue-300 rounded-lg"></div>
      </div>

      {/* Skeleton for Password Section */}
      <div className="p-3 bg-white rounded-lg shadow-lg space-y-4">
        {/* Skeleton for Password Input */}
        <div>
          <div className="w-1/2 h-5 bg-gray-300 rounded-full mb-2"></div>
          <div className="w-full h-9 bg-gray-200 rounded"></div>
        </div>

        {/* Skeleton for Update Password Button */}
        <div className="w-1/2 h-11 bg-blue-300 rounded-lg"></div>
      </div>

      {/* Skeleton for Danger Zone */}
      <div className="p-3 bg-white rounded-lg shadow-lg space-y-4">
        <div className="w-32 h-7 bg-red-300 rounded-full"></div>
        <div className="w-1/2 h-11 bg-red-500 rounded-lg"></div>
      </div>
    </div>
  );
};

export default ProfileLoadingSkeleton;
