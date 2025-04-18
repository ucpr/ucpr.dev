---
title: "tracetest で Trace-based Testing に触れてみる"
description: "Trace データの活用方法の一つとして、Trace-based Testing という手法があります。本記事では、tracetest というツールを使って Trace-based Testing を実践します。"
publishedAt: "2024-12-18"
tags: ["Observability", "OpenTelemetry", "tracetest"]
---

## はじめに

本記事は、[OpenTelemetry Advent Calendar 2024](https://qiita.com/advent-calendar/2024/opentelemetry) の 18 日目の記事です。

Trace データを利用してテストを行う、Trace-based Testing という手法があります。本記事では、[tracetest](https://github.com/kubeshop/tracetest) というツールを使って Trace-based Testing を実践してみます。

## 前提

本記事において利用しているツールのバージョンは以下の通りです。

- tracetest: [v1.7.1](https://github.com/kubeshop/tracetest/releases/tag/v1.7.1)

また、アプリケーション実装や設定ファイルは以下のリポジトリに格納しています。

[[カードOGP:github.com/ucpr/tracetest-example]](https://github.com/ucpr/tracetest-example)

## Trace-based Testing とは

Trace-based Testing は、分散トレーシングに含まれるデータを活用して、統合テスト・システムテストを行う手法です。
システムに対してイベントをトリガー(HTTP request, gRPC call, ...)し、そのトリガーで生成されたトレースデータを活用して、システムの振る舞いを検証できます。

![trace-based testing diagram](https://opentelemetry.io/blog/2023/testing-otel-demo/trace-based-testing-diagram.png)

ref. [Trace-based Testing the OpenTelemetry Demo](https://opentelemetry.io/blog/2023/testing-otel-demo/)

### tracetest

> Tracetest is a trace-based testing tool for integration and end-to-end testing using OpenTelemetry traces. Verify end-to-end transactions and side-effects across microservices & event-driven apps by using trace data as test specs.
>
> [docs.tracetest.io](https://docs.tracetest.io/)

tracetest は、OpenTelemetry のトレースデータを活用して、Trace-based Testing をサポートしてくれるツールです。

> [!WARNING]
> Enterprise 向けに提供されていた Tracetest Cloud と Enterprise Self-Hosted Tracetest は、2024/10/31 に EOL となっているようです。 <br />
> OSS の Tracetest は引き続き利用可能ですが、今後の開発がどうなるかは不明です。そのため、利用を検討する際は注意が必要です。 <br />
> <br />
> [End of Life Announcement for Tracetest Cloud](https://tracetest.io/blog/end-of-life-announcement-for-tracetest-cloud)

## 動かす

実際にデモアプリケーションを用意して、tracetest を使って Trace-based Testing を行ってみます。
デモアプリケーションは以下のようなマイクロサービスをイメージした構成になっています。

![intro_trace_based_test-00](https://ucprdev-image-proxy.ucpr.workers.dev/images/articles/intro_trace_based_test/intro_trace_based_test-00.png)

上記サービスで特定のエンドポイントをコールすると、以下のようなトレースデータが生成されます。

![intro_trace_based_test-01](https://ucprdev-image-proxy.ucpr.workers.dev/images/articles/intro_trace_based_test/intro_trace_based_test-01.png)

このトレースデータを活用して、テストを書いてみます。

### tracetest を起動してみる

tracetest を起動するために、tracetest サーバーの設定を作成する必要があります。
tracetest はテスト結果や設定情報の永続化に PostgreSQL を利用するため、PostgreSQL の接続情報を設定します。

```yaml
# tracetest/config.yaml
postgres:
  host: postgres
  user: user
  password: password
  port: 5432
  dbname: dbname
  params: sslmode=disable
```

さらに、データストアの設定を追加するために、以下の設定を追加します。

```yaml
# tracetest/provision.yaml
type: DataStore
spec:
  name: OpenTelemetry Collector
  type: otlp
  default: true
```

上記の設定を元に、docker compose を利用して tracetest を起動します。

```yaml
# compose.yaml
tracetest:
    image: kubeshop/tracetest:${TAG:-latest}
    volumes:
        - type: bind
          source: ./tracetest/config.yaml
          target: /app/tracetest.yaml
        - type: bind
          source: ./tracetest/provision.yaml
          target: /app/provision.yaml
    command: --provisioning-file /app/provision.yaml
    ports:
        - 11633:11633
```

起動後、[http://localhost:11633](http://localhost:11633) にアクセスすると tracetest の Web UI が表示されます。

![intro_trace_based_test-02](https://ucprdev-image-proxy.ucpr.workers.dev/images/articles/intro_trace_based_test/intro_trace_based_test-02.png)

### テストを作成する

実際に tracetest を利用してテストを作成してみます。
テストは Web UI から作成するか、YAML ファイルを作成してテストを定義することができます。

今回は、YAML ファイルを作成してテストを定義してみます。
以下は HTTP リクエストをテストのトリガとして、

- HTTP リクエストのステータスコードが 200 であること
- トリガされたスパンのレスポンスタイムが 200ms 以下であること

をテストするように定義します。

```yaml
# tracetest/testspec.yaml
type: Test
spec:
  id: Mr56ftSHg
  name: test
  trigger:
    type: http
    httpRequest: # テストのトリガとなる HTTP リクエスト
      method: GET
      url: http://gateway:8080/hoge
      headers:
      - key: Content-Type
        value: application/json
  specs:
  - selector: span[tracetest.span.type="http"]
    name: "All HTTP Spans: Status  code is 200"
    assertions:
    - attr:http.status_code  =  200
  - selector: span[tracetest.span.type="general" name="Tracetest trigger"]
    name: "Trigger Span: Response time is less than 200ms"
    assertions:
    - attr:tracetest.span.duration < 200ms
```

`spec.specs` に、テストの仕様を記述します。
selector で対象のスパンを指定し、assertions でテストの条件を記述します。

このようにして、トレースデータを活用してテストを定義することができます。

### テストを実行する

tracetest CLI を利用して、作成したテストを実行します。

tracetest CLI のサーバーの向き先をローカルで起動している tracetest サーバーに向けるために、以下のようなコマンドを実行します。

```bash
# Server の向き先を変更する
$ tracetest configure --server-url http://localhost:11633
SUCCESS  Successfully configured Tracetest CLI
```

向き先を変更した後、以下のコマンドでテストを実行します。
テストが成功すると、以下のような出力が表示されます。

```bash
$ tracetest run test -f tracetest/testspec.yaml
✔ test (http://localhost:11633/test/Mr56ftSHg/run/5/test) - trace id: b8dfae1bbfe6b7db838639300b3bd6be
        ✔ All HTTP Spans: Status  code is 200
        ✔ Trigger Span: Response time is less than 200ms
```

意図的にテストケースが失敗する状態に実装を変更し、再度実行してみます。

```bash
$ tracetest run test -f tracetest/testspec.yaml
✘ test (http://localhost:11633/test/Mr56ftSHg/run/1/test) - trace id: 45c632bc672e29b526c0bdcffaf267d8
        ✘ All HTTP Spans: Status  code is 200
                ✘ #6c3fe5a2515f8493
                        ✘ attr:http.status_code  =  200 (500) (http://localhost:11633/test/Mr56ftSHg/run/1/test?selectedAssertion=0&selectedSpan=6c3fe5a2515f8493)
        ✔ Trigger Span: Response time is less than 200ms
                ✔ #877ef3b6349f006e
                        ✔ attr:tracetest.span.duration < 200ms (8ms)

        ✘ Required gates
                ✘ test-specs
```

意図通りテストが失敗することが確認できました。

## おわりに

本記事では、tracetest を使って Trace-based Testing を行う方法について簡単に紹介させていただきました。

Tracetest Cloud の EOL の影響なのか、 OSS の tracetest の開発が止まっていそうに見えており、今後どうなっていくかは不明です。しかし、Trace データを活用してシステム全体のテストを行うのはとても面白い手法だとなと感じました。
最初の入力と最後の出力を重視してテストしてきた従来のテスト手法とは違い、システム全体の振る舞いをテストすることができるのは、特にマイクロサービスアーキテクチャのような複雑なシステムにおいてすごい良さそうだと思いました。

今回は紹介として、説明をだいぶ省略してしまっているので実際に触ってみたい方や深掘りたい方は tracetest のドキュメントとサンプルが充実しているのでそちらを参考にしていただけると良いと思います。

[[カードOGP:github.com/kubeshop/tracetest/examples]](https://github.com/kubeshop/tracetest/blob/main/examples)

本記事において、異なっている説明や表現がありましたらご連絡ください。

## 参考

- [github.com/kubeshop/tracetest](https://github.com/kubeshop/tracetest)
- [docs.tracetest.io](https://docs.tracetest.io/)
