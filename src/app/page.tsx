import { ProfileCardForm } from "@/components/ProfileCardForm";
import { CardHistory } from "@/components/CardHistory";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-profilecard.ezoai.jp";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AIプロフカード",
  url: siteUrl,
  description:
    "名前と趣味を入力するだけで、AIがオシャレな自己紹介カードを自動生成。SNS映えするプロフィールカードを30秒で作成。",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  creator: {
    "@type": "Organization",
    name: "Ghostfee",
    url: "https://ezoai.jp",
  },
  inLanguage: "ja",
  isAccessibleForFree: true,
  featureList:
    "AIプロフィールカード生成, 名前と趣味から自動作成, SNSシェア対応, 4つのスタイル選択, ステータス表示",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "AIプロフカードとは何ですか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AIプロフカードは、名前と趣味を入力するだけでAIがオシャレな自己紹介カードを自動生成するサービスです。キャッチコピー、性格タイプ、ステータスなどを含むカードが30秒で作成できます。",
      },
    },
    {
      "@type": "Question",
      name: "利用料金はかかりますか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "完全無料です。会員登録も不要で、すぐに利用できます。何度でもカードを作成可能です。",
      },
    },
    {
      "@type": "Question",
      name: "作成したカードはSNSでシェアできますか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、X (Twitter) へのシェアやリンクコピーに対応しています。OGP画像も自動生成されるため、SNSに投稿すると見栄えの良いカードが表示されます。",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="text-center mb-10">
        <p className="text-sky-400 text-sm font-bold tracking-widest mb-4">
          無料・登録不要・30秒で完成
        </p>
        <h1 className="text-4xl font-black tracking-tight mb-3">
          <span className="text-sky-400">{"//"}</span> AIプロフカード
        </h1>
        <p className="text-white/70 text-lg leading-relaxed">
          名前と趣味を入力するだけで、AIが
          <span className="text-sky-400 font-bold">オシャレな自己紹介カード</span>
          を自動生成
        </p>
        <p className="text-white/40 text-sm mt-2">
          SNS映えするプロフカードを一瞬で。キャッチコピーもステータスもAIにおまかせ。
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { step: "1", title: "入力", desc: "名前と趣味を記入" },
          { step: "2", title: "生成", desc: "AIがカードを作成" },
          { step: "3", title: "シェア", desc: "SNSで共有" },
        ].map((item) => (
          <div
            key={item.step}
            className="bg-white/5 border border-white/10 rounded-lg p-4 text-center"
          >
            <div className="text-sky-400 font-black text-lg mb-1">
              {item.step}
            </div>
            <div className="text-white text-sm font-bold">{item.title}</div>
            <div className="text-white/40 text-xs mt-1">{item.desc}</div>
          </div>
        ))}
      </div>

      <ProfileCardForm />

      <CardHistory />

      {/* Sample Card */}
      <section className="mt-16 space-y-4">
        <h2 className="text-white/50 text-xs tracking-widest uppercase text-center">
          Sample
        </h2>
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <p className="text-sky-400 text-xs font-bold tracking-widest mb-2">
              探究者タイプ
            </p>
            <p className="text-white font-black text-2xl">たろう</p>
            <p className="text-sky-400 font-bold text-lg mt-1">
              深夜のコード職人
            </p>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">
              好奇心の赴くままにコードを書き、未知の技術に飛び込む冒険者
            </p>
          </div>
          <div className="p-6 border-b border-white/10">
            <p className="text-white/40 text-xs font-medium mb-4">STATUS</p>
            <div className="space-y-3">
              {[
                { label: "コード力", value: 88 },
                { label: "好奇心", value: 95 },
                { label: "集中力", value: 72 },
                { label: "創造性", value: 81 },
                { label: "探究心", value: 90 },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/70 text-sm">{stat.label}</span>
                    <span className="text-sky-400 text-sm font-bold">
                      {stat.value}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-sky-400 h-2 rounded-full"
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {["プログラミング好き", "夜型エンジニア", "技術探究者"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="bg-sky-500/10 text-sky-400 text-xs px-3 py-1.5 rounded-full border border-sky-400/20"
                  >
                    #{tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
        <p className="text-white/30 text-xs text-center">
          このようなカードがAIによって自動生成されます
        </p>
      </section>

      {/* Features */}
      <section className="mt-12 space-y-4">
        <h2 className="text-white/50 text-xs tracking-widest uppercase text-center">
          Features
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "AI生成キャッチコピー", desc: "あなたの個性を一言で表現" },
            { title: "ステータス表示", desc: "5つの能力値をバーで可視化" },
            { title: "性格タイプ判定", desc: "趣味と性格からタイプを分析" },
            { title: "SNSシェア対応", desc: "OGP画像付きで映えるシェア" },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <div className="text-white text-sm font-bold">{f.title}</div>
              <div className="text-white/40 text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
