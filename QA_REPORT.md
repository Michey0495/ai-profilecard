# QA Report - AIプロフカード

**Date:** 2026-03-03
**Project:** ai-profilecard (ID: 9)
**Tester:** Claude QA Agent

---

## チェックリスト結果

| # | 項目 | 結果 |
|---|------|------|
| 1 | `npm run build` 成功 | PASS |
| 2 | `npm run lint` エラーなし | PASS (修正後) |
| 3 | レスポンシブ対応 | PASS |
| 4 | favicon, OGP設定 | PASS |
| 5 | 404ページ | PASS |
| 6 | ローディング状態の表示 | PASS |
| 7 | エラー状態の表示 | PASS |

---

## 発見した問題と対応

### 1. [FIXED] Lint Error - CardHistory.tsx (Critical)

**問題:** `useEffect` 内で `setHistory` を同期的に呼び出しており、React 19 の `react-hooks/set-state-in-effect` ルールに違反。

**修正:** `useState` + `useEffect` パターンを `useSyncExternalStore` に置き換え。localStorage からの読み取りを外部ストアとして正しく扱うようにした。

**ファイル:** `src/components/CardHistory.tsx`

### 2. [FIXED] JSON Parse Error - generate.ts, mcp/route.ts (High)

**問題:** AI レスポンスのフォールバック JSON パースで、正規表現マッチ後の `JSON.parse` が `try/catch` で囲まれておらず、不正な JSON 断片でクラッシュする可能性。

**修正:** フォールバック `JSON.parse` も `try/catch` で囲み、適切なエラーメッセージを返すようにした。

**ファイル:** `src/lib/generate.ts`, `src/app/api/mcp/route.ts`

### 3. [FIXED] API Input Validation - generate/route.ts (Medium)

**問題:**
- `req.json()` の parse 失敗時のエラーハンドリングが不足
- `style` パラメータのバリデーションなし（任意の文字列が受け入れられる）

**修正:**
- `req.json()` を `try/catch` で囲み、400 エラーを返すようにした
- `style` を `validStyles` リストで検証し、不正な値は `"cool"` にフォールバック

**ファイル:** `src/app/api/generate/route.ts`

### 4. [FIXED] Feedback API Validation - feedback/route.ts (Medium)

**問題:** フィードバック API の入力値に長さ制限やバリデーションがなく、極端に長い文字列が GitHub Issues に送信される可能性。

**修正:** `type`, `message`, `repo` を `String()` でキャストし、長さ制限を追加。空メッセージは 400 エラーを返すようにした。

**ファイル:** `src/app/api/feedback/route.ts`

### 5. [FIXED] Accessibility - ProfileCardForm.tsx (Medium)

**問題:**
- フォームの `<label>` と `<input>` が `htmlFor`/`id` で紐づいていない
- カードスタイル選択ボタンに `role="radiogroup"` / `role="radio"` がない
- 送信ボタンにローディング時の `aria-busy` がない

**修正:**
- `name`, `interests`, `personality` フィールドに `id` を追加し `label` と紐づけ
- スタイル選択を `role="radiogroup"` + `role="radio"` + `aria-checked` で ARIA 対応
- 送信ボタンに `aria-busy={loading}` を追加

**ファイル:** `src/components/ProfileCardForm.tsx`

### 6. [FIXED] Accessibility - ShareButtons.tsx (Low)

**問題:** シェアボタン（X, LINE, コピー）に説明的な `aria-label` がない。

**修正:** 各ボタンに適切な `aria-label` を追加。

**ファイル:** `src/components/ShareButtons.tsx`

---

## 確認済み項目（問題なし）

### SEO / メタデータ
- Root layout: 包括的な metadata 設定（title template, description, keywords, OGP, Twitter card）
- JSON-LD: WebApplication + FAQPage スキーマ
- Dynamic OGP: 結果ページごとに 1200x630 画像を動的生成
- robots.txt: 静的 + 動的の両対応、AI クローラー許可設定
- sitemap.xml: 動的生成
- `/.well-known/agent.json`: A2A Agent Card
- `/llms.txt`: AI 向けサイト説明

### UI / レイアウト
- トップページ: 3ステップ説明、フォーム、サンプルカード、機能一覧
- 結果ページ: プロフィールカード表示、シェアボタン、ダウンロードボタン
- 404ページ: 適切なメッセージとトップへのリンク
- エラーページ: リトライボタン付きのエラーバウンダリ
- ローディング: スケルトン UI（結果ページ）、回転メッセージ（フォーム送信時）
- レスポンシブ: `max-w-2xl` ベースの中央寄せ、グリッドレイアウト対応
- デザインシステム準拠: 黒背景、白テキスト、アクセントカラー、アイコンなし

### エッジケース
- フォーム: クライアント側バリデーション（空入力チェック）+ サーバー側バリデーション
- 入力制限: `maxLength` 属性 + サーバー側 `slice()` による二重防御
- レート制限: IP ベースで 10 リクエスト/10 分
- KV 未存在: `notFound()` による 404 処理
- スタイル不明: `getTheme()` で `cool` にフォールバック

### パフォーマンス
- Server Components をデフォルトで使用、`"use client"` は必要な箇所のみ
- Edge Runtime で OGP 画像生成
- アニメーション: CSS transition + 最小限の JS
- フォント: `next/font` による最適化ロード
- 静的ページ: `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml` はプリレンダリング

### セキュリティ
- XSS: React の自動エスケープ + 入力値の `String()` キャスト
- API: 入力長制限、レート制限、バリデーション
- 認証情報: 環境変数で管理、クライアントに露出なし

---

## 修正ファイル一覧

1. `src/components/CardHistory.tsx` - useSyncExternalStore 移行
2. `src/lib/generate.ts` - JSON パースのエラーハンドリング
3. `src/app/api/generate/route.ts` - 入力バリデーション強化
4. `src/app/api/mcp/route.ts` - JSON パースのエラーハンドリング
5. `src/app/api/feedback/route.ts` - 入力バリデーション追加
6. `src/components/ProfileCardForm.tsx` - アクセシビリティ改善
7. `src/components/ShareButtons.tsx` - aria-label 追加

---

## 最終ビルド結果

```
npm run build  -> SUCCESS (5.7s)
npm run lint   -> 0 errors, 0 warnings
```
