import { Link } from 'react-router-dom';

export default function QuizListPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Ngân hàng Đề thi Trắc nghiệm</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">Tin học cơ bản (Tin A)</h2>
          <p className="mb-4">Bộ 60 câu hỏi ngẫu nhiên. Thời gian làm bài 25 phút.</p>
          <Link to="/quiz/entry?subject=A" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Vào thi ngay
          </Link>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-2 text-green-600 dark:text-green-400">Tin học nâng cao (Tin B)</h2>
          <p className="mb-4">Bộ 50 câu hỏi ngẫu nhiên. Thời gian làm bài 20 phút.</p>
          <Link to="/quiz/entry?subject=B" className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Vào thi ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
