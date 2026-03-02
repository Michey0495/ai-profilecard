import { ProfileCardForm } from "@/components/ProfileCardForm";

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

      <section className="mt-16 space-y-4">
        <h2 className="text-white/50 text-xs tracking-widest uppercase text-center">
          Features
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "AI生成キャッチコピー", desc: "あなたの個性を一言で表現" },
            { title: "ステータス表示", desc: "5つの能力値をレーダー風に可視化" },
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
