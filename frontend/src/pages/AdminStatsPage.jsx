import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Users, BookOpen, Clock, ShieldAlert } from 'lucide-react';

export default function AdminStatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get('https://it-proficiency-backend.onrender.com/api/quizzes/stats-all', {
        headers: { 'x-admin-password': password }
      });
      setStats(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMsg("Mật khẩu không chính xác!");
      } else {
        setErrorMsg("Có lỗi xảy ra khi kết nối tới máy chủ.");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalViews = stats.reduce((acc, curr) => acc + curr.viewCount, 0);
  const totalSubmits = stats.reduce((acc, curr) => acc + curr.submitCount, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 pt-16">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full mx-4 border border-slate-100 dark:border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <ShieldAlert size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Bảo Mật Hệ Thống</h1>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-sm">Vui lòng nhập Mật Khẩu Admin để truy cập báo cáo số liệu.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
                required
              />
            </div>
            {errorMsg && (
              <p className="text-red-500 text-sm font-medium text-center">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xác thực..." : "Xác Nhận Đăng Nhập"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-5">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-2">
            <ShieldAlert size={28} />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Báo cáo Dữ liệu Học tập & Trắc nghiệm Nội bộ</p>
        </div>

        {/* Tổng quan Thực tế (Không có Offset phong thủy) */}
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <BarChart3 size={20} /> Tổng quan (Real Data)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Tổng Lượt Vào Bài Giảng</p>
              <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalViews.toLocaleString()}</h3>
            </div>
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Users size={32} className="text-blue-500 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Tổng Lượt Nộp Bài Thi</p>
              <h3 className="text-4xl font-bold text-amber-600 dark:text-amber-500">{totalSubmits.toLocaleString()}</h3>
            </div>
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <BookOpen size={32} className="text-amber-500 dark:text-amber-400" />
            </div>
          </div>
        </div>

        {/* Chi tiết từng học phần */}
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Clock size={20} /> Bóc tách chi tiết từng môn
        </h2>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold">Học Phần</th>
                  <th scope="col" className="px-6 py-4 font-bold">Lượt xem khóa học</th>
                  <th scope="col" className="px-6 py-4 font-bold">Lượt làm bài thi</th>
                  <th scope="col" className="px-6 py-4 font-bold">Lần cập nhật cuối</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {stats.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      Tin {item.subject}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded font-medium">
                        {item.viewCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded font-medium">
                        {item.submitCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(item.updatedAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
                {stats.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      Chưa có dữ liệu nào được ghi nhận.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
