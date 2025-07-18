type Props = {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  loading: boolean;
};

export default function ChatInput({ input, setInput, sendMessage, loading }: Props) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        className="flex-1 border p-2 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            sendMessage();
          }
        }}
        placeholder="メッセージを入力..."
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? '送信中...' : '送信'}
      </button>
    </div>
  );
}