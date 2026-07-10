import { Flag } from 'lucide-react';

export default function QuestionViewer({ 
  question, 
  index, 
  total, 
  selectedAnswers, 
  isFlagged, 
  onSelectAnswer, 
  onToggleFlag, 
  onNext, 
  onPrev 
}) {
  if (!question) return null;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6 border-b pb-4 dark:border-slate-700">
        <h2 className="text-xl font-bold">
          Câu {index + 1} <span className="text-sm font-normal text-slate-500">/ {total}</span>
        </h2>
        <button 
          onClick={onToggleFlag}
          className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
            isFlagged 
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Flag size={18} fill={isFlagged ? "currentColor" : "none"} />
          <span className="text-sm font-medium">{isFlagged ? 'Đã đánh dấu' : 'Đánh dấu'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2">
        <p className="text-lg mb-6 whitespace-pre-wrap">{question.text}</p>
        
        <div className="space-y-3">
          {question.options.map((option, i) => {
            const isSelected = selectedAnswers.includes(option);
            return (
              <label 
                key={i} 
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <input 
                  type="checkbox" // Dùng checkbox để hỗ trợ chọn nhiều
                  className="mt-1 w-5 h-5 text-blue-600 cursor-pointer"
                  checked={isSelected}
                  onChange={() => onSelectAnswer(option)}
                />
                <span className="text-base">{option}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t dark:border-slate-700">
        <button 
          onClick={onPrev}
          disabled={index === 0}
          className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded disabled:opacity-50 hover:bg-slate-300 dark:hover:bg-slate-600 font-medium"
        >
          &larr; Câu trước
        </button>
        <button 
          onClick={onNext}
          disabled={index === total - 1}
          className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 font-medium"
        >
          Câu sau &rarr;
        </button>
      </div>
    </div>
  );
}
