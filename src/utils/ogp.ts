import { load } from 'cheerio';

export interface OgpData {
  url: string;
  title: string;
  description: string;
  image?: string;
  favicon?: string;
  siteName?: string;
}

/**
 * URLからOGPメタデータを取得する
 */
export async function fetchOgpData(url: string): Promise<OgpData> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'bot',
      },
      next: { revalidate: 60 * 60 * 24 } // 1日間キャッシュ
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = load(html);
    
    // 基本情報の取得
    const title = $('meta[property="og:title"]').attr('content') || 
                  $('title').text() || 
                  '';
    
    const description = $('meta[property="og:description"]').attr('content') || 
                        $('meta[name="description"]').attr('content') || 
                        '';
    
    const image = $('meta[property="og:image"]').attr('content');
    
    const siteName = $('meta[property="og:site_name"]').attr('content');
    
    // faviconの取得
    let favicon = $('link[rel="icon"]').attr('href') || 
                  $('link[rel="shortcut icon"]').attr('href');
                  
    // 相対パスの場合は絶対パスに変換
    if (favicon && !favicon.startsWith('http')) {
      const baseUrl = new URL(url);
      favicon = favicon.startsWith('/') 
        ? `${baseUrl.protocol}//${baseUrl.host}${favicon}`
        : `${baseUrl.protocol}//${baseUrl.host}/${favicon}`;
    }
    
    return {
      url,
      title,
      description,
      image,
      favicon,
      siteName,
    };
  } catch (error) {
    console.error(`Failed to fetch OGP data from ${url}:`, error);
    // エラー時はURLとデフォルト値を返す
    return {
      url,
      title: url,
      description: 'リンク先の情報を取得できませんでした',
    };
  }
} 