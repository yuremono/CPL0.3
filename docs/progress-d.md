# 作業D: 状態管理 - 進捗チェックリスト

## 実装完了状況

### タスク1: IndexedDBラッパー
- [x] `src/lib/storage/indexed-db.ts` を作成
- [x] `createIndexedDBStorage()` 関数を実装
- [x] `getItem`, `setItem`, `removeItem` メソッドを実装
- [x] エラーハンドリングを追加
- [x] ストレージキー定数を追加

### タスク2: プレビューストア
- [x] `src/stores/preview-store.ts` を作成
- [x] `PreviewState` インターフェースを定義
- [x] `PreviewMode` (preview/edit) の管理を実装
- [x] 選択要素 (`selectedElement`) の管理を実装
- [x] 編集内容 (`edits`) の管理を実装
- [x] Zustandのpersistミドルウェアを使用して永続化
- [x] セレクターフックを追加

### タスク3: 編集履歴ストア
- [x] `src/stores/edit-history-store.ts` を作成
- [x] `EditHistoryState` インターフェースを定義
- [x] 過去の操作 (`past`) と未来の操作 (`future`) を管理
- [x] Undo機能を実装
- [x] Redo機能を実装
- [x] `canUndo`/`canRedo` ヘルパーを実装
- [x] 履歴の最大保持数（50件）を設定

### タスク4: 自動保存ロジック
- [x] `src/lib/storage/auto-save.ts` を作成
- [x] `setupAutoSave()` 関数を実装
- [x] プレビューストアの変更を監視
- [x] デバウンス処理（1秒）を実装
- [x] `loadSavedEdits()` / `clearSavedEdits()` を追加
- [x] `triggerAutoSave()` （手動保存）を追加

### タスク5: カスタムフック
- [x] `src/hooks/use-selected-element.ts` を作成
- [x] `src/hooks/use-auto-save.ts` を作成
- [x] `useBeforeUnload` （離脱前確認）を追加

---

## テスト項目（未実施）

### 単体テスト
- [ ] IndexedDBラッパーの各メソッドのテスト
- [ ] プレビューストアのアクションテスト
- [ ] 編集履歴ストアのUndo/Redoテスト
- [ ] 自動保存ロジックのデバウンス処理テスト

### 結合テスト
- [ ] 要素を選択すると状態が更新される
- [ ] 編集内容が保存される
- [ ] 自動保存が動作する
- [ ] Undoで元に戻る
- [ ] Redoでやり直せる
- [ ] リロード後も状態が復元される

---

## 完了条件

- [x] `preview-store.ts` が実装され、状態管理ができる
- [x] `edit-history-store.ts` が実装され、Undo/Redoができる
- [x] `indexed-db.ts` が実装され、永続化ができる
- [x] `auto-save.ts` が実装され、自動保存が動作する
- [ ] すべての作業単位と連携して動作する
- [ ] テストカバレッジ 80% 以上

---

## 次のステップ

1. **作業Aとの連携確認**
   - `A11yElementInfo` 型を使用している
   - プレビューモードの切り替えが正常に動作する

2. **作業Bとの連携確認**
   - AI編集結果を保存できる
   - チャットUIから選択要素を操作できる

3. **作業Cとの連携確認**
   - 編集内容を永続化できる
   - APIレスポンスをストアに反映できる

4. **テスト実施**
   - 単体テストを作成
   - 結合テストを作成
   - E2Eテストを作成

---

## メモ

- ビルド: 成功（型エラーなし）
- 依存関係: Zustand v5.x がインストール済み
- ブランチ: `feature/state-management` （未作成、要作成）
