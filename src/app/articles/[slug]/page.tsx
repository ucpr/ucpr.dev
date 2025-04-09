import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllArticles, getArticleBySlug } from '@/utils/article';
import { format } from 'date-fns';
import 'highlight.js/styles/github-dark.css';
import { highlightCodeBlocks } from '@/utils/syntax-highlighter';

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | ucpr.dev`,
    description: article.description,
  };
}

/**
 * テキストコンテンツを整形する
 */
function formatContent(content: string): string {
  const lines = content.split('\n');
  let formattedContent = '';
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLang = '';
  let foundFirstHeading = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // コードブロックの開始を処理
    if (line.trim().startsWith('```') && !inCodeBlock) {
      inCodeBlock = true;
      codeBlockLang = line.trim().substring(3).trim();
      codeBlockContent = '';
      continue;
    }
    
    // コードブロックの終了を処理
    if (line.trim() === '```' && inCodeBlock) {
      inCodeBlock = false;
      // codeBlockContentはhighlightCodeBlocks関数で処理されるので、
      // 特殊な形式でマークしておく
      formattedContent += `<pre data-lang="${codeBlockLang}" class="code-block">${codeBlockContent}</pre>\n`;
      continue;
    }
    
    // コードブロック内の行を処理
    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }
    
    // 見出しの処理
    if (line.startsWith('# ')) {
      // 最初の見出しはスキップ（タイトルとして別途表示するため）
      if (!foundFirstHeading) {
        foundFirstHeading = true;
        continue;
      }
      formattedContent += `<h1>${line.substring(2)}</h1>\n`;
      continue;
    }
    if (line.startsWith('## ')) {
      formattedContent += `<h2>${line.substring(3)}</h2>\n`;
      continue;
    }
    if (line.startsWith('### ')) {
      formattedContent += `<h3>${line.substring(4)}</h3>\n`;
      continue;
    }
    
    // 空行の処理
    if (line.trim() === '') {
      formattedContent += '<p></p>\n';
      continue;
    }
    
    // 通常のテキスト行を処理
    let processedLine = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 太字
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // 斜体
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 dark:text-blue-400 underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors">$1</a>'); // リンク
    
    formattedContent += `<p>${processedLine}</p>\n`;
  }

  return formattedContent;
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  // コンテンツの整形
  const formattedContent = formatContent(article.content);
  
  // シンタックスハイライトの適用
  const highlightedContent = await highlightCodeBlocks(formattedContent);

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <article className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="text-gray-400 mb-8">
          {format(new Date(article.publishedAt), 'yyyy年MM月dd日')}
        </div>
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
        />
      </article>
    </main>
  );
} 