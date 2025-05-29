import { NextResponse } from 'next/server';
import { fetchUnsplashImages } from '@/utils/unsplash';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const count = parseInt(searchParams.get('count') || '5', 10);
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }
  
  try {
    const images = await fetchUnsplashImages(query, count);
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error in Unsplash API route:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
