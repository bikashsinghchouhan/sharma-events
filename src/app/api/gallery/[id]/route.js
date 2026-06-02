import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem';

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('sharma_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, description, images, category } = await request.json();

    await dbConnect();

    const item = await GalleryItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (images !== undefined && Array.isArray(images)) item.images = images;
    if (category !== undefined) item.category = category;

    await item.save();

    return NextResponse.json({
      id: item._id.toString(),
      title: item.title,
      description: item.description,
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
    
    await dbConnect();

    const item = await GalleryItem.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
