import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuestionViewer from '../components/quiz/QuestionViewer';
import QuizSidebar from '../components/quiz/QuizSidebar';

export default function QuizActivePage() {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || 'A';
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem(`quiz_${subject}_answers`) || '{}'));
  const [flags, setFlags] = useState(() => JSON.parse(localStorage.getItem(`quiz_${subject}_flags`) || '{}'));
  
  // Timer State
  const timeLimitMinutes = subject === 'A' ? 25 : 20;
  const timeLimitSeconds = timeLimitMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem(`quiz_${subject}_time`);
    return saved !== null ? parseInt(saved, 10) : timeLimitSeconds;
  });
  const [isOvertime, setIsOvertime] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
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
        const response = await axios.get(`http://localhost:3001/api/quizzes/random?subject=${subject}&limit=${limit}`);
        setQuestions(response.data);
        localStorage.setItem(`quiz_${subject}_questions`, JSON.stringify(response.data));
      } catch (error) {
        console.error("Lỗi khi lấy đề thi:", error);
      }
    };
    fetchQuestions();
  }, [subject]);

  // Auto-save
  useEffect(() => {
    localStorage.setItem(`quiz_${subject}_answers`, JSON.stringify(answers));
    localStorage.setItem(`quiz_${subject}_flags`, JSON.stringify(flags));
  }, [answers, flags, subject]);

  // Bộ đếm thời gian
  useEffect(() => {
    if (showModal) return; // Dừng đếm khi hiện Modal

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (!isOvertime) {
          if (prev <= 1) {
            setShowModal(true); // Hết giờ -> Hiện modal
            return 0;
          }
          const nextTime = prev - 1;
          localStorage.setItem(`quiz_${subject}_time`, nextTime.toString());
          return nextTime;
        } else {
          // Đang đếm lố giờ (đếm tiến)
          const nextTime = prev + 1;
          localStorage.setItem(`quiz_${subject}_time`, nextTime.toString());
          return nextTime;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOvertime, showModal, subject]);

  const handleSelectAnswer = (qId, option) => {
    setAnswers(prev => {
      const current = prev[qId] || [];
      const newAnswers = current.includes(option) ? current.filter(a => a !== option) : [...current, option];
      return { ...prev, [qId]: newAnswers };
    });
  };

  const handleToggleFlag = (qId) => setFlags(prev => ({ ...prev, [qId]: !prev[qId] }));

  const handleSubmit = async () => {
    try {
      const timeTaken = isOvertime ? timeLimitSeconds + timeLeft : timeLimitSeconds - timeLeft;
      const res = await axios.post('http://localhost:3001/api/quizzes/submit', {
        answers,
        timeTaken,
        isOvertime
      });
      localStorage.setItem(`quiz_${subject}_results`, JSON.stringify(res.data));
      
      // Cleanup localStorage thi
      localStorage.removeItem(`quiz_${subject}_questions`);
      localStorage.removeItem(`quiz_${subject}_answers`);
      localStorage.removeItem(`quiz_${subject}_flags`);
      localStorage.removeItem(`quiz_${subject}_time`);
      
      navigate(`/quiz/result?subject=${subject}`);
    } catch (err) {
      console.error(err);
      alert('Lỗi nộp bài!');
    }
  };

  const handleContinueOvertime = () => {
    setShowModal(false);
    setIsOvertime(true);
    setTimeLeft(1); // Bắt đầu đếm tiến từ giây đầu tiên lố
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (questions.length === 0) return <div className="p-8 text-center text-xl font-bold">Đang tải đề thi...</div>;

  return (
    <div className="container mx-auto p-4 max-w-7xl py-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <QuestionViewer 
            question={questions[currentIndex]}
            index={currentIndex}
            total={questions.length}
            selectedAnswers={answers[questions[currentIndex]?._id] || []}
            isFlagged={flags[questions[currentIndex]?._id] || false}
            onSelectAnswer={(opt) => handleSelectAnswer(questions[currentIndex]._id, opt)}
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
