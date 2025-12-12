---
title: "open-telemetry/weaver を利用したカスタム属性の標準化と管理"
description: "本記事では、open-telemetry/weaver を利用してテレメトリのカスタム属性を標準化して管理する方法についてまとめます"
publishedAt: '2025-12-12'
tags: ["Observability", "OpenTelemetry", "weaver"]
noindex: false
---

## はじめに

本記事は、[OpenTelemetry Advent Calendar 2025](https://qiita.com/advent-calendar/2025/otel) の 12 日目の記事です。

テレメトリデータに含まれるカスタム属性を標準化して管理することは、オブザーバビリティの品質向上において重要な要素です。本記事では、[open-telemetry/weaver](https://github.com/open-telemetry/weaver) を利用して、カスタム属性の標準化と管理を行う方法についてまとめます。

## 前提

本記事において、利用しているツールのバージョンは以下の通りです。

- open-telemetry/weaver: [v0.20.0](https://github.com/open-telemetry/weaver/releases/tag/v0.20.0)

また、記事中に利用した設定や実装は以下のリポジトリで公開されています。

[[カードOGP:github.com/ucpr/otel-weaver-example]](https://github.com/ucpr/otel-weaver-example)

## Semantic Conventions

Semantic Conventions とは、テレメトリデータに関する命名規則や属性の標準化を定義したものです。OpenTelemetry では、トレース、メトリクス、ログに関する様々な Semantic Conventions が定義されています。この定義に従うことで、異なるシステムやサービス間でのデータの一貫性が保たれ、分析やモニタリングが容易になります。

[[カードOGP:https://opentelemetry.io/docs/concepts/semantic-conventions/]](https://opentelemetry.io/docs/concepts/semantic-conventions/)

実際の開発現場では、プロジェクト固有の要件やドメインに応じてカスタム属性の追加が必要になる場面があると思います。これらのカスタム属性も一貫性を持たせるために、独自に Semantic Conventions を定義し、チーム全体で共有することが重要です。
しかし、属性に一貫性をもたせ、独自で定義した Semantic Conventions を運用することは容易ではなく、以下のような課題が存在します。
- 命名規則の不統一
- ドキュメントの不足
- バージョン管理の欠如

今回紹介する Otel Weaver はこれらの課題を解決するツールです。

## Otel Wweaver とは

weaver は Semantic Conventions とオブザーバビリティワークフローの管理、検証、進化をサポートするツールです。

具体的には、以下のような機能を提供します。
- 独自の Semantic Conventions の定義とそのバージョン管理
- ベストプラクティスに基づく命名規則や安定性、不変性を強制するポリシーベースの検証
- 定義した Semantic Conventions を元にした型安全なコード生成とドキュメントの自動生成

![weaver architecture](https://github.com/open-telemetry/weaver/raw/main/docs/images/otel-weaver-platform.svg)

weaver は実際に open-telemetry/opentelemetry-go 内の semconv パッケージでのコード生成でも利用されており、OpenTelemetry コミュニティ内でも活用が進んでいます。

[[カードOGP:/semconv/templates/registry/go/weaver.yaml]](https://github.com/open-telemetry/opentelemetry-go/blob/v1.39.0/semconv/templates/registry/go/weaver.yaml)

## weaver で Semantic Conventions を管理する

本記事では、実際に weaver を利用して、Semantic Conventions を管理し、そこからコード生成を行う方法について紹介します。

### カスタムの Semantic Conventions を定義する

weaver では、yaml ファイルを用いて、Semantic Conventions を定義します。
独自のスキーマを定義するには、以下の手順を行います。

1. Semantic Conventions を格納するディレクトリを作成する
2. `registry_manifest.yaml` ファイルを作成
3. シグナルごとに Semantic Conventions を定義する yaml ファイルを作成

ここでは、`./model` というディレクトリにカスタムの Semantic Conventions を定義する例を示します。

```bash
$ tree model
model
├── attributes.yaml
└── registry_manifest.yaml
```

**registry_manifest.yaml**

`registry_manifest.yaml` では、Semantic Conventions のカスタムレジストリのメタデータと、他のレジストリへの依存関係を定義するのに利用します。

```yaml
name: otel-weaver-example
description: otel weaver example
semconv_version: 0.1.0
schema_base_url: https://weaver-example.io/schemas/
dependencies:
  - name: otel
    registry_path: https://github.com/open-telemetry/semantic-conventions/archive/refs/tags/v1.37.0.zip[model]
```

**attributes.yaml**

`attributes.yaml` では、カスタムの属性を定義します。ここでは、 E-commerce ドメインに関連する属性を例として示します。
ec.order という属性グループを定義し、注文に関する属性をまとめています。

```yaml
groups:
  - id: registry.ec.order
    type: attribute_group
    display_name: EC Service Attributes - Order
    brief: Attributes for e-commerce order domain signals.
    attributes:
      - id: ec.order.id
        type: string
        brief: Unique identifier of the order.
        stability: development
        examples: ["ord_20251212_001234"]

      - id: ec.order.status
        type: string
        brief: Current lifecycle state of the order.
        stability: development
        examples: ["created", "paid", "fulfilled", "cancelled", "refunded"]

      - id: ec.order.total_amount
        type: double
        brief: Total amount charged for the order (including tax/shipping/discounts) in minor units is not used here.
        stability: development
        examples: [129.99]

      - id: ec.order.currency
        type: string
        brief: ISO 4217 currency code for monetary amounts.
        stability: development
        examples: ["JPY", "USD", "EUR"]

      - id: ec.order.item_count
        type: int
        brief: Number of line items in the order.
        stability: development
        examples: [3]
```

詳細な設定項目については、[公式ドキュメント](https://github.com/open-telemetry/weaver/blob/v0.20.0/schemas/semconv-syntax.md) を参照してください。

### 定義したレジストリの有効性の確認

weaver では、定義した Semantic Conventions のレジストリが正しいかどうかを検証するコマンドが用意されています。これにより、命名規則やポリシーに違反していないかを事前にチェックできます。

```bash
$ weaver registry check -r ./model
Weaver Registry Check
Checking registry `model`
ℹ Found registry manifest: model/registry_manifest.yaml
✔ `otel-weaver-example` semconv registry `model` loaded (219 files)
✔ No `after_resolution` policy violation

Total execution time: 0.4966055s
```

本記事では詳細なポリシー設定については割愛しますが、rego を用いて独自のポリシーを定義することも可能です。詳細は[公式ドキュメント](https://github.com/open-telemetry/weaver/blob/main/crates/weaver_checker/README.md)を参照してください。

レジストリの継続運用では、差分の確認と破壊的変更の検知が重要です。`weaver registry diff` でバージョン間の差分（属性の追加・削除・型変更）を機械的に確認でき、`stability` が `development` → `stable` へ昇格する際に Breaking になる変更を検知できます。

### コード生成

先程のように YAML 形式で定義した Semantic Conventions を元に、各言語向けのコード生成が可能です。これにより、属性名の一貫性が保たれ、手動実装によるミスを防ぐことができます。
コード生成には、Rust の minijinja クレートを利用した Jinja テンプレートエンジンが使用されています。そのため、テンプレートをカスタマイズすることで、OpenTelemetry 以外の計装ライブラリ (dd-trace, newrelic, ...)向けのコード生成も可能です。

コード生成を行うには、以下の手順を実行します。

1. `./registry/{言語}` のパス形式でディレクトリを作成
2. 言語ごとの `weaver.yaml` ファイルを作成
3. テンプレートファイルを作成
4. コード生成コマンドを実行

最終的なディレクトリ構成は以下のようになります。

```bash
$ tree templates
templates
└── registry
    └── go
        ├── attributes.go.j2
        └── weaver.yaml
```

**weaver.yaml**

`weaver.yaml` では、コード生成に関する設定を行います。
pattern には、テンプレートファイルのパスを指定します。この pattern に基づくテンプレートファイルを元に、weaver がコードを生成します。

```yaml
templates:
  - pattern: attributes.go.j2
    filter: semconv_grouped_attributes($params)
    application_mode: single
```

**attributes.go.j2**

attributes.go.j2 では、実際のコード生成のテンプレートを定義します。実際に、特定の言語で利用できるコードを生成するには複雑なテンプレートを書く必要がありますが、ここでは Go 言語向けのシンプルな例を示します。

```
// DO NOT EDIT, this is an auto-generated file

package semconv
{% for root_ns in ctx -%}
{% if loop.first -%}
const (
{% endif -%}
	{% for attr in root_ns.attributes | rejectattr("name", "in", params.excluded_attributes) -%}
	{% if attr.note -%}
	{% set safe_note = attr.note | replace('<', '[') | replace('>', ']') | trim -%}
{% endif -%}
	{{ [attr.brief, concat_if("\n\n## Notes\n\n", safe_note)] | comment }}
	{{ attr.name | camel_case }} = "{{ attr.name }}"
{% endfor -%}
{% if loop.last -%}
){% endif -%}
{% endfor -%}
```

このテンプレートでは、属性の名前、説明、例を元に Go 言語の定数を生成しています。
このテンプレートを元に、コードを生成します。

```bash
$ weaver registry generate -r model --templates templates go src/go
```

上記コマンドを実行すると、`./src/go` ディレクトリに Go 言語向けのコードが生成されます。

```go
// DO NOT EDIT, this is an auto-generated file

package semconv

const (
	// Unique identifier of the order.
	ecOrderId = "ec.order.id"
	// Current lifecycle state of the order.
	ecOrderStatus = "ec.order.status"
	// Total amount charged for the order (including tax/shipping/discounts) in minor
	// units is not used here.
	ecOrderTotalAmount = "ec.order.total_amount"
	// ISO 4217 currency code for monetary amounts.
	ecOrderCurrency = "ec.order.currency"
	// Number of line items in the order.
	ecOrderItemCount = "ec.order.item_count"
)
```

このようにして、独自のテンプレートを利用して、コードの生成を行うことができます。独自のテンプレートを利用できるため、OpenTelemetry 以外の計装ライブラリ向けのコード生成や、プロジェクト固有のコーディング規約に準拠したコード生成も可能です。

### ドキュメント生成

ドキュメントの生成も同様にテンプレートを用いて行うことができます。また、 weaver では、別のレジストリのテンプレートを参照することも可能です。例えば、OpenTelemetry の公式レジストリを参照して、独自のドキュメントを生成することができます。

```bash
$ weaver registry generate -r model --templates "https://github.com/open-telemetry/semantic-conventions/archive/refs/tags/v1.37.0.zip[templates]" markdown docs
```

上記コマンドを実行すると、`./docs` ディレクトリにドキュメントが生成されます。

```markdown
<!-- NOTE: THIS FILE IS AUTOGENERATED. DO NOT EDIT BY HAND. -->
<!-- see templates/registry/markdown/attribute_namespace.md.j2 -->

# Ec

## EC Service Attributes - Order

Attributes for e-commerce order domain signals.

| Attribute | Type | Description | Examples | Stability |
|---|---|---|---|---|
| <a id="ec-order-currency" href="#ec-order-currency">`ec.order.currency`</a> | string | ISO 4217 currency code for monetary amounts. | `JPY`; `USD`; `EUR` | ![Development](https://img.shields.io/badge/-development-blue) |
| <a id="ec-order-id" href="#ec-order-id">`ec.order.id`</a> | string | Unique identifier of the order. | `ord_20251212_001234` | ![Development](https://img.shields.io/badge/-development-blue) |
| <a id="ec-order-item-count" href="#ec-order-item-count">`ec.order.item_count`</a> | int | Number of line items in the order. | `3` | ![Development](https://img.shields.io/badge/-development-blue) |
| <a id="ec-order-status" href="#ec-order-status">`ec.order.status`</a> | string | Current lifecycle state of the order. | `created`; `paid`; `fulfilled`; `cancelled`; `refunded` | ![Development](https://img.shields.io/badge/-development-blue) |
| <a id="ec-order-total-amount" href="#ec-order-total-amount">`ec.order.total_amount`</a> | double | Total amount charged for the order (including tax/shipping/discounts) in minor units is not used here. | `129.99` | ![Development](https://img.shields.io/badge/-development-blue) |
```

このようにして、独自のテンプレートもしくは他のレジストリのテンプレートを利用して、コードの生成やドキュメントの生成を行うことができます。

## おわりに

本記事では、open-telemetry/weaver を利用してテレメトリのカスタム属性を標準化して管理し、そのスキーマからコードの自動生成をする方法について紹介しました。今回は、コード生成がメインの紹介になってしまいましたが、 weaver は Semantic Conventions の定義やバージョン管理、ポリシーベースの検証など、オブザーバビリティワークフロー全体をサポートする強力なツールです。これらの機能を活用することで、オブザーバビリティの品質向上に寄与できると考えています。

設定も難しめかつ、記事等もまだ少ないですが、opentelemetry-go の semconv パッケージでも利用されているため、それらの設定を参考にすることで、比較的スムーズに導入できると思います。
興味を持った方はぜひ、実際にお試しいただけると良いなと思います。

本記事において、異なっている説明や表現がありましたらご連絡ください。

## 参考

- [github.com/open-telemetry/weaver](https://github.com/open-telemetry/weaver)
- [github.com/open-telemetry/opentelemetry-weaver-examples](https://github.com/open-telemetry/opentelemetry-weaver-examples)
- [opentelemetry-go/semconv/templates/registry/go](https://github.com/open-telemetry/opentelemetry-go/blob/v1.39.0/semconv/templates/registry/go)
- [Observability by Design: Unlocking Consistency with OpenTelemetry Weaver](https://opentelemetry.io/blog/2025/otel-weaver/)
