import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import GalleryItem from '@/models/GalleryItem';
import { readData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Auto-seeding check
    const count = await GalleryItem.countDocuments();
    if (count === 0) {
      const fileSeeds = readData('gallery.json');
      if (fileSeeds && fileSeeds.length > 0) {
        // Strip out the manual string IDs so MongoDB generates ObjectId
        const formattedSeeds = fileSeeds.map(({ id, ...rest }) => rest);
        await GalleryItem.insertMany(formattedSeeds);
      }
    }

    // Sort items descending by creation id
    const gallery = await GalleryItem.find().sort({ _id: -1 });

    // Map to frontend expected format
    const mappedGallery = gallery.map(g => ({
      id: g._id.toString(),
      title: g.title || '',
      description: g.description || '',
      images: g.images || [],
      category: g.category
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

    await dbConnect();

    const { title, description, images, category } = await request.json();
    if (!images || !Array.isArray(images) || images.length === 0 || !category) {
      return NextResponse.json(
        { error: 'Missing required fields (images array, category)' }, 
        { status: 400 }
      );
    }

    const newItemDoc = await GalleryItem.create({
      title: title || '',
      description: description || '',
      images,
      category
    });

    return NextResponse.json({
      id: newItemDoc._id.toString(),
      title: newItemDoc.title,
      description: newItemDoc.description,
      images: newItemDoc.images,
      category: newItemDoc.category
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
