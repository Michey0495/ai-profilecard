# AIプロフカード

AI自己紹介カードメーカー - 名前と趣味を入れるとオシャレなプロフカードを自動生成、SNS映え

## Features

- 名前と趣味を入力するだけでAIがプロフカードを自動生成
- AI生成キャッチコピーと二つ名
- 性格タイプ判定
- 5つの能力値ステータス (バー表示)
- ハッシュタグ自動生成
- 4つのカードスタイル (クール/キュート/ダーク/クリエイティブ)
- 結果シェア機能 (X/リンクコピー)
- OGP画像自動生成でSNS映え

## Tech Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Claude Haiku 4.5 (AI engine)
- Vercel KV (data storage)
- Sonner (toast notifications)

## Setup

```bash
npm install
```

### Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
NEXT_PUBLIC_SITE_URL=https://ai-profilecard.ezoai.jp
NEXT_PUBLIC_GA_ID=G-... (optional)
GITHUB_TOKEN=ghp_... (optional, for feedback)
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## API

### POST /api/generate

Generate a profile card.

Request:
```json
{
  "name": "たろう",
  "interests": "ゲーム、プログラミング、アニメ",
  "personality": "好奇心旺盛、マイペース",
  "style": "cool"
}
```

Response:
```json
{
  "id": "abc123"
}
```

### MCP Server: /api/mcp

JSON-RPC 2.0 endpoint for AI agent integration.

Tool: `generate_profile_card`
- name (string, required): Name or nickname
- interests (string, required): Hobbies and interests
- personality (string, optional): Personality traits
- style (string, optional): cool/cute/dark/creative

## Pages

- `/` - Home page with profile card form
- `/result/{id}` - Generated profile card with OGP image

## AI Public Channels

- Agent Card: `/.well-known/agent.json`
- LLMs: `/llms.txt`
- Robots: `/robots.txt`
- MCP: `/api/mcp`

## Deployment

- Hosting: Vercel
- Domain: ai-profilecard.ezoai.jp
- GitHub: https://github.com/Michey0495/ai-profilecard
