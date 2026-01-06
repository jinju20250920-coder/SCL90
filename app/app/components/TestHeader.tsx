interface TestHeaderProps {
  current: number;
  total: number;
}

export default function TestHeader({ current, total }: TestHeaderProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="w-full px-4 pt-6 pb-2">
      {/* 标题区域 */}
      <div className="flex items-center justify-center mb-4 relative">
        {/* 左侧徽章 */}
        <div className="absolute left-0 flex items-center bg-orange-400/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
          <svg 
            className="w-4 h-4 text-white mr-1.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 11a3 3 0 11-6 0m6 0a3 3 0 10-6 0m6 0h6m-6 0V9a3 3 0 00-3-3m3 3v2a3 3 0 01-3 3m0 0h-6m6 0v2a3 3 0 003 3m-3-3v-2m0 0H9m3 0v2" 
            />
          </svg>
          <span className="text-white text-xs font-medium">国际标准版</span>
        </div>
        
        {/* 居中标题 */}
        <h1 className="text-2xl font-bold text-gray-800 text-center ml-[50px]">
          SCL-90自评量表（国际标准版）
        </h1>
      </div>
      
      {/* 进度条区域 */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-600">即将获取专业的分析报告</span>
          <span className="text-xl font-bold text-gray-800">{percentage}%</span>
        </div>
        <div className="w-full bg-orange-100 rounded-full h-2.5">
          <div
            className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

