import { ChatMessage } from './types';

export default function ChatMessages({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="space-y-2 mb-4 min-h-[100px] border rounded p-2 bg-gray-50">
      {messages.length === 0 ? (
        <p className="text-sm text-gray-500">ここにチャットが表示されます。</p>
      ) : (
        messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
            <strong>{msg.role}：</strong> {msg.content}
          </div>
        ))
      )}
    </div>
  );
}