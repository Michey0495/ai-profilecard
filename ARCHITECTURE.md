# Architecture - AIプロフカード

## Design Philosophy

AIプロフカードは「AIエージェントが使うサービスを人間がモニタリングする」構造で設計。
MCP Server経由でAIエージェントが直接プロフカード生成を実行でき、
人間向けUIはそのモニタリング/操作インターフェースとして機能する。

## Data Flow

```
User Input → POST /api/generate → Claude Haiku → Parse JSON → Store in KV → Redirect to /result/{id}
```

1. ユーザーが名前・趣味・性格・スタイルを入力
2. フロントエンドが `/api/generate` にPOST
3. APIがClaude Haikuにプロンプト送信
4. AIがJSON形式でプロフカードデータを生成
5. Vercel KVに結果を保存 (30日間)
6. ユーザーを `/result/{id}` にリダイレクト
7. OGP画像が動的生成され、SNSシェア時に表示

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (metadata, GA, CrossPromo, Toaster)
│   ├── page.tsx            # Home page (form + SEO structured data)
│   ├── globals.css         # Global styles (black background)
│   ├── robots.ts           # Dynamic robots.txt
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── error.tsx           # Error boundary
│   ├── not-found.tsx       # 404 page
│   ├── api/
│   │   ├── generate/route.ts  # Profile card generation API
│   │   ├── mcp/route.ts       # MCP Server (JSON-RPC 2.0)
│   │   └── feedback/route.ts  # Feedback → GitHub Issues
│   └── result/[id]/
│       ├── page.tsx           # Result display
│       ├── opengraph-image.tsx # Dynamic OGP image
│       └── loading.tsx        # Loading skeleton
├── components/
│   ├── ProfileCardForm.tsx # Main input form (client component)
│   ├── ShareButtons.tsx    # X/copy share buttons (client component)
│   ├── CrossPromo.tsx      # Cross-promotion to other services
│   └── FeedbackWidget.tsx  # Feedback submission widget
├── types/
│   └── index.ts            # TypeScript type definitions
└── public/
    ├── .well-known/agent.json  # A2A Agent Card
    ├── llms.txt               # AI-readable site description
    └── robots.txt             # Static robots.txt fallback
```

## AI Output Schema

```typescript
interface ProfileResult {
  id: string;
  input: {
    name: string;       // User name (max 50 chars)
    interests: string;  // Interests (max 300 chars)
    personality: string; // Personality (max 200 chars)
    style: string;      // Card style
  };
  title: string;        // AI-generated catchy title
  catchcopy: string;    // AI-generated catchphrase
  type: string;         // Personality type name
  description: string;  // Profile description
  stats: Array<{        // 5 ability stats
    label: string;      // Stat name
    value: number;      // 50-99
  }>;
  hashtags: string[];   // 3 hashtags
  createdAt: string;    // ISO timestamp
}
```

## MCP Server Design

### Endpoint: /api/mcp
- Protocol: JSON-RPC 2.0
- Methods: `tools/list`, `tools/call`

### Tool: generate_profile_card
- Input: name (required), interests (required), personality (optional), style (optional)
- Output: Profile card data + result URL
- AI Model: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Design System

- Background: `#000000` (pure black)
- Accent: `sky-400` (#38bdf8)
- Cards: `bg-white/5 border border-white/10`
- Text: `text-white`, `text-white/70`, `text-white/40`
- Interactions: `transition-all duration-200 cursor-pointer`

## Rate Limiting

- 10 requests per 10 minutes per IP
- Stored in Vercel KV with TTL

## SEO

- JSON-LD structured data (WebApplication + FAQPage)
- Dynamic OGP images per result
- meta tags for title, description, keywords
- robots.txt allowing AI crawlers
- sitemap.xml
