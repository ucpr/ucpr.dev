import Parser from 'rss-parser';
import { writeFileSync } from 'fs';
import { join } from 'path';

enum ExternalContentType {
  Zenn = "Zenn",
  ZennScraps = "Zenn Scraps",
  Other = "Other",
}

type ExternalContent = {
  title: string;
  url: string;
  publishedDate: string;
  source: ExternalContentType;
};

const rssUrls = [
  'https://zenn.dev/ucpr/feed?include_scraps=1'
];

const fetchAndParseRSS = async (url: string): Promise<ExternalContent[]> => {
  const parser = new Parser();
  const feed = await parser.parseURL(url);

  return feed.items.map(item => {
    let source: ExternalContentType;

    if (url.includes('zenn.dev') && !url.includes('scraps')) {
      source = ExternalContentType.Zenn;
    } else if (url.includes('zenn.dev') && url.includes('scraps')) {
      source = ExternalContentType.ZennScraps;
    } else {
      source = ExternalContentType.Other;
    }

    return {
      title: item.title || 'No title',
      url: item.link || 'No link',
      source: source,
      publishedDate: item.isoDate || 'No date',
    };
  });
};

const getAllExternalContents = async (): Promise<ExternalContent[]> => {
  const allContents = await Promise.all(rssUrls.map(fetchAndParseRSS));
  return allContents.flat();
};

const main = async () => {
  try {
    const externalContents = await getAllExternalContents();
    const jsonContent = JSON.stringify(externalContents, null, 2);
    const filePath = join(__dirname, 'external_content.json');
    writeFileSync(filePath, jsonContent, 'utf8');
    console.log(`Data saved to ${filePath}`);
  } catch (error) {
    console.error('Error fetching and parsing RSS feeds:', error);
  }
};

main()
