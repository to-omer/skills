# 根拠にした資料と、このスキルへの反映

このスキルは、公的な日本語ガイドライン、プレーンランゲージの国際規格、Web標準、読解研究、Agent Skillsの仕様をもとにしている。

資料の文言をそのまま規則にするのではなく、次の目的に合わせて整理した。

- 原文の事実と意味を保つ。
- 読者に必要な情報を選ぶ。
- 必要な情報を見つけやすくする。
- 条件、例外、論理関係を理解しやすくする。
- 読者が判断や行動に使える形にする。
- MarkdownやHTMLに変換しても、情報の階層と読み順を保つ。

最終確認日: 2026-07-24

## 日本語の公的な指針

### 文化審議会建議「公用文作成の考え方」

- 発行: 文化審議会、2022年
- URL: https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/pdf/93651301_01.pdf

この資料では、公用文を読み手とのコミュニケーションとして捉え、読み手に理解され、信頼され、行動の指針となる文書を作る考え方が示されている。また、正確に書くこと、伝える内容を絞ること、趣旨を明確にすること、読み手に通じる語を選ぶこと、図表を使うことなどが扱われている。

このスキルでは、次の方針に反映した。

- 読者と目的を先に定める。
- 原文の内容と意味を損なわない。
- 結論や必要な対応を早い位置に置く。
- 専門語、外来語、敬語、曖昧語を読者に合わせて調整する。
- 主語と述語、修飾、否定、句読点、文の長さを確認する。
- 表記を文書内でそろえる。

### 「在留支援のためのやさしい日本語ガイドライン」

- 発行: 出入国在留管理庁、文化庁、2020年
- URL: https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/pdf/92484001_01.pdf

この資料では、原文を一文ずつ機械的に置き換えるのではなく、伝える情報を選び、必要な説明を補い、具体的な行動が分かる形にすることが重視されている。

このスキルでは、次の方針に反映した。

- 一文で扱う内容を絞る。
- 二重否定、遠回しな表現、難しい外来語を見直す。
- 日時、場所、持ち物、行動を具体的にする。
- 必要な正式名称は、説明を付けて残す。
- 対象となる読者に実際に読んでもらい、行動できるか確認する。

## プレーンランゲージの国際規格

### ISO 24495-1:2023 Plain language — Part 1

- 発行: International Organization for Standardization
- URL: https://www.iso.org/standard/78907.html

公開されている概要では、読者が必要な情報を得られること、必要な情報を見つけられること、内容を理解できること、情報を利用できることが、プレーンランゲージの中心として示されている。

このスキルでは、文章の品質を次の観点に分けた。

1. 事実と意味の正確さ
2. 読者に必要な情報があるか
3. 必要な情報を見つけやすいか
4. 内容を理解しやすいか
5. 判断や行動に使いやすいか
6. 文と表記を読みやすいか

ISO規格の本文には利用上の制約があるため、このスキルでは公開されている概要と原則を参照し、規格本文を転載していない。

## Webの構造とアクセシビリティ

### Web Content Accessibility Guidelines（WCAG）2.2

- 発行: W3C
- URL: https://www.w3.org/TR/WCAG22/

このスキルでは、特に次の達成基準を参照した。

- 1.3.1 Info and Relationships
- 1.3.2 Meaningful Sequence
- 2.4.4 Link Purpose (In Context)
- 2.4.6 Headings and Labels
- 2.4.10 Section Headings
- 1.4.12 Text Spacing

反映した内容:

- 見た目で伝わる情報の関係を、マークアップや本文でも分かるようにする。
- 意味のある読み順を保つ。
- 見出しとラベルに、内容や目的が分かる文言を使う。
- リンク文から、移動先の目的を判断できるようにする。
- 文字間隔や行間を変更しても、内容や機能が失われないようにする。

WCAG 1.4.12の値は、利用者が文字間隔や行間を変更しても内容や機能が失われないことを確認するための条件である。すべての文書へ同じ値を初期設定する規則としては扱っていない。

