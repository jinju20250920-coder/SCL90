"use client";

interface SymptomBarProps {
  factorResults: {
    name: string;
    totalScore: number;
    avgScore: number;
    level: string;
  }[];
}

export default function SymptomBar({ factorResults }: SymptomBarProps) {
  // 根据严重程度获取颜色
  const getColor = (level: string) => {
    switch (level) {
      case '重度':
        return {
          bg: 'bg-gradient-to-r from-red-400 to-red-500',
          badgeBg: 'bg-red-100',
          badgeText: 'text-red-700',
          badgeBorder: 'border-red-500',
          badge: 'bg-red-500'
        };
      case '中度':
        return {
          bg: 'bg-gradient-to-r from-orange-400 to-orange-500',
          badgeBg: 'bg-orange-100',
          badgeText: 'text-orange-700',
          badgeBorder: 'border-orange-500',
          badge: 'bg-orange-500'
        };
      case '轻度':
        return {
          bg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
          badgeBg: 'bg-yellow-100',
          badgeText: 'text-yellow-700',
          badgeBorder: 'border-yellow-500',
          badge: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-green-400 to-green-500',
          badgeBg: 'bg-green-100',
          badgeText: 'text-green-700',
          badgeBorder: 'border-green-500',
          badge: 'bg-green-500'
        };
    }
  };

  // 准备数据 - 按平均分降序排列
  const data = [...factorResults].sort((a, b) => b.avgScore - a.avgScore);

  // 计算最大平均分用于进度条比例
  const maxAvgScore = Math.max(...data.map(d => d.avgScore), 5);

  return (
    <div className="w-full">
      <div className="space-y-2">
        {data.map((factor, index) => {
          const colors = getColor(factor.level);
          const percentage = (factor.avgScore / maxAvgScore) * 100;

          return (
            <div
              key={factor.name}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* 序号 */}
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-gray-600">{index + 1}</span>
              </div>

              {/* 因子名称 */}
              <div className="w-20 text-sm font-medium text-gray-800 truncate flex-shrink-0">
                {factor.name}
              </div>

              {/* 进度条容器 */}
              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden flex items-center px-2 relative">
                {/* 进度条 */}
                <div
                  className={`h-full ${colors.bg} rounded-lg transition-all duration-500`}
                  style={{ width: `${Math.max(percentage, 15)}%` }}
                />

                {/* 总分标签 */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1 shadow-sm border border-gray-200">
                    <span className="text-xs text-gray-500">总分</span>
                    <span className="text-sm font-bold text-gray-800">{factor.totalScore}</span>
                  </div>
                </div>
              </div>

              {/* 等级标签 */}
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${colors.badgeBg} ${colors.badgeText} border-2 ${colors.badgeBorder}`}
                >
                  {factor.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
