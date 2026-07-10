import { useSearchParams, useNavigate } from 'react-router-dom';

export default function QuizEntryPage() {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || 'A';
  const navigate = useNavigate();

  const title = subject === 'A' ? "Đề thi ngẫu nhiên Tin A" : "Đề thi ngẫu nhiên Tin B";
  const questionCount = subject === 'A' ? 60 : 50;
  const timeLimit = subject === 'A' ? 25 : 20;

  const handleStart = () => {
    // Xóa bộ nhớ đệm bài thi cũ nếu có
    localStorage.removeItem(`quiz_${subject}_answers`);
    localStorage.removeItem(`quiz_${subject}_flags`);
    localStorage.removeItem(`quiz_${subject}_time`);
    navigate(`/quiz/active?subject=${subject}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow border border-slate-200 dark:border-slate-700 w-full text-center">
        <div className="flex justify-around mb-8">
          <div>
            <p className="text-slate-500 text-sm">Số câu hỏi</p>
            <p className="text-2xl font-bold">{questionCount}</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm">Thời gian làm bài</p>
            <p className="text-2xl font-bold">{timeLimit} phút</p>
          </div>
        </div>
        <button 
          onClick={handleStart}
          className="px-8 py-3 bg-blue-600 text-white text-lg font-bold rounded hover:bg-blue-700 w-full"
        >
          BẮT ĐẦU LÀM
        </button>
      </div>
    </div>
  );
}
