"use client";

interface ProgressBarProps {
  value: number; // 1-5之间的值
}

export default function ProgressBar({ value }: ProgressBarProps) {
  // 确保值在1-5范围内
  const normalizedValue = Math.max(1, Math.min(5, value));

  // 计算百分比 (1对应0%, 5对应100%)
  const percentage = ((normalizedValue - 1) / 4) * 100;

  // 根据值确定颜色和渐变
  const getColorConfig = (val: number) => {
    if (val >= 3.5) {
      return {
        from: 'from-red-500',
        to: 'to-red-600',
        shadow: 'shadow-red-300',
        text: 'text-red-600',
        bg: 'bg-red-50'
      };
    } else if (val >= 2.5) {
      return {
        from: 'from-orange-500',
        to: 'to-orange-600',
        shadow: 'shadow-orange-300',
        text: 'text-orange-600',
        bg: 'bg-orange-50'
      };
    } else if (val >= 2.0) {
      return {
        from: 'from-yellow-500',
        to: 'to-yellow-600',
        shadow: 'shadow-yellow-300',
        text: 'text-yellow-600',
        bg: 'bg-yellow-50'
      };
    } else {
      return {
        from: 'from-green-500',
        to: 'to-green-600',
        shadow: 'shadow-green-300',
        text: 'text-green-600',
        bg: 'bg-green-50'
      };
    }
  };

  const colorConfig = getColorConfig(normalizedValue);

  return (
    <div className="w-full space-y-2">
      {/* 进度条容器 */}
      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
        {/* 背景网格 */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(90deg, transparent 49%, #999 50%, transparent 51%)',
            backgroundSize: '20% 100%'
          }} />
        </div>

        {/* 进度条（渐变色） */}
        <div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${colorConfig.from} ${colorConfig.to} rounded-full transition-all duration-700 ease-out shadow-lg ${colorConfig.shadow} relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* 高光效果 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />

          {/* 动画光效 */}
          <div className="absolute inset-0">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite'
            }} />
          </div>
        </div>

        {/* 刻度线和标签 */}
        <div className="absolute inset-0 flex items-center">
          {[1.0, 2.0, 3.0, 4.0, 5.0].map((mark, index) => {
            const markPosition = ((mark - 1) / 4) * 100;
            const isActive = normalizedValue >= mark;
            return (
              <div
                key={index}
                className="absolute flex flex-col items-center justify-center"
                style={{ left: `${markPosition}%`, transform: 'translateX(-50%)' }}
              >
                <div className={`w-0.5 h-3 rounded-full transition-all duration-300 ${
                  isActive ? `${colorConfig.from} ${colorConfig.to} bg-gradient-to-b` : 'bg-gray-300'
                }`} />
              </div>
            );
          })}
        </div>

        {/* 当前值指示器 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 transition-all duration-700 ease-out flex items-center justify-center"
          style={{
            left: `${percentage}%`,
            transform: 'translate(-50%, -50%)',
            borderColor: normalizedValue >= 3.5 ? '#ef4444' :
                       normalizedValue >= 2.5 ? '#f97316' :
                       normalizedValue >= 2.0 ? '#eab308' : '#22c55e'
          }}
        >
          <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${colorConfig.from} ${colorConfig.to}`} />
        </div>
      </div>

      {/* 底部标签 */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-gray-800">{normalizedValue.toFixed(1)}</span>
          <span className="text-xs text-gray-500">/ 5.0</span>
        </div>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${colorConfig.bg} ${colorConfig.text}`}>
          {normalizedValue >= 3.5 ? '重度' :
           normalizedValue >= 2.5 ? '中度' :
           normalizedValue >= 2.0 ? '轻度' : '正常'}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
