'use client';

import { ChatSession } from './types';

type Props = {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function ChatList({ sessions, activeId, onSelect, onDelete }: Props) {
  return (
    <div className="mb-4 space-y-1">
      <h2 className="font-semibold">チャット一覧</h2>
      <ul className="border p-2 rounded bg-gray-50">
        {sessions.map((session) => (
          <li
            key={session.id}
            className={`p-2 rounded cursor-pointer hover:bg-gray-200 flex justify-between items-center ${session.id === activeId ? 'bg-blue-100 font-bold' : ''
              }`}
          >
            <span onClick={() => onSelect(session.id)} className="flex-1 cursor-pointer">
              {session.title || '（タイトルなし）'}
            </span>
            <button
              onClick={() => onDelete(session.id)}
              className="ml-2 text-red-500 text-xs hover:underline"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}