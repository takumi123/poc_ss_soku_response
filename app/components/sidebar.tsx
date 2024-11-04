'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="h-screen w-64 bg-gray-50 border-r">
      <div className="p-4">
        <nav className="space-y-1">
          <Link
            href="/company/dashboard"
            className={`${
              isActive('/company/dashboard')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
          >
            ダッシュボード
          </Link>

          <Link
            href="/company/room"
            className={`${
              isActive('/company/room')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
          >
            ルーム管理
          </Link>

          <Link
            href="/company/user"
            className={`${
              isActive('/company/user')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
          >
            ユーザー管理
          </Link>

          <Link
            href="/company/report"
            className={`${
              isActive('/company/report')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
          >
            レポート
          </Link>
          <Link
            href="/company/setting"
            className={`${
              isActive('/company/setting')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
          >
            会社設定
          </Link>
          <Link
            href="/company/run_api"
            className={`${
              isActive('/company/run_api')
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
          >
            API更新
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
