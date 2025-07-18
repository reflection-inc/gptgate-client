type Props = {
  model: string;
  setModel: (value: string) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  systemPrompt: string;
  handlePromptChange: (value: string) => void;
};

export default function ChatSettings({
  model,
  setModel,
  temperature,
  setTemperature,
  systemPrompt,
  handlePromptChange,
}: Props) {
  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold">モデル選択：</label>
        <select value={model} onChange={(e) => setModel(e.target.value)} className="border rounded p-1">
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
        {temperature >= 1.1 && (
          <p className="text-sm text-yellow-600 bg-yellow-100 p-2 rounded mt-2">
            ※ <strong>注意：</strong> Temperature を <code>{temperature.toFixed(1)}</code> に設定すると、
            出力が壊れる可能性が高まります。生成AIの仕様上、1.1以上は文字化けなどのリスクがあります。
            <br />
            <strong>おすすめの範囲は 0.8 〜 1.0</strong> です。
          </p>
        )}
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
    </>
  );
}