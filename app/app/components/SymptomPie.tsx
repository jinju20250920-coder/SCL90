"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SymptomPieProps {
  factorResults: {
    name: string;
    avgScore: number;
    level: string;
  }[];
}

export default function SymptomPie({ factorResults }: SymptomPieProps) {
  // 根据严重程度获取颜色
  const getColor = (level: string) => {
    switch (level) {
      case '重度':
        return '#ef4444'; // red-500
      case '中度':
        return '#f97316'; // orange-500
      case '轻度':
        return '#eab308'; // yellow-500
      default:
        return '#22c55e'; // green-500
    }
  };

  // 准备饼图数据 - 使用平均分作为权重
  const data = factorResults.map(factor => ({
    name: factor.name,
    value: factor.avgScore,
    level: factor.level
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
          <p className="text-sm font-bold text-gray-800">{data.name}</p>
          <p className="text-xs text-gray-600">
            平均分: <span className="font-bold">{data.value.toFixed(2)}</span>
          </p>
          <p className="text-xs text-gray-600">
            等级: <span className="font-bold" style={{ color: getColor(data.level) }}>{data.level}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex gap-4">
      {/* 环形图 */}
      <div className="flex-1 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => {
                const percentage = (percent * 100).toFixed(0);
                if (Number(percentage) < 8) return null;
                return `${percentage}%`;
              }}
              labelLine={false}
              fontSize={11}
              fontWeight={600}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.level)}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 图例列表 */}
      <div className="w-48 overflow-y-auto max-h-80 pr-2">
        <div className="space-y-1.5">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getColor(item.level) }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-800 truncate">{item.name}</div>
                <div className="text-xs text-gray-500">{item.value.toFixed(2)}分</div>
              </div>
              <div
                className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  item.level === '重度' ? 'bg-red-100 text-red-700' :
                  item.level === '中度' ? 'bg-orange-100 text-orange-700' :
                  item.level === '轻度' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}
              >
                {item.level}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
