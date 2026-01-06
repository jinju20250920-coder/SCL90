"use client";

interface FactorTableProps {
  factorResults: {
    name: string;
    totalScore: number;
    avgScore: number;
    level: string;
  }[];
}

export default function FactorTable({ factorResults }: FactorTableProps) {
  // 根据严重程度获取颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case '重度':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-300',
          badge: 'bg-red-500'
        };
      case '中度':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          border: 'border-orange-300',
          badge: 'bg-orange-500'
        };
      case '轻度':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-300',
          badge: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-300',
          badge: 'bg-green-500'
        };
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        {/* 表头 */}
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
              因子名称
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
              总分
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
              平均分
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border border-gray-200">
              等级
            </th>
          </tr>
        </thead>

        {/* 表体 */}
        <tbody className="bg-white divide-y divide-gray-200">
          {factorResults.map((factor, index) => {
            const levelColors = getLevelColor(factor.level);

            return (
              <tr
                key={factor.name}
                className={`hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                {/* 序号 */}
                <td className="px-4 py-3 text-sm text-gray-500 text-center border border-gray-200 font-medium">
                  {index + 1}
                </td>

                {/* 因子名称 */}
                <td className="px-4 py-3 text-sm text-gray-800 font-medium border border-gray-200">
                  {factor.name}
                </td>

                {/* 总分 */}
                <td className="px-4 py-3 text-sm text-gray-800 text-center border border-gray-200 font-bold">
                  {factor.totalScore}
                </td>

                {/* 平均分 */}
                <td className="px-4 py-3 text-sm text-gray-800 text-center border border-gray-200 font-bold">
                  {factor.avgScore.toFixed(2)}
                </td>

                {/* 等级 */}
                <td className="px-4 py-3 text-center border border-gray-200">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${levelColors.bg} ${levelColors.text} border-2 ${levelColors.border}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${levelColors.badge} mr-1.5`}></span>
                    {factor.level}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* 表尾总计 */}
        <tfoot className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300">
          <tr>
            <td
              colSpan={2}
              className="px-4 py-3 text-sm font-bold text-gray-700 border border-gray-200"
            >
              总计 / 平均
            </td>
            <td className="px-4 py-3 text-sm text-gray-800 text-center border border-gray-200 font-bold">
              {factorResults.reduce((sum, f) => sum + f.totalScore, 0)}
            </td>
            <td className="px-4 py-3 text-sm text-gray-800 text-center border border-gray-200 font-bold">
              {(factorResults.reduce((sum, f) => sum + f.avgScore, 0) / factorResults.length).toFixed(2)}
            </td>
            <td className="px-4 py-3 border border-gray-200"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
