"use client";

interface SymptomCloudProps {
  symptoms: {
    left: string[];
    right: string[];
    bottom: string[];
  };
}

export default function SymptomCloud({ symptoms }: SymptomCloudProps) {
  // 合并所有症状词
  const allSymptoms = [
    ...symptoms.left,
    ...symptoms.right,
    ...symptoms.bottom,
  ];

  // 定义不同的大小（直径）和字体大小
  const sizes = [60, 75, 85, 65, 80, 70, 68, 82, 72]; // 大小不一的圆形泡泡
  const fontSizes = [14, 16, 18, 15, 17, 16, 14, 18, 15]; // 不同的字体大小
  const baseRadius = 120; // 基础半径，围绕中心

  // 定义多种颜色 - 柔和温馨的色调
  const colors = [
    'rgba(255, 182, 193, 0.9)',  // 淡粉色
    'rgba(144, 217, 216, 0.9)',  // 淡青色
    'rgba(255, 218, 185, 0.9)',  // 淡橙色
    'rgba(181, 234, 215, 0.9)',  // 淡薄荷绿
    'rgba(230, 210, 255, 0.9)',  // 淡紫色
    'rgba(255, 245, 157, 0.9)',  // 淡黄色
    'rgba(255, 205, 210, 0.9)',  // 淡玫瑰色
    'rgba(167, 219, 216, 0.9)',  // 淡蓝绿色
    'rgba(255, 226, 183, 0.9)',  // 淡金桔色
  ];

  return (
    <div className="relative w-full h-80 flex items-center justify-center">
      {/* 中间女孩图片 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-32 h-32 relative" style={{ transform: 'scale(1.5)' }}>
          {/* 如果图片存在则使用，否则使用 SVG 占位符 */}
          <img
            src="/girl.png"
            alt="女孩插图"
            className="w-full h-full object-contain"
            onError={(e) => {
              // 如果图片加载失败，显示 SVG 占位符
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const svg = target.nextElementSibling as HTMLElement;
              if (svg) svg.style.display = 'block';
            }}
          />
          {/* SVG 占位符 - 简单的女孩插图 */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full hidden"
            style={{ display: 'none' }}
          >
            {/* 身体 - 连帽衫 */}
            <ellipse cx="100" cy="140" rx="50" ry="40" fill="#B0C4DE" />
            {/* 头部 */}
            <circle cx="100" cy="80" r="35" fill="#FFDBAC" />
            {/* 头发 */}
            <path
              d="M 65 70 Q 65 50 85 50 Q 100 45 115 50 Q 135 50 135 70 Q 135 85 120 90 Q 100 95 80 90 Q 65 85 65 70"
              fill="#8B4513"
            />
            {/* 连帽衫帽子 */}
            <path
              d="M 70 75 Q 70 60 85 60 Q 100 55 115 60 Q 130 60 130 75 Q 130 85 120 90 L 100 95 L 80 90 Q 70 85 70 75"
              fill="#B0C4DE"
            />
            {/* 眼睛 - 向下看，悲伤的表情 */}
            <ellipse cx="90" cy="85" rx="4" ry="6" fill="#333" />
            <ellipse cx="110" cy="85" rx="4" ry="6" fill="#333" />
            {/* 嘴巴 - 向下，悲伤 */}
            <path
              d="M 95 95 Q 100 100 105 95"
              stroke="#333"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* 手 - 抱着膝盖 */}
            <ellipse cx="70" cy="130" rx="8" ry="12" fill="#FFDBAC" />
            <ellipse cx="130" cy="130" rx="8" ry="12" fill="#FFDBAC" />
            {/* 腿 */}
            <ellipse cx="85" cy="170" rx="10" ry="15" fill="#B0C4DE" />
            <ellipse cx="115" cy="170" rx="10" ry="15" fill="#B0C4DE" />
          </svg>
        </div>
      </div>

      {/* 圆形泡泡围绕小女孩 */}
      {allSymptoms.map((symptom, index) => {
        // 计算角度：均匀分布在360度圆周上
        const angle = (index / allSymptoms.length) * 360 - 90; // -90度让第一个从顶部开始
        const radian = (angle * Math.PI) / 180;
        
        // 计算位置（使用极坐标）
        const radius = baseRadius + (index % 3) * 10; // 稍微变化半径，让分布更自然
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        
        const size = sizes[index % sizes.length];

        const fontSize = fontSizes[index % fontSizes.length];
        const animationDelay = index * 0.1;

        // 为每个泡泡分配不同的颜色
        const bubbleColor = colors[index % colors.length];

        return (
          <div
            key={index}
            className="absolute rounded-full flex items-center justify-center text-gray-700 shadow-lg hover:shadow-xl transition-all z-0"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: bubbleColor,
              backdropFilter: 'blur(8px)',
              fontSize: `${fontSize}px`,
              fontWeight: '500',
              animation: `fadeInScale 0.6s ease ${animationDelay}s both, bounce 2s ease-in-out ${animationDelay + 0.6}s infinite`,
            }}
          >
            {symptom}
          </div>
        );
      })}

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}

