---
title: "dd-trace-go で計装していないアプリケーションで Datadog Profiler の Endpoint Profiling を実現する"
description: "dd-trace-go で計装していないアプリケーションかつ Datadog Profiler を導入しているケースにおいて、Endpoint Profiling を実現する方法について説明します。"
publishedAt: '2025-12-19'
tags: ["Observability", "Datadog", "Go", "pprof"]
noindex: false
---

## はじめに

本記事は、[CyberAgent Group SRE Advent Calendar 2025](https://qiita.com/advent-calendar/2025/ca-sre) の 19 日目の記事です。

Datadog では dd-trace だけでなく OpenTelemetry を使った計装も可能ですが、dd-trace-go を使っていたときには特に意識せずに使えていた機能が、OpenTelemetry をそのまま導入しただけでは動かないことがあります。その場合、Datadog とアプリケーションをうまく連携させるために、いくつかの実装を自前で補う必要があります。

本記事では、その中でも dd-trace-go を利用していないアプリケーションで Datadog Profiler を利用する際に、Endpoint Profiling を実現する方法について解説します。

## 前提

本記事では以下のバージョンのパッケージを使用を前提としています。

- dd-trace-go: v1.72.2

## Endpoint Profiling とは

Endpoint Profiling は、Datadog Profiler の機能の一つで、Web サービスの任意のエンドポイント （例: HTTP Endpoint / gRPC Method）で Profile のフレームグラフのスコープを絞り込み、特定のエンドポイントに関連するプロファイルデータを詳細に分析できる機能です。

エンドポイントごとにプロファイルデータを分析することで、調査したいエンドポイント以外のノイズを排除でき、特定のエンドポイントで発生しているパフォーマンスの問題やボトルネックを特定しやすくなります。

![endpoint profiling](https://datadog-docs.imgix.net/images/profiler/endpoint_agg.fe615c5594a27f1bcac90f13a144d038.png?auto=format "ref. [遅いトレースまたはエンドポイントを調査する - docs.datadoghq.com](https://docs.datadoghq.com/ja/profiler/connect_traces_and_profiles/?tab=go)")

上記画像のように、Datadog Profiler の UI 上でエンドポイントごとにプロファイルデータをフィルタリングし、特定のエンドポイントに関連するプロファイルデータを詳細に分析できます。

しかし、OpenTelemetry で計装したアプリケーションに Datadog Profiler を導入した場合、Endpoint Profiling 機能はデフォルトでは有効になりません。これは、dd-trace-go のトレース計装時に自動的に設定される pprof ラベルに依存しているためです。

[Datadog Endpoint Profiling](https://docs.datadoghq.com/ja/profiler/connect_traces_and_profiles/?tab=go)

## dd-trace-go での Endpoint Profiling の実装

dd-trace-go 計装を行っている場合、Endpoint Profiling は自動的に有効化されます。Endpoint Profiling は Go の `runtime/pprof` パッケージの提供するラベル機能を利用してプロファイルデータにエンドポイント情報を付与することで、実現されています。

### pprof ラベルの付与

[Go 1.9 で導入された pprof ラベル](https://github.com/golang/go/issues/17280)は、プロファイルサンプルに任意のキーバリューペアを付与できる仕組みです。CPU プロファイラがサンプリングを行う際、現在の goroutine に設定されているラベルが自動的にサンプルに記録されます。

```go
import "runtime/pprof"

func handleRequest(w http.ResponseWriter, r *http.Request) {
    // goroutine にラベルを設定
    labels := pprof.Labels("endpoint", "GET /users")
    ctx := pprof.WithLabels(r.Context(), labels)
    pprof.SetGoroutineLabels(ctx)

    // この goroutine で消費された CPU 時間は
    // "endpoint=GET /users" というラベル付きでサンプリングされる
    doWork()

    // 親のラベルに戻す
    pprof.SetGoroutineLabels(r.Context())
}
```

### ラベルの伝播

pprof ラベルで重要なのは、ラベルが goroutine 単位で設定されることです。そのため、子 goroutine を起動する場合は、明示的にラベルを引き継ぐ必要があります。

```go
ctx := pprof.WithLabels(parentCtx, pprof.Labels("key", "value"))
pprof.SetGoroutineLabels(ctx)

go func() {
    // この goroutine にもラベルを設定
    pprof.SetGoroutineLabels(ctx)
    // ...
}()
```

### Datadog Profiler でのラベルの利用

Datadog Profiler は、収集された pprof プロファイルのラベルのうち、特定のキーをエンドポイント識別子として解釈し、UI 上の Endpoint フィルタとして表示します。
dd-trace-go は Span 開始時にこのラベルを自動的に設定しています。

```go:dd-trace-go/ddtrace/tracer/tracer.go
func (t *tracer) StartSpan(operationName string, options ...StartSpanOption) *Span {
	// ... 省略 ...
	if t.config.internalConfig.ProfilerHotspotsEnabled() || t.config.internalConfig.ProfilerEndpoints() {
		t.applyPPROFLabels(span.pprofCtxRestore, span)
	} else {
		span.pprofCtxRestore = nil
	}
	// ... 省略 ...
}

func (t *tracer) applyPPROFLabels(ctx gocontext.Context, span *Span) {
	// ... 省略 ...
	if t.config.internalConfig.ProfilerEndpoints() && localRootSpan != nil {
		localRootSpan.mu.RLock()
		if spanResourcePIISafe(localRootSpan) {
			labels = append(labels, traceprof.TraceEndpoint, localRootSpan.resource)
			if span == localRootSpan {
				// Inform the profiler of endpoint hits. This is used for the unit of
				// work feature. We can't use APM stats for this since the stats don't
				// have enough cardinality (e.g. runtime-id tags are missing).
				traceprof.GlobalEndpointCounter().Inc(localRootSpan.resource)
			}
		}
		localRootSpan.mu.RUnlock()
	}
	if len(labels) > 0 {
		span.pprofCtxRestore = ctx
		span.pprofCtxActive = pprof.WithLabels(ctx, pprof.Labels(labels...))
		// :NOTE: ここで pprof ラベルを設定している
		pprof.SetGoroutineLabels(span.pprofCtxActive)
	}
}
```

[DataDog/dd-trace-go/ddtrace/tracer/tracer.go#L765-L871 - github.com](https://github.com/DataDog/dd-trace-go/blob/886ce05e3005c3526bd00d6b6e115a293bdc8fc6/ddtrace/tracer/tracer.go#L834-L871)

pprof ラベルのキーは以下のように定義されています。

```go:internal/traceprof/traceprof.go
// pprof labels applied by the tracer to show up in the profiler's profiles.
const (
    // ...
	TraceEndpoint   = "trace endpoint"
)
```

[dd-trace-go/internal/traceprof/traceprof.go#L10-L14 - github.com](https://github.com/DataDog/dd-trace-go/blob/886ce05e3005c3526bd00d6b6e115a293bdc8fc6/internal/traceprof/traceprof.go#L10-L14)

このラベル名を使用して pprof ラベルを設定することで、 dd-trace-go でトレース計装を行っていない場合においても、Datadog Profiler の Endpoint Profiling 機能を利用できます。

> [!NOTE]
> なお、`trace endpoint` label は dd-trace-go 内部で非公開のパッケージとして定義されており、Datadog の公開仕様として明示されているものは見つけられませんでした。そのため、将来のバージョンで変更される可能性があることに注意してください。

## dd-trace-go の計装なしで Endpoint Profiling を実現する

`trace endpoint` ラベルを設定する方法としては、Span Processor や Middleware / Interceptor でラベルを設定する方法が考えられます。
ここでは例として、 Middleware / Interceptor でラベルを設定する方法を紹介します。

### HTTP サーバーの Middleware でラベルを設定する

ここでは、 `gorilla/mux` を使用した HTTP サーバーのミドルウェアで pprof ラベルを設定する例を示します。
middleware 関数内で、リクエストのルートパターンを取得し、pprof ラベルを設定します。

```go
package main

import (
    "net/http"
    "runtime/pprof"

    "github.com/gorilla/mux"
)

const (
    traceEndpoint   = "trace endpoint"
)

func middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        endpoint := getRoutePattern(r)
        if endpoint == "" {
            next.ServeHTTP(w, r)
            return
        }

        // pprof ラベルを設定
        labels := pprof.Labels(traceEndpoint, endpoint)
        ctx := pprof.WithLabels(r.Context(), labels)
        pprof.SetGoroutineLabels(ctx)

        // リクエスト終了時にラベルを復元
        defer pprof.SetGoroutineLabels(r.Context())

        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

func getRoutePattern(r *http.Request) string {
    route := mux.CurrentRoute(r)
    if route == nil {
        return ""
    }
    pathTemplate, err := route.GetPathTemplate()
    if err != nil {
        return ""
    }

    return r.Method + " " + pathTemplate
}
```

### gRPC Unary Server の Interceptor でラベルを設定する

ここでは、gRPC サーバーの Unary Server Interceptor で pprof ラベルを設定する例を示します。
interceptor 関数内で、gRPC メソッド名を取得し、pprof ラベルを設定します。

```go
package main

import (
	"context"
	"runtime/pprof"

	"google.golang.org/grpc"
)

const (
    traceEndpoint   = "trace endpoint"
)

func interceptor() grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (any, error) {
        // pprof ラベルを設定
        // `info.FullMethod` は `/echo.EchoService/Echo` のような形式
		endpoint := info.FullMethod
		pprofCtx := pprof.WithLabels(ctx, pprof.Labels(
			traceEndpoint, endpoint,
		))
		pprof.SetGoroutineLabels(pprofCtx)

        // リクエスト終了時にラベルを復元
		defer pprof.SetGoroutineLabels(ctx)

		return handler(pprofCtx, req)
	}
}
```

これらの実装を入れることで、Profiler の UI 上でエンドポイントごとのフィルタができるようになることと、Service Catalog の Profiling のタブでエンドポイントごとにプロファイルデータが色で分かれて表示されるようになります。


**Profiler UI**

![trace_bq_sink](https://ucprdev-image-proxy.ucpr.workers.dev/images/articles/datadog_opentelemetry_endpoint_profiling/profile.png)


**Service Catalog Profiler Tab**

![trace_bq_sink](https://ucprdev-image-proxy.ucpr.workers.dev/images/articles/datadog_opentelemetry_endpoint_profiling/service_catalog.png)

### Middleware / Interceptor でラベル設定を行う際の注意点

紹介した方法は HTTP / gRPC のリクエスト単位でのプロファイリングには有効ですが、pprof ラベルは goroutine 単位で設定されるため、handler 内で新たに goroutine を起動したり、worker pool やバックグラウンドジョブに処理を委譲した場合、子 goroutine にはラベルが自動で引き継がれません。

その結果、エンドポイントに起因する処理であっても、非同期 goroutine で消費された CPU Time は Endpoint Profiling 上ではどのエンドポイントにも紐づかないサンプルとして表示されることがあります。
非同期処理を含めて計測したい場合は、起動先の goroutine 側で `pprof.SetGoroutineLabels` を明示的に呼び直すなどの工夫が必要になります。

## おわりに

本記事では、 dd-trace-go で計装していないアプリケーションで Datadog Profiler の Endpoint Profiling を実現する方法について解説しました。
Datadog Profiler の Endpoint Profiling 機能は、特定のエンドポイントに関連するプロファイルデータを詳細に分析するのに非常に有用です。pprof ラベルを適切に設定することで、OpenTelemetry など dd-trace-go を利用していないケースでもこの機能を活用できます。

また、Datadog のProfiler と Trace の相関付けも pprof ラベルを用いて行っているようなので、まだ未検証ですが同様の方法で実現できる可能性があるため、興味がある方はぜひ試してみて結果を共有していただけると嬉しいです。

本記事において、異なっている説明や表現がありましたらご連絡ください。

## 参考

- [遅いトレースまたはエンドポイントを調査する - docs.datadoghq.com](https://docs.datadoghq.com/ja/profiler/connect_traces_and_profiles/?tab=go)
- [Continuous Profiler - docs.datadoghq.com](https://docs.datadoghq.com/ja/profiler/)
- [runtime/pprof - pkg.go.dev](https://pkg.go.dev/runtime/pprof)
- [Go Profilerでメモリ使用量とCPU時間を最適化 - clyr.co.jp](https://www.clyr.co.jp/posts/optimize-memory-usage-and-cpu-time-with-go-profiler-2963)
- [pprof: add support for profiler labels - github.com](https://github.com/golang/go/issues/17280)
