'use client';

import { FC, useState } from 'react';
import Image from 'next/image'
import Link from 'next/link';

interface Account {
  chatworkAccountId: bigint;
  name: string;
  iconUrl: string | null;
  isMessageTarget: boolean;
  unreadCount: number;
}

interface DataTableProps {
  data: Account[];
}

async function handleBulkUpdate(accounts: Account[]) {
  try {
    const promises = accounts.map(account => 
      fetch('/api/account/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: account.chatworkAccountId.toString(),
          isMessageTarget: account.isMessageTarget
        })
      })
    );

    await Promise.all(promises);
    window.location.reload();
  } catch (error) {
    console.error('一括更新に失敗しました:', error);
    throw error;
  }
}

const DataTable: FC<DataTableProps> = ({ data }) => {
  const [accounts, setAccounts] = useState<Account[]>(data);
  
  const onCheckboxChange = (accountId: bigint, checked: boolean) => {
    setAccounts(prevAccounts => prevAccounts.map(account => {
      if (account.chatworkAccountId === accountId) {
        return { ...account, isMessageTarget: checked };
      }
      return account;
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">ユーザー一覧</h2>
        <button
          onClick={() => handleBulkUpdate(accounts)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          送信対象の更新
        </button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">即レスくんメッセージ送信対象</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アイコン</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">返信必要数</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {accounts.map((account) => (
            <tr key={String(account.chatworkAccountId)}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={account.isMessageTarget}
                  onChange={(e) => onCheckboxChange(account.chatworkAccountId, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/company/user/${account.chatworkAccountId.toString()}`}>
                  {account.iconUrl ? (
                    <Image 
                      src={account.iconUrl}
                      alt={`${account.name}のアイコン`}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  )}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Link 
                  href={`/company/user/${account.chatworkAccountId.toString()}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {account.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={account.unreadCount > 0 ? "text-red-600 font-bold" : "text-gray-500"}>
                  {account.unreadCount > 0 ? account.unreadCount : '-'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;