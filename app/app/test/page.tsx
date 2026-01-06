"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/scl90";
import TestHeader from "@/app/components/TestHeader";
import QuestionCard from "@/app/components/QuestionCard";
import {
  isValidAccessKey,
  isAccessKeyUsed,
  setCurrentAccessKey,
  getCurrentAccessKey,
} from "@/lib/accessKey";

export default function TestPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isClient, setIsClient] = useState(false);
  const [isFillingMissing, setIsFillingMissing] = useState(false); // 是否正在补答漏答题目
  const [isProcessing, setIsProcessing] = useState(false); // 防止快速点击

  const totalQuestions = questions.length;
  
  // 所有 Hooks 必须在早期返回之前调用
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);

    // 验证 access_key（如果存在）
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const accessKey = params.get('access_key');

      if (accessKey) {
        // 验证 access_key 格式
        if (!isValidAccessKey(accessKey)) {
          alert('无效的访问密钥，请重新验证订单');
          router.push('/verify');
          return;
        }

        // 检查是否已使用
        if (isAccessKeyUsed(accessKey)) {
          alert('此链接已使用过，无法重复测试。如需重新测试，请重新下单。');
          router.push('/');
          return;
        }

        // 保存当前 access_key
        setCurrentAccessKey(accessKey);
      }
    }

    // 尝试恢复进度（可选）
    const saved = localStorage.getItem("scl90_answers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        // 跳到第一个未答题目
        for (let i = 0; i < questions.length; i++) {
            if (!parsed[questions[i].id]) {
                const targetIndex = Math.max(0, Math.min(i, questions.length - 1));
                setCurrentIndex(targetIndex);
                break;
            }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [router]);

  // 确保 currentIndex 在有效范围内
  useEffect(() => {
    if (currentIndex < 0 || currentIndex >= totalQuestions) {
      const correctedIndex = Math.max(0, Math.min(currentIndex, totalQuestions - 1));
      if (correctedIndex !== currentIndex) {
        setCurrentIndex(correctedIndex);
      }
    }
  }, [currentIndex, totalQuestions]);

  if (!isClient) return <div className="min-h-screen flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl mx-4 my-4 p-8 shadow-lg">加载中...</div>;

  // 在早期返回之后计算这些值
  const safeIndex = Math.max(0, Math.min(currentIndex, totalQuestions - 1));

  const currentQuestion = questions[safeIndex];
  
  // 安全检查：确保 currentQuestion 存在
  if (!currentQuestion || safeIndex < 0 || safeIndex >= totalQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl mx-4 my-4 p-8 shadow-lg">
        <div className="text-center">
          <p className="text-gray-600 mb-4">题目加载错误，请刷新页面重试</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }

  const handleSelect = (value: number) => {
    if (isProcessing) return; // 防止快速点击
    
    setIsProcessing(true);
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };
    setAnswers(newAnswers);
    localStorage.setItem("scl90_answers", JSON.stringify(newAnswers));

    // 如果正在补答漏答题目
    if (isFillingMissing) {
      // 检查是否还有漏答的题目
      const nextUnansweredIndex = questions.findIndex((q, idx) => idx > currentIndex && !newAnswers[q.id]);
      if (nextUnansweredIndex !== -1) {
        // 还有漏答的题目，跳转到下一个漏答题目
        setTimeout(() => {
          if (nextUnansweredIndex >= 0 && nextUnansweredIndex < totalQuestions) {
            setCurrentIndex(nextUnansweredIndex);
          }
          setIsProcessing(false);
        }, 300);
      } else {
        // 所有漏答题目都已答完，跳转到最后一题
        setTimeout(() => {
          const lastIndex = totalQuestions - 1;
          if (lastIndex >= 0 && lastIndex < totalQuestions) {
            setCurrentIndex(lastIndex);
          }
          setIsFillingMissing(false);
          setIsProcessing(false);
        }, 300);
      }
    } else {
      // 正常答题流程，自动跳转到下一题
      if (currentIndex < totalQuestions - 1) {
        setTimeout(() => {
          const nextIndex = currentIndex + 1;
          if (nextIndex >= 0 && nextIndex < totalQuestions) {
            setCurrentIndex(nextIndex);
          }
          setIsProcessing(false);
        }, 300);
      } else {
        setIsProcessing(false);
      }
    }
  };

  const handleNext = () => {
    if (isProcessing) return; // 防止快速点击
    
    setIsProcessing(true);
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      // 确保索引在有效范围内
      if (nextIndex >= 0 && nextIndex < totalQuestions) {
        setCurrentIndex(nextIndex);
      }
    } else {
      finishTest();
    }
    // 300ms后解除锁定
    setTimeout(() => {
      setIsProcessing(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isProcessing) return; // 防止快速点击
    
    setIsProcessing(true);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      // 确保索引在有效范围内
      if (prevIndex >= 0 && prevIndex < totalQuestions) {
        setCurrentIndex(prevIndex);
      }
    }
    // 300ms后解除锁定
    setTimeout(() => {
      setIsProcessing(false);
    }, 300);
  };

  const finishTest = () => {
    // 检查是否有漏答的题目
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      // 找到第一个未答的题目
      const firstUnansweredIndex = questions.findIndex(q => !answers[q.id]);
      if (firstUnansweredIndex !== -1) {
        setCurrentIndex(firstUnansweredIndex);
        setIsFillingMissing(true); // 标记为正在补答漏答题目
        alert(`第 ${firstUnansweredIndex + 1} 题尚未回答，请先完成所有题目`);
        return;
      }
    }
    // 所有题目都已答完，跳转到结果页面
    router.push("/result");
  };

  return (
    <div className="min-h-screen flex flex-col max-w-xl mx-auto">
      <TestHeader current={currentIndex + 1} total={totalQuestions} />
      
      <div className="flex-1 flex flex-col justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
          <QuestionCard
            question={currentQuestion}
            selectedOption={answers[currentQuestion.id] || null}
            onSelect={handleSelect}
          />
        </div>
      </div>

      <div className="p-4 flex justify-between items-center space-x-4 mb-8 bg-white/90 backdrop-blur-sm rounded-2xl mx-4 shadow-lg">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0 || isProcessing}
          className={`flex-1 py-3 rounded-full border border-orange-500 text-orange-500 font-medium transition-colors
            ${currentIndex === 0 || isProcessing ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : "hover:bg-orange-50"}`}
        >
          上一题
        </button>
        
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id] || isProcessing}
          className={`flex-1 py-3 rounded-full bg-orange-500 text-white font-medium shadow-md transition-colors
            ${!answers[currentQuestion.id] || isProcessing ? "opacity-50 cursor-not-allowed bg-gray-300" : "hover:bg-orange-600"}`}
        >
          {currentIndex === totalQuestions - 1 ? "提交测试" : "下一题"}
        </button>
      </div>
    </div>
  );
}
