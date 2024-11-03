'use client';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              即レスくんについて
            </h3>
            <p className="mt-4 text-sm text-gray-500">
              ChatWorkでのコミュニケーションを効率化し、返信漏れを防ぐためのリマインダーツールです。
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              プライバシーポリシー
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <p className="text-sm text-gray-500">• メッセージデータは90日後に自動削除</p>
              </li>
              <li>
                <p className="text-sm text-gray-500">• データは暗号化して安全に保管</p>
              </li>
              <li>
                <p className="text-sm text-gray-500">• アクセス権限は厳密に管理</p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              お問い合わせ
            </h3>
            <p className="mt-4 text-sm text-gray-500">
              システムに関するご質問・ご要望は管理者までご連絡ください。
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} 即レスくん All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
