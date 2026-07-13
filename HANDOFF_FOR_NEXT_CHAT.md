# 次チャット用 引継書

## 対象フォルダ

```text
/Users/takumiishitani/Documents/Codex/files-mentioned-by-the-user-self/outputs/self_intro_streaming_site
```

現在の採用案はこの `self_intro_streaming_site`。

動画配信サービス風の自己紹介サイトとして制作中。

## サイト構成

- `index.html`: Home / 概要
- `growth.html`: Episode 1: History / 経歴
- `strengths.html`: Episode 2: Top Skills / 強み
- `goals.html`: Episode 3: Next Stage / 目標
- `css/style.css`: 全ページ共通CSS
- `js/script.js`: 全ページ共通JavaScript
- `assets/images/`: 画像・favicon
- `README.md`: 公開方法などの簡易説明
- `PROJECT_NOTES.md`: 制作方針・仕様メモ
- `PRESENTATION_NOTES.md`: 発表時に説明する制作過程メモ

## ローカル確認

ローカルサーバーは以下で確認していた。

```text
http://127.0.0.1:4173/
```

起動コマンド:

```bash
python3 -m http.server 4173
```

起動ディレクトリ:

```text
/Users/takumiishitani/Documents/Codex/files-mentioned-by-the-user-self/outputs/self_intro_streaming_site
```

## 現在の主要仕様

### 全体

- HTML / CSS / Vanilla JavaScriptのみ
- React、Vue、WordPress、CMSは未使用
- Netlifyへフォルダごとアップロード可能な静的サイト
- 黒背景、赤アクセント、動画配信サービス風
- ブランド表記は `TAKUMI ORIGINALS`
- タブアイコン、サイドバーアイコン、Homeイントロは `T` で統一

### Home

ファイル:

```text
index.html
```

内容:

- `TAKUMI ISHITANI`
- コピー: `明日死ぬように生き、永遠に生きるように学ぶ`
- コピー右横に `▶ はじめから見る` ボタン
- プロフィールカード
- KPIカード3枚
- 数値で見た石谷
- スマホ下部にも `▶ はじめから見る` ボタン追加済み

プロフィールカード文言:

```text
石谷 拓巳
29歳 / 福岡出身 / 東京都浅草在住
施工管理、広告運用、広告営業を経験。2026年7月1日から株式会社セルミュラーに入社。
```

KPI:

- 仮説を立てる速度: `88%`
- 修正の粘り: `90%`
- まず動く力: `92%`

数値で見た石谷:

- Meta広告運用: `86%`
- 営業力: `78%`
- 動画編集: `74%`
- 数値分析: `82%`

Homeの方針:

- 概要ページなので、できるだけ1画面に収めたい
- 余白は詰め気味
- スマホではKPIカードを3列横並びにして省スペース化済み

### Homeイントロ

Homeを開いた時だけ、大きな赤い `T` から始まるイントロ演出あり。

実装:

- `index.html` に `.intro-splash`
- `style.css` に `.intro-splash` と `@keyframes intro-i-drive`
- `script.js` でアニメーション終了後に `.is-finished` を付与

注意:

- 名前は `intro-i-drive` のままだが、表示は `T`
- 必要なら後で `intro-t-drive` にリネームしてもよい
- Tの比率は調整済み
  - 縦棒を細く
  - 横棒を太め

### History

ファイル:

```text
growth.html
```

ページ上部:

- `Episode 1: History`
- `HISTORY`
- `人生山あり谷あり`

項目:

1. 小学生
2. 中学生
3. 高校生
4. 施工管理
5. フリーランス
6. 広告営業
7. 株式会社セルミュラー

仕様:

- 各カードは `details` / `summary`
- 閉じている時:
  - PC: `クリックして展開`
  - スマホ: `タップして展開`
- 開いた後は展開案内を非表示
- 本文末の `○○に続く` ボタンだけ表示
- `○○に続く` を押すと次のエピソードが開く
- 最後は次ページへ移動
- カード外をクリックすると開いているHistoryカードは閉じる

