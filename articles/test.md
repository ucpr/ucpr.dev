+++
title = "テスト記事"
description = "テスト記事"
date = "2000-01-01T00:00:00+09:00"
tags = []
+++

## blockquote

> こんにちは、世界。Hello, World!

日本語と英語表示。

> Hello, World!
>> こんにちは、世界。

二重引用

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

Rust のコードを書いてみる。

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

[Google](https://www.google.com) へのリンクを貼る。

### 定義参照リンク

定義参照リンクで [Google][1] へのリンクを貼る。

[1]: https://www.google.com

## GFM: Table

|header1|header2|header3|
|---|---|---|
|美味しいご飯|うまい飯|ご飯美味しい|
|*a*|b|c|

# header1
H1
## header2
H2
### header3
H3
#### header4
H4
