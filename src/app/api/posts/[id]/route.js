import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('sharma_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, description, mediaUrl, mediaType } = await request.json();

    await dbConnect();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (mediaUrl !== undefined) post.mediaUrl = mediaUrl;
    if (mediaType !== undefined) post.mediaType = mediaType;

    await post.save();

    return NextResponse.json({
      id: post._id.toString(),
      title: post.title,
      description: post.description,
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
    
    await dbConnect();
    
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
