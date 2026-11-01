import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lỗi giao diện Go Coffee đã được bắt:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-stone-200 p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 text-[#b22830] flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-stone-900 font-display">
                Đã xảy ra lỗi tạm thời
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Hệ thống Go Coffee vừa gặp sự cố nhỏ khi tải giao diện. Bạn có thể bấm nút bên dưới để khôi phục nhanh.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#b22830] hover:bg-[#8c141c] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tải lại trang</span>
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-stone-200"
              >
                <Home className="w-4 h-4" />
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
