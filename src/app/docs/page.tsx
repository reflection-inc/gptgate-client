export default function DocsPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">gptgate ドキュメント</h1>

      <section id="temperature" className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Temperatureとは？</h2>
        <p className="mb-2">
          AIの「創造性・発散度合い」を調整するパラメータです。
        </p>
        <ul className="list-disc list-inside mb-2">
          <li><strong>0.2 など低い値</strong>：安定・論理的・保守的な出力</li>
          <li><strong>0.7〜1.0</strong>：自然で人間らしい文章</li>
          <li><strong>1.1〜2.0</strong>：創造性高いが壊れやすく、ストリームで不具合が出やすい</li>
        </ul>
        <p>
          <span className="font-semibold text-red-500">※注意：</span> ストリームモードでは <strong>1.1以上</strong> でJSONエラーが頻発する可能性があります。<br />
          <span className="text-green-600">推奨値：0.8〜1.0</span>
        </p>
      </section>

      {/* 今後追加予定セクション */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">System Promptとは？</h2>
        <p>（あとで追加）</p>
      </section>
    </div>
  );
}