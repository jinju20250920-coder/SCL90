"use client";

import { useEffect, useState } from "react";
import { factors } from "@/lib/scl90";

interface ResultData {
  factorScores: Record<string, number>;
  totalScore: number;
  totalAvg: number;
  positiveCount: number;
}

export default function ResultPage() {
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("scl90_answers");
    if (!saved) {
      window.location.href = "/";
      return;
    }

    try {
      const answers: Record<number, number> = JSON.parse(saved);
      
      let totalScore = 0;
      let positiveCount = 0;
      const factorScores: Record<string, number> = {};

      Object.values(answers).forEach(val => {
        totalScore += val;
        if (val >= 2) positiveCount++;
      });

      factors.forEach(factor => {
        let sum = 0;
        let count = 0;
        factor.questionIds.forEach(qid => {
            // 确保有答案，虽然应该都有
          if (answers[qid]) {
            sum += answers[qid];
            count++;
          }
        });
        // 保留两位小数
        factorScores[factor.name] = count > 0 ? Number((sum / count).toFixed(2)) : 0;
      });

      setResult({
        factorScores,
        totalScore,
        totalAvg: Number((totalScore / 90).toFixed(2)),
        positiveCount
      });
    } catch (e) {
      console.error(e);
      window.location.href = "/";
    }
  }, []);

  if (!result) return <div className="min-h-screen flex items-center justify-center text-gray-500">正在生成分析报告...</div>;

  const getLevel = (score: number) => {
    if (score >= 3) return { text: "中重度", color: "text-red-600", bg: "bg-red-50" };
    if (score >= 2) return { text: "轻度", color: "text-orange-500", bg: "bg-orange-50" };
    return { text: "正常", color: "text-green-500", bg: "bg-green-50" };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">测试结果分析</h1>
          <p className="text-center text-gray-500 text-sm mb-8">本结果仅供参考，不作为医学诊断依据</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-gray-50 p-4 rounded-xl text-center">
               <div className="text-gray-500 text-sm mb-1">总分</div>
               <div className="text-2xl font-bold text-gray-800">{result.totalScore}</div>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl text-center">
               <div className="text-gray-500 text-sm mb-1">阳性项目数</div>
               <div className="text-2xl font-bold text-gray-800">{result.positiveCount}</div>
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800 border-b pb-2">因子分析</h3>
            {factors.map(factor => {
              const score = result.factorScores[factor.name];
              const level = getLevel(score);
              return (
                <div key={factor.name} className="flex flex-col space-y-2 py-3 border-b last:border-0 border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{factor.name}</span>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${level.color} ${level.bg}`}>{level.text}</span>
                      <span className="w-12 text-right font-mono text-gray-600 font-bold">{score}</span>
                    </div>
                  </div>
                  {score >= 2 && (
                    <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-2 rounded">{factor.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center pb-8">
            <button 
                onClick={() => {
                    localStorage.removeItem("scl90_answers");
                    window.location.href = "/test";
                }}
                className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 transition-colors w-full sm:w-auto"
            >
                重新测试
            </button>
        </div>
      </div>
    </div>
  );
}
