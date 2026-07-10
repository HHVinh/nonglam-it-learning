export default function QuizSidebar({ 
  questions, 
  currentIndex, 
  answers, 
  flags, 
  onNavigate, 
  timeString, 
  isOvertime, 
  onSubmitEarly 
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      
      {/* Khối hiển thị ô vuông */}
      <div className="flex-1 overflow-y-auto mb-4">
        <h3 className="font-bold mb-4 text-center border-b pb-2 dark:border-slate-700">Danh sách câu hỏi</h3>
        <div className="grid grid-cols-10 gap-1 md:grid-cols-5 md:gap-2">
          {questions.map((q, idx) => {
            const hasAnswer = answers[q._id] && answers[q._id].length > 0;
            const isFlagged = flags[q._id];
            const isCurrent = currentIndex === idx;

            let bgColor = "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"; // Chưa làm
            if (isFlagged) {
              bgColor = "bg-amber-300 dark:bg-amber-500 text-amber-900"; // Đang phân vân
            } else if (hasAnswer) {
              bgColor = "bg-blue-500 text-white"; // Đã làm
            }

            if (isCurrent) {
              bgColor += " ring-2 ring-offset-2 ring-blue-600 dark:ring-blue-400"; // Đang chọn
            }

            return (
              <button
                key={q._id}
                onClick={() => onNavigate(idx)}
                className={`w-full aspect-square flex items-center justify-center rounded font-semibold text-[11px] md:text-sm transition-all ${bgColor}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nút nộp bài */}
      <button 
        onClick={onSubmitEarly}
        className="w-full py-3 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition-colors"
      >
        NỘP BÀI
      </button>
    </div>
  );
}