最近の修正:

- サイドバー下部は `Contact` ではなく `History Guide`
- 文言:
  - `最初はまったく仕事ができなかった`
  - `厳しい現場では毎日怒られていた`
  - `しばらく経つと「あれ？なんか通用するようになってきた？」...`
- スマホでは開いたカードを `画像 → テキスト` の縦並びに調整済み

### Top Skills

ファイル:

```text
strengths.html
```

ページ上部:

- `Episode 2: Top Skills`
- `TOP SKILLS`
- `こんな力を秘めています`

スキル:

1. 分析力
2. 仮説構築力
3. 言語化力
4. ヒアリング力
5. 提案力
6. 調整力・巻き込み力

仕様:

- 閉じている時は `VIEW SKILL`
- 開いた時は `CLOSE`
- スマホでは詳細下に次へ進むボタンをJSで追加
  - 例: `仮説構築力へ ↓`
  - 最後は `スキルの目安へ ↓`
- 開いたスキル以外は閉じる

注意:

- 次へ進むボタンはHTMLには直接書かれていない
- `script.js` が `.skill-next` ボタンを生成している

### Goals

ファイル:

```text
goals.html
```

ページ上部:

- `Episode 3: Next Stage`
- `NEXT STAGE`
- `成長or死。止まれません。マグロと同じです。`

目標本文は箇条書きではなく文章形式。

短期:

```text
まずは1ヶ月半の研修を走りきる
テクニック・専門スキル・マインド・ビジネスマナーを身につけ、利益を生み出せるマーケティングコンサルタントになる
```

中期:

```text
単月200万円以上の粗利を出す
1人でクライアントの課題を特定し、最適解の改善案を提案し、成果に向けて伴走できるようになる
```

長期:

```text
自分を起点に、セルミュラーから100人の“本物のマーケター”を輩出する
理想の死に方は、95歳でボケずに仕事もプライベートも現役バリバリ健康マッチョな状態でぽっくり逝くこと
「昨日まで元気だったのにな」と言われながら多くの人から死を惜しまれる
```

重要:

- 句点は不要
- ユーザー指定外の言い回しを勝手に足さないこと
- 以前 `人生にする` を勝手に足してしまい、削除済み

PC仕様:

- 閉じている時は3カード
- 開くと左右2カラム
  - 左: 画像
  - 右上: タイトル
  - 右下: 詳細テキスト
- 開いた時のボタン:
  - 短期: `中期目標へ`
  - 中期: `長期目標へ`
  - 長期: `CLOSE`

スマホ仕様:

- 開いたカード内に赤い移動ボタンを追加済み
  - 短期: `中期目標へ →`
  - 中期: `← 短期目標へ` / `長期目標へ →`
  - 長期: `← 中期目標へ` / `CLOSE`
- スマホでは旧ボタンは非表示
- `CLOSE` を押した後、長期目標カード位置に戻るようにJS修正済み

## 画像最適化

ユーザーから「画像が重い」と指摘あり。

対応済み:

- 元画像は `/private/tmp/self_intro_streaming_site_image_backup/` に退避
- サイト内のPNG画像をJPEG化
- HTML参照も `.jpg` に変更
- 重いPNGはサイトフォルダ外へ移動済み

現在の画像フォルダ:

```text
assets/images
```

サイズ:

```text
約1.5MB
```

元画像バックアップ:

```text
/private/tmp/self_intro_streaming_site_image_backup/
```

注意:

- WebP変換ツールはこの環境に見当たらなかった
- `sips` はWebP読み込みはできるが、書き出しは不可
- JPEG化で十分軽くなっている

## 画像ファイル

現在HTMLが参照している主な画像:

