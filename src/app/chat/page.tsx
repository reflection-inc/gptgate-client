'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'chatSessions';
const ACTIVE_KEY = 'activeChatId';

type ChatMessage = { role: string; content: string };
type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  systemPrompt: string;
  createdAt: string;
  updatedAt: string;
};

const loadSessions = (): ChatSession[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveSessions = (sessions: ChatSession[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

const loadActiveSessionId = (): string | null => {
  return localStorage.getItem(ACTIVE_KEY);
};

const setActiveSessionId = (id: string) => {
  localStorage.setItem(ACTIVE_KEY, id);
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(1.0);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  useEffect(() => {
    const sessions = loadSessions();
    const activeId = loadActiveSessionId();
    const activeSession = sessions.find(s => s.id === activeId) || sessions[0];

    if (activeSession) {
      setMessages(activeSession.messages.filter(m => !(m.role === 'assistant' && m.content.trim() === '')));
      setSystemPrompt(activeSession.systemPrompt);
      setCurrentSessionId(activeSession.id);
    } else {
      const newSession: ChatSession = {
        id: crypto.randomUUID(),
        title: '新しいチャット',
        messages: [],
        systemPrompt: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveSessions([newSession]);
      setMessages([]);
      setSystemPrompt('');
      setCurrentSessionId(newSession.id);
      setActiveSessionId(newSession.id);
    }
  }, []);

  const updateCurrentSession = (updates: Partial<ChatSession>) => {
    const sessions = loadSessions();
    const index = sessions.findIndex(s => s.id === currentSessionId);
    if (index !== -1) {
      sessions[index] = {
        ...sessions[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveSessions(sessions);
    }
  };

  const handleSendMessage = (newMessage: ChatMessage) => {
    const sessions = loadSessions();
    const index = sessions.findIndex(s => s.id === currentSessionId);
    if (index !== -1) {
      sessions[index].messages.push(newMessage);
      sessions[index].updatedAt = new Date().toISOString();
      saveSessions(sessions);
      setMessages(sessions[index].messages);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const assistantMessage = { role: 'assistant', content: '' };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
    setLoading(true);

    const baseMessages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages,
      userMessage,
    ];

    let buffer = '';
    let fullText = '';

    try {
      const res = await fetch('https://api.gptgate.online/api/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          temperature,
          messages: baseMessages,
          stream: true,
        }),
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += value;
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const chunk = line.slice(6).trim();
          if (chunk === '[DONE]') {
            reader.cancel();
            break;
          }
          try {
            const json = JSON.parse(chunk);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: fullText,
                };
                return updated;
              });
            }
          } catch {
            buffer = 'data: ' + chunk + '\n' + buffer;
            break;
          }
        }
      }
    } catch (err) {
      console.error('Stream fetch error:', err);
    } finally {
      setLoading(false);
      setMessages(prev => {
        const updated = [...prev];

        // 🔽 最後の assistant が空なら削除
        if (updated.length > 0 && updated[updated.length - 1].role === 'assistant' && fullText.trim() === '') {
          updated.pop(); // ← 削除
        } else {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: fullText,
          };
        }

        updateCurrentSession({ messages: updated });
        return updated;
      });
    }
  }
  const handlePromptChange = (value: string) => {
    setSystemPrompt(value);
    updateCurrentSession({ systemPrompt: value });
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">gptgate Chat（ストリーム対応）</h1>
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold">モデル選択：</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border rounded p-1"
        >
          <option value="gpt-4">gpt-4</option>
          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
        </select>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <label className="font-semibold">Temperature：</label>
          <a
            href="/docs#temperature"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            temperatureとは？
          </a>
        </div>
        <div className="flex items-center">
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-64 align-middle"
          />
          <span className="ml-2">{temperature.toFixed(1)}</span>
        </div>
      </div>
      <div className="mb-4">
        <label className="font-semibold mr-2">System Prompt：</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="例：あなたは優しい家庭教師です"
          rows={2}
        />
      </div>
      <div className="space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
            <strong>{msg.role}：</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
      <p className="text-xs text-gray-500 mt-2">⌘+Enter または Ctrl+Enter で送信</p>
    </div>
  );
}
