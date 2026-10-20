# 描画ライブラリ

## 目次

- [選択と組み込み](#選択と組み込み)
- [数式：KaTeX](#数式katex)
- [通常のコード：Shiki](#通常のコードshiki)
- [差分・行注釈：Diffs](#差分行注釈diffs)
- [数値の図：Observable Plot](#数値の図observable-plot)
- [構造の図：Mermaid](#構造の図mermaid)

## 選択と組み込み

| 内容 | 基本の選択 | 選ぶ条件 |
| --- | --- | --- |
| 数式 | [KaTeX](https://katex.org/docs/api) | 本文内と独立行の数式。`output: "html"` で HTML だけを生成する |
| 通常のコード | [Shiki](https://shiki.style/guide/install) | 読める構文色を付け、静的な `pre` / `code` にする |
| 差分・行注釈 | [Diffs](https://diffs.com/llms-full.txt) | 変更行、追加・削除、行に対応する説明を示す |
| 数量の比較・推移・分布 | [Observable Plot](https://observablehq.com/plot/getting-started) | データと尺度から SVG のグラフを作る |
| 分岐・状態・依存関係 | [Mermaid](https://mermaid.js.org/config/usage.html) | 関係の配置を自動化する。小さな固定図は直接 SVG でもよい |
| コード中心の文書 | [Expressive Code](https://expressive-code.com/reference/configuration/) | ファイル枠、ターミナル表現、強調範囲などをまとめて使う。生成 HTML に必要な CSS と採用機能の JS も含める |

- 必要なライブラリだけを使う。通常の文書に UI フレームワークや複数の構文ハイライターを常設しない。
- 主要内容は生成時に HTML / SVG へ描画し、最終 HTML の本文へ含める。操作に必要な JavaScript を追加する。
- 信頼できる CDN も使える。バージョンを固定し、描画器と CSS・フォントを同じ版に揃える。オフライン指定では CSS、フォント、必要な JS もインライン化し、相対パスやネットワーク依存を残さない。
- 描画器の CSS の後に [基準 CSS](../assets/document.css) をインライン化する。本文と部品の配色は `--paper` / `--surface` / `--ink` / `--muted` / `--edge` / `--accent` / `--link` に合わせる。明暗と印刷は図やコードにも適用する。
- 元のコード・式・データを保つ。描画できない場合は、設定・組み込み方法を修正し、数式以外では必要に応じて別の描画器を選ぶ。最終成果物にエラーメッセージや空の図を残さない。

以下の Node.js 例は ESM の生成処理で使う。各例の `html` または `svg` を文書へ組み込み、必要なスタイルを `head` に追加する。API の確認に使った版は KaTeX 0.19.0、Shiki 4.5.0、Diffs 1.5.2、Observable Plot 0.6.17、Mermaid 12.2.0。更新時は使う API と実表示を確認する。

## 数式：KaTeX

数式は KaTeX の HTML 出力のみを使い、MathJax と MathML（非表示の支援技術向け出力を含む）は使わない。`output` は既定値に任せず `"html"` とする。既存の MathML、Unicode、プレーンテキストによる数式も、変数・演算・添字・条件の意味を保って TeX へ整理する。単なる数値・単位やコードは対象にしない。

```js
import katex from "katex";
const escapeAttribute = value => value.replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);
const tex = String.raw`\sum_{i=1}^{n} i = \frac{n(n+1)}{2}`;
const label = "i を 1 から n まで足した和は、n と、n に 1 を足した値の積を、2 で割った値に等しい。";
const rendered = katex.renderToString(tex, {
  displayMode: true,
  output: "html",
  throwOnError: true,
  trust: false
});
const html = `<div class="equation" tabindex="0" role="math"
  aria-label="${escapeAttribute(label)}"
  data-tex="${escapeAttribute(tex)}">${rendered}</div>`;
```

本文中は `displayMode: false` にし、`.equation` の `div` の代わりに、同じ `role`・`aria-label`・`data-tex` を持つ `span` で包む。KaTeX の HTML 内部には `aria-hidden` が付くことがあるため、式の内容を伝える読み上げ名はその外側の `role="math"` の要素へ付ける。本文中の説明を `aria-labelledby` で参照してもよい。

元 TeX は上の `data-tex` のように属性値をエスケープして保持する。対応記法へ直した場合は、原式と描画用 TeX を別の属性に分けて残す。[オプション](https://katex.org/docs/options)の `maxExpand` などの制限を理由なく解除しない。

CDN を使う場合は、生成に使った版と同じ CSS を追加する。

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/katex.min.css">
```

完全に埋め込む場合は、インストール済みパッケージの `dist/katex.min.css` を読み、各 `@font-face` の `src` を同梱 woff2 の `data:font/woff2;base64,...` と `format("woff2")` だけに置き換えてから `<style>` に入れる。使わない woff・ttf の相対 URL は除き、採用する字体・太さに必要なフォントを残す。CSS だけのインライン化ではフォントは埋め込まれない。

この処理には同梱の [katex-css.mjs](../scripts/katex-css.mjs) を使える。描画に使う KaTeX をインストールした生成用ディレクトリから実行すると、同じ版の CSS と全 WOFF2 フォントを一つにした CSS を標準出力へ返す。

```sh
node /path/to/create-html-document/scripts/katex-css.mjs > katex-inline.css
```

`/path/to/create-html-document` は実際の Skill の場所に置き換える。生成した CSS を HTML に埋め込み、納品物からこの中間ファイルを参照しない。

KaTeX の内部クラスは改名しない。CSS を埋め込む際も、各 `@font-face` の境界と `.katex` の基本宣言を保つ。

数式専用フォントは保持し、本文との大きさを調整する。長い式は意味の区切りで `aligned` などに分け、残る幅は式の領域内でスクロールさせる。画面と印刷で添字や右端が切れないことを確認する。[対応表](https://katex.org/docs/support_table)を参照し、未対応の記法は意味が等しい KaTeX 対応記法やマクロの展開形へ直して再描画する。`throwOnError: false` で生の式を残したり、別の数式描画器やプレーンテキストへ暗黙に切り替えたりしない。

## 通常のコード：Shiki

```js
import {codeToHtml} from "shiki";
const source = 'const message = "<hello>";\nconsole.log(message);';
const html = await codeToHtml(source, {
  lang: "javascript",
  themes: {light: "github-light", dark: "github-dark"},
  defaultColor: false
});
```

この出力にはブラウザー用ハイライターは不要。[二つのテーマ](https://shiki.style/guide/dual-themes)の CSS 変数を出力し、基準 CSS の `.shiki` 規則で `data-theme`、OS の明暗、印刷へ合わせる。独自 CSS を使う場合も `--shiki-light` / `--shiki-dark` と背景色を切り替え、印刷は明色を明示する。

構文色はテーマの背景色と組み合わせて使う。コードや差分の背景だけを本文の `--surface` へ差し替えると、文字のコントラストが下がる場合がある。

コードを再整形せず、言語を正しく指定する。未対応の言語は `lang: "text"` で原文を保つ。横幅はコード領域内で扱い、折り返す場合もインデントを維持する。コピー機能を付ける場合は元の `source` をコピーし、行番号・装飾・コピー済み表示を混入させない。

等幅フォントにない文字は、埋め込んだ本文用フォントでも補う。基準 CSS は `monospace` の後へ `var(--font-sans)` を置き、英数字の等幅と日本語などの表示を両立させる。本文用フォントだけへ置き換えてコード全体を比例幅にしない。

## 差分・行注釈：Diffs

短い変更の説明は一列の差分を基本にする。左右の対応を追う用途では分割表示も使えるが、狭い画面と印刷は一列へ戻す。色に加えて `+` / `-` を表示する。

```js
import {preloadMultiFileDiff} from "@pierre/diffs/ssr";
const oldFile = {name: "example.js", contents: "const total = 1;\n"};
const newFile = {name: "example.js", contents: "const total = 2;\n"};
const {prerenderedHTML} = await preloadMultiFileDiff({
  oldFile, newFile,
  options: {
    theme: {light: "github-light", dark: "github-dark"},
    themeType: "system", diffStyle: "unified", diffIndicators: "classic",
    overflow: "wrap", expandUnchanged: true, disableFileHeader: true,
    unsafeCSS: `:host { color-scheme: inherit; }
      @media print {
        :host { color-scheme: light !important; }
        pre { overflow: visible !important; }
      }`
  }
});
const html = `<diffs-container><template shadowrootmode="open">${prerenderedHTML}</template></diffs-container>`;
```

この出力は CSS を含む Declarative Shadow DOM 用の断片。`template` を含めて最終 HTML へ保存する。外側の CSS は内部の `pre` や行へ直接届かないため、必要な変更は生成オプションの `unsafeCSS` に記す。上の例は文書の `color-scheme` を継承し、印刷では明色にする。

対応ブラウザーでは初期 HTML だけで表示できる。コピーや行選択などの操作はこの SSR 例には含まれない。必要な操作を実装・検証してから表示し、元ファイルをコピー対象にする。静的表示では未変更行の展開ボタンに依存しない。元ファイルのない部分パッチでは、含まれていない行を補って作らない。

対象環境で Shadow DOM が使えない場合は Shiki またはエスケープ済みの `pre` / `code` で読める差分を用意する。通常の本文で仮想スクロールを使わず、必要な行が印刷にも残ることを確認する。

## 数値の図：Observable Plot

データと軸の意味を決めてから描画する。次は説明用データを使う生成時 SVG の例。

```js
import * as Plot from "@observablehq/plot";
import {JSDOM} from "jsdom";
const document = new JSDOM("").window.document;
const data = [{plan: "案 A", minutes: 24}, {plan: "案 B", minutes: 36}];
const svg = Plot.plot({
  document, width: 640, height: 180, marginLeft: 56, marginRight: 40,
  style: {background: "transparent", color: "var(--ink)",
    fontFamily: "inherit", fontSize: "13px"},
  ariaLabel: "案ごとの所要時間", ariaDescription: "案 A は24分、案 B は36分。",
  x: {label: "所要時間（分）", grid: true}, y: {label: null},
  marks: [
    Plot.barX(data, {x: "minutes", y: "plan", fill: "var(--accent)"}),
    Plot.ruleX([0]),
    Plot.text(data, {x: "minutes", y: "plan", text: d => `${d.minutes}分`,
      dx: 4, textAnchor: "start"})
  ]
}).outerHTML;
const html = `<figure class="diagram">
  <div class="diagram-scroll" tabindex="0" role="region" aria-label="案ごとの所要時間の図">${svg}</div>
  <figcaption>案 A は24分、案 B は36分（説明用データ）。</figcaption>
</figure>`;
```

[生成時の描画](https://observablehq.com/plot/getting-started)には `document` を渡す。`caption` や凡例などの指定によって HTML の `figure` が返る場合もある。`outerHTML` 全体を組み込み、必要な説明や値の表を添える。

図内のフォントは本文から継承し、ラベルをホバーだけに隠さない。狭い画面は幅に合わせて目盛りと配置を作り直すか、適切な幅の SVG を別に生成する。固定幅を保つ必要がある場合は、上の `.diagram-scroll` のように図だけを局所スクロールさせる。単に `width: 100%` で縮小して文字を小さくしない。印刷幅でも文字が小さくなる場合は、印刷用の配置を生成する。明暗・印刷の配色は CSS 変数で追従させ、複数系列は形や直接ラベルでも区別する。

HTML 側へ凡例を付ける場合も、マークは小さな SVG で描ける。背景印刷の設定に左右される CSS の背景色を、系列を区別する唯一の記号にしない。

```html
<span><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4" fill="currentColor"/></svg> 中央値</span>
<span><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="2" width="8" height="8" fill="currentColor"/></svg> p95</span>
```

この円・四角は、図中で同じ指標に使うマークと対応させる。配色を加える場合も、形との対応を保つ。

## 構造の図：Mermaid

生成時に実ブラウザーで描画し、得られた SVG を最終 HTML へ埋める。次は描画用ページの断片。読み手の入力で図を変える場合は、初期図を保存した上でブラウザー用の描画処理も残せる。

```html
<div id="diagram"></div>
<script type="module">
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@12.2.0/dist/mermaid.esm.min.mjs";
const definition = `flowchart TD
  accTitle: 公開までの手順
  accDescr: 下書きをレビューし、必要なら修正して再確認し、承認後に公開する。
  A["下書き"] --> B{"レビュー"}
  B -->|修正あり| C["修正"]
  C --> B
  B -->|承認| D["公開"]`;
const fontFamily = getComputedStyle(document.body).fontFamily;
await document.fonts.load(`16px ${fontFamily}`, definition);
await document.fonts.ready;
mermaid.initialize({
  startOnLoad: false, securityLevel: "strict", htmlLabels: false,
  theme: "base", look: "classic", layout: "dagre", fontFamily,
  flowchart: {minNodeWidth: 0, nodeSpacing: 24, rankSpacing: 40, padding: 12},
  themeVariables: {fontFamily, primaryColor: "#f4f4f5",
    primaryTextColor: "#18181b", primaryBorderColor: "#d4d4d8",
    lineColor: "#52525b"}
});
const {svg} = await mermaid.render("publication-flow-light", definition);
document.querySelector("#diagram").innerHTML = svg;
</script>
```

SVG を測定する前に、使う日本語フォントを読み込む。構文チェックだけで済ませず、ラベルの欠け、重なり、矢印、狭い表示を実ブラウザーで確認する。`accTitle` / `accDescr` と本文の説明を付け、操作しなくても関係を読める状態にする。複数の図と明暗の各版には別々の描画 ID を渡し、SVG 内部の参照を衝突させない。

[テーマ](https://mermaid.js.org/config/theming.html)は `base` を明示し、`look` も固定する。上の明色は例なので、文書のパレットに合わせて HEX 色を渡す。Mermaid のテーマ計算に `var(--ink)` を直接渡さない。明暗それぞれのパレットで同じ定義から SVG を生成して文書のテーマで切り替え、印刷は明色を表示する。別の方法として、生成 SVG 内の必要な色を CSS トークンへ置換して全モードを検証してもよい。SVG 内部には描画時の色が残るため、本文の文字色変更だけでは追従しない。
