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
    const { imageUrl, caption, order } = await request.json();

    const slides = readData('hero-slides.json');
    const index = slides.findIndex(slide => (slide.id === id || slide._id?.toString() === id));

    if (index === -1) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    const slide = slides[index];

    if (imageUrl !== undefined) slide.imageUrl = getDirectDriveLink(imageUrl);
    if (caption !== undefined) slide.caption = caption;
    if (order !== undefined) slide.order = Number(order);

    slides[index] = slide;
    // Re-sort slides by order
    slides.sort((a, b) => (a.order || 0) - (b.order || 0));

    writeData('hero-slides.json', slides);

    return NextResponse.json({
      id: slide.id || slide._id?.toString() || id,
      imageUrl: slide.imageUrl,
      caption: slide.caption,
      order: slide.order
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
    
    const slides = readData('hero-slides.json');
    const filteredSlides = slides.filter(slide => (slide.id !== id && slide._id?.toString() !== id));

    if (filteredSlides.length === slides.length) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    writeData('hero-slides.json', filteredSlides);

    return NextResponse.json({ success: true, message: 'Slide deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

