const MessageSkeleton = () => {
  return (
    <div className="animate-pulse min-h-screen">
      {/* Header Skeleton */}
      <div className="flex items-center mb-4 border p-4">
        <div className="w-20 h-20 rounded-md bg-gray-300 "></div>
        <div className="ml-4">
          <div className="w-48 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded mt-2"></div>
          <div className="h-4 bg-gray-300 rounded mt-2"></div>
        </div>
      </div>

      {/* Message Bubbles Skeleton */}
      <div className="space-y-4">
        <div className="flex">
          <div className="w-3/5 h-20 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="flex justify-end">
          <div className="w-3/5 h-16 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="flex">
          <div className="w-1/2 h-16 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="flex justify-end">
          <div className="w-3/4 h-16 bg-gray-300 rounded-lg"></div>
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="mt-4 w-[532px] fixed bottom-28">
        <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
