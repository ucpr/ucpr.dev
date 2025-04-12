---
title: "opentelemetry-go で計装した Span の属性を SpanProcessor で加工する"
description: "opentelemetry-go で計装した Span の属性を SpanProcessor で加工する方法について解説します。"
publishedAt: '2025-04-13'
tags: ["Observability", "OpenTelemetry", "Go"]
---

## はじめに

OpenTelemetry SDK には SpanProcessor というアプリケーションで生成された Span を加工するための機構を加えることが出来ます。

本記事では、 SpanProcessor を利用して、 Span の属性を加工する方法について解説します。

## 前提

本記事では、 以下の Go とライブラリのバージョンで動作を確認しています。

```go
❯ go version
go version go1.24.0 darwin/arm64
```

```
go.opentelemetry.io/otel v1.34.0
go.opentelemetry.io/otel/sdk v1.34.0
```

また、本記事で利用しているコードは以下のリポジトリに公開しています。

[[カードOGP:github.com/ucpr/workspace2025]](https://github.com/ucpr/workspace2025/tree/main/otel-span-processor-example)

## SpanProcessor について

OpenTelemetry SDK の `SpanProcessor` は、アプリケーション内で生成された Span を処理するためのフック機構です。

SpanProcessor でできることの例としては、

- 属性の追加
- 独自のログ出力やフィルタ処理

などが挙げられます。

opentelemetry-go の `SpanProcessor` は以下のようなインターフェースで定義されています。

```go
type SpanProcessor interface {
	OnStart(parent context.Context, s ReadWriteSpan)
	OnEnd(s ReadOnlySpan)
	Shutdown(ctx context.Context) error
	ForceFlush(ctx context.Context) error
}
```

このインターフェースを満たした実装を用意することで、カスタムの SpanProcessor を作成することが出来ます。

## span.SetAttributes で追加した属性を加工する

`span.SetAttributes` で追加した属性は `SpanProcessor.OnStart` では参照することは出来ず、`SpanProcessor.OnEnd` でのみ参照可能になります。しかし、`SpanProcessor.OnEnd` では引数で受け取る span が `ReadOnlySpan` となっており変更することが出来ません。

そこで、以下のような Span 実装を追加することで、 属性の書き換えを実現します。

```go
import (
	"go.opentelemetry.io/otel/attribute"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

var _ sdktrace.ReadOnlySpan = (*customSpan)(nil)

type customSpan struct {
	sdktrace.ReadOnlySpan
	attrs []attribute.KeyValue
}

func (s *customSpan) Attributes() []attribute.KeyValue {
	return s.attrs
}
```

この customSpan を `OnEnd` で利用するようにします。
ここでは、 属性のキーに一律 prefix をつけるような実装を追加してみます。

```go
import (
	"go.opentelemetry.io/otel/attribute"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

var _ sdktrace.SpanProcessor = (*CustomSpanProcessor)(nil)

type CustomSpanProcessor struct {
	spanProcessor sdktrace.SpanProcessor
}

func (p *CustomSpanProcessor) OnEnd(span sdktrace.ReadOnlySpan) {
	attrs := span.Attributes()
	newAttrs := make([]attribute.KeyValue, len(attrs))

	// 属性に prefix を一律追加する
	for i, attr := range attrs {
		key := "prefix." + string(attr.Key)
		newAttrs[i] = attribute.KeyValue{
			Key:   attribute.Key(key),
			Value: attr.Value,
		}
	}

	p.spanProcessor.OnEnd(&modifiedSpan{
		ReadOnlySpan: span,
		attrs:        newAttrs,
	})
}
```

上記のように OnEnd で実装することで、 属性を変更できるようになります。

テストで動作確認をしてみます。

```go
func TestCustomSpanProcessor_OnEnd(t *testing.T) {
	sp := tracetest.NewInMemoryExporter()
	processor := NewCustomSpanProcessor(sdktrace.NewSimpleSpanProcessor(sp))
	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithSpanProcessor(processor),
	)

	// Create a new span
	tracer := tracerProvider.Tracer("test-tracer")
	_, span := tracer.Start(context.Background(), "OnEnd")
	span.SetAttributes(
		attribute.String("span", "value"),
	)
	span.End()

	// Force flush to ensure spans are exported
	if err := processor.ForceFlush(context.Background()); err != nil {
		t.Fatalf("failed to force flush: %v", err)
	}

	// Check if the span was processed
	spans := sp.GetSpans()
	if len(spans) != 1 {
		t.Fatalf("expected 1 span, got %d", len(spans))
	}
	// Check if the custom attribute was set
	for _, attr := range spans.Snapshots()[0].Attributes() {
		if !strings.HasPrefix(string(attr.Key), "prefix.") {
			t.Fatalf("expected attribute key to start with 'prefix.', got %s", attr.Key)
		}
	}
}
```

```
❯ go test -run TestCustomSpanProcessor_OnEnd
PASS
ok      github.com/ucpr/workspace2025/otel-span-processor-example       0.225s
```

上記のように、 `OnEnd` で属性を加工することが出来ました。

## おわりに

本記事では、 opentelemetry-go の `SpanProcessor.OnEnd` で属性の書き換えを行う方法について解説しました。 

OpenTelemetry では属性の命名に関して、 semantic convention で定義されていないものでアプリケーション固有の属性は `com.acme.shopname` などドメインを逆順にした文字列を prefix につけることを推奨しています。

[[カードOGP:opentelemetry.io/docs | Naming]](https://opentelemetry.io/docs/specs/semconv/general/naming/#recommendations-for-application-developers)

すべての属性にこの prefix をつけることを実装で強制することが難しい場合は、このように SpanProcessor を実装して一律で付与するなど様々な使い道が考えられます。

本記事において、異なっている説明や表現がありましたらご連絡ください。

## 参考

- [github.com/open-telemetry/opentelemetry-go](https://github.com/open-telemetry/opentelemetry-go)
- [opentelemetry.io/docs | Naming](https://opentelemetry.io/docs/specs/semconv/general/naming/#recommendations-for-application-developers)
