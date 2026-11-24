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
| 数式 | [KaTeX](https://katex.org/docs/api) | 本文中の数式と独立行の数式。`output: "html"` で HTML だけを生成する |
| 通常のコード | [Shiki](https://shiki.style/guide/install) | 読みやすい構文の色を付け、静的な `pre` / `code` にする |
| 差分・行注釈 | [Diffs](https://diffs.com/llms-full.txt) | 変更行、追加・削除、行に対応する説明を示す |
| 数量の比較・推移・分布 | [Observable Plot](https://observablehq.com/plot/getting-started) | データと尺度から SVG のグラフを作る |
| 分岐・状態・依存関係 | [Mermaid](https://mermaid.js.org/config/usage.html) | 関係図の配置を自動化する。小さな固定図は直接 SVG で書いてもよい |
| コード中心の文書 | [Expressive Code](https://expressive-code.com/reference/configuration/) | ファイル枠、ターミナル表示、強調範囲などをまとめて使う。生成した HTML に必要な CSS と採用した機能の JS も含める |

- 必要なライブラリだけを使う。通常の文書に UI フレームワークや複数の構文ハイライターを常設しない。
- 主要な内容は生成時に HTML や SVG として描画し、最終的な HTML の本文に含める。操作に必要な JavaScript はそのうえで追加する。
- 信頼できる CDN も使える。バージョンは固定し、描画器・CSS・フォントを同じ版にそろえる。オフライン対応の指定があるときは、CSS・フォント・必要な JS もインライン化し、相対パスやネットワークへの依存を残さない。
- 描画器の CSS の後ろに [基準 CSS](../assets/document.css) をインライン化する。本文と部品の配色は `--paper` / `--surface` / `--ink` / `--heading` / `--strong` / `--muted` / `--edge` / `--accent` / `--link` に合わせる。明暗の切り替えと印刷は、図やコードにも適用する。
- 元のコード・式・データは変えずに保つ。描画できない場合は設定や組み込み方法を修正し、数式以外では必要に応じて別の描画器を選ぶ。最終的な成果物にエラーメッセージや空の図を残さない。

以下の Node.js の例は ESM 形式の生成処理で使う。各例で得られる `html` または `svg` を文書に組み込み、必要なスタイルを `head` に追加する。API の確認に使ったバージョンは KaTeX 0.19.0、Shiki 4.5.0、Diffs 1.5.2、Observable Plot 0.6.17、Mermaid 12.2.0 である。更新する際は、使う API と実際の表示を確認する。

## 数式：KaTeX

数式には KaTeX の HTML 出力だけを使い、MathJax や MathML（支援技術向けの非表示出力を含む）は使わない。`output` は既定値に任せず `"html"` とする。既存の MathML・Unicode・プレーンテキストで書かれた数式も、変数・演算・添字・条件の意味を保ったまま TeX 記法に整理する。単なる数値・単位やコードは数式の対象にしない。

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

本文中の数式では `displayMode: false` にし、`.equation` の `div` の代わりに、同じ `role`・`aria-label`・`data-tex` を付けた `span` で包む。KaTeX が出力する HTML の内側には `aria-hidden` が付くことがあるため、式の内容を伝える読み上げ名は、その外側にある `role="math"` の要素に付ける。本文中の説明を `aria-labelledby` で参照してもよい。

元の TeX は、上の `data-tex` のように属性値をエスケープして保持する。KaTeX で対応する記法に直した場合は、原式と描画用の TeX を別の属性に分けて残す。[オプション](https://katex.org/docs/options)の `maxExpand` などの制限は、理由なく解除しない。

CDN を使う場合は、生成時に使ったものと同じ版の CSS を追加する。

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/katex.min.css">
```

フォントも含めて完全に埋め込む場合は、インストール済みパッケージの `dist/katex.min.css` を読み込み、各 `@font-face` の `src` を同梱の woff2 による `data:font/woff2;base64,...` と `format("woff2")` だけに置き換えてから `<style>` に入れる。使わない woff・ttf の相対 URL は除き、実際に使う字体や太さに必要なフォントを残す。CSS をインライン化しただけではフォントは埋め込まれない。

この処理には、同梱の [katex-css.mjs](../scripts/katex-css.mjs) を使える。描画に使う KaTeX をインストールした生成用ディレクトリで実行すると、同じ版の CSS とすべての WOFF2 フォントを一つにまとめた CSS が標準出力に返される。

```sh
node /path/to/create-html-document/scripts/katex-css.mjs > katex-inline.css
```

`/path/to/create-html-document` は、実際の Skill の配置場所に置き換える。生成した CSS は HTML に埋め込み、納品物からこの中間ファイルを参照しない。

KaTeX の内部クラス名は変更しない。CSS を埋め込む際も、各 `@font-face` の区切りと `.katex` の基本宣言を保つ。

数式専用のフォントはそのまま保ち、本文とつり合う大きさに調整する。長い式は意味の区切りで `aligned` などに分け、収まりきらない幅は式の領域内でスクロールさせる。画面表示と印刷の両方で、添字や右端が切れないことを確認する。[対応表](https://katex.org/docs/support_table)を参照し、未対応の記法は意味が等しい KaTeX 対応記法やマクロの展開形に直して再描画する。`throwOnError: false` を指定して生の式を残したり、別の数式描画器やプレーンテキストに暗黙のうちに切り替えたりしない。

## 通常のコード：Shiki

通常の文書では、基準 CSS の `--code-*` と組み合わせる CSS 変数テーマを使う。コードの背景・基本文字・予約語の色を文書の背景面・本文・アクセントにそろえ、文字列とコメントも彩度を抑えて読み分けられるようにする。

```js
import {codeToHtml} from "shiki";
import {createCssVariablesTheme} from "shiki/core";
const documentTheme = createCssVariablesTheme({
  name: "document-code",
  variablePrefix: "--code-",
  fontStyle: false
});
const source = 'const message = "<hello>";\nconsole.log(message);';
const html = await codeToHtml(source, {
  lang: "javascript",
  theme: documentTheme
});
```

この出力があれば、ブラウザー用のハイライターは不要である。[CSS 変数テーマ](https://shiki.style/guide/theme-colors#css-variables-theme)の `--code-*` は基準 CSS から引き継がれ、`data-theme`、OS の明暗設定、印刷、パレットに追従する。HTML のインラインスタイルに出力される変数は残す。ANSI の端末色を保つ必要がある場合は、対応する色も定義して検証するか、ANSI に対応した明暗テーマを使う。

コード中心の文書などで特定のテーマを選びたい場合は、`themes: {light: "github-light", dark: "github-dark"}, defaultColor: false` のように[二つのテーマ](https://shiki.style/guide/dual-themes)を指定して生成できる。基準 CSS の `.shiki-themes` ルールはこの形式だけに適用し、CSS 変数テーマを上書きしない。独自の CSS を使う場合も文字色と背景色を同時に切り替え、印刷時には明色を明示する。

構文の色は、そのテーマの背景色と組み合わせて使う。コードや差分の背景色だけを本文の `--surface` に差し替えると、文字のコントラストが下がる場合がある。

コードは再整形せず、言語を正しく指定する。未対応の言語は `lang: "text"` を指定して原文を保つ。横幅はコード領域の中で扱い、折り返す場合もインデントを維持する。コピー機能を付ける場合は元の `source` だけをコピー対象とし、行番号・装飾・コピー済み表示などが混ざらないようにする。

コード本体と親要素には高さの制限を設けず、長いコードもページ全体の縦スクロールで読めるようにする。補足として載せる全文は必要に応じて `details` で折りたたみ、展開したときは全行を通常の文書フローで表示する。

等幅フォントに含まれない文字は、埋め込んだ本文用フォントでも補えるようにする。基準 CSS では `monospace` の後ろに `var(--font-sans)` を置き、英数字の等幅表示と日本語などの表示を両立させている。本文用フォントだけに置き換えて、コード全体を比例幅にしない。

## 差分・行注釈：Diffs

短い変更の説明には、一列の差分表示を基本にする。左右の対応を追う用途では分割表示も使えるが、狭い画面と印刷時は一列に戻す。色に加えて `+` / `-` を表示する。

```js
import {createCssVariablesTheme} from "shiki/core";
import {registerCustomTheme} from "@pierre/diffs";
import {preloadMultiFileDiff} from "@pierre/diffs/ssr";
const documentTheme = createCssVariablesTheme({
  name: "document-code", variablePrefix: "--code-", fontStyle: false
});
registerCustomTheme(documentTheme.name, async () => documentTheme);
const oldFile = {name: "example.js", contents: "const total = 1;\n"};
const newFile = {name: "example.js", contents: "const total = 2;\n"};
const {prerenderedHTML} = await preloadMultiFileDiff({
  oldFile, newFile,
  options: {
    theme: documentTheme.name,
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

この出力は、CSS を含む Declarative Shadow DOM 用の HTML 断片である。`template` 要素を含めたまま最終的な HTML に保存する。外側の CSS は内部の `pre` や各行に直接届かないため、必要なスタイル変更は生成オプションの `unsafeCSS` に書く。上の例では文書の `color-scheme` を継承し、印刷時には明色になるようにしている。

通常のコードと同じ CSS 変数テーマを、生成プロセスの中で一度登録しておく。`--code-*` は Shadow DOM の内側にも継承される。Diffs 1.5.2 では追加・削除・変更の色を CSS 変数から正しく取り出せないため、基準 CSS の `--diffs-addition-color-override` / `--diffs-deletion-color-override` / `--diffs-modified-color-override` を残す。単一テーマから出力される明暗指定を文書に合わせるため、上の `color-scheme` の指定も残す。

基準 CSS では追加を緑、削除を赤で示し、行・行番号・変更語句の背景色を明暗ごとに指定している。配色を調整するときは、追加と削除の見分けやすさに加え、各背景の上にある文字や `+` / `-` のコントラストも両立させる。

対応ブラウザーであれば初期 HTML だけで表示できる。コピーや行選択といった操作は、この SSR の例には含まれていない。必要な操作は実装と検証を済ませてから表示し、コピーの対象には元のファイルを使う。静的な表示では、未変更行の展開ボタンに頼らない。元ファイルのない部分パッチでは、パッチに含まれていない行を補って作らない。

対象環境で Shadow DOM が使えない場合は、Shiki またはエスケープ済みの `pre` / `code` で読める差分を用意する。通常の本文では仮想スクロールを使わず、必要な行が印刷時にも残ることを確認する。

## 数値の図：Observable Plot

データと軸の意味を決めてから描画する。次は、説明用データを使って生成時に SVG を作る例である。

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

[生成時の描画](https://observablehq.com/plot/getting-started)では `document` を渡す。`caption` や凡例などの指定によっては、HTML の `figure` が返ることもある。`outerHTML` 全体を文書に組み込み、必要な説明や値の表を添える。

図の中のフォントは本文から継承し、ラベルをホバーしたときしか見られない形に隠さない。狭い画面向けには、幅に合わせて目盛りや配置を作り直すか、その幅に合った SVG を別に生成する。固定幅を保つ必要がある場合は、上の `.diagram-scroll` のように図だけを局所的にスクロールさせる。単に `width: 100%` で縮小して文字を小さくしない。印刷時の幅でも文字が小さくなる場合は、印刷用の配置を別に生成する。明暗や印刷に応じた配色は CSS 変数で追従させ、複数の系列は形や直接ラベルでも区別する。

HTML 側に凡例を置く場合も、マークは小さな SVG で描ける。背景を印刷するかどうかの設定に左右される CSS の背景色を、系列を見分ける唯一の記号にしない。

```html
<span><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4" fill="currentColor"/></svg> 中央値</span>
<span><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="2" width="8" height="8" fill="currentColor"/></svg> p95</span>
```

この円と四角は、図の中で同じ指標に使うマークと対応させる。色分けを加える場合も、形との対応を保つ。

## 構造の図：Mermaid

生成時に実際のブラウザーで描画し、得られた SVG を最終的な HTML に埋め込む。次は描画用ページの断片である。読み手の入力に応じて図を変える場合は、初期状態の図を保存したうえで、ブラウザー側の描画処理も残せる。

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

SVG の寸法を測定する前に、使用する日本語フォントを読み込んでおく。構文チェックだけで済ませず、ラベルの欠け・重なり・矢印、狭い画面での表示を実際のブラウザーで確認する。`accTitle` / `accDescr` と本文での説明を付け、操作しなくても関係を読み取れる状態にする。図が複数ある場合や明暗の各版を作る場合は、別々の描画 ID を渡し、SVG 内部の参照が衝突しないようにする。

[テーマ](https://mermaid.js.org/config/theming.html)には `base` を明示し、`look` も固定する。上の明色パレットは一例なので、文書のパレットに合わせて HEX 形式の色を渡す。Mermaid のテーマ計算には `var(--ink)` を直接渡さない。明暗それぞれのパレットで同じ定義から SVG を生成して文書のテーマに応じて切り替え、印刷時には明色を表示する。別の方法として、生成した SVG 内の必要な色を CSS トークンに置き換え、すべての表示モードで検証してもよい。SVG の内部には描画時の色がそのまま残るため、本文の文字色を変えただけでは追従しない。
