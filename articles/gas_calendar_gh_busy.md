+++
title = "GASで特定の予定の際にGitHubのステータスをBusyにする"
description = "Google Apps Script(GAS)を使って、Googleカレンダーに登録したお休み予定を取得し、GitHubのステータスをBusyにする方法を紹介します。"
date = "2024-05-28T00:00:00+09:00"
tags = ["Google Apps Script", "GitHub", "Bun"]
+++

## はじめに

GitHub にはプロフィールにステータスという、ユーザーの状態を表す機能があります。この機能を使うことで、ユーザーがどのような状態にあるかを他のユーザーに伝えることができます。
例えばステータスの状態を `busy` にすることで、

- mention をする際にユーザーが busy 状態であることを知らせる
- [チームに割り当てられたレビューで、自動割り当てから除外される][0]

などの効果があります。

この記事では、Google Apps Script(GAS)を使って、Googleカレンダーに登録したお休み予定を取得し、GitHubのステータスをBusyにする方法を紹介します。

なお、ここで実装したソースコードは下記のリポジトリで公開しています。

- [github.com/ucpr/isogac][4]

## 前提

この記事内では、以下のバージョンで動作を確認しています。

- bun
  - 1.1.10
- clasp
  - 2.4.2

## GitHub のステータスを API で変更する

ステータスを変更するために、GitHub の GraphQL API を使用します。
`changeUserStatus` mutation を使用することで、ステータスを変更することができます。

- ref. [ミューテーション - changeuserstatus][2]

`gh` コマンドで動作確認を行います。

```bash
api graphql -f query='mutation($message: String!, $emoji: String!, $limitedAvailability: Boolean!) { changeUserStatus(input: { message: $message, emoji: $emoji, limitedAvailability: $limitedAvailability }) { status { message emoji indicatesLimitedAvailability } } }' -f message='busy' -f emoji=':love_you_gesture:' -F limitedAvailability=true
```

ここでは 
- `message` に `busy`
- `emoji` に `:love_you_gesture:`
- `limitedAvailability` に `true`
を指定しています。

`limitedAvailability` に `true` を指定することで、ステータスが `busy` になります。

注意点として、`limitedAvailability` のパラメータのみ指定してリクエストした場合、ステータスが `busy` にならず初期化されてしまうようです。そのため、 `message` もしくは `emoji` のどちらかを一緒に指定する必要があります。

## GAS でカレンダー

Google Apps Script のプロジェクトの管理ツールとして、Google が提供している [Clasp][3] というツールを使用します。

Clasp は TypeScript で実装されているツールで、プロジェクトの作成やデプロイ、削除などの操作をコマンドライン上から行うことができます。

### プロジェクトの作成

```
clasp create --type standalone --title "isogac"
```

## おわりに

GAS で Google カレンダーの予定を取得し、GitHub のステータスを Busy に変更する方法を紹介しました。
チームとしてステータスの変更をルールとして取り入れることで、業務の効率化につながるかもしれません。その際に、本記事がその一助となれば幸いです。

本記事において、異なっている説明や表現がありましたらご連絡ください。

## 参考

- [Teamのコードレビュー設定の管理 | GitHub Docs][0]
- [プロフィールをパーソナライズする - ステータスを設定する | GitHub Docs][1]
- [ミューテーション - changeuserstatus | GitHub Docs][2]
- [github.com/google/clasp][3]

[0]: https://docs.github.com/ja/organizations/organizing-members-into-teams/managing-code-review-settings-for-your-team
[1]: https://docs.github.com/ja/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/personalizing-your-profile#setting-a-status
[2]: https://docs.github.com/ja/graphql/reference/mutations#changeuserstatus
[3]: https://github.com/google/clasp
[4]: https://github.com/ucpr/isogac
