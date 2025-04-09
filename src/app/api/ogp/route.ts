import { NextRequest, NextResponse } from 'next/server';
import { fetchOgpData } from '@/utils/ogp';

export async function GET(req: NextRequest) {
  // URLパラメータからtarget URLを取得
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    // OGPデータを取得
    const ogpData = await fetchOgpData(url);

    return NextResponse.json(ogpData);
  } catch (error) {
    console.error('Error fetching OGP data:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch OGP data',
        url: url,
        title: url,
        description: 'リンク先の情報を取得できませんでした'
      },
      { status: 500 }
    );
  }
} 
