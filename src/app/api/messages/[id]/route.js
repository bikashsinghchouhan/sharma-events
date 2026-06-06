import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readData, writeData } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('sharma_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const messages = readData('messages.json');
    const filteredMessages = messages.filter(msg => (msg.id !== id && msg._id?.toString() !== id));

    if (filteredMessages.length === messages.length) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    writeData('messages.json', filteredMessages);

    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

