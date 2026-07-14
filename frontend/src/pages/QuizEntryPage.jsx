import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Users, AlertTriangle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function QuizEntryPage() {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || 'A';
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  const title = subject === 'A' ? "Luyện thi trắc nghiệm Tin A" : "Luyện thi trắc nghiệm Tin B";
  const questionCount = subject === 'A' ? 60 : 50;
  const timeLimit = subject === 'A' ? 25 : 20;

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(`https://it-proficiency-backend.onrender.com/api/quizzes/exams?subject=${subject}`);
        setExams(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đề thi:", error);
      }
    };
    fetchExams();
  }, [subject]);

  const handleStart = (examId = null) => {
    // Xóa bộ nhớ đệm bài thi cũ nếu có
    localStorage.removeItem(`quiz_${subject}_questions`);
    localStorage.removeItem(`quiz_${subject}_answers`);
    localStorage.removeItem(`quiz_${subject}_flags`);
    localStorage.removeItem(`quiz_${subject}_startTime`);
    localStorage.removeItem(`quiz_${subject}_onTimeAnswers`);
    
    let url = `/quiz/active?subject=${subject}`;
    if (examId) {
      url += `&examId=${encodeURIComponent(examId)}`;
    }
    navigate(url);
  };

  return (
    <div className="pt-20 container mx-auto p-4 max-w-4xl py-12 flex flex-col items-center">
      <div className="w-full relative flex items-center justify-center mb-6 mt-2">
        <Link to="/quiz" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 font-bold text-base transition-colors absolute left-0">
          <ArrowLeft size={18} strokeWidth={2.5} /> Trở về
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-center leading-tight m-0">
          Trắc nghiệm Tin {subject}
        </h1>
      </div>

      <div className="w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 px-5 py-4 rounded-lg flex items-start gap-3 mb-8 shadow-sm">
        <AlertTriangle className="shrink-0 mt-0.5" size={20} />
        <p className="text-sm md:text-base leading-relaxed">
          <strong>Lưu ý:</strong> Nếu bạn phát hiện lỗi trong quá trình làm bài, vui lòng nhấn nút <strong>"Góp ý phát triển"</strong> trên thanh menu để báo cho Admin sửa nhé! Cảm ơn bạn rất nhiều.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow border border-slate-200 dark:border-slate-700 w-full text-center mb-10">
        <div className="flex justify-around mb-8">
          <div>
            <p className="text-slate-500 text-sm">Số câu hỏi mỗi đề</p>
            <p className="text-2xl font-bold">{questionCount}</p>
          </div>
          <div>
            <p className="text-slate-500 text-sm">Thời gian làm bài</p>
            <p className="text-2xl font-bold">{timeLimit} phút</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-400">Đề Ngẫu Nhiên</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">Hệ thống sẽ bốc ngẫu nhiên {questionCount} câu từ toàn bộ ngân hàng đề thi.</p>
            </div>
            <button 
              onClick={() => handleStart()}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 w-full shadow-md transition-colors"
            >
              ĐỀ NGẪU NHIÊN
            </button>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">HOT</div>
            <div>
              <h2 className="text-xl font-bold mb-3 text-red-700 dark:text-red-400">Đề Thi Nâng Cao</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">Đề được tự động tạo từ các câu hỏi có tỉ lệ sai nhiều nhất của sinh viên.</p>
            </div>
            <button 
              onClick={() => handleStart('hardcore')}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 w-full shadow-md transition-colors flex justify-center items-center gap-2"
            >
              ĐỀ NÂNG CAO 🔥
            </button>
          </div>
        </div>
      </div>

      <div className="w-full mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">Hoặc chọn làm theo đề cố định</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {exams.length > 0 ? exams.map(exam => (
            <button 
              key={exam}
              onClick={() => handleStart(exam)}
              className="px-4 py-4 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 font-bold transition-all shadow-sm"
            >
              {exam}
            </button>
          )) : (
            <p className="col-span-full text-center text-slate-500 py-8">Đang tải danh sách đề...</p>
          )}
        </div>
      </div>

      <div className="w-full">
        {subject === 'A' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6 border border-blue-100 dark:border-blue-800 text-left shadow-sm">
            <h3 className="text-lg font-bold mb-3 text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <BookOpen size={20} /> Tài liệu ôn tập tham khảo thêm
            </h3>
            <ul className="space-y-3 text-sm md:text-base">
              <li>
                <a href="https://www.studocu.vn/vn/document/truong-dai-hoc-kinh-te-thanh-pho-ho-chi-minh/ic3-gs5-outcome/ic3-trn-ic3/84518042" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors flex items-start gap-2">
                  <span className="mt-1">🔹</span> <span className="underline underline-offset-4 decoration-blue-300 dark:decoration-blue-700">250 câu hỏi trắc nghiệm IC3</span>
                </a>
              </li>
              <li>
                <a href="https://baitaptracnghiem.com/danh-sach-bai-tap/mang-may-tinh-dai-hoc" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors flex items-start gap-2">
                  <span className="mt-1">🔹</span> <span className="underline underline-offset-4 decoration-blue-300 dark:decoration-blue-700">37 đề ôn trắc nghiệm Mạng Máy Tính</span>
                </a>
              </li>
            </ul>
          </div>
        )}

        <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-lg mb-10 border border-amber-100 dark:border-amber-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-left shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-1">Bạn có đề thi hay?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Hãy chia sẻ tài liệu trắc nghiệm với mọi người nhé. (Ghi kèm <strong className="text-amber-700 dark:text-amber-400">[Trắc nghiệm Tin {subject}]</strong> vào tiêu đề)</p>
          </div>
          <a href="/#community" className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 font-bold rounded-lg transition-colors border border-amber-200 dark:border-amber-800">
            <Users size={18} /> Đóng góp tài liệu
          </a>
        </div>
      </div>
    </div>
  );
}
