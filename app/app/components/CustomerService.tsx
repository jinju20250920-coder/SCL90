"use client";

export default function CustomerService() {
  return (
    <div className="fixed right-4 bottom-24 z-50">
      <div className="relative group">
        {/* 对话气泡 */}
        <div className="absolute right-16 top-0 bg-white rounded-2xl px-4 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <div className="text-xs text-gray-700">客服咨询</div>
          <div className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2">
            <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </div>

        {/* 头像按钮 */}
        <button className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110">
          <div className="relative">
            {/* 耳机图标 */}
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            {/* 微笑表情 */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </button>

        {/* 减少标签 */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
          减少
        </div>
      </div>
    </div>
  );
}

