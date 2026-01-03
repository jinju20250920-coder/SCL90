import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <main className="max-w-md w-full text-center space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">SCL-90 心理健康症状自评量表</h1>
        <p className="text-gray-600 leading-relaxed">
          SCL-90是目前世界上最著名的心理健康测试量表之一，是当前使用最为广泛的精神障碍和心理疾病门诊检查量表。
        </p>
        <div className="bg-orange-50 p-6 rounded-2xl text-left space-y-2 text-sm text-gray-700">
          <p>• 共 90 道题目</p>
          <p>• 预计用时 10-15 分钟</p>
          <p>• 请根据您最近一周的实际感觉回答</p>
        </div>
        <Link 
          href="/test"
          className="block w-full bg-orange-500 text-white font-bold py-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        >
          开始测评
        </Link>
      </main>
    </div>
  );
}
