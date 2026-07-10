import React from 'react';
import { AlertTriangle, MessageSquare } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lỗi ứng dụng (bắt được bởi ErrorBoundary):", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl text-center border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-200 dark:border-red-800/50">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Ôi không! Trang web gặp sự cố!</h1>
            
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Trang web hiện đang quá tải hoặc gặp lỗi hiển thị. Trong thời gian chờ Admin khắc phục, bạn có thể tự học qua Link Dự Phòng nhé. Xin lỗi bạn vì sự bất tiện này!
            </p>
            
            <div className="flex flex-col gap-3">
              <a 
                href="https://docs.google.com/document/d/1F2QWqOfda-bFr0L7QRgGuZZk3FCJxwkjab-fIiGfbao/edit?tab=t.0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                📚 Mở Link Dự Phòng (Google Docs)
              </a>
              
              <a 
                href="https://www.facebook.com/HuynhHuuVinh2101" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-xl transition-colors border border-slate-200 dark:border-slate-600 active:scale-95"
              >
                <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" /> 
                Nhắn tin báo lỗi cho Admin
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
