/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  HardDrive, 
  Search, 
  RefreshCw, 
  FolderPlus, 
  Upload, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon, 
  Folder, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  LogOut,
  FolderOpen,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { 
  googleSignIn, 
  googleLogout, 
  getCurrentGoogleUser, 
  initAuth,
  getAccessToken 
} from '../services/googleDriveAuth';
import { 
  listDriveFiles, 
  searchDriveFiles, 
  uploadFileToDrive, 
  createDriveFolder, 
  deleteDriveFile, 
  DriveFileItem 
} from '../services/googleDriveService';
import { safeStorage } from '../utils/safeStorage';
import { getConversionStats } from '../services/conversionTracker';
import { User } from 'firebase/auth';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1zjoM9T1X8loIS5DnXFkBZnjtoSqPVS9p';

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'backup' | 'folder'>('files');

  // File explorer state
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document' | 'folder'>('all');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Backup state
  const [isExporting, setIsExporting] = useState(false);
  const [lastExportedFile, setLastExportedFile] = useState<DriveFileItem | null>(null);

  // Destructive confirmation state (Mandatory per Google Workspace Guidelines)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New folder state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('GO.COFFEE - Tư Liệu & Báo Cáo');

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasToken(!!token);
      },
      () => {
        setCurrentUser(null);
        setHasToken(false);
        setFiles([]);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && currentUser && hasToken) {
      loadFiles();
    }
  }, [isOpen, currentUser, hasToken]);

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setHasToken(true);
        showNotification(`Đăng nhập Google thành công: ${res.user.displayName || res.user.email}`, 'success');
        loadFiles();
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Không thể đăng nhập Google. Vui lòng thử lại.', 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleLogout();
      setCurrentUser(null);
      setHasToken(false);
      setFiles([]);
      showNotification('Đã đăng xuất tài khoản Google.', 'info');
    } catch (err: any) {
      showNotification('Lỗi khi đăng xuất: ' + err.message, 'error');
    }
  };

  const loadFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const result = await searchDriveFiles(searchQuery, filterType);
      setFiles(result);
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Lỗi khi tải tệp từ Google Drive.', 'error');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFiles();
  };

  // Export & Backup to Google Drive
  const handleBackupToDrive = async () => {
    setIsExporting(true);
    try {
      const orders = safeStorage.getItem('go_coffee_local_orders');
      const orderList = orders ? JSON.parse(orders) : [];
      const conversionStats = getConversionStats();

      const backupData = {
        app: 'GO.COFFEE Sài Gòn 1975',
        projectTitle: 'Báo Cáo Môn Digital Marketing - GO.COFFEE',
        storeAddress: '120 Pasteur, Phường Sài Gòn, Quận 1',
        exportedAt: new Date().toISOString(),
        exportedBy: currentUser?.email || 'Chủ quán',
        summary: {
          totalOrdersRecorded: orderList.length,
          totalConversionEvents: conversionStats.total,
          viewComboClicks: conversionStats.viewCombo,
          startOrderClicks: conversionStats.startOrder,
          orderCompletedEvents: conversionStats.orderCompleted,
        },
        orders: orderList,
      };

      const now = new Date();
      const dateTag = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      const fileName = `GO_COFFEE_BaoCao_DonHang_${dateTag}.json`;

      const result = await uploadFileToDrive({
        name: fileName,
        mimeType: 'application/json',
        content: JSON.stringify(backupData, null, 2),
        description: 'Báo cáo tổng hợp đơn hàng và chỉ số tiếp thị số GO.COFFEE được tạo tự động.',
      });

      setLastExportedFile(result);
      showNotification(`Đã xuất báo cáo thành công lên Google Drive: ${result.name}`, 'success');
      loadFiles();
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Lỗi khi xuất báo cáo lên Google Drive.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Create folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsCreatingFolder(true);
    try {
      const folder = await createDriveFolder(newFolderName.trim());
      showNotification(`Đã tạo thư mục Google Drive: ${folder.name}`, 'success');
      setNewFolderName('GO.COFFEE - Tài Liệu & Ảnh');
      loadFiles();
    } catch (err: any) {
      showNotification(err.message || 'Lỗi khi tạo thư mục.', 'error');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Confirm and delete file (Destructive action confirmation requirement)
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      showNotification(`Đã xóa vĩnh viễn tệp "${fileToDelete.name}" khỏi Google Drive.`, 'success');
      setFileToDelete(null);
      loadFiles();
    } catch (err: any) {
      showNotification(err.message || 'Không thể xóa tệp.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return 'Thư mục';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return 'Không rõ';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) {
      return <Folder className="w-5 h-5 text-amber-500 shrink-0" />;
    }
    if (mimeType.includes('image/')) {
      return <ImageIcon className="w-5 h-5 text-emerald-500 shrink-0" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv')) {
      return <FileSpreadsheet className="w-5 h-5 text-green-600 shrink-0" />;
    }
    return <FileText className="w-5 h-5 text-stone-500 shrink-0" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#faf5ec] border-2 border-[#801419]/40 w-full max-w-4xl max-h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden text-[#2b1d14]">
        {/* Header */}
        <div className="bg-[#801419] text-amber-100 px-4 py-3.5 sm:px-6 flex items-center justify-between border-b-2 border-[#52090c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-black text-base sm:text-lg tracking-wide flex items-center gap-2">
                <span>Google Drive GO.COFFEE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold uppercase">
                  Workspace
                </span>
              </div>
              <div className="text-[11px] text-amber-200/80 font-sans">
                Đồng bộ tài nguyên hình ảnh, thực đơn & sao lưu báo cáo Digital Marketing
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Feedback Alert Strip */}
        {statusMessage && (
          <div className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b transition-all ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : statusMessage.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="flex-1">{statusMessage.text}</span>
          </div>
        )}

        {/* Account Authentication Banner */}
        <div className="bg-[#ede2cb] border-b border-[#dfc8a5] px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'Google Account'} 
                  className="w-9 h-9 rounded-full border border-amber-800/30 shadow-xs" 
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#801419] text-amber-200 font-bold flex items-center justify-center text-sm">
                  {currentUser.email ? currentUser.email[0].toUpperCase() : 'G'}
                </div>
              )}
              <div>
                <div className="font-serif font-bold text-stone-900 flex items-center gap-1.5">
                  <span>{currentUser.displayName || 'Tài khoản Google'}</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Đã kết nối" />
                </div>
                <div className="text-[11px] text-stone-600 font-mono">{currentUser.email}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-stone-700">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Chưa kết nối Google Drive. Vui lòng đăng nhập để xem tệp và đồng bộ dữ liệu.</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold text-xs transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất Google</span>
              </button>
            ) : (
              /* Official GSI Material Style Sign In Button per Google Workspace guidelines */
              <button 
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="inline-flex items-center gap-2.5 px-4 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg shadow-xs font-medium text-xs transition cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isAuthenticating ? 'Đang kết nối...' : 'Sign in with Google'}</span>
              </button>
            )}

            <a
              href={PROJECT_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#801419] text-amber-200 hover:bg-[#600f13] text-xs font-serif font-bold transition shadow-xs"
              title="Mở thư mục ảnh Drive của dự án"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mở Thư Mục Ảnh Drive</span>
              <span className="sm:hidden">Drive Dự Án</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#dfc8a5] bg-[#f2e7d3] px-4 sm:px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 font-serif text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'files'
                ? 'border-[#801419] text-[#801419] bg-[#faf5ec] rounded-t-lg shadow-2xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Tệp Trên Google Drive</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 font-serif text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'backup'
                ? 'border-[#801419] text-[#801419] bg-[#faf5ec] rounded-t-lg shadow-2xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Sao Lưu & Báo Cáo Marketing</span>
          </button>
          <button
            onClick={() => setActiveTab('folder')}
            className={`px-4 py-2 font-serif text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'folder'
                ? 'border-[#801419] text-[#801419] bg-[#faf5ec] rounded-t-lg shadow-2xs'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Quản Lý Thư Mục</span>
          </button>
        </div>

        {/* Tab 1: File Browser */}
        {activeTab === 'files' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm tệp ảnh, menu, báo cáo theo tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-24 py-2 rounded-lg border border-[#dfc8a5] bg-white text-xs text-stone-900 focus:outline-hidden focus:border-[#801419] shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1 bg-[#801419] hover:bg-[#600f13] text-amber-200 text-xs font-semibold rounded-md transition cursor-pointer"
                >
                  Tìm
                </button>
              </form>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => { setFilterType('all'); loadFiles(); }}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition whitespace-nowrap ${
                    filterType === 'all' ? 'bg-[#801419] text-amber-200 font-bold' : 'bg-white border border-[#dfc8a5] text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => { setFilterType('image'); loadFiles(); }}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition whitespace-nowrap flex items-center gap-1 ${
                    filterType === 'image' ? 'bg-[#801419] text-amber-200 font-bold' : 'bg-white border border-[#dfc8a5] text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Hình ảnh</span>
                </button>
                <button
                  onClick={() => { setFilterType('document'); loadFiles(); }}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition whitespace-nowrap flex items-center gap-1 ${
                    filterType === 'document' ? 'bg-[#801419] text-amber-200 font-bold' : 'bg-white border border-[#dfc8a5] text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tài liệu / Báo cáo</span>
                </button>
                <button
                  onClick={loadFiles}
                  disabled={isLoadingFiles}
                  className="p-1.5 rounded-md bg-white border border-[#dfc8a5] text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition cursor-pointer ml-1"
                  title="Tải lại danh sách"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Quick access link banner */}
            <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-stone-800">
                  Thư mục ảnh & logo chính thức của dự án môn Digital Marketing:
                </span>
              </div>
              <a
                href={PROJECT_DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#801419] font-bold underline flex items-center gap-1 shrink-0 hover:text-[#52090c]"
              >
                <span>Xem trên Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* File List */}
            {isLoadingFiles ? (
              <div className="py-12 flex flex-col items-center justify-center text-stone-500 gap-3">
                <RefreshCw className="w-7 h-7 text-[#801419] animate-spin" />
                <span className="text-xs">Đang truy xuất tệp từ Google Drive của bạn...</span>
              </div>
            ) : files.length === 0 ? (
              <div className="py-12 text-center text-stone-500 space-y-3 bg-white/60 rounded-xl border border-dashed border-[#dfc8a5]">
                <HardDrive className="w-10 h-10 text-stone-400 mx-auto" />
                <div className="text-sm font-serif font-bold text-stone-700">
                  {currentUser ? 'Không tìm thấy tệp phù hợp' : 'Vui lòng đăng nhập Google để xem tệp'}
                </div>
                <div className="text-xs max-w-md mx-auto text-stone-500">
                  {currentUser 
                    ? 'Bạn có thể xuất báo cáo đơn hàng hoặc tạo thư mục mới qua các tab bên trên.' 
                    : 'Nhấn nút "Sign in with Google" phía trên để kết nối và quản lý tệp trực tiếp.'}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-lg border border-[#e8dac1] bg-white hover:border-[#801419]/40 hover:shadow-md transition flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded bg-stone-100 shrink-0">
                        {file.thumbnailLink ? (
                          <img 
                            src={file.thumbnailLink} 
                            alt={file.name} 
                            className="w-8 h-8 object-cover rounded" 
                          />
                        ) : (
                          getFileIcon(file.mimeType)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-serif font-bold text-stone-900 truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>{formatFileSize(file.size)}</span>
                          {file.modifiedTime && (
                            <>
                              <span>•</span>
                              <span>{new Date(file.modifiedTime).toLocaleDateString('vi-VN')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                      {file.webViewLink ? (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#801419] font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Mở trên Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-stone-400">Không có liên kết</span>
                      )}

                      <button
                        onClick={() => setFileToDelete(file)}
                        className="text-stone-400 hover:text-red-600 transition p-1 rounded hover:bg-red-50 cursor-pointer"
                        title="Xóa tệp khỏi Google Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Backup to Drive */}
        {activeTab === 'backup' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-[#dfc8a5] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Xuất Báo Cáo Đơn Hàng & Chỉ Số Tiếp Thị Số
                  </h3>
                  <p className="text-xs text-stone-600">
                    Lưu trữ tự động toàn bộ đơn hàng khách đặt, tỷ lệ chuyển đổi và chiến dịch vào tệp JSON chuẩn hóa trên Google Drive.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700 space-y-1.5 font-mono">
                <div>📁 Tên tệp dự kiến: <span className="font-bold text-[#801419]">GO_COFFEE_BaoCao_DonHang_YYYYMMDD_HHmm.json</span></div>
                <div>📍 Điểm bán xuất: <span className="font-bold">120 Pasteur, Phường Sài Gòn, Quận 1</span></div>
                <div>📊 Dữ liệu bao gồm: Mã đơn, sản phẩm, doanh thu, kênh tiếp thị (Creator/UTM), thời gian đặt.</div>
              </div>

              <button
                onClick={handleBackupToDrive}
                disabled={!currentUser || isExporting}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#801419] hover:bg-[#600f13] text-amber-200 rounded-lg font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang tải lên Google Drive...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Xuất & Lưu Lên Google Drive Ngay</span>
                  </>
                )}
              </button>

              {!currentUser && (
                <p className="text-[11px] text-amber-800">
                  * Yêu cầu bấm "Sign in with Google" ở thanh trên trước khi thực hiện xuất báo cáo.
                </p>
              )}

              {lastExportedFile && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Đã tạo tệp báo cáo thành công trên Google Drive!</span>
                  </div>
                  <div className="text-stone-700">Tên tệp: <strong className="font-mono">{lastExportedFile.name}</strong></div>
                  {lastExportedFile.webViewLink && (
                    <a
                      href={lastExportedFile.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-[#801419] hover:underline"
                    >
                      <span>Mở tệp báo cáo vừa tạo trên Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Folder Management */}
        {activeTab === 'folder' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-[#dfc8a5] shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-[#801419] flex items-center justify-center">
                  <FolderPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Tạo Thư Mục Riêng Cho Dự Án Trên Google Drive
                  </h3>
                  <p className="text-xs text-stone-600">
                    Khởi tạo thư mục chuyên dụng để phân loại banner, ảnh chụp đồ uống và tài liệu thuyết trình.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateFolder} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tên thư mục mới:
                  </label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="VD: GO.COFFEE - Tiếp Thị & Đơn Hàng"
                    className="w-full px-3.5 py-2 border border-[#dfc8a5] rounded-lg text-xs bg-white text-stone-900 focus:outline-hidden focus:border-[#801419]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!currentUser || isCreatingFolder}
                  className="px-4 py-2 bg-[#801419] hover:bg-[#600f13] text-amber-200 rounded-lg font-serif font-bold text-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isCreatingFolder ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tạo thư mục...</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>Tạo Thư Mục Trên Drive</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mandatory User Confirmation Dialog for Destructive Operations */}
        {fileToDelete && (
          <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-xl max-w-md w-full p-5 border-2 border-red-300 shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base">
                    Xác nhận xóa tệp trên Google Drive?
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Hành động này sẽ xóa vĩnh viễn tệp <strong className="text-stone-900 font-mono">"{fileToDelete.name}"</strong> khỏi Google Drive của bạn. Bạn không thể hoàn tác sau khi xác nhận.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setFileToDelete(null)}
                  disabled={isDeleting}
                  className="px-3.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  onClick={confirmDeleteFile}
                  disabled={isDeleting}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xóa...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xác Nhận Xóa</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#ede2cb] px-4 py-3 sm:px-6 border-t border-[#dfc8a5] flex items-center justify-between text-xs text-stone-600">
          <span className="font-serif font-semibold">
            GO.COFFEE • Tích hợp Google Drive API & Firebase Auth
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-[#dfc8a5] text-stone-800 hover:bg-stone-50 font-serif font-bold text-xs transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
