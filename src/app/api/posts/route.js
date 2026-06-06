import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readData, writeData, getDirectDriveLink } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = readData('posts.json');
    
    // Ensure Google Drive links are mapped and ids are clean strings
    const mappedPosts = posts.map(p => ({
      id: p.id || p._id?.toString() || `post-${Math.random().toString(36).substr(2, 9)}`,
      title: p.title || '',
      description: p.description || p.discription || '',
      discription: p.discription || p.description || '',
      mediaUrl: getDirectDriveLink(p.mediaUrl),
      mediaType: p.mediaType || 'image',
      date: p.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
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

    const { title, description, discription, mediaUrl, mediaType } = await request.json();
    if (!title || (!description && !discription) || !mediaUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const posts = readData('posts.json');

    // Format local date string like "June 6, 2026"
    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const newPost = {
      id: `post-${Date.now()}`,
      title,
      description: description || discription,
      discription: discription || description,
      mediaUrl: getDirectDriveLink(mediaUrl),
      mediaType: mediaType || 'image',
      date: todayStr
    };

    posts.unshift(newPost); // Add new post to top of list
    writeData('posts.json', posts);

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