```text
assets/images/profile-photo.jpg
assets/images/episode-elementary.jpg
assets/images/episode-middle-school.jpg
assets/images/episode-high-school.jpg
assets/images/episode-construction.jpg
assets/images/episode-freelance.jpg
assets/images/episode-sales.jpg
assets/images/episode-cellmuller.jpg
assets/images/goal-short.jpg
assets/images/goal-middle.jpg
assets/images/goal-long.jpg
assets/images/favicon.svg
```

古い `.png` 参照が復活しないよう注意。

## favicon

ファイル:

```text
assets/images/favicon.svg
```

現在は赤い `T`。

全HTMLの `<head>` に以下あり:

```html
<link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">
```

## JavaScript実装

ファイル:

```text
js/script.js
```

主な処理:

- Homeイントロ終了後に非表示化
- スマホ用ハンバーガーメニュー
- KPIカウントアップ
- IntersectionObserverでスクロール表示
- Historyカード開閉
- Historyの `○○に続く`
- Top Skillsの次へ進むボタン生成
- Goalsカード開閉
- Goalsの次/前/閉じるボタン
- GoalsのCLOSE後スクロール位置補正

検証済み:

```bash
node --check js/script.js
```

## 発表用メモ

発表・質問対策は以下にまとめてある。

```text
PRESENTATION_NOTES.md
```

ただし、直近のスマホUI改善や画像最適化まではまだ反映していない可能性がある。
次チャットで余裕があれば `PRESENTATION_NOTES.md` も最新化するとよい。

## 代表・プログラマ寄りの人に突っ込まれそうな点

### KPIやスキルバーの数値

実績値ではなく自己評価。

説明:

```text
実績数値ではなく、ダッシュボード風に見せるための自己評価指標です
```

### なぜ動画配信サービス風か

説明:

```text
普通の履歴書形式だと読み飛ばされやすいので、自分の人生や強みをエピソードとして読み進めてもらう構成にしました
```

### JavaScriptは何をしているか

説明:

```text
カウントアップ、スクロール表示、スマホメニュー、カード開閉、Historyの次エピソード遷移、Goalsの前後移動を実装しています
```

### 制作過程はどこにあるか

説明:

```text
PRESENTATION_NOTES.md に、構成・デザイン意図・実装方針をまとめています
```

## 直近の確認結果

確認済み:

- HTML内の相対参照切れなし
- `node --check js/script.js` OK
- `episode-elementary.jpg` 200 OK
- `goal-long.jpg` 200 OK
- `script.js` 200 OK

ローカルサーバーで必要なら再確認:

```bash
curl -I http://127.0.0.1:4173/index.html
curl -I http://127.0.0.1:4173/growth.html
curl -I http://127.0.0.1:4173/strengths.html
curl -I http://127.0.0.1:4173/goals.html
curl -I http://127.0.0.1:4173/css/style.css
curl -I http://127.0.0.1:4173/js/script.js
```

## 次にやるなら

優先順:

1. 実機スマホでHome/History/Top Skills/Goalsを再確認
2. `PRESENTATION_NOTES.md` にスマホUI改善と画像軽量化を追記
3. 不要な `.DS_Store` が気になる場合は削除
4. Netlifyに再アップロード
5. ブラウザキャッシュが残る場合は強制再読み込み

## 注意事項

- ユーザー文言は勝手に意味を足さない
- 特にGoalsの長期目標は原文ニュアンスを保つ
- スマホ表示は今後も実機スクショベースで調整する
- 画像は現在JPEG参照になっているため、PNG名に戻さない
- Homeは概要ページなので、縦に長くしすぎない

---

# 2026-07-09 追記: デザイン微調整まとめ

このセクションより上の内容は2026-07-06時点のもので、一部下記により古くなっている（特にGoalsのボタン仕様）。矛盾する場合はこのセクションを優先すること。

## 全ページ共通

- `<p class="eyebrow">`（`Episode 1: History`等の赤い小見出し）は4ページ全て削除済み
- スクロール表示時に出ていた「細い赤枠」（`.card::before`のreveal演出）は削除済み
- カード・画像の角丸を`6px`→`10px`に統一（`.card`本体、History全画面表示、Goals画像、Homeプロフィール画像など）
- 「開いた状態」の赤枠（`.skill-card[open]`、`.goal-card[open]`、`.log-overlay`）は全て透明化済み。閉じたカードへのhover時の赤みは残したまま

