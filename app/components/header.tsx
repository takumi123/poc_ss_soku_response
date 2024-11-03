'use client';

import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
 

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                即レスくん
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center text-gray-700 mr-4">
              <Image
                src="https://assets.st-note.com/production/uploads/images/112897200/profile_9241a13ca3d5be8deec4137b1e89b10b.jpg"
                alt="ユーザーアイコン"
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium mr-2">
                遠藤巧巳
              </span>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded ml-1">
                admin
              </span>
            </div>
            <Link
              href="/auth/login"
              className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              ログアウト
            </Link>
          </div>
        </div>
      </nav>

    </header>
  );
};

export default Header;
