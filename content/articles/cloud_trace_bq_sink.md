---
title: "Cloud Trace のデータを BigQuery にエクスポートする"
description: "Cloud Trace の BigQuery Sink を使って Cloud Trace のデータを BigQuery にエクスポートする方法を紹介します。"
publishedAt: '2024-12-02'
tags: ["Observability", "Google Cloud"]
---

## はじめに

Cloud Trace は Google Cloud のサービスの一つで、アプリケーションのトレースデータを収集・分析するためのサービスです。Cloud Trace では、トレースデータを 30 日間しか保存することができないため、それ以前のデータを確認する場合は、別のデータストアに保存しておく必要があります。

本記事では、Cloud Trace の BigQuery Sink を使って Cloud Trace のデータを BigQuery にエクスポートする方法について紹介します。

[[カードOGP:Google Cloud - Trace data exports overview]](https://cloud.google.com/trace/docs/trace-export-overview)

<Warn>
  本記事の執筆時点 (2024/12/02) では、Cloud Trace の BigQuery Sink はベータ版の機能として提供されています。そのため、本記事で紹介する内容は今後変更される可能性があるため、利用時は公式ドキュメントも合わせてご確認ください。
</Warn>

## セットアップ

### 1. BigQuery データセットの作成

まずは、Cloud Trace のデータを保存するための BigQuery データセットを作成します。

```tf
resource "google_bigquery_dataset" "trace_sink" {
  dataset_id                  = "trace_sink"
  description                 = "trace sink dataset"
  location                    = "ASIA-NORTHEAST1"
}
```

### 2. Cloud Trace の BigQuery Sink の設定

次に、Cloud Trace の BigQuery Sink を設定します。 Cloud Trace の BigQuery Sink は、現状では Terraform での設定がサポートされていません。そのため、 gcloud コマンドから設定を行います。

```sh
gcloud alpha trace \
  sinks create \
  trace-sink \
  bigquery.googleapis.com/projects/${PROJECT_ID}/datasets/trace_sink
```

コマンドを実行し、無事成功すると以下のようなメッセージが表示されます。

```
You can give permission to the service account by running the following command.
gcloud projects add-iam-policy-binding bigquery-project \
--member serviceAccount:export-hogehogehoge-fugafuga@gcp-sa-cloud-trace.iam.gserviceaccount.com \
--role roles/bigquery.dataEditor
```

コマンドの出力にもあるように Sink の設定の作成が完了したら、特定のサービスアカウントに BigQuery のデータ編集権限を付与する必要があります。
そのため、出力されたサービスアカウントに対して BigQuery のデータ編集権限を付与します。

### 3. BigQuery への書き込み権限の付与

出力されたサービスアカウントに BigQuery のデータ編集権限を付与します。
先程のコマンドの出力では Project レベルで権限を付与するコマンドが表示されていますが、 Dataset レベルの権限で問題ないため、以下のように設定します。

```tf
resource "google_bigquery_dataset_iam_member" "trace_sink_bigquery_data_editor" {
  dataset_id = google_bigquery_dataset.trace_sink.dataset_id
  role       = "roles/bigquery.dataEditor"
  member     = "serviceAccount:export-hogehogehoge-fugafuga@gcp-sa-cloud-trace.iam.gserviceaccount.com"
}
```

設定反映後、数分立つと Cloud Trace のデータが BigQuery にエクスポートされるようになります。

## データの確認

### テーブルスキーマ

トレース データを格納するテーブルのスキーマは、Google Cloud の [Span Trace V2 API 定義][1]によって決まるようです。

実際にデータを確認すると、以下のようなスキーマでデータが保存されていることが確認できます。

![trace_bq_sink](https://opentelemetry.io/blog/2023/testing-otel-demo/trace-based-testing-diagram.png)

Attribute など、Span ごとに既存のテーブルスキーマに無いデータが新しく送信されてきた場合、そのデータは都度新しいカラムとしてパッチが適用されて追加されるようです。

[[カードOGP:Google Cloud - BigQuery へのエクスポート#スキーマ]](https://cloud.google.com/trace/docs/trace-export-bigquery#schema)

### データのクエリ例

クエリ例として、Trace ごとの実行時間を計算するクエリを試してみます。

```sql
SELECT
  extendedFields.traceId as traceId,
  MIN(span.startTime) as startTime,
  MAX(span.endTime) as endTime,
  TIMESTAMP_DIFF(MAX(span.endTime), MIN(span.startTime), SECOND) AS duration
FROM
  `project.dataset.table`
GROUP BY extendedFields.traceId
```

個人で作成しているプロジェクトの [weathercal](https://weathercal.ucpr.dev) のデータで確認してみると、以下のような結果が得られました。

<img
  src="/cloud_trace_bq_sink-01.png"
  alt=""
  width="800"
  height="600"
/>

計装が入っている場合は、トレースデータを元に様々な分析・可視化を行うことできそうです。

## おわりに

本記事では、Cloud Trace の BigQuery Sink の機能を利用して Cloud Trace のデータを BigQuery にエクスポートする方法について紹介しました。

BigQuery への Trace データのエクスポートを行うことで、Cloud Trace のデータを長期間保存できるだけでなく、BigQuery と Looker Studio などの BI ツールを組み合わせることで、より高度な分析 (過去データとの比較, ビジネス指標としてのトレースデータの活用など) を行うことが可能になります。

まだベータ版の機能として提供されているため、今後のアップデートに期待です。

本記事において、異なっている説明や表現がありましたらご連絡ください。

## 参考

- [Google Cloud - Trace data exports overview][0]

[0]: https://cloud.google.com/trace/docs/trace-export-overview
[1]: https://cloud.google.com/trace/docs/reference/v2/rest/v2/projects.traces/batchWrite#Span
