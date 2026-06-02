import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { readData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    // Auto-seeding check
    const count = await Post.countDocuments();
    if (count === 0) {
      const fileSeeds = readData('posts.json');
      if (fileSeeds && fileSeeds.length > 0) {
        // Strip out the manual string IDs so MongoDB generates ObjectId
        const formattedSeeds = fileSeeds.map(({ id, ...rest }) => rest);
        await Post.insertMany(formattedSeeds);
      }
    }

    const posts = await Post.find().sort({ date: -1 });
    
    // Map to frontend expected format (id instead of _id)
    const mappedPosts = posts.map(p => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      mediaUrl: p.mediaUrl,
      mediaType: p.mediaType,
      date: p.date
    }));

    return NextResponse.json(mappedPosts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts: ' + error.message },
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

    const { title, description, mediaUrl, mediaType } = await request.json();
    if (!title || !description || !mediaUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPostDoc = await Post.create({
      title,
      description,
      mediaUrl,
      mediaType: mediaType || 'image',
      // Schema will auto-set the date
    });

    return NextResponse.json({
      id: newPostDoc._id.toString(),
      title: newPostDoc.title,
      description: newPostDoc.description,
      mediaUrl: newPostDoc.mediaUrl,
      mediaType: newPostDoc.mediaType,
      date: newPostDoc.date
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
