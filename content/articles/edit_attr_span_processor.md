---
title: "opentelemetry-go で計装した Span の属性を SpanProcessor で加工する"
description: "opentelemetry-go で計装した Span の属性を SpanProcessor で加工する方法について解説します。"
publishedAt: '2025-04-13'
tags: ["Observability", "OpenTelemetry", "Go"]
---

## はじめに

OpenTelemetry SDK には SpanProcessor というアプリケーションで生成された Span を加工するための機構があります。

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

[github.com/ucpr/workspace2025](https://github.com/ucpr/workspace2025/tree/main/otel-span-processor-example)

## SpanProcessor について

OpenTelemetry SDK の `SpanProcessor` は、アプリケーション内で生成された Span を処理するためのフック機構です。

SpanProcessor でできることの例としては、

- 属性の追加・変更・削除
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

このインターフェースを満たした実装を用意することで、カスタム SpanProcessor を作成することが出来ます。

## span.SetAttributes で追加した属性を加工する

`span.SetAttributes` で追加した属性は、Span の開始後に設定されるため、`OnStart` 時点では存在せず、`SpanProcessor.OnEnd` でのみ参照可能になります。しかし、`SpanProcessor.OnEnd` では引数で受け取る span が `ReadOnlySpan` となっており変更することが出来ません。

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
	"context"

	"go.opentelemetry.io/otel/attribute"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

var _ sdktrace.SpanProcessor = (*CustomSpanProcessor)(nil)

type CustomSpanProcessor struct {
	spanProcessor sdktrace.SpanProcessor
}

func (p *CustomSpanProcessor) OnStart(parent context.Context, s sdktrace.ReadWriteSpan) {
	p.spanProcessor.OnStart(parent, s)
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

	p.spanProcessor.OnEnd(&customSpan{
		ReadOnlySpan: span,
		attrs:        newAttrs,
	})
}

func (p *CustomSpanProcessor) Shutdown(ctx context.Context) error {
	return p.spanProcessor.Shutdown(ctx)
}

func (p *CustomSpanProcessor) ForceFlush(ctx context.Context) error {
	return p.spanProcessor.ForceFlush(ctx)
}
```

上記のように OnEnd で実装することで、 属性を変更できるようになります。

次に、実装した SpanProcessor の動作を確認するテストを作成します。

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

本記事では、`SpanProcessor` を実装して Span 属性を加工する方法を解説しました。

`ReadOnlySpan` の制約を回避するためにカスタム Span 実装でラップすることで、`OnEnd` での属性変更を実現できます。この方法は、組織固有のドメインプレフィックス付与、機密情報のマスキング、属性の正規化など、さまざまな用途に応用可能です。

特に OpenTelemetry の Semantic Convention では、アプリケーション固有の属性に `com.acme.shopname` のようなドメイン逆順プレフィックスの使用を推奨しており、本記事の手法を用いることで、この規約への準拠を強制することなどが可能です。

[opentelemetry.io/docs | Naming](https://opentelemetry.io/docs/specs/semconv/general/naming/#recommendations-for-application-developers)

SpanProcessor は強力な拡張ポイントですが、パフォーマンスへの影響を考慮し、処理は軽量に保つことが重要です。
本記事において、異なっている説明や表現がありましたらご連絡ください。

## 参考

- [github.com/open-telemetry/opentelemetry-go](https://github.com/open-telemetry/opentelemetry-go)
- [opentelemetry.io/docs | Naming](https://opentelemetry.io/docs/specs/semconv/general/naming/#recommendations-for-application-developers)
