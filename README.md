## 数独アプリ

Deno + Vite + React + TypeScript で構築したブラウザ上で動作する数独パズルアプリケーションです。パズル生成から入力補助、バリデーションまで、数独を遊ぶために必要な機能を一通り備えています。

## 機能

### パズル生成

- バックトラッキングアルゴリズムで完全な解答盤面を生成します
- 難易度に応じたセル削除を行います（かんたん: 35セル、ふつう: 45セル、むずかしい: 55セル）
- セル削除時に解の一意性を検証し、論理的に解ける盤面のみを出力します

### 入力方式

- 画面上の数字ボタン（1〜9）による入力
- キーボード入力（1〜9、Backspace / Delete で消去）
- 矢印キーによるセル間の移動

### メモ機能

- メモモードをONにすると、セル内に候補数字を小さく表示できます
- 同じ数字を再度入力するとメモを削除できます

### リアルタイムバリデーション

- 行・列・3×3ブロック内での数字の重複をリアルタイムで検出します
- 重複しているセルは赤色で表示されます

### クリア判定

- 全セルが埋まり、かつ重複がない状態でクリアメッセージが表示されます

### 使用技術

| 項目           | 使用技術   |
| -------------- | ---------- |
| ランタイム     | Deno       |
| ビルドツール   | Vite       |
| フレームワーク | React      |
| 言語           | TypeScript |
| スタイリング   | CSS        |

## セットアップ

### 必要条件

- Deno 2.0 以上

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd sudoku-app

# 依存関係をインストール（node_modules の生成）
deno install --allow-scripts
```

### 開発サーバーの起動

```bash
deno task dev
```

ブラウザで `http://localhost:3000` を開くとアプリが起動します。

### ビルド

```bash
deno task build
```

`dist/` ディレクトリに静的ファイルが出力されます。

### プロジェクト構成

```text
sudoku/
├── deno.json              # Deno 設定（npm パッケージの import 管理）
├── index.html             # エントリHTML
├── vite.config.ts         # Vite 設定
├── src/
│   ├── main.tsx           # アプリケーションのエントリポイント
│   ├── App.tsx            # ルートコンポーネント（状態管理・ゲームロジック）
│   ├── types.ts           # 型定義（CellState, CellPosition など）
│   ├── index.css          # グローバルスタイル
│   ├── App.css            # コンポーネントスタイル
│   ├── components/
│   │   ├── SudokuBoard.tsx    # 盤面グリッドコンポーネント
│   │   ├── SudokuCell.tsx     # セルコンポーネント
│   │   ├── NumberPad.tsx      # 数字入力パッド
│   │   └── Controls.tsx       # 難易度選択・新規ゲームボタン
│   └── utils/
│       └── sudoku.ts      # パズル生成・バリデーション・クリア判定ロジック
```

### パズル生成の仕組み

1. 解答盤面の生成: バックトラッキング法で 9×9 の完全な数独解答を生成します
2. セルの削除: 難易度に応じた数のセルをランダムに削除します
3. 一意解の検証: 各セル削除時に `countSolutions()` を呼び出し、解1通りのみであることを確認します。複数解が存在する場合はそのセルを復元し、別のセルを削除します

この手順により、論理的に解ける・かつ解が1つだけ存在する盤面が保証されます。

### 型定義

```ts
// src/types.ts

export type CellValue = number | null;

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellState {
  value: CellValue; // セルの値（1〜9、または null）
  isFixed: boolean; // 初期配置の固定セルかどうか
  isValid: boolean; // バリデーション結果
  isHighlighted: boolean; // ハイライト表示用（将来拡張用）
  notes: number[]; // メモとして入れた候補数字
}
```
