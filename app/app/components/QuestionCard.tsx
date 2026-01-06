import { Question, options } from "@/lib/scl90";

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  onSelect: (value: number) => void;
}

export default function QuestionCard({ question, selectedOption, onSelect }: QuestionCardProps) {
  // 安全检查
  if (!question) {
    return <div className="text-center text-gray-500">题目加载中...</div>;
  }
  
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold text-center mb-8 text-gray-800 leading-relaxed">
        {question.text}
      </h2>
      <div className="w-full space-y-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`w-full py-3.5 px-6 rounded-full border transition-all duration-200 text-left relative
              ${
                selectedOption === option.value
                  ? "border-orange-500 bg-orange-50 text-orange-600 font-medium shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            <span className="ml-2">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
