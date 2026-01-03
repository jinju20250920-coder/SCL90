"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/scl90";
import ProgressBar from "@/app/components/ProgressBar";
import QuestionCard from "@/app/components/QuestionCard";

export default function TestPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    // 尝试恢复进度（可选）
    const saved = localStorage.getItem("scl90_answers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        // 跳到第一个未答题目
        for (let i = 0; i < questions.length; i++) {
            if (!parsed[questions[i].id]) {
                setCurrentIndex(i);
                break;
            }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!isClient) return <div className="min-h-screen bg-white flex items-center justify-center">加载中...</div>;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelect = (value: number) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };
    setAnswers(newAnswers);
    localStorage.setItem("scl90_answers", JSON.stringify(newAnswers));

    // 自动跳转
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 250);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishTest();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const finishTest = () => {
    if (Object.keys(answers).length < totalQuestions) {
      // 找到第一个未答的
      const firstUnansweredIndex = questions.findIndex(q => !answers[q.id]);
      if (firstUnansweredIndex !== -1) {
        setCurrentIndex(firstUnansweredIndex);
        alert(`第 ${firstUnansweredIndex + 1} 题尚未回答`);
        return;
      }
    }
    router.push("/result");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-xl mx-auto">
      <ProgressBar current={currentIndex + 1} total={totalQuestions} />
      
      <div className="flex-1 flex flex-col justify-center">
        <QuestionCard
          question={currentQuestion}
          selectedOption={answers[currentQuestion.id] || null}
          onSelect={handleSelect}
        />
      </div>

      <div className="p-4 flex justify-between items-center space-x-4 mb-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex-1 py-3 rounded-full border border-orange-500 text-orange-500 font-medium transition-colors
            ${currentIndex === 0 ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400" : "hover:bg-orange-50"}`}
        >
          上一题
        </button>
        
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className={`flex-1 py-3 rounded-full bg-orange-500 text-white font-medium shadow-md transition-colors
            ${!answers[currentQuestion.id] ? "opacity-50 cursor-not-allowed bg-gray-300" : "hover:bg-orange-600"}`}
        >
          {currentIndex === totalQuestions - 1 ? "提交测试" : "下一题"}
        </button>
      </div>
    </div>
  );
}