## History（growth.html）

- モバイルでフルスクリーン表示（詳しく見る）を開くと、タイトルが写真に重なる/余白が異常に空く不具合があった
  - 原因1: 画像枠の高さをCSS Gridの`auto`行 + `aspect-ratio`で決めていたが、モバイルではこの組み合わせで高さがブラウザに正しく伝わらない
  - 原因2: 本文が短いエピソードほど、余ったスペースが行の間に配分されてズレていた（`.log-overlay`に`align-content:start`が無かった）
  - 対応: 画像枠を`padding-bottom`方式に変更、`.log-overlay`に`align-content:start`を追加。全7エピソードで画像とタイトルの間隔が16pxに統一されたことを確認済み
- フルスクリーン表示の写真の切り出し位置（`object-position`）が全エピソード共通の値のみで、高校生だけ頭が切れていた
  - サムネイル用に個別調整していた値と同じものを、フルスクリーン表示にも`img[src*="episode-xxx"]`のセレクタで追加し、全エピソードで頭が切れないように統一
- 小学生（`episode-elementary.jpg`）の写真は胸元までのタイトな構図で、そのままだとフルスクリーン表示で顔が拡大されすぎる問題があった
  - 元写真の周囲に黒（サイト背景と同色 `#0b0b0b`）の余白を全方向に追加した専用画像を作成し、`episode-elementary.jpg`と`episode-elementary-thumb.jpg`両方をこれに置き換え
  - サムネイル・フルスクリーンどちらも`object-fit:cover`に統一（以前サムネ専用ファイル+フルスクリーンだけcontainという分岐をしていたが、見た目の一貫性のためcoverに統一した）
  - `growth.html`の該当`<img>`には`data-full-src`属性が付いているが、現在はサムネ画像とフル画像が同一内容のため実質未使用（`script.js`の`openLogCard`はこの属性があれば優先する仕組みだけ残してある）
- ESCキーでの挙動は元々実装済み（`closeLogCards`）

## Top Skills（strengths.html）

- スキルカードだけ`:focus-visible`の見た目定義が無く、ESC押下時などにブラウザ標準の青い枠線が出ていた。History/Goalsと同じ赤い控えめな枠に統一
- ESCキーでスキルカードを閉じる処理が無かったため追加（`.skill-card[open]`を閉じるだけの単純な処理）

## Goals（goals.html）

- 3カードとも「次へ/閉じる」ボタン（`summary em`）が本文の直前にあり、本文とボタンの間に大きな空白ができていた
  - CSS Gridの行を入れ替え、本文（`.goal-detail`）を可変行、ボタンを最後の行に固定して、常にカード最下部にボタンが来るようにした（3カード共通CSSなので短期・中期・長期すべてに反映済み）
- 本文の文字サイズが小さく余白に対して物足りなかったため、`15px`固定 → `clamp(17px, 1.6vw, 21px)`に変更
- 各カードに専用の「閉じる」ボタン（`.goal-close`、右上に表示）を追加し、ESCキーでも閉じられるようにした（以前はカード外クリック or 次への遷移ボタンのみだった）

## 検証方法

今回はPlaywright（`npx playwright`、ブラウザキャッシュは`~/Library/Caches/ms-playwright`に既存）を使い、実際にページをレンダリング・スクリーンショットして確認しながら修正した。次回同様の見た目の不具合を調査する時は、CSSを読むだけでなく実際に描画して`getBoundingClientRect`等で数値を取ると原因特定が早い（History不具合はこの方法で発見した）。

## 次にやるなら

- 実機スマホで今回の修正（History全エピソード、Goals3カード、Top Skills）を最終確認
- Netlifyへ再デプロイ
- `PRESENTATION_NOTES.md`の更新は依然未着手
