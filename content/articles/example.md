---
title: "Test Article"
description: "Test Description"
publishedAt: '1999-12-29'
tags: ["test", "article"]
noindex: true
---

## h2

h1 は使わない。

### h3

#### h4

## blockquote

body

> こんにちは。これはぶろっくくおーとです。
日本語表示。

> Hello. This is a block quote.
英語表示。

> こんにちは。This is a block quote.
日本語と英語表示。

> Hello. This is a block quote.
>> こんにちは。これはぶろっくくおーとです。
二重引用

## alert

> [!NOTE]
> `NOTE` の例

> [!TIP]
> `TIP` の例

> [!IMPORTANT]
> `IMPORTANT` の例

> [!WARNING]
> `WARNING` の例

> [!CAUTION]
> `CAUTION` の例


## pre & codeblock

```rust
const body = "---
title: Test Title
tags:
  - rust
  - test
---"

let tree = markdown::to_mdast(body, config).ok().unwrap();
let mut front_matter = String::new();
tree.children().into_iter().for_each(|node| {
    for child in node.iter() {
        match child {
            markdown::mdast::Node::Yaml(yaml) => {
                front_matter = yaml.value.clone();
            }
            _ => {}
        }
    }
});
```

## code

`Hello, World!` はこんにちは世界という意味です。

## ul & li

- item1
    - item2
- item3
    - item4
    - item5
        - item6

## ol & li

1. item1
    1. item2
1. item3
    1. item4
    1. item5
        1. item6

## em

*italic で文字を書いてみるよ。*

## strong

**bold で文字を書いてみるよ。**

## em & strong

***italic と bold を組み合わせて文字を書いてみるよ。***

## strike

~~strike で文字を書いてみるよ。~~

## hr

`---` で水平線を引く。

---

`***` で水平線を引く。

***

## link

[Google](https://www.google.com)

## コメント

{/* コメント */}

```markdown
<!-- コメント -->
```

## GFM: Table

|header1|header2|header3|
|---|---|---|
|align left|align right|align center|
|a|b|c|

## LinkCard

[[カードOGP:SolidJS]](https://solidjs.com/)

[[カードOGP:ucpr.dev]](https://ucpr.dev)

## 画像

![ucpr](https://avatars.githubusercontent.com/u/17886370?v=4)

## 画像（キャプション付き）

![ucpr](https://avatars.githubusercontent.com/u/17886370?v=4 "これはキャプションです")

## 画像（キャプション内にリンク）

![ucpr](https://avatars.githubusercontent.com/u/17886370?v=4 "出典: [GitHub](https://github.com/ucpr)")

## 脚注

これは脚注のテストです[^1]。複数の脚注も使えます[^2]。

脚注内にリンクを含めることもできます[^link]。

[^1]: これは最初の脚注です。
[^2]: これは2番目の脚注です。
[^link]: 詳細は[GitHub](https://github.com)を参照してください。
