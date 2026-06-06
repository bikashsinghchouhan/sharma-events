import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readData, writeData, getDirectDriveLink } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('sharma_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, description, content, images, category } = await request.json();

    const gallery = readData('gallery.json');
    const index = gallery.findIndex(item => (item.id === id || item._id?.toString() === id));

    if (index === -1) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    const item = gallery[index];

    if (title !== undefined) item.title = title;
    if (description !== undefined) {
      item.description = description;
      item.content = description;
    }
    if (content !== undefined) {
      item.content = content;
      item.description = content;
    }
    if (images !== undefined && Array.isArray(images)) {
      item.images = images.map(url => getDirectDriveLink(url));
    }
    if (category !== undefined) item.category = category;

    gallery[index] = item;
    writeData('gallery.json', gallery);

    return NextResponse.json({
      id: item.id || item._id?.toString() || id,
      title: item.title,
      description: item.description,
      content: item.content,
      images: item.images,
      category: item.category
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('sharma_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const gallery = readData('gallery.json');
    const filteredGallery = gallery.filter(item => (item.id !== id && item._id?.toString() !== id));

    if (filteredGallery.length === gallery.length) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    writeData('gallery.json', filteredGallery);

    return NextResponse.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

