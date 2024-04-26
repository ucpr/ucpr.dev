+++
title = "GoでXMLのCDATAにXMLを埋め込む"
description = "GoでXMLのCDATAにXMLをネストさせて、Marshalする方法について紹介します"
date = "2024-04-25T00:00:00+09:00"
tags = ["go", "xml"]
+++

## はじめに

Go で XML の CDATA を使う際に、CDATA に文字列などのデータを埋め込むことは簡単です。しかし、 CDATA に XML などのネストした構造体のデータを埋め込む場合は少し工夫が必要です。

愚直に CDATA を構造体として定義して Marshal すると、思った通りに CDATA 以下の XML が出力されないことがあります。

その際のアプローチとしては、以下の方法があります。

- CDATA は `string` 型で定義して、ネストした構造体を別で Marshal して `string` 型で定義した CDATA のフィールドに入れる
- `encoding` パッケージの `TextMarshaler` インターフェースを実装して、CDATA にデータを埋め込む

本記事では、`encoding` パッケージの `TextMarshaler` インターフェースを実装して、CDATA に XML を埋め込む方法について紹介します。

## 前提

この記事内では、以下のバージョンで動作を確認しています。

- Go
  - go version go1.22.1 darwin/arm64

## CDATA とは

> CDATASection インターフェースは CDATA セクションを表します。これにより、XML 内でエスケープされていないテキストの拡張部分を入れることができます。 CDATA セクションの内部では、記号 < と & は通常のようにエスケープする必要がありません。

ref. [CDATASection | MDN Web Docs][0]

とあるように CDATA は XML の一部で、エスケープされていないテキストを記述するためのものです。CDATA は、`<![CDATA[` で始まり、`]]>` で終わります。
以下は CDATA を持つ XML の例です。

```xml
<!xml version="1.0" encoding="UTF-8"?>
<root>
  <![CDATA[
      ここにはエスケープされていないテキストが入ります。
      <hoge>hoge</hoge>
  ]]>
</root>
```

## 愚直に xml タグを付けた構造体を定義して Marshal する

愚直に cdata を構造体として定義して、Marshal します。
ここでは CDATA 内の XML を表す構造体を `Inner` とし、それを CDATA として扱う `Root` 構造体を定義します。

```go
type Inner struct {
	Field1 string `xml:"field1"`
	Field2 int    `xml:"field2"`
}

type Root struct {
	XMLName xml.Name `xml:"root"`
	CData   Inner    `xml:",cdata"`
}

func main() {
	outerData := Root{
		CData: Inner{Field1: "example", Field2: 123},
	}

	output, err := xml.MarshalIndent(outerData, "", "  ")
	if err != nil {
		fmt.Printf("error: %v\n", err)
		return
	}

	fmt.Println(string(output))
}
```

- https://go.dev/play/p/bN5mKII4jfB

上記のコードを実行すると、以下のような XML が出力されます。

```xml
<root></root>
```

CDATA が出力されることを期待したコードになっていますが、実際に Marshal を行っても CDATA 以下のデータが出力されません。
これは、 `encoding/xml` パッケージが `cdata` タグがあるものは文字列として扱い、ネストした構造体は Marshal されず、スキップされるためです。

> a field with tag ",cdata" is written as character data wrapped in one or more <![CDATA[ ... ]]> tags, not as an XML element.

ref. [encofing/xml | pkg.go.dev][1]

そのため、CDATA に XML を埋め込むためには、ネストした構造体に `encoding` パッケージの `TextMarshaler` インターフェースを実装する必要があります。

## TextMarshaler インターフェースを実装して Marshal する

> a field implementing encoding.TextMarshaler is written by encoding the result of its MarshalText method as text.

ref. [encofing/xml | pkg.go.dev][1]

`encoding/xml` パッケージでは、[encoding.TextMarshaler](https://pkg.go.dev/encoding#TextMarshaler) インターフェースを実装することで、CDATA に `MarshalText` で返却されたデータを埋め込むことができます。

以下は、`TextMarshaler` インターフェースを実装した例です。

```go
type Inner struct {
	Field1 string `xml:"field1"`
	Field2 int    `xml:"field2"`
}

func (i Inner) MarshalText() ([]byte, error) {
	type inner Inner // 再帰的な呼び出しを避けるために型を定義
	output, err := xml.Marshal((*inner)(&i))
	if err != nil {
		return nil, err
	}

	return output, nil
}

type Root struct {
	XMLName xml.Name `xml:"root"`
	CData   Inner    `xml:",cdata"`
}

func main() {
	outerData := Root{
		CData: Inner{Field1: "example", Field2: 123},
	}

	output, err := xml.MarshalIndent(outerData, "", "  ")
	if err != nil {
		panic(err)
	}

	fmt.Println(string(output))
}
```

- https://go.dev/play/p/fh9mrxp_m78

注意点として、`TextMarshaler` インターフェースを実装する際に、再帰的な呼び出しを避けるために、`Inner` 型を `inner` 型に変換して `xml.Marshal` に渡しています。

上記のコードを実行すると、期待した通りの XML が出力されました。

```xml
<root><![CDATA[<inner><field1>example</field1><field2>123</field2></inner>]]></root>
```

### 寄り道

実際に Go の `encoding/xml` パッケージのソースコードを見てみると、`TextMarshaler` が実装されている場合に `MarshalText` が呼ばれることがわかります。

```go
if vf.CanInterface() && vf.Type().Implements(textMarshalerType) {
	data, err := vf.Interface().(encoding.TextMarshaler).MarshalText()
	if err != nil {
		return err
	}
	if err := emit(p, data); err != nil {
		return err
	}
	continue
}
// ...
```

ref: [src/encoding/xml/marshal.go;l=855-877](https://cs.opensource.google/go/go/+/refs/tags/go1.22.2:src/encoding/xml/marshal.go;l=855-877)

これは CDATA に限った仕組みではなく、XML のエンコード時に `TextMarshaler` インターフェースを実装した場合に、`MarshalText` が呼ばれるようになっています。
そのため、通常の XML のエンコード時にも `TextMarshaler` インターフェースを実装することで、カスタムなエンコード処理を行うことができます。

## おわりに

本記事では、Go で XML の CDATA に XML を埋め込む方法について紹介しました。`TextMarshaler` インターフェースを実装することで、CDATA に XML やその他フォーマットのデータも埋め込むことも可能です。

本記事において、異なっている説明や表現がありましたらご連絡ください。

## 参考

- [CDATASection | MDN Web Docs][0]
- [encoding/xml | pkg.go.dev][1]
- [encoding | pkg.go.dev][2]
- [XML の構文 <![CDATA[...]]> のルーツ | Zenn][3]

[0]: https://developer.mozilla.org/ja/docs/Web/API/CDATASection
[1]: https://pkg.go.dev/encoding/xml
[2]: https://pkg.go.dev/encoding
[3]: https://zenn.dev/takumi_n/articles/xml-cdata-roots
