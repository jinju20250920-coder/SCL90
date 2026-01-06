"use client";

interface DepressionGaugeProps {
  score: number; // 0-300
}

export default function DepressionGauge({ score }: DepressionGaugeProps) {
  const maxScore = 300;
  const percentage = (score / maxScore) * 100;

  // 判断等级
  const getLevel = () => {
    if (score >= 250) return { text: "严重", color: "#EF4444", bgColor: "bg-red-100" };
    if (score >= 200) return { text: "明显异常", color: "#F97316", bgColor: "bg-orange-100" };
    if (score >= 150) return { text: "轻度异常", color: "#EAB308", bgColor: "bg-yellow-100" };
    return { text: "正常", color: "#22C55E", bgColor: "bg-green-100" };
  };

  const level = getLevel();

  return (
    <div className="relative w-72 h-72 mx-auto transform scale-150 origin-center">
      <svg
        viewBox="0 0 300 160"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
      >
        {/* 渐变定义 */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22C55E" />   {/* 绿色 */}
            <stop offset="33%" stopColor="#EAB308" />  {/* 黄色 */}
            <stop offset="66%" stopColor="#F97316" />  {/* 橙色 */}
            <stop offset="100%" stopColor="#EF4444" />  {/* 红色 */}
          </linearGradient>
        </defs>

        {/* 外圈装饰圆弧（半透明） */}
        <path
          d="M 30 130 A 120 120 0 0 1 270 130"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeOpacity="0.2"
        />

        {/* 中圈圆弧（稍细） */}
        <path
          d="M 40 130 A 110 110 0 0 1 260 130"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeOpacity="0.3"
        />

        {/* 内圈进度圆弧 */}
        <path
          d="M 50 130 A 100 100 0 0 1 250 130"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 3.14} 314`}
          strokeDashoffset="157"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />

        {/* 刻度标记 */}
        {[0, 75, 150, 225, 300].map((value) => {
          const angle = 180 - (value / maxScore) * 180;
          const rad = (angle * Math.PI) / 180;
          const x1 = 150 + 90 * Math.cos(rad);
          const y1 = 130 - 90 * Math.sin(rad);
          const x2 = 150 + 100 * Math.cos(rad);
          const y2 = 130 - 100 * Math.sin(rad);

          const textRadius = 115;
          const textX = 150 + textRadius * Math.cos(rad);
          const textY = 130 - textRadius * Math.sin(rad);

          return (
            <g key={value}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#666666"
                strokeWidth="2"
              />
              <text
                x={textX}
                y={textY}
                fontSize="14"
                fontWeight="600"
                fill="#666666"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* 中心装饰圆点 */}
        <circle
          cx="150"
          cy="130"
          r="8"
          fill="url(#gaugeGradient)"
          opacity="0.8"
        />
      </svg>

      {/* 中心数值和等级显示 */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transform: 'translateY(25px)' }}
      >
        {/* 分数 */}
        <div className="relative">
          <div className="text-4xl font-bold text-gray-800 leading-none">
            {score}
          </div>
          <div className="text-base text-gray-500 font-medium mt-1">
            分
          </div>
        </div>

        {/* 等级标签 */}
        <div
          className={`mt-4 px-5 py-2 rounded-full text-sm font-bold text-white shadow-lg ${level.bgColor.replace('bg-', 'bg-').replace('100', '500')}`}
          style={{
            backgroundColor: level.color,
          }}
        >
          {level.text}
        </div>
      </div>
    </div>
  );
}

