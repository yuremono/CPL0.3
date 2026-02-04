# GitHub Secrets 設定ガイド

このプロジェクトのCI/CDパイプラインで必要なGitHub Secretsの一覧です。

## 必須Secrets

### Vercelデプロイ用
| Secret名 | 説明 | 取得方法 |
|----------|------|----------|
| `VERCEL_TOKEN` | Vercelのデプロイトークン | Vercelダッシュボード → Settings → Tokens から作成 |
| `VERCEL_ORG_ID` | Vercelの組織ID | `.vercel/project.json` の `orgId` |
| `VERCEL_PROJECT_ID` | VercelのプロジェクトID | `.vercel/project.json` の `projectId` |

### カバレッジレポート用（オプション）
| Secret名 | 説明 | 取得方法 |
|----------|------|----------|
| `CODECOV_TOKEN` | Codecovのアップロードトークン | Codecovダッシュボード → Settings → Repository から取得 |

### 環境変数
| Secret名 | 説明 | 備考 |
|----------|------|------|
| `NEXT_PUBLIC_API_URL` | APIのベースURL | 本番環境用 |

## Netlifyデプロイ用（オプション）

Vercelの代わりにNetlifyを使用する場合に必要です。

| Secret名 | 説明 | 取得方法 |
|----------|------|----------|
| `NETLIFY_AUTH_TOKEN` | Netlifyの認証トークン | Netlifyダッシュボード → User Settings → Applications から作成 |
| `NETLIFY_SITE_ID` | NetlifyのサイトID | Netlifyダッシュボード → Site Settings → General → Site details |

## Secretsの設定手順

1. GitHubリポジトリの **Settings** → **Secrets and variables** → **Actions** に移動
2. **New repository secret** をクリック
3. 上記のSecret名と値を入力して **Add secret** をクリック

## Vercelプロジェクトの設定

### プロジェクトの作成
1. Vercelダッシュボードで **Add New** → **Project** をクリック
2. GitHubリポジトリをインポート
3. プロジェクト設定を確認して **Deploy**

### プロジェクトIDの確認
```bash
# プロジェクトをVercel CLIにリンク後
vercel link
cat .vercel/project.json
```

出力例：
```json
{
  "orgId": "team_xxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxx"
}
```

これらの値を `VERCEL_ORG_ID` と `VERCEL_PROJECT_ID` として登録してください。

## CI/CDパイプラインの動作

### プッシュ時
- ESLintチェック
- TypeScript型チェック
- ユニットテスト（Vitest）
- カバレッジレポート生成
- E2Eテスト（Playwright）
- Storybookビルド

### mainブランチへのマージ時
- 上記CIチェック
- Vercelへの自動デプロイ
- 本番環境でのE2Eテスト
