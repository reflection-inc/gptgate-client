'use client';

import React, { useState } from 'react';

export default function GPTTestPage() {
  const [result, setResult] = useState("");

  const callGPT = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_GPT_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: "こんにちは！" }],
        stream: false,
      }),
    });

    const data = await res.json() as {
      choices: { message: { content: string } }[];
    };

    setResult(data.choices?.[0]?.message?.content ?? "No response");
  };

  return (
    <div className="p-6">
      <button onClick={callGPT} className="bg-blue-500 text-white px-4 py-2 rounded">
        GPTに聞く
      </button>
      <pre className="mt-4 bg-gray-100 p-4 rounded">{result}</pre>
    </div>
  );
}