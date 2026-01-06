"use client";

import { useEffect, useState } from "react";
import { factors } from "@/lib/scl90";
import { factorDescriptions } from "@/lib/factorDescriptions";
import ProgressBar from "@/app/components/ProgressBar";
import SymptomRadar from "@/app/components/SymptomRadar";
import SymptomPie from "@/app/components/SymptomPie";
import SymptomBar from "@/app/components/SymptomBar";
import {
  getCurrentAccessKey,
  markAccessKeyUsed,
  clearCurrentAccessKey,
} from "@/lib/accessKey";

interface FactorResult {
  name: string;
  totalScore: number;
  avgScore: number;
  level: string;
}

interface ResultData {
  factorResults: FactorResult[];
  totalScore: number;
  totalAvg: number;
  positiveCount: number;
}

export default function ResultPage() {
  const [result, setResult] = useState<ResultData | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showPositiveModal, setShowPositiveModal] = useState(false);

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

      Object.values(answers).forEach(val => {
        totalScore += val;
        if (val >= 2) positiveCount++;
      });

      const factorResults: FactorResult[] = factors.map(factor => {
        let sum = 0;
        let count = 0;
        factor.questionIds.forEach(qid => {
          if (answers[qid]) {
            sum += answers[qid];
            count++;
          }
        });
        const avgScore = count > 0 ? Number((sum / count).toFixed(2)) : 0;
        const totalFactorScore = sum;

        // 判断等级：正常、轻度、中度、重度
        let level = "正常";
        if (avgScore >= 3.5) {
          level = "重度";
        } else if (avgScore >= 2.5) {
          level = "中度";
        } else if (avgScore >= 2.0) {
          level = "轻度";
        }

        return {
          name: factor.name,
          totalScore: totalFactorScore,
          avgScore: avgScore,
          level: level
        };
      });

      setResult({
        factorResults,
        totalScore,
        totalAvg: Number((totalScore / 90).toFixed(2)),
        positiveCount
      });

      // 标记 access_key 为已使用
      const currentAccessKey = getCurrentAccessKey();
      if (currentAccessKey) {
        markAccessKeyUsed(currentAccessKey);
        clearCurrentAccessKey();
      }
    } catch (e) {
      console.error(e);
      window.location.href = "/";
    }
  }, []);

  if (!result) return <div className="min-h-screen flex items-center justify-center"><div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-gray-500">正在生成分析报告...</div></div>;

  // 排序逻辑：有问题的因子（轻度及以上）放在前面
  const sortedFactorResults = [...result.factorResults].sort((a, b) => {
    const getLevelPriority = (level: string) => {
      if (level === "重度") return 3;
      if (level === "中度") return 2;
      if (level === "轻度") return 1;
      return 0;
    };
    const priorityA = getLevelPriority(a.level);
    const priorityB = getLevelPriority(b.level);

    if (priorityA !== priorityB) {
      return priorityB - priorityA; // 有问题的在前
    }
    return b.avgScore - a.avgScore; // 相同等级按分数降序
  });

  const getOverallStatus = () => {
    const hasSevere = sortedFactorResults.some(f => f.level === "重度");
    const hasModerate = sortedFactorResults.some(f => f.level === "中度");
    const hasMild = sortedFactorResults.some(f => f.level === "轻度");

    if (hasSevere) return { text: "需要关注", color: "bg-red-500", textColor: "text-red-600", bgColor: "bg-red-50" };
    if (hasModerate) return { text: "建议关注", color: "bg-orange-500", textColor: "text-orange-600", bgColor: "bg-orange-50" };
    if (hasMild) return { text: "轻微关注", color: "bg-yellow-500", textColor: "text-yellow-600", bgColor: "bg-yellow-50" };
    return { text: "状态良好", color: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-50" };
  };

  const overallStatus = getOverallStatus();

  // 总分解读
  const getScoreInterpretation = () => {
    if (result.totalScore > 250 || result.totalAvg > 3) {
      return {
        level: "严重",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-500",
        description: "您的总体心理症状较为严重，可能正在经历较大的心理压力和困扰。这种情况可能会明显影响您的日常生活、工作和人际关系。建议您尽快寻求专业心理咨询师或精神科医生的帮助，进行深入评估和针对性的治疗。"
      };
    } else if (result.totalScore > 200 || result.totalAvg > 2.5) {
      return {
        level: "较重",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-500",
        description: "您的总体心理症状较为明显，可能存在一定的心理压力和困扰。这种情况已经开始对您的生活产生一些影响。建议您关注自己的心理状态，必要时寻求专业心理咨询师的帮助，通过心理咨询和调适来改善症状。"
      };
    } else if (result.totalScore > 160 || result.totalAvg > 2) {
      return {
        level: "轻度",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-500",
        description: "您的总体心理症状处于轻度水平，可能在某些方面存在一些压力或困扰。这种程度的症状在日常生活中较为常见，通常会随着时间推移或通过自我调节得到缓解。建议您注意劳逸结合，保持良好的生活习惯，适当进行放松和减压活动。"
      };
    } else {
      return {
        level: "正常",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-500",
        description: "您的总体心理状态良好，心理症状处于正常范围内。这表明您具有较好的心理健康水平和适应能力。建议您继续保持良好的生活习惯和积极的心态，定期进行自我关怀和心理调适。"
      };
    }
  };

  const scoreInterpretation = getScoreInterpretation();

  // 阳性项目解读
  const getPositiveInterpretation = () => {
    const positiveRate = (result.positiveCount / 90) * 100;

    if (result.positiveCount >= 43) {
      return {
        level: "严重",
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "阳性项目数过多（≥43项），说明您在多个方面都存在心理困扰，症状分布较为广泛，需要特别重视。"
      };
    } else if (result.positiveCount >= 30) {
      return {
        level: "较多",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: `阳性项目数较多（${result.positiveCount}项），占全部项目的${positiveRate.toFixed(1)}%。说明您在多个方面存在心理困扰，建议关注心理健康。`
      };
    } else if (result.positiveCount >= 20) {
      return {
        level: "中等",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        description: `阳性项目数处于中等水平（${result.positiveCount}项），占全部项目的${positiveRate.toFixed(1)}%。说明您在某些方面存在心理困扰，需要适当关注。`
      };
    } else {
      return {
        level: "较少",
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: `阳性项目数较少（${result.positiveCount}项），占全部项目的${positiveRate.toFixed(1)}%。说明您的心理状态整体良好，只有少数方面存在轻微困扰。`
      };
    }
  };

  const positiveInterpretation = getPositiveInterpretation();

  const getLevelColor = (level: string) => {
    if (level === "重度") return "text-red-600";
    if (level === "中度") return "text-orange-500";
    if (level === "轻度") return "text-yellow-600";
    return "text-green-500";
  };

  const getLevelBgColor = (level: string) => {
    if (level === "重度") return "bg-red-50 border-red-200";
    if (level === "中度") return "bg-orange-50 border-orange-200";
    if (level === "轻度") return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  const getLevelBorderColor = (level: string) => {
    if (level === "重度") return "border-l-red-500";
    if (level === "中度") return "border-l-orange-500";
    if (level === "轻度") return "border-l-yellow-500";
    return "border-l-green-500";
  };

  const getFactorDescription = (factorName: string, level: string) => {
    const factorDesc = factorDescriptions.find(f => f.name === factorName);
    if (!factorDesc) return "";

    switch (level) {
      case "重度":
        return factorDesc.severe;
      case "中度":
        return factorDesc.moderate;
      case "轻度":
        return factorDesc.mild;
      default:
        return factorDesc.normal;
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 bg-cover bg-center bg-no-repeat relative"
         style={{
           backgroundImage: "url('/background.jpg')",
         }}
    >
      {/* 背景遮罩层 */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] -z-10" />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">SCL-90测试结果分析</h1>
          <p className="text-sm text-gray-500">本结果仅供参考，不作为医学诊断依据</p>
        </div>

        {/* 测试结果汇总卡片 */}
        <div className={`${overallStatus.bgColor} border-2 ${overallStatus.color.replace('bg-', 'border-')} rounded-3xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">测试结果汇总</h2>
            <div className={`${overallStatus.color} text-white px-6 py-3 rounded-full text-base font-bold shadow-lg`}>
              {overallStatus.text}
            </div>
          </div>

          {/* 核心数据展示 */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* 总分 */}
            <div
              className="bg-white rounded-2xl p-5 shadow-md cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowScoreModal(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-bold text-gray-800">{result.totalScore}</div>
                  <div className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                    <span>总分</span>
                    <span className="text-blue-500">ℹ️</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">平均分</div>
                  <div className="text-2xl font-bold text-gray-700">{result.totalAvg}</div>
                </div>
              </div>
            </div>

            {/* 阳性项目 */}
            <div
              className="bg-white rounded-2xl p-5 shadow-md cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowPositiveModal(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-bold text-gray-800">{result.positiveCount}</div>
                  <div className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                    <span>阳性项目数</span>
                    <span className="text-blue-500">ℹ️</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">占比</div>
                  <div className="text-2xl font-bold text-gray-700">
                    {((result.positiveCount / 90) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 整体评估 */}
          <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">整体评估</h3>
            <div className="flex items-center gap-3">
              <div className={`flex-1 ${scoreInterpretation.bgColor} rounded-xl p-4 border-l-4 ${scoreInterpretation.borderColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">您的心理状态等级：</span>
                  <span className={`px-4 py-1 rounded-full text-base font-bold ${scoreInterpretation.bgColor} ${scoreInterpretation.color} border-2 ${scoreInterpretation.borderColor}`}>
                    {scoreInterpretation.level}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {scoreInterpretation.description}
                </p>
              </div>
            </div>
          </div>

          {/* 可视化分析 */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">可视化分析</h3>
            <div className="grid grid-cols-1 gap-4">
              {/* 柱状图 - 独占一行 */}
              <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-sm font-bold text-gray-700 mb-3 text-center">因子分数对比（柱状图）</h4>
                <SymptomBar factorResults={sortedFactorResults} />
              </div>

              {/* 雷达图 */}
              <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-sm font-bold text-gray-700 mb-3 text-center">症状分布雷达图</h4>
                <SymptomRadar factorResults={sortedFactorResults} />
              </div>
            </div>
          </div>
        </div>

        {/* 因子结果卡片列表 */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-gray-800">因子详细分析</h2>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>

          {sortedFactorResults.map((factor, index) => {
            const factorDesc = factorDescriptions.find(f => f.name === factor.name);
            const description = getFactorDescription(factor.name, factor.level);
            const factorInfo = factors.find(f => f.name === factor.name);

            return (
              <div
                key={factor.name}
                className={`bg-white rounded-xl p-5 shadow-md border-l-4 ${getLevelBorderColor(factor.level)} hover:shadow-lg transition-shadow`}
              >
                {/* 第一行：因子名称和分数 */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`${overallStatus.color} text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm`}>
                    {factor.name}
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl font-bold text-gray-800">{factor.totalScore}</div>
                      <div className="text-sm text-gray-500">总分</div>
                    </div>
                    <div className={`text-base font-bold mt-2 ${getLevelColor(factor.level)}`}>
                      {factor.level}
                    </div>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mb-4">
                  <ProgressBar value={factor.avgScore} />
                </div>

                {/* 因子描述 */}
                {factorInfo && (
                  <div className="mb-3">
                    <h4 className="text-xs font-bold text-gray-700 mb-1">💡 症状说明</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {factorInfo.description}
                    </p>
                  </div>
                )}

                {/* 建议文字 */}
                {description && (
                  <div className="mt-3">
                    <h4 className="text-xs font-bold text-gray-700 mb-1">📋 专业建议</h4>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">
                      {description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 关于结果的说明 */}
        <div className={`${overallStatus.bgColor} rounded-3xl overflow-hidden border-t-4 ${overallStatus.color.replace('bg-', 'border-')} shadow-lg`}>
          <div className={`bg-gradient-to-r ${overallStatus.color.replace('bg-', 'from-')} ${overallStatus.color.replace('bg-', 'to-')} ${overallStatus.color.replace('bg-', 'to-').replace('500', '600')} text-white px-6 py-3`}>
            <h2 className="text-base font-bold">⚠️ 关于结果的说明</h2>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              本报告基于您的自评数据生成，可作为心理状态的参考，但不能替代专业医生的诊断。
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              如果某些结果让您感到担忧，建议与心理咨询师或精神科医生进一步沟通。
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              测试结果受多种因素影响，请结合实际情况综合判断。
            </p>
          </div>
        </div>
      </div>

      {/* 总分解读弹窗 */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowScoreModal(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* 标题栏 */}
            <div className={`${scoreInterpretation.bgColor} border-b-4 ${scoreInterpretation.borderColor} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">总分解读</h3>
                <button
                  onClick={() => setShowScoreModal(false)}
                  className="w-8 h-8 rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center transition-colors"
                >
                  <span className="text-gray-600 text-xl">×</span>
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-6 space-y-4">
              {/* 等级标签 */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">您的等级：</span>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${scoreInterpretation.bgColor} ${scoreInterpretation.color} border-2 ${scoreInterpretation.borderColor}`}>
                  {scoreInterpretation.level}
                </span>
              </div>

              {/* 详细说明 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {scoreInterpretation.description}
                </p>
              </div>

              {/* 参考标准 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-700">📊 参考标准</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">严重：总分 &gt; 250 或 平均分 &gt; 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-700">较重：总分 &gt; 200 或 平均分 &gt; 2.5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-700">轻度：总分 &gt; 160 或 平均分 &gt; 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">正常：总分 ≤ 160 且 平均分 ≤ 2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setShowScoreModal(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 阳性项目解读弹窗 */}
      {showPositiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowPositiveModal(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* 标题栏 */}
            <div className={`${positiveInterpretation.bgColor} border-b-4 ${positiveInterpretation.color.replace('text-', 'border-')} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">阳性项目解析</h3>
                <button
                  onClick={() => setShowPositiveModal(false)}
                  className="w-8 h-8 rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center transition-colors"
                >
                  <span className="text-gray-600 text-xl">×</span>
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-6 space-y-4">
              {/* 定义说明 */}
              <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                <h4 className="text-sm font-bold text-gray-800 mb-2">📌 什么是阳性项目？</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  阳性项目是指您在测试中得分 ≥ 2 分的项目数量。这些项目反映了您可能存在的心理困扰或症状。
                  得分 ≥ 2 分表示该症状在"有时"、"经常"或"频繁"出现，需要引起关注。
                </p>
              </div>

              {/* 您的阳性项目 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-700">您的阳性项目数</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${positiveInterpretation.bgColor} ${positiveInterpretation.color}`}>
                    {positiveInterpretation.level}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">{result.positiveCount}</div>
                    <div className="text-xs text-gray-500 mt-1">项</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${positiveInterpretation.color.replace('text-', 'bg-')} transition-all duration-500`}
                        style={{ width: `${Math.min((result.positiveCount / 90) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {((result.positiveCount / 90) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 解读说明 */}
              <div className={`${positiveInterpretation.bgColor} rounded-xl p-4`}>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {positiveInterpretation.description}
                </p>
              </div>

              {/* 参考标准 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gray-700">📊 参考标准</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">严重：≥ 43 项（约占48%）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-700">较多：30 - 42 项</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-700">中等：20 - 29 项</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">较少：&lt; 20 项</span>
                  </div>
                </div>
              </div>

              {/* 温馨提示 */}
              <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
                <h4 className="text-sm font-bold text-gray-800 mb-2">💡 温馨提示</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  阳性项目数多并不一定代表心理问题严重，还需要结合具体项目和严重程度综合判断。
                  如果阳性项目集中在某个特定因子，可能说明您在该方面存在较明显的困扰。
                </p>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setShowPositiveModal(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
