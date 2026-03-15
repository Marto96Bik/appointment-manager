"use client";

export default function NotificationBell() {
  return (
    <div className="fixed top-3 right-4 z-50">
      <button
        type="button"
        className="relative cursor-pointer p-3 bg-white text-black hover:bg-gray-300 active:brightness-90 shadow-2xl rounded-2xl transition-all ease-linear"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>

        {/* Notification dot */}
        <div className="bg-red-400 border-2 border-transparent rounded-full size-2.5 absolute -top-1 -right-1">
          <div className="bg-red-400 rounded-full animate-ping size-full"></div>
        </div>
      </button>
    </div>
  );
}