### W3C Web Accessibility Tutorials

- Page Structure: https://www.w3.org/WAI/tutorials/page-structure/
- Headings: https://www.w3.org/WAI/tutorials/page-structure/headings/
- Tables: https://www.w3.org/WAI/tutorials/tables/
- Images: https://www.w3.org/WAI/tutorials/images/
- Forms and Labels: https://www.w3.org/WAI/tutorials/forms/labels/

反映した内容:

- 見出しでページの構成を示し、階層に沿って入れ子にする。
- 見出しを、ページ内の移動や全体把握に使えるようにする。
- 表では、見出しセルとデータセルの関係をHTMLで示す。
- 画像の目的に合う代替テキストを書く。
- フォームの入力欄とラベルを関連付ける。

### WHATWG HTML Living Standard

- URL: https://html.spec.whatwg.org/multipage/

反映した内容:

- `main`、`article`、`section`、見出し、リスト、表、`figure`、`time`、`abbr`、`ruby` などを、内容上の役割に合わせて使う。
- 別の場所への移動にはリンクを使い、現在のページで処理を実行する場合はボタンを使う。
- レイアウトのために表を使わない。
- CSSの見た目だけに頼らず、DOMの順序でも意味が通るようにする。

## Markdownの仕様

### CommonMark 0.31.2

- URL: https://spec.commonmark.org/current/

反映した内容:

- Markdownを、段落、見出し、引用、リスト、コードなどのブロックと、リンク、強調、インラインコードなどの要素として扱う。
- 出力先が不明な場合は、広く対応されている構文を基本にする。
- 改行や字下げだけで構造を示さず、標準的な構文を使う。

### GitHub Flavored Markdown

- URL: https://github.github.com/gfm/

反映した内容:

- 表、タスクリスト、取り消し線などを、CommonMarkの中核構文とは分けて扱う。
- 出力先が対応していることを確認してから、拡張構文を使う。

Markdownには実装ごとの差がある。表、脚注、注記、定義リスト、数式、front matterなどは、出力先の仕様を確認する。

## 日本のデジタルサービス向け指針

### デジタル庁デザインシステム

- 見出し: https://design.digital.go.jp/dads/components/heading/usage/
- タイポグラフィとアクセシビリティ: https://design.digital.go.jp/dads/foundations/typography/accessibility/

反映した内容:

- 見出しレベルと文字サイズを分けて考える。
- 見出しでページ全体の構成を示す。
- 長すぎる行を避ける。
- 見出し、段落、箇条書き、挿絵を使い、文章の構成を見た目だけでなく文書構造としても分かるようにする。
- 日本語の長い斜体を避ける。
- 拡大やフォント変更をしても、内容と機能が失われないようにする。

全角40字程度の行幅や、本文の1.5倍程度の行の高さは、設計を始めるときの目安として扱う。画面幅、文字サイズ、書体、対象読者、文章の種類によって適切な値は変わる。

## 読解と文章構造に関する研究

### Lorch, R. F. Jr. (1989)

- 論文: “Text-signaling devices and their effects on reading and memory processes”
- 掲載誌: Educational Psychology Review, 1, 209–234
- DOI: https://doi.org/10.1007/BF01320135

タイトル、見出し、概要、要約、文字上の手掛かりなどが、文章の構造や重要な情報に注意を向ける助けになることが論じられている。ただし、効果は文章や課題の条件によって異なる。

このスキルでは、見出し、要約、ラベル、強調を、装飾ではなく構造と重要度を伝えるために使う方針に反映した。

### McNamara, D. S. ほか (1996)

- 論文: “Are good texts always better? Interactions of text coherence, background knowledge, and levels of understanding in learning from text”
- 掲載誌: Cognition and Instruction, 14(1), 1–43
- DOI: https://doi.org/10.1207/s1532690xci1401_1

