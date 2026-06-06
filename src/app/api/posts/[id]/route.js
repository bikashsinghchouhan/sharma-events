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
    const { title, description, discription, mediaUrl, mediaType } = await request.json();

    const posts = readData('posts.json');
    const index = posts.findIndex(post => (post.id === id || post._id?.toString() === id));

    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = posts[index];

    if (title !== undefined) post.title = title;
    if (description !== undefined) {
      post.description = description;
      post.discription = description;
    }
    if (discription !== undefined) {
      post.discription = discription;
      post.description = discription;
    }
    if (mediaUrl !== undefined) post.mediaUrl = getDirectDriveLink(mediaUrl);
    if (mediaType !== undefined) post.mediaType = mediaType;

    posts[index] = post;
    writeData('posts.json', posts);

    return NextResponse.json({
      id: post.id || post._id?.toString() || id,
      title: post.title,
      description: post.description,
      discription: post.discription,
      mediaUrl: post.mediaUrl,
      mediaType: post.mediaType,
      date: post.date
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
    
    const posts = readData('posts.json');
    const filteredPosts = posts.filter(post => (post.id !== id && post._id?.toString() !== id));

    if (filteredPosts.length === posts.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    writeData('posts.json', filteredPosts);

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

