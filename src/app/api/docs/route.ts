import { NextResponse } from 'next/server';
import { getDocsData } from '@/lib/docs';

export async function GET() {
  try {
    const docs = await getDocsData();
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error in docs API:', error);
    return NextResponse.json({ error: 'Failed to fetch docs data' }, { status: 500 });
  }
}