文章のつながりをどの程度明示するかは、読者の背景知識と関係することが示されている。背景知識が少ない読者には関係を明示した文章が役立ちやすい一方、知識のある読者には説明の追加が常に最適とは限らない。

このスキルでは、初心者には因果関係、定義、参照先を明示し、専門家向けでは既知の説明を増やしすぎない方針に反映した。

研究結果を、すべての文章に機械的に当てはめてはいけない。読む目的、背景知識、文章の種類、評価方法によって効果は変わる。

## 日本語の読みやすさを測る指標

### jReadability

- システム: https://jreadability.net/sys/
- 参考論文: Yoichiro Hasebe & Jae-Ho Lee (2015), “Introducing a Readability Evaluation System for Japanese Language Education”
- PDF: https://jreadability.net/file/hasebe-lee-2015-castelj.pdf

語彙、文、文字種などから文章の難しさを推定する方法は、複数の案を比べたり、極端に難しい箇所を見つけたりする際の補助に使える。

ただし、読みやすさの点数だけでは、次を確認できない。

- 事実が正しいか。
- 条件や例外が抜けていないか。
- 論理関係が正しいか。
- 読者が必要な判断を下し、行動できるか。
- MarkdownやHTMLの構造が適切か。

このため、自動指標は警告として使い、最終判断には使わない。

## Agent Skillsの仕様

### Agent Skills Specification

- URL: https://agentskills.io/specification

反映した内容:

- スキルの中核を `SKILL.md` に置く。
- YAML front matterに `name` と `description` を置く。
- ディレクトリ名と `name` を一致させる。
- 詳細資料や評価ケースを、必要に応じて別ファイルにする。

### Best practices for skill creators

- URL: https://agentskills.io/skill-creation/best-practices

反映した内容:

- 中核の指示を短く保ち、詳細は参照ファイルへ分ける。
- 宣言だけでなく、実行する順番を示す。
- 参照ファイルを、いつ読むか具体的に示す。
- 実際の失敗例と修正例を評価ケースにする。
- スキルを実際の作業に適用し、結果をもとに改訂する。

## 資料と実装箇所の対応

| このスキルの考え方 | 主な資料 | 実装箇所 |
|---|---|---|
| 読者と目的から構成を決める | 公用文作成の考え方、ISO 24495-1 | `SKILL.md`、`document-structure.md` |
| 原文の内容と意味を保つ | 公用文作成の考え方、ISO 24495-1 | `SKILL.md`、`review.md` |
| 結論と必要な対応を先に示す | 公用文作成の考え方、Lorch | `document-structure.md` |
| 読者の知識に合わせて説明の詳しさを変える | McNamaraほか | `document-structure.md`、`japanese-style.md` |
| 日本語を自然で具体的にする | 公用文作成の考え方、やさしい日本語ガイドライン | `japanese-style.md` |
| 見出しとリストで親子関係を示す | W3C、デジタル庁 | `document-structure.md`、`markdown-html.md` |
| HTMLで情報の関係と読み順を示す | WCAG、WHATWG、W3C Tutorials | `markdown-html.md` |
| Markdownの実装差を確認する | CommonMark、GFM | `markdown-html.md` |
| 自動評価の点数を補助として使う | jReadability | `review.md` |
| 中核の指示と詳細な参照資料を分ける | Agent Skills | `SKILL.md`、`references/` |

## このスキルだけでは保証できないこと

- 外部の事実が正しいこと、または最新であること
- 法令、契約、医療、金融、安全上の判断が妥当であること
- すべてのMarkdown環境で同じ表示になること
- 生成したHTMLが、すべてのアクセシビリティ要件を満たすこと
- すべての読者に、同じ文章が最適であること
- 読みやすさの点数だけで、理解度を証明できること

必要な場合は、原資料の確認、分野の専門家による確認、HTMLの検証、支援技術を含む利用者テストを追加する。
