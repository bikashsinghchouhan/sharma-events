import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readData, writeData, getDirectDriveLink } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slides = readData('hero-slides.json');

    const mappedSlides = slides.map(s => ({
      id: s.id || s._id?.toString() || `slide-${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: getDirectDriveLink(s.imageUrl),
      caption: s.caption || '',
      order: s.order || 0
    }));

    return NextResponse.json(mappedSlides);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch hero slides: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('sharma_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, caption, order } = await request.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing required field (imageUrl)' }, { status: 400 });
    }

    const slides = readData('hero-slides.json');

    const newSlide = {
      id: `slide-${Date.now()}`,
      imageUrl: getDirectDriveLink(imageUrl),
      caption: caption || '',
      order: order !== undefined ? Number(order) : 0
    };

    slides.push(newSlide);
    // Sort slides by order
    slides.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    writeData('hero-slides.json', slides);

    return NextResponse.json(newSlide);
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

