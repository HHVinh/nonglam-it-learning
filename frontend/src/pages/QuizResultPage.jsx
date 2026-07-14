import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Bot, ArrowLeft, CheckSquare, Square, Info } from 'lucide-react';

export default function QuizResultPage() {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || 'A';
  const [resultData, setResultData] = useState(null);
  const [selectedForAI, setSelectedForAI] = useState([]);
  const [askedAILog, setAskedAILog] = useState([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const savedResults = localStorage.getItem(`quiz_${subject}_results`);
    if (savedResults) {
      setResultData(JSON.parse(savedResults));
    }
  }, [subject]);

  const toggleAISelection = (qId) => {
    if (selectedForAI.includes(qId)) {
      setSelectedForAI(prev => prev.filter(id => id !== qId));
    } else {
      if (selectedForAI.length >= 10) {
        alert("Chỉ nên chọn tối đa 10 câu để AI giải thích tốt nhất!");
        return;
      }
      setSelectedForAI(prev => [...prev, qId]);
    }
  };

  const executeAskAI = () => {
    let prompt = "Đóng vai một giáo viên Tin học, hãy giải thích ngắn gọn tại sao tôi lại chọn sai trong các câu trắc nghiệm sau:\n\n";
    
    selectedForAI.forEach((qId, index) => {
      const qData = resultData.results[qId];
      const wrongAnswers = qData.userAnswers.join(', ') || 'Bỏ trống';
      const correct = qData.correctAnswers.join(', ');
      
      const cleanQuestionText = qData.questionText.replace(/^Câu \d+[:\.]?\s*/i, '');
      prompt += `Câu ${index + 1}: ${cleanQuestionText}\n`;
      prompt += `(Tôi chọn đáp án: [${wrongAnswers}], nhưng đáp án đúng là: [${correct}])\n\n`;
    });

    navigator.clipboard.writeText(prompt).then(() => {
      setAskedAILog(prev => [...prev, ...selectedForAI]);
      setSelectedForAI([]);
      setToastMsg("✅ Đã copy câu hỏi! Hãy nhấn Ctrl + V bên tab ChatGPT nhé.");
      setTimeout(() => setToastMsg(""), 4000);
      window.open("https://chatgpt.com/", "chatgpt_window");
    }).catch(() => {
      alert("Không thể copy vào bộ nhớ tạm. Trình duyệt của bạn có thể đang chặn.");
    });
  };

  const handleBulkAskAI = () => {
    if (selectedForAI.length === 0) return;
    
    const lastAITime = localStorage.getItem('lastAIModalTime');
    const now = Date.now();
    // 30 phút = 30 * 60 * 1000 = 1800000 milliseconds
    if (lastAITime && now - parseInt(lastAITime) < 1800000) {
      executeAskAI(); // Chưa qua 30 phút -> Mở thẳng luôn
    } else {
      setShowAIModal(true); // Đã qua 30 phút -> Hiện lại thông báo
    }
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
                
                <div className="mt-4 flex justify-end items-center gap-4">
                  {askedAILog.includes(qId) && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md text-sm font-semibold">
                      <CheckCircle2 size={16} /> Đã gửi AI
                    </span>
                  )}
                  {!data.isCorrect && (
                    <button 
                      onClick={() => toggleAISelection(qId)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors border-2 ${
                        selectedForAI.includes(qId) 
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600'
                      }`}
                    >
                      {selectedForAI.includes(qId) ? <CheckSquare size={18} /> : <Square size={18} />}
                      {selectedForAI.includes(qId) ? 'Đã chọn hỏi AI' : 'Chọn hỏi AI'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 opacity-100 transition-opacity duration-300">
          <CheckCircle2 className="text-green-400" size={20} />
          <span className="font-medium">{toastMsg}</span>
        </div>
      )}

      {selectedForAI.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40">
          <div className="container mx-auto max-w-4xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                <Bot className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Số câu hỏi</p>
                <p className="text-sm text-slate-500">Đã chọn {selectedForAI.length} / 10 câu</p>
              </div>
            </div>
            <button 
              onClick={handleBulkAskAI}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              Gửi ChatGPT
            </button>
          </div>
        </div>
      )}

      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-blue-600 p-6 text-white text-center">
              <Bot size={48} className="mx-auto mb-2" />
              <h3 className="text-2xl font-bold">Hỏi AI (ChatGPT)</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Hệ thống đã <strong>tự động sao chép</strong> các câu hỏi bạn chọn.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-lg mb-6 flex gap-3">
                <Info className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  Bạn chỉ cần nhấn <strong>Ctrl + V (Dán)</strong> vào ô chat và nhấn Enter để nhận câu trả lời.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowAIModal(false)}
                  className="px-5 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => {
                    localStorage.setItem('lastAIModalTime', Date.now().toString());
                    setShowAIModal(false);
                    executeAskAI();
                  }}
                  className="px-5 py-2.5 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                >
                  Đã hiểu! Mở ChatGPT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
