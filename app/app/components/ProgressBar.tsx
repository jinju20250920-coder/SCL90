interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="w-full px-4 py-4">
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span>即将获取专业的分析报告</span>
        <span className="text-xl font-bold text-gray-800">{percentage}%</span>
      </div>
      <div className="w-full bg-orange-100 rounded-full h-2.5">
        <div
          className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
