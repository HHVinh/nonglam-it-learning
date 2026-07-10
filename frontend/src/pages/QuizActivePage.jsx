import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import QuestionViewer from '../components/quiz/QuestionViewer';
import QuizSidebar from '../components/quiz/QuizSidebar';

export default function QuizActivePage() {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || 'A';
  const examId = searchParams.get('examId');
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem(`quiz_${subject}_answers`) || '{}'));
  const [flags, setFlags] = useState(() => JSON.parse(localStorage.getItem(`quiz_${subject}_flags`) || '{}'));
  
  // Timer State
  const timeLimitMinutes = subject === 'A' ? 25 : 20;
  const timeLimitSeconds = timeLimitMinutes * 60;
  
  const [startTime] = useState(() => {
    const saved = localStorage.getItem(`quiz_${subject}_startTime`);
    if (saved) return parseInt(saved, 10);
    const now = Date.now();
    localStorage.setItem(`quiz_${subject}_startTime`, now.toString());
    return now;
  });
  
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [isOvertime, setIsOvertime] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [onTimeAnswers, setOnTimeAnswers] = useState(() => JSON.parse(localStorage.getItem(`quiz_${subject}_onTimeAnswers`) || 'null'));
  
  // Lấy dữ liệu API
  useEffect(() => {
    const fetchQuestions = async () => {
      // Nếu đã có trong localStorage (đang thi bị f5) thì load lại
      const savedQuestions = localStorage.getItem(`quiz_${subject}_questions`);
      if (savedQuestions) {
        setQuestions(JSON.parse(savedQuestions));
        return;
      }
      try {
        const limit = subject === 'A' ? 60 : 50;
        let url = `https://it-proficiency-backend.onrender.com/api/quizzes/random?subject=${subject}&limit=${limit}`;
        if (examId && examId !== 'random') {
          url = `https://it-proficiency-backend.onrender.com/api/quizzes/exam?subject=${subject}&examId=${encodeURIComponent(examId)}`;
        }
        const response = await axios.get(url);
        setQuestions(response.data);
        localStorage.setItem(`quiz_${subject}_questions`, JSON.stringify(response.data));
      } catch (error) {
        console.error("Lỗi khi lấy đề thi:", error);
      }
    };
    fetchQuestions();
  }, [subject, examId]);

  // Auto-save
  useEffect(() => {
    localStorage.setItem(`quiz_${subject}_answers`, JSON.stringify(answers));
    localStorage.setItem(`quiz_${subject}_flags`, JSON.stringify(flags));
  }, [answers, flags, subject]);

  // Bộ đếm thời gian an toàn không bị ảnh hưởng khi chuyển tab
  useEffect(() => {
    if (showModal) return;

    const timer = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      
      if (!isOvertime) {
        const remaining = timeLimitSeconds - elapsedSeconds;
        if (remaining <= 0) {
          setShowModal(true);
          setTimeLeft(0);
        } else {
          setTimeLeft(remaining);
        }
      } else {
        // Nếu đã lố giờ thì tính thời gian lố
        setTimeLeft(elapsedSeconds - timeLimitSeconds);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime, isOvertime, showModal, timeLimitSeconds]);

  const handleSelectAnswer = (qId, option, isMultipleChoice) => {
    setAnswers(prev => {
      if (!isMultipleChoice) {
        return { ...prev, [qId]: [option] };
      }
      const current = prev[qId] || [];
      const newAnswers = current.includes(option) ? current.filter(a => a !== option) : [...current, option];
      return { ...prev, [qId]: newAnswers };
    });
  };

  const handleToggleFlag = (qId) => setFlags(prev => ({ ...prev, [qId]: !prev[qId] }));

  const handleSubmit = async () => {
    try {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      
      const res = await axios.post('https://it-proficiency-backend.onrender.com/api/quizzes/submit', {
        answers: onTimeAnswers || answers,
        overtimeAnswers: isOvertime ? answers : null,
        questionIds: questions.map(q => q._id),
        timeTaken: elapsedSeconds,
        isOvertime,
        subject
      });
      localStorage.setItem(`quiz_${subject}_results`, JSON.stringify(res.data));
      
      // Cleanup localStorage thi
      localStorage.removeItem(`quiz_${subject}_questions`);
      localStorage.removeItem(`quiz_${subject}_answers`);
      localStorage.removeItem(`quiz_${subject}_flags`);
      localStorage.removeItem(`quiz_${subject}_startTime`);
      localStorage.removeItem(`quiz_${subject}_onTimeAnswers`);
      
      navigate(`/quiz/result?subject=${subject}`);
    } catch (err) {
      console.error(err);
      alert('Lỗi nộp bài!');
    }
  };

  const handleContinueOvertime = () => {
    // Chụp lại đáp án tại đúng thời điểm hết giờ
    setOnTimeAnswers(answers);
    localStorage.setItem(`quiz_${subject}_onTimeAnswers`, JSON.stringify(answers));
    setShowModal(false);
    setIsOvertime(true);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (questions.length === 0) return <div className="pt-20 p-8 text-center text-xl font-bold">Đang tải đề thi...</div>;

  return (
    <div className="pt-20 container mx-auto p-4 max-w-7xl pb-8 relative">
      <div className="mb-4 flex justify-between items-center sticky top-16 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <Link to={`/quiz/entry?subject=${subject}`} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 font-bold text-base transition-colors shrink-0 relative z-10">
          <ArrowLeft size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Trở về</span>
        </Link>
        
        <div className="absolute left-1/2 -translate-x-1/2 font-bold text-base md:text-lg text-slate-800 dark:text-slate-200 whitespace-nowrap">
          {examId ? examId : 'Đề Ngẫu Nhiên'}
        </div>
        
        <div className={`font-mono text-lg font-bold tracking-wider px-3 py-1 rounded-md border flex items-center gap-2 relative z-10 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur ${
          isOvertime 
            ? 'text-red-600 border-red-200 dark:text-red-400 dark:border-red-800' 
            : 'text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800'
        }`}>
          <span>{isOvertime ? '-' : ''}{formatTime(timeLeft)}</span>
          {isOvertime && <span className="text-[10px] font-sans text-red-500 font-bold hidden md:inline uppercase">Lố giờ</span>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <QuestionViewer 
            question={questions[currentIndex]}
            index={currentIndex}
            total={questions.length}
            selectedAnswers={answers[questions[currentIndex]?._id] || []}
            isFlagged={flags[questions[currentIndex]?._id] || false}
            onSelectAnswer={(opt, isMul) => handleSelectAnswer(questions[currentIndex]._id, opt, isMul)}
            onToggleFlag={() => handleToggleFlag(questions[currentIndex]._id)}
            onNext={() => setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))}
            onPrev={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
          />
        </div>
        <div className="md:col-span-1">
          <QuizSidebar 
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            flags={flags}
            onNavigate={(index) => setCurrentIndex(index)}
            timeString={formatTime(timeLeft)}
            isOvertime={isOvertime}
            onSubmitEarly={handleSubmit}
          />
        </div>
      </div>

      {/* Modal Hết Giờ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">HẾT GIỜ LÀM BÀI!</h2>
            <p className="mb-6 text-lg">Bạn có muốn nộp bài luôn hay tiếp tục làm (sẽ tính điểm quá giờ)?</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleContinueOvertime}
                className="px-6 py-2 bg-slate-200 text-slate-800 rounded font-bold hover:bg-slate-300 transition-colors"
              >
                Tiếp tục làm
              </button>
              <button 
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
