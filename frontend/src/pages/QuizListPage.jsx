import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

export default function QuizListPage() {
  const [globalStats, setGlobalStats] = useState({ totalViews: 0, totalSubmits: 0 });

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const res = await axios.get('https://it-proficiency-backend.onrender.com/api/quizzes/global-stats');
        setGlobalStats(res.data);
      } catch (e) {
        console.error("Lỗi lấy global stats", e);
      }
    };
    fetchGlobalStats();
  }, []);

  return (
    <div className="pt-20 container mx-auto p-4 max-w-2xl md:max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-3 text-center">Ngân hàng Đề thi Trắc nghiệm</h1>
      
      {globalStats.totalSubmits > 0 && (
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="flex items-center gap-1.5 text-sm md:text-base font-bold text-slate-700 dark:text-slate-300">
              <BookOpen size={18} className="text-amber-500" /> Hệ thống đã ghi nhận <span className="text-amber-600 dark:text-amber-500">{globalStats.totalSubmits.toLocaleString()}</span> lượt nộp bài
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Tin A (Phần 1)</h2>
          <Link to="/quiz/entry?subject=A" className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
            VÀO THI NGAY
          </Link>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">Tin B (Phần 2)</h2>
          <Link to="/quiz/entry?subject=B" className="inline-block px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">
            VÀO THI NGAY
          </Link>
        </div>
      </div>
    </div>
  );
}
