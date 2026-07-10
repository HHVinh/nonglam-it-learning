import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Bot, ArrowLeft } from 'lucide-react';

export default function QuizResultPage() {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || 'A';
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const savedResults = localStorage.getItem(`quiz_${subject}_results`);
    if (savedResults) {
      setResultData(JSON.parse(savedResults));
    }
  }, [subject]);

  const handleAskAI = (qId) => {
    // Tạm thời hiển thị alert. Ở phase sau sẽ gọi API tới Gemini.
    alert('Tính năng Hỏi AI (Gemini) sẽ được mở khóa ở bản cập nhật sau!');
  };

  if (!resultData) {
    return (
      <div className="pt-16 container mx-auto p-8 text-center">
        <p className="text-xl mb-4">Không tìm thấy kết quả thi!</p>
        <Link to={`/quiz/entry?subject=${subject}`} className="text-blue-600 underline">Quay lại danh sách đề</Link>
      </div>
    );
  }

  const { score, correctCount, totalQuestions, results, overtimeScore, overtimeCorrectCount, timeTaken, isOvertime } = resultData;
  const timeLimit = subject === 'A' ? 25 * 60 : 20 * 60;
  
  // Format thời gian hiển thị
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} phút ${s} giây`;
  };

  return (
    <div className="pt-20 container mx-auto p-4 max-w-4xl py-8 relative">
      <div className="mb-8 flex items-center sticky top-16 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <Link to={`/quiz/entry?subject=${subject}`} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 font-bold text-base transition-colors absolute">
          <ArrowLeft size={18} strokeWidth={2.5} /> Trở về
        </Link>
        <h1 className="text-xl md:text-2xl font-bold w-full text-center m-0">
          KẾT QUẢ BÀI THI
        </h1>
      </div>

      {/* Box Điểm số */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 mb-8 text-center flex flex-col md:flex-row justify-around items-center gap-6">
        <div>
          <p className="text-slate-500 uppercase tracking-wider text-sm font-bold mb-2">Điểm đúng hạn</p>
          <p className={`text-6xl font-bold ${score >= 5 ? 'text-green-600' : 'text-red-600'}`}>
            {score}
          </p>
          <p className="text-sm mt-2 text-slate-500">Đúng {correctCount} / {totalQuestions} câu</p>
        </div>
        
        {isOvertime && overtimeScore !== null && (
          <>
            <div className="h-24 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-sm font-bold mb-2 text-amber-600">Điểm lố giờ</p>
              <p className={`text-6xl font-bold ${overtimeScore >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                {overtimeScore}
              </p>
              <p className="text-sm mt-2 text-slate-500">Đúng {overtimeCorrectCount} / {totalQuestions} câu</p>
            </div>
          </>
        )}

        <div className="h-24 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

        <div>
          <p className="text-slate-500 uppercase tracking-wider text-sm font-bold mb-2">Thời gian làm bài</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {formatTime(timeTaken)}
          </p>
          {isOvertime && (
            <p className="text-sm mt-2 text-amber-600 font-semibold bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full inline-block">
              Lố {formatTime(timeTaken - timeLimit)}
            </p>
          )}
        </div>
      </div>

      {/* Chi tiết từng câu */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Chi tiết đáp án</h2>
        {Object.entries(results).map(([qId, data], index) => (
          <div 
            key={qId} 
            className={`p-6 rounded-lg border ${
              data.isCorrect 
                ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800/50' 
                : 'bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50'
            }`}
          >
            <div className="flex gap-4 items-start mb-4">
              <div className="mt-1">
                {data.isCorrect ? <CheckCircle2 className="text-green-600" size={24} /> : <XCircle className="text-red-600" size={24} />}
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold mb-4">Câu {index + 1}: {data.questionText.replace(/^Câu \d+[:\.]?\s*/i, '')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {data.options.map((opt, i) => {
                    const isUserSelected = data.userAnswers.includes(opt);
                    const isCorrectOption = data.correctAnswers.includes(opt);
                    
                    let bg = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700";
                    if (isCorrectOption) bg = "bg-green-100 border-green-500 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-bold";
                    else if (isUserSelected && !isCorrectOption) bg = "bg-red-100 border-red-500 dark:bg-red-900/40 text-red-800 dark:text-red-300 line-through";

                    return (
                      <div key={i} className={`p-3 rounded border ${bg}`}>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {data.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded text-sm">
                    <strong>Giải thích:</strong> {data.explanation}
                  </div>
                )}
                
                <div className="mt-4 text-right">
                  <button 
                    onClick={() => handleAskAI(qId)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 rounded-full text-sm font-semibold hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors"
                  >
                    <Bot size={16} />
                    Hỏi AI tại sao
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
