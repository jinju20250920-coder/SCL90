"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateAccessKey } from "@/lib/accessKey";

export default function VerifyPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleVerify = () => {
    if (!orderId.trim()) {
      setError("请输入订单号");
      return;
    }

    // 清除订单号中的空格
    const cleanOrderId = orderId.trim().replace(/\s+/g, "");

    if (cleanOrderId.length < 5) {
      setError("订单号格式不正确，请检查后重新输入");
      return;
    }

    // 生成 access_key
    const generatedKey = generateAccessKey(cleanOrderId);
    setAccessKey(generatedKey);
    setIsVerified(true);
    setError("");
  };

  const handleStartTest = () => {
    // 跳转到主页，带上 access_key 参数
    router.push(`/?access_key=${accessKey}`);
  };

  const handleCopyLink = async () => {
    const testUrl = `${window.location.origin}/test?access_key=${accessKey}`;

    try {
      await navigator.clipboard.writeText(testUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
      // 降级方案：使用传统方法
      const textArea = document.createElement("textarea");
      textArea.value = testUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        setError("复制失败，请手动复制链接");
      }
      document.body.removeChild(textArea);
    }
  };

  const testUrl = accessKey ? `${window.location.origin}/test?access_key=${accessKey}` : "";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      {/* 背景遮罩层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/40 backdrop-blur-[2px]" />

      <main className="max-w-md w-full relative z-10">
        {/* 主卡片 */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
          {/* 标题 */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">订单验证</h1>
            <p className="text-gray-600">请输入您在小红书购买时的订单号</p>
          </div>

          {/* 输入区域 */}
          {!isVerified ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  订单号
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => {
                    setOrderId(e.target.value);
                    setError("");
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleVerify();
                    }
                  }}
                  placeholder="例如：2025010612345678"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white/80 text-gray-800 placeholder-gray-400"
                />
                {error && (
                  <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleVerify}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                验证订单
              </button>

              {/* 使用说明 */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 使用说明</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• 请输入您在小红书下单时的订单号</li>
                  <li>• 订单号可以在订单详情中找到</li>
                  <li>• 验证成功后将生成专属测试链接</li>
                  <li>• 每个订单仅可测试一次，请妥善保管</li>
                </ul>
              </div>
            </div>
          ) : (
            /* 验证成功区域 */
            <div className="space-y-6">
              {/* 成功提示 */}
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">验证成功！</h2>
                <p className="text-gray-600">您的专属测试链接已生成</p>
              </div>

              {/* 测试链接显示 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  您的专属测试链接
                </label>
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-xs text-gray-600 break-all font-mono">
                    {testUrl}
                  </p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <button
                  onClick={handleStartTest}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>🚀</span>
                  <span>立即开始测试</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 rounded-full shadow-lg transition-all border-2 border-gray-300 flex items-center justify-center gap-2"
                >
                  <span>{copied ? "✅" : "📋"}</span>
                  <span>{copied ? "已复制！" : "复制链接"}</span>
                </button>

                <button
                  onClick={() => {
                    setIsVerified(false);
                    setAccessKey("");
                    setOrderId("");
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 font-semibold py-2 transition-colors"
                >
                  返回重新验证
                </button>
              </div>

              {/* 重要提示 */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">⚠️ 重要提示</h3>
                <ul className="text-xs text-yellow-800 space-y-1">
                  <li>• 建议您立即开始测试或保存链接</li>
                  <li>• 测试链接生成后可重复访问</li>
                  <li>• 一旦开始测试，链接将无法重复使用</li>
                  <li>• 请在安静环境下完成测试（15-20分钟）</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-700">
            如有疑问，请联系客服
          </p>
        </div>
      </main>
    </div>
  );
}
