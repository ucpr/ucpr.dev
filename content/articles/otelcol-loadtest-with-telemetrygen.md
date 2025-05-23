---
title: "telemetrygenで行うOpenTelemetry Collectorの負荷試験"
description: "telemetrygen を利用して OpenTelemetry Collector の負荷試験を行う方法について紹介します"
publishedAt: "2024-08-25"
tags: ["Observability", "OpenTelemetry"]
---

## はじめに

OpenTelemetry は Observability において広く採用されており、アプリケーションやインフラの監視には欠かせないツールです。OpenTelemetry を導入する際テレメトリデータを収集・処理・転送するために、OpenTelemetry Collector を利用することがあります。

OpenTelemetry Collector を運用していく際には、Collector がどの程度の負荷に耐えられるかを事前に検証しておくことが重要です。本記事では、[telemetrygen](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/cmd/telemetrygen) を利用して OpenTelemetry Collector の負荷試験を簡易的に行う方法について紹介します。

## 前提

本記事において利用しているツールのバージョンは以下の通りです。

- OpenTelemetry Collector Contrib: [v0.107.0](https://github.com/open-telemetry/opentelemetry-collector-contrib/releases/tag/v0.107.0)
- telemetrygen: [v0.107.0](https://github.com/open-telemetry/opentelemetry-collector-contrib/releases/tag/v0.107.0)

また、利用した設定ファイルは以下のリポジトリに格納しています。

> [!NOTE]
> 本記事では設定ファイルを部分的に抜粋して記載している部分があるため、全体の設定ファイルについてはリポジトリを参照してください

[[カードOGP:ucpr/tlgen-loadtest-example]](https://github.com/ucpr/tlgen-loadtest-example)

## telemetrygen

telemetrygen は、トレース、メトリクス、ログを生成するクライアントをシミュレートできるツールです。
例えば、以下のようなコマンドを実行することでメトリクスデータを生成することができます。

```sh
$ telemetrygen metrics --duration 1s --otlp-insecure
```

その他のオプションについては、`telemetrygen --help` で確認することができます。

```sh
$ telemetrygen --help

Telemetrygen simulates a client generating traces, metrics, and logs

Usage:
  telemetrygen [command]

Examples:
telemetrygen traces
telemetrygen metrics
telemetrygen logs

Available Commands:
  help        Help about any command
  logs        Simulates a client generating logs. (Stability level: Development)
  metrics     Simulates a client generating metrics. (Stability level: Development)
  traces      Simulates a client generating traces. (Stability level: Alpha)

Flags:
  -h, --help   help for telemetrygen

Use "telemetrygen [command] --help" for more information about a command.
```

それぞれのサブコマンドには、`--duration` や `--rate`, `--workers` などのオプションがあり、これを用いて負荷試験を行います。
また、Attributes などのカスタム属性を追加することも可能なため、実際のアプリケーションに寄せた形で負荷試験を行うこともできます。

<Info>
  telemetrygen では徐々に負荷をかけるようなことはできないため、そのような試験を行いたい場合は別途スクリプトを作成する必要があります。
</Info>

## 検証環境の構築

OpenTelemetry Collector のパイプラインは、以下のように設定しています。

```yaml
# config.yaml

# ...
service:
  telemetry:
    metrics:
      address: ":8888"
  pipelines:
    logs:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [debug]
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [debug]
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [debug]
```

OpenTelemetry Collector とモニタリング用のツールとして Prometheus、Grafana を利用するため、Docker Compose を利用して実行環境を構築します。

```yaml
# compose.yaml
services:
  otelcol:
    image: ghcr.io/open-telemetry/opentelemetry-collector-releases/opentelemetry-collector-contrib:0.107.0
    ports:
      - "4317:4317"
      - "4318:4318"
      - "8888:8888"
      - "30001:30001"
    volumes:
      - ./config.yaml:/etc/otelcol-contrib/config.yaml
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: '256M'
        reservations:
          cpus: '0.1'
          memory: '256M'

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yaml:/etc/prometheus/prometheus.yaml
    command: "--config.file=/etc/prometheus/prometheus.yaml"
    restart: always

  grafana:
    image: grafana/grafana
    depends_on:
      - prometheus
    volumes:
      - ./dashboards:/var/lib/grafana/dashboards
      - ./dashboard.yaml:/etc/grafana/provisioning/dashboards/dashboard.yaml
      - ./datasource.yaml:/etc/grafana/provisioning/datasources/datasource.yaml
    ports:
      - "3000:3000"
    restart: always
```

上記の Docker Compose ファイルを利用して、OpenTelemetry Collector、Prometheus、Grafana のコンテナを起動します。

```sh
$ docker-compose up
```

> [!WARNING] 
> 本記事では OpenTelemetry Collector Contrib を利用していますが、本番利用する際には必要な拡張を選択してビルドすることをおすすめします。

## OpenTelemetry Collector の負荷試験

構築した検証環境において、telemetrygen を利用して OpenTelemetry Collector の負荷試験を行います。
ここでは traces を送りつける負荷試験を行う場合を例に進めますが、metrics や logs についても同様の手順で負荷試験を行うことができます。

まずは、OpenTelemetry Collector のリソースを CPU: 0.25, メモリ: 256M に制限した状態で実行してみます。

```sh
$ telemetrygen traces --otlp-insecure --duration 10s --rate 500 --workers 10
```

上記のコマンドを実行することで、10 秒間に 500 spans/sec のトレースデータを 10 worker で送信します。

コマンド実行後にGrafana から OpenTelemetry Collector のメトリクスを確認すると、Trace データを受け取り徐々に Refused と Dropped が増加していることが確認できます。

![otelcol-loadtest-with-telemetrygen-01](https://ucprdev-image-proxy.ucpr.workers.dev/images/articles/otelcol-loadtest-with-telemetrygen/otelcol-loadtest-with-telemetrygen-01.png)

telemetrygen のログを確認すると、メモリ使用率が高くなりデータが refused されていることがわかりました。

```
traces export: context deadline exceeded: rpc error: code = Unavailable desc = data refused due to high memory usage
```

OpenTelemetry Collector の設定で memory_limiter を利用しているため、メモリ使用量が高くなるとデータを拒否するようになっておりそれが原因であると考えられます。
ここに関しては、本来は実行環境のメトリクスも合わせて確認したほうが良いですが、今回は省略しています。

次は、CPU: 1, メモリ: 1G のリソースに制限した OpenTelemetry Collector に対してトレースデータを送信します。

![otelcol-loadtest-with-telemetrygen-00](https://ucprdev-image-proxy.ucpr.workers.dev/images/articles/otelcol-loadtest-with-telemetrygen/otelcol-loadtest-with-telemetrygen-00.png)

コマンド実行後、Grafana から OpenTelemetry Collector のメトリクスを確認すると、Refused や Dropped が増加せず、正常にデータを受け取っていることが確認できました。

## おわりに

本記事では、telemetrygen を利用して OpenTelemetry Collector の負荷試験を行う方法について紹介しました。OpenTelemetry Collector の負荷試験を行う際には、telemetrygen を利用することで簡単に負荷試験を行うことができます。

今回は Attributes の追加などのカスタマイズは行っていませんが、実際のアプリケーションが出力するテレメトリデータに近い形で負荷試験を行うことをおすすめします。

本記事において、異なっている説明や表現がありましたらご連絡ください。

## 参考

- [GitHub - opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib)
- [GitHub - telemetrygen](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/cmd/telemetrygen)
- [telemetrygenでTail Sampling Processorの挙動をサクッと確認する](https://zenn.dev/taxin/articles/otel-tail-sampling)
- [OpenTelemetry Collectorでデータを一元的に管理する](https://christina04.hatenablog.com/entry/opentelemetry-collector)
