'use client';

import { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatSettings from './ChatSettings';
import ChatList from './ChatList';

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
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const resetSession = () => {
    const sessions = loadSessions();
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: '新しいチャット',
      messages: [],
      systemPrompt: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedSessions = [...sessions, newSession];
    saveSessions(updatedSessions);
    setSessions(updatedSessions); // ← セッション一覧の state も更新
    setMessages([]);
    setSystemPrompt('');
    setCurrentSessionId(newSession.id);
    setActiveSessionId(newSession.id);
  };

  useEffect(() => {
    const sessions = loadSessions();
    setSessions(sessions); //

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
      setSessions([newSession]);
      setMessages([]);
      setSystemPrompt('');
      setCurrentSessionId(newSession.id);
      setActiveSessionId(newSession.id);
    }
  }, []);

  const deleteSession = (id: string) => {
    const sessions = loadSessions().filter(s => s.id !== id);
    saveSessions(sessions);

    if (id === currentSessionId) {
      const nextSession = sessions[0];
      if (nextSession) {
        setCurrentSessionId(nextSession.id);
        setMessages(nextSession.messages);
        setSystemPrompt(nextSession.systemPrompt);
        setActiveSessionId(nextSession.id);
      } else {
        resetSession();
      }
    }

    setSessions(sessions);
  };

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
      setSessions(sessions);
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
      const res = await fetch(process.env.NEXT_PUBLIC_GPT_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
        },
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
        if (updated.length > 0 && updated[updated.length - 1].role === 'assistant' && fullText.trim() === '') {
          updated.pop();
        } else {
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: fullText,
          };
        }
        const sessions = loadSessions();
        const index = sessions.findIndex(s => s.id === currentSessionId);
        if (index !== -1) {
          const session = sessions[index];
          if (!session.title || session.title === '新しいチャット') {
            const firstUserMsg = updated.find(m => m.role === 'user')?.content || '';
            sessions[index].title = firstUserMsg.slice(0, 20); // 長さは好みに応じて調整
          }

          // 🔄 メッセージと一緒に保存・反映
          sessions[index].messages = updated;
          sessions[index].updatedAt = new Date().toISOString();
          saveSessions(sessions);
        }

        return updated;
      });
    }
  };

  const handlePromptChange = (value: string) => {
    setSystemPrompt(value);
    updateCurrentSession({ systemPrompt: value });
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <button
        onClick={resetSession}
        className="text-sm text-red-500 underline mb-4"
      >
        チャットをリセットする
      </button>
      <h1 className="text-xl font-bold mb-4">gptgate Chat（ストリーム対応）</h1>
      <button
        onClick={resetSession}
        className="text-sm text-blue-500 underline mb-2"
      >
        新しいチャットを作成
      </button>
      <ChatList
        sessions={sessions}
        activeId={currentSessionId}
        onSelect={(id) => {
          const session = sessions.find(s => s.id === id);
          if (session) {
            setCurrentSessionId(id);
            setMessages(session.messages);
            setSystemPrompt(session.systemPrompt);
            setActiveSessionId(id);
          }
        }}
        onDelete={deleteSession}
      />
      <ChatSettings
        model={model}
        setModel={setModel}
        temperature={temperature}
        setTemperature={setTemperature}
        systemPrompt={systemPrompt}
        handlePromptChange={handlePromptChange}
      />

      <ChatMessages messages={messages} />

      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
      />

      <p className="text-xs text-gray-500 mt-2">⌘+Enter または Ctrl+Enter で送信</p>
    </div>
  );
}