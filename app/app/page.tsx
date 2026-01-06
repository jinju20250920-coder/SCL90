"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DepressionGauge from "./components/DepressionGauge";
import SymptomCloud from "./components/SymptomCloud";
import CustomerService from "./components/CustomerService";
import {
  isValidAccessKey,
  isAccessKeyUsed,
  setCurrentAccessKey,
} from "@/lib/accessKey";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [score, setScore] = useState(300); // 默认显示300分（最高分）
  const [accessKey, setAccessKey] = useState<string | null>(null);

  // 处理 access_key 参数
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const key = searchParams.get('access_key');
    if (key) {
      // 验证 access_key 格式
      if (!isValidAccessKey(key)) {
        alert('无效的访问密钥');
        router.push('/verify');
        return;
      }

      // 保存 access_key 和状态（不检查是否已使用）
      setCurrentAccessKey(key);
      setAccessKey(key);
    }
  }, [searchParams, router]);

  // 处理"开始测试"按钮点击
  const handleStartTest = () => {
    if (accessKey) {
      // 检查是否已使用
      if (isAccessKeyUsed(accessKey)) {
        // 已使用，跳转到结果页
        router.push(`/result?access_key=${accessKey}`);
      } else {
        // 未使用，跳转到测试页
        router.push(`/test?access_key=${accessKey}`);
      }
    } else {
      // 没有 access_key，直接跳转到测试页
      router.push('/test');
    }
  };

  const symptoms = {
    left: ["胸闷", "心悸", "绝望"],
    right: ["紧张", "焦虑", "烦躁"],
    bottom: ["不安", "压抑", "悲观"],
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      {/* 背景遮罩层，确保内容可读性 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/40 backdrop-blur-[2px]" />

      <main className="max-w-md w-full text-center space-y-6 relative z-10">
        {/* 主标题 */}
        <div className="space-y-3 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 drop-shadow-lg">
            你离抑郁有多远
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 drop-shadow-lg">
            抑郁风险评估
          </h2>
        </div>

        {/* 仪表盘区域 */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
          <DepressionGauge score={score} />
        </div>

        {/* 症状词云区域 */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/50">
          <div className="text-gray-800 font-semibold mb-5" style={{ fontSize: '24px' }}>你是否经常感到</div>
          <SymptomCloud symptoms={symptoms} />
        </div>

        {/* 重要提示 */}
        <div className="bg-blue-50 rounded-2xl p-5 border-2 border-blue-200 shadow-lg">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>⚠️</span>
            <span>重要提示</span>
          </h3>
          <ul className="text-sm text-gray-900 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-gray-700 font-bold">•</span>
              <span>本测试仅作为参考工具，不能替代专业诊断</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-700 font-bold">•</span>
              <span>预计耗时：15-20分钟（请确保环境安静）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-700 font-bold">•</span>
              <span>根据最近1周内的实际感受选择，无需过度思考</span>
            </li>
          </ul>
        </div>

        {/* 底部按钮 */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleStartTest}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            开始测试
          </button>
          <Link
            href="/result"
            className="flex-1 bg-white/90 hover:bg-white text-gray-800 font-bold py-4 rounded-full shadow-lg transition-all transform hover:scale-105 border-2 border-gray-300"
          >
            查看结果
          </Link>
        </div>
      </main>

      {/* 客服咨询悬浮按钮 */}
      <CustomerService />

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
