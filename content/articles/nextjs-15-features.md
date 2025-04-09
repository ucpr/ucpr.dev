---
title: Next.js 15の新機能について
description: Next.js 15がリリースされました。このバージョンでの主な変更点と新機能について解説します。
publishedAt: '2023-04-09'
---

# Next.js 15の新機能について

Next.js 15がリリースされ、多くの新機能や改善が導入されました。この記事では、Next.js 15の主な変更点と新機能について解説します。

## Turbopack

Next.js 15では、Turbopackが安定版としてリリースされました。Turbopackは、Rustで書かれた高速なビルドエンジンで、開発サーバーの起動時間と更新時間を大幅に短縮します。

```typescript
// next.config.js
module.exports = {
  // Turbopackを有効化
  experimental: {
    turbo: true
  }
}
```

または、起動時にフラグを指定することもできます：

```bash
next dev --turbo
```

## Server Actionsの改善

Server Actionsがさらに強化され、フォーム処理やデータ変更が簡単になりました。

```typescript
// app/actions.ts
'use server'

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string
  
  // データベースに保存する処理
  await db.todos.create({ data: { title } })
  
  // キャッシュを再検証
  revalidatePath('/todos')
}
```

```tsx
// app/page.tsx
import { createTodo } from './actions'

export default function Page() {
  return (
    <form action={createTodo}>
      <input name="title" />
      <button type="submit">Add Todo</button>
    </form>
  )
}
```

## パフォーマンスの最適化

Next.js 15では、静的・動的レンダリングのハイブリッドアプローチがさらに改善され、ページロード時間が短縮されました。

## Image Componentの改善

Image Componentが改善され、より良いパフォーマンスと使いやすさを提供します。

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/profile.jpg"
      width={500}
      height={300}
      quality={90}
      alt="プロフィール画像"
      priority
    />
  )
}
```

## まとめ

Next.js 15は、パフォーマンスと開発者体験を重視した重要なアップデートです。Turbopackの安定化、Server Actionsの改善、その他多くの新機能により、より高速で使いやすいフレームワークになりました。

詳細は[公式ドキュメント](https://nextjs.org/docs)を参照してください。 