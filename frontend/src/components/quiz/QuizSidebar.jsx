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
        <div className="grid grid-cols-5 gap-2">
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
                className={`w-full aspect-square flex items-center justify-center rounded font-semibold text-sm transition-all ${bgColor}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Khối hiển thị Đồng hồ */}
      <div className={`text-center p-4 rounded-lg mb-4 font-mono text-3xl font-bold tracking-wider ${
        isOvertime 
          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
          : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
      }`}>
        {timeString}
        {isOvertime && <p className="text-xs mt-1 text-red-500 font-sans">Thời gian lố</p>}
      </div>

      {/* Nút nộp bài */}
      <button 
        onClick={onSubmitEarly}
        className="w-full py-3 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition-colors"
      >
        NỘP BÀI SỚM
      </button>
    </div>
  );
}
