'use client';

import { motion } from "framer-motion";
import { ShieldCheck, Link as LinkIcon, Zap, MousePointerClick, Settings2, Bot, Send } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-black text-white">
      <header className="w-full px-6 py-4 flex justify-between items-center border-b border-white/10">
        <h1 className="text-xl font-bold">gptgate</h1>
        <nav className="space-x-4">
          <Link href="#features" className="hover:underline">
            特長
          </Link>
          <Link href="#demo" className="hover:underline">
            デモ
          </Link>
          <Link href="#contact" className="hover:underline">
            お問い合わせ
          </Link>
        </nav>
      </header>

      <main className="flex flex-col flex-grow items-center text-center justify-center px-6 pt-16 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold"
        >
          OpenAI APIを<br />
          <span className="inline-block bg-white text-black px-2 py-1 rounded">安全に中継</span>し、<br />
          <span className="inline-block bg-white text-black px-2 py-1 rounded">簡単に使える</span><br />
          GPTプロキシ
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg text-gray-300 mt-6 max-w-xl"
        >
          Cloudflare Workersを使って、キーを隠しながらフロントや外部ツールとつなぐAPIゲートを構築。
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 mt-12"
        >
          <div className="bg-gradient-to-b from-gray-800 to-gray-700 rounded-full p-6 w-[160px] h-[160px] flex flex-col items-center justify-center shadow-md hover:scale-105 transition">
            <ShieldCheck className="w-6 h-6 mb-2 text-blue-400" />
            <p className="text-sm font-semibold">APIキー<br />を保護</p>
          </div>
          <div className="bg-gradient-to-b from-gray-800 to-gray-700 rounded-full p-6 w-[160px] h-[160px] flex flex-col items-center justify-center shadow-md hover:scale-105 transition">
            <LinkIcon className="w-6 h-6 mb-2 text-green-400" />
            <p className="text-sm font-semibold">外部ツールと<br />かんたん連携</p>
          </div>
          <div className="bg-gradient-to-b from-gray-800 to-gray-700 rounded-full p-6 w-[160px] h-[160px] flex flex-col items-center justify-center shadow-md hover:scale-105 transition">
            <Zap className="w-6 h-6 mb-2 text-yellow-400" />
            <p className="text-sm font-semibold">ノーコードでも<br />すぐ使える</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 flex gap-4 flex-wrap justify-center"
        >
          <a
            href="#"
            className="bg-white text-black px-6 py-3 rounded-full font-medium transition-colors hover:bg-gray-200"
          >
            ドキュメントを見る
          </a>
          <a
            href="#"
            className="border border-white px-6 py-3 rounded-full font-medium transition-colors hover:bg-white hover:text-black"
          >
            デモを試す
          </a>
        </motion.div>
      </main>

      <section id="steps" className="w-full max-w-4xl text-center mx-auto px-4 sm:px-0 mt-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-10"
        >
          3ステップで使える
        </motion.h2>

        <motion.ol
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-6 text-left"
        >
          <li className="bg-white text-black rounded-xl p-6 shadow">
            <h3 className="font-bold mb-2">① APIキーを設定</h3>
            <p className="text-sm">OpenAIのキーを安全に設定（Cloudflareの環境変数利用）</p>
          </li>
          <li className="bg-white text-black rounded-xl p-6 shadow">
            <h3 className="font-bold mb-2">② curlやWebhookで呼び出し</h3>
            <p className="text-sm">LINE Botや外部ツールから簡単に呼び出せる</p>
          </li>
          <li className="bg-white text-black rounded-xl p-6 shadow">
            <h3 className="font-bold mb-2">③ すぐにGPTが動く</h3>
            <p className="text-sm">独自UIもノーコードツールで即構築OK</p>
          </li>
        </motion.ol>
      </section>

  <section id="audience" className="w-full max-w-4xl text-center mt-20 space-y-10 mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold"
        >
          gptgate はこんな方におすすめ
        </motion.h2>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <li className="bg-white text-black p-6 rounded-xl shadow">
            ノーコードで GPT を使いたいが<br />API連携が難しい
          </li>
          <li className="bg-white text-black p-6 rounded-xl shadow">
            LINE や Slack などの<br />チャット連携を考えている
          </li>
          <li className="bg-white text-black p-6 rounded-xl shadow">
            OpenAI キーを安全に隠して<br />UIをすばやく作りたい
          </li>
        </motion.ul>
      </section>

      <section id="steps" className="w-full max-w-4xl text-center mt-24 space-y-10 mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold"
        >
          かんたん3ステップで使える！
        </motion.h2>

        <motion.ol
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-decimal list-inside text-left"
        >
          <li className="bg-white text-black p-6 rounded-xl shadow">
            <Settings2 className="w-6 h-6 mb-2 text-blue-600" />
            <p className="font-semibold">CloudflareとOpenAIのキーを登録</p>
          </li>
          <li className="bg-white text-black p-6 rounded-xl shadow">
            <Bot className="w-6 h-6 mb-2 text-green-600" />
            <p className="font-semibold">/api/chat/completions にPOST</p>
          </li>
          <li className="bg-white text-black p-6 rounded-xl shadow">
            <Send className="w-6 h-6 mb-2 text-yellow-600" />
            <p className="font-semibold">LINEなどと簡単に連携！</p>
          </li>
        </motion.ol>
      </section>
      <footer className="text-sm text-gray-500 text-center py-4 border-t border-white/10 mt-20">
        © 2025 gptgate. Powered by Cloudflare Workers.
      </footer>
    </div>
  );
}
