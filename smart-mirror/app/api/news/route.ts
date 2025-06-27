import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.error('API key is missing');
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=f4ced57051b64ddabd60e674941828f8
`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      cache: 'no-store'
    });

    console.log('NewsAPI Status:', res.status);

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}