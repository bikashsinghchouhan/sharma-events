import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import HeroSlide from '@/models/HeroSlide';

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('sharma_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { imageUrl, caption, order } = await request.json();

    await dbConnect();

    const slide = await HeroSlide.findById(id);
    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    if (imageUrl !== undefined) slide.imageUrl = imageUrl;
    if (caption !== undefined) slide.caption = caption;
    if (order !== undefined) slide.order = Number(order);

    await slide.save();

    return NextResponse.json({
      id: slide._id.toString(),
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
    
    await dbConnect();

    const slide = await HeroSlide.findByIdAndDelete(id);
    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Slide deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
