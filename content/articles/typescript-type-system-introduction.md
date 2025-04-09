---
title: TypeScriptの型システム入門
description: TypeScriptの型システムの基本から応用までを解説します。型安全なコードの書き方を学びましょう。
publishedAt: '2023-03-10'
---

# TypeScriptの型システム入門

TypeScriptは、JavaScriptに静的型付けを追加した言語です。型システムを活用することで、多くのバグを事前に防ぎ、コードの品質を向上させることができます。この記事では、TypeScriptの型システムの基本から応用までを解説します。

## 基本的な型

TypeScriptでは、変数や関数の引数、戻り値に型を指定することができます。

```typescript
// 基本的な型
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let hobbies: string[] = ["reading", "gaming"];
let tuple: [string, number] = ["position", 20];
```

## インターフェースと型エイリアス

複雑なオブジェクトの型を定義するには、インターフェースや型エイリアスを使用します。

```typescript
// インターフェース
interface User {
  id: number;
  name: string;
  email: string;
  isAdmin?: boolean; // オプショナルプロパティ
}

// 型エイリアス
type Point = {
  x: number;
  y: number;
};

// 使用例
const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com"
};

const point: Point = { x: 10, y: 20 };
```

## ユニオン型とインターセクション型

複数の型を組み合わせる方法として、ユニオン型（Union Types）とインターセクション型（Intersection Types）があります。

```typescript
// ユニオン型
type ID = string | number;

function printId(id: ID) {
  console.log(`ID: ${id}`);
}

printId(101); // OK
printId("202"); // OK

// インターセクション型
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

type Person = HasName & HasAge;

const person: Person = {
  name: "Alice",
  age: 25
}; // OK
```

## ジェネリクス

型を引数として受け取る「ジェネリクス」を使うと、再利用可能なコンポーネントを作成できます。

```typescript
// ジェネリック関数
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity(123); // 型推論によりnumber型と判断される

// ジェネリックインターフェース
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 42 };
```

## 高度な型機能

TypeScriptには、より高度な型機能も用意されています。

```typescript
// 条件付き型
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// マップ型
interface Person {
  name: string;
  age: number;
}

type ReadonlyPerson = Readonly<Person>;
// { readonly name: string; readonly age: number; }

type PartialPerson = Partial<Person>;
// { name?: string; age?: number; }
```

## まとめ

TypeScriptの型システムを活用することで、コードの品質と保守性を大幅に向上させることができます。基本的な型から高度な型機能まで徐々に学んでいくことで、TypeScriptの力を最大限に引き出せるようになります。

型安全なプログラミングを心がけ、エディタの自動補完や型チェックを活用することで、開発効率も向上します。ぜひTypeScriptの型システムをマスターして、より堅牢なアプリケーションを開発しましょう。 