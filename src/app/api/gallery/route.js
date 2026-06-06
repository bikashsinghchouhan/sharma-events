import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readData, writeData, getDirectDriveLink } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const gallery = readData('gallery.json');

    // Map to frontend expected format and ensure any drive URLs are parsed
    const mappedGallery = gallery.map(g => ({
      id: g.id || g._id?.toString() || `gal-${Math.random().toString(36).substr(2, 9)}`,
      title: g.title || '',
      description: g.description || g.content || '',
      content: g.content || g.description || '',
      images: (g.images || []).map(url => getDirectDriveLink(url)),
      category: g.category || 'Other'
    }));

    return NextResponse.json(mappedGallery);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch gallery: ' + error.message },
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

    const { title, description, content, images, category } = await request.json();
    if (!images || !Array.isArray(images) || images.length === 0 || !category) {
      return NextResponse.json(
        { error: 'Missing required fields (images array, category)' }, 
        { status: 400 }
      );
    }

    const gallery = readData('gallery.json');

    // Parse image links (e.g. Google Drive URLs)
    const formattedImages = images.map(url => getDirectDriveLink(url));

    const newItem = {
      id: `gal-${Date.now()}`,
      title: title || '',
      description: description || content || '',
      content: content || description || '',
      images: formattedImages,
      category
    };

    gallery.unshift(newItem); // Add new item to the beginning
    writeData('gallery.json', gallery);

    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

