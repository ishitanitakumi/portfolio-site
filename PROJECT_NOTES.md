# Project Notes

## 現在の採用案

動画配信サービス風の自己紹介サイト。
フォルダは `outputs/self_intro_streaming_site`。

既存の別案は残す。

- `outputs/self_intro_dashboard_site`
- `outputs/self_intro_dashboard_site_humor`
- `outputs/self_intro_streaming_site`

## 全体方針

- Netflixそのもののロゴや名前は使わない
- あくまで「動画配信サービス風」のオマージュ
- 自己紹介を「石谷拓巳の人生シリーズ」として見せる
- 読み進めたくなるように、エピソード形式・開閉カード・次のエピソード導線を使う
- 計測ツールを後から入れたとき、どのエピソードやスキルが開かれたか見やすい構造にする

## ページ構成

### Home: `index.html`

目的: 第一印象と導入。

表示内容:

- `TAKUMI ORIGINALS`
- `TAKUMI ISHITANI`
- `明日死ぬように生き、永遠に生きるように学ぶ`
- `▶ はじめから見る`
- `29歳 ・ 東京都浅草在住 ・ 広告 / LINE構築 / 営業 / データコンサルタント`
- Series Overview
- KPIカード
- 数値で見た石谷

注意:

- 「気になる石谷リスト」は不要
- `LPO` は `営業力` に変更済み

### Episode 1: History: `growth.html`

目的: 人生の流れを読ませる。

ページ上部:

- 赤文字: `Episode 1: History`
- 見出し: `HISTORY`
- コピー: `人生山あり谷あり`

エピソード:

1. 小学生
2. 中学生
3. 高校生
4. 施工管理
5. フリーランス
6. 広告営業
7. 株式会社セルミュラー

方針:

- `EP.01` などの表記は不要
- 展開部分の本文はユーザー原文を勝手に敬語化しない
- 各項目に PC は `クリックして展開`、スマホは `タップして展開`
- 開いた本文末は `中学生に続く` のように自然な導線にする
- ページ最上部の「次のエピソード」ボタンは不要
- ページ最下部のみ `▶ 次のエピソード`

画像対応:

- 小学生: `assets/images/episode-elementary.jpg`
- 中学生: `assets/images/episode-middle-school.jpg`
- 高校生: `assets/images/episode-high-school.jpg`
- 施工管理: `assets/images/episode-construction.jpg`
- フリーランス: `assets/images/episode-freelance.jpg`
- 広告営業: `assets/images/episode-sales.jpg`
- 株式会社セルミュラー: `assets/images/episode-cellmuller.jpg`

画像表示:

- 上切れ防止のため `object-fit: contain`
- 背景は黒系

### Episode 2: Top Skills: `strengths.html`

目的: 強みを長文のまま読みやすく見せる。

ページ上部:

- 赤文字: `Episode 2: Top Skills`
- 見出し: `TOP SKILLS`
- コピー: `こんな力を秘めています`

表示方式:

- `VIEW SKILL` カード形式
- 閉じている時はスキル名、要約、`VIEW SKILL`
- 開いた時は詳細文
- 開いたカードには `SKILL UNLOCKED`
- ページ最上部の「次のエピソード」ボタンは不要
- ページ最下部のみ `▶ 次のエピソード`

スキル項目:

1. 分析力
2. 仮説構築力
3. 言語化力
4. ヒアリング力
5. 提案力
6. 調整力・巻き込み力

本文:

ユーザー指定文を使用。勝手に敬語や内容を変えない。

### Episode 3: Next Stage: `goals.html`

目的: 今後の方向性。

ページ上部:

- 赤文字: `Episode 3: Next Stage`
- 見出し: `NEXT STAGE`
- コピー: `成長or死。止まれません。マグロと同じです。`

## ナビゲーション

左サイドバーは以下で統一。

- Home
- Episode 1: History
- Episode 2: Top Skills
- Episode 3: Next Stage

## 連絡先

Historyページの左下に表示。

`ishitani_takumi@cellmuller.com`

メールアドレスははみ出し防止のため `overflow-wrap: anywhere` を指定済み。

## デザインメモ

- 黒背景
- 赤アクセント
- 大きな写真ヒーロー
- 動画配信サービス風
- ただしNetflixそのもののロゴや名称は使わない
- 上部余白は多すぎないように調整済み

## Netlify反映方法

`outputs/self_intro_streaming_site` フォルダを丸ごとNetlifyへアップロードする。

## 未確定・今後検討

- 計測ツール導入時に、History の各 `details` 開閉と Top Skills の `VIEW SKILL` 開閉をイベント計測する
- フリーランス画像などの差し替えがあれば `assets/images` に追加してHTML参照を変更する
- Next Stage の本文は追加済み。本人の具体的な目標が増えたら差し替える
