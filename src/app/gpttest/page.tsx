'use client';

import { useState } from 'react';


export default function GPTTestPage() {
  const [result, setResult] = useState("");

  const callGPT = async () => {
    const res = await fetch("https://api.gptgate.online/api/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: "こんにちはGPT！" }],
        stream: false,
      }),
    });

    const data = await res.json();
    setResult(data.choices?.[0]?.message?.content ?? "No response");
  };

  return (
    <div className="p-6">
      <button onClick={callGPT} className="bg-blue-500 text-white px-4 py-2 rounded">
        GPTに聞く
      </button>
      <pre className="mt-4 bg-gray-100 p-4 rounded whitespace-pre-wrap">{result}</pre>
    </div>
  );
}