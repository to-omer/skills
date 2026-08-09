---
name: create-html-document
description: >-
  Convert supplied text, Markdown, notes, documents, or structured content into a readable, accessible single-file HTML document.
  Use for guides, reports, articles, reference pages, or richer previewable replacements for Markdown.
  Preserve the supplied meaning and language. Handle HTML semantics, CSS, JavaScript, layout, assets, external dependencies, and browser validation.
  Version-pinned CDN libraries such as KaTeX may be used when they improve correctness, readability, accessibility, reliability, or maintainability.
---

# 読みやすい単一 HTML 文書を作る

## 目的

与えられた内容の意味と言語を保ち、一つの `.html` ファイルへまとめる。文書の構造と利用方法を HTML と CSS で明確にする。

## 適用範囲

この Skill は、文書の HTML、CSS、JavaScript とブラウザーでの検証を扱う。内容、言語、順序、階層、数値、条件、引用、リンク、コード、数式を保ち、HTML として表すために必要な範囲で構造を調整する。文章の執筆や改稿、表や図などの情報形式の選択は扱わない。ユーザーが内容の変更も求めた場合は、指定された変更後の内容を HTML として実装する。

## 単一ファイルの意味

「単一 HTML」は、納品する文書ファイルが一つであることを指す。ページ固有の CSS、JavaScript、データ、小さな画像やアイコンは、その HTML へ含める。外部ライブラリの利用は [外部ライブラリ](references/readability-and-layout.md#外部ライブラリ) を基準にする。

## 成果物の境界

HTML ファイルには、ユーザーが依頼した文書だけを含める。次の内容は、文書の一部として明示的に求められた場合を除き、`body`、`head` 内のメタ要素、HTML コメント、埋め込みデータ、JavaScript の文字列へ入れない。

- Skill を使用したことの説明
- 依頼の復唱、作業計画、作業経緯
- 内部レビューの記録、自己評価、採点
- 確認結果、修正一覧、未実施事項
- 依頼対応上の補足、免責、納品説明
- ファイル案内、保存案内、ダウンロード案内
- TODO、仮置き文、デバッグ情報、内部メモ

必要な連絡や検証結果は、チャットや納品メッセージなど、HTML の外側へ分ける。一方、文書の読者に必要な注記、出典、利用条件、アクセシビリティ上の説明は文書内容である。作業上のメタ情報と混同して削除しない。

## 作業の進め方

### 1. 内容と制約を確定する

元の言語、主題、読者、目的、編集範囲、保持する情報、出力先、想定画面、アクセシビリティ、操作機能、ファイル構成、外部依存に関する指定を把握する。不足情報を、見栄えのために推測で埋めない。

### 2. 文書構造を HTML で表す

原文の順序と階層を確認し、各要素を内容上の役割に合う HTML で表す。要素の選択と DOM 順序は、[文書構造](references/readability-and-layout.md#文書構造) を基準にする。

### 3. 読みやすい表示を設計する

読者の主な利用方法に合わせて、本文幅、余白、見出し、目次、タイポグラフィ、配色、レスポンシブ表示を設計する。詳しい判断は [読みやすさとレイアウト](references/readability-and-layout.md) に従う。

### 4. 文書に必要な要素を実装する

数式がある場合は [数式](references/readability-and-layout.md#数式) に従う。

元資料やユーザーの指定にある図と操作機能を、[図と画像](references/readability-and-layout.md#図と画像)と[操作機能](references/readability-and-layout.md#操作機能)に従って実装する。外部ライブラリは、[外部ライブラリ](references/readability-and-layout.md#外部ライブラリ)を基準に選ぶ。

### 5. 一つの成果物へまとめる

[単一ファイルの意味](#単一ファイルの意味) に従って、納品する HTML をまとめる。最後に、[成果物の境界](#成果物の境界) に反する内容を取り除く。

### 6. 実際に検証する

[HTML 文書の検証](references/validation.md) に従い、原資料、ソース、実表示、採用した機能を確認する。

## 納品

ファイル出力が可能な環境では `.html` ファイルを作る。ファイルを作れない環境では、一つの完全な `html` コードブロックを返す。
