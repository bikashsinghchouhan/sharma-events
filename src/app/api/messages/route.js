import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readData, writeData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('sharma_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = readData('messages.json');

    const mappedMessages = messages.map(m => ({
      id: m.id || m._id?.toString() || `msg-${Math.random().toString(36).substr(2, 9)}`,
      name: m.name,
      email: m.email,
      phone: m.phone || '',
      eventDate: m.eventDate || '',
      message: m.message,
      createdAt: m.createdAt || new Date().toISOString()
    }));

    return NextResponse.json(mappedMessages);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, email, phone, eventDate, message } = await request.json();
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields (name, email, message)' },
        { status: 400 }
      );
    }

    const messages = readData('messages.json');

    const newMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      eventDate: eventDate || '',
      message,
      createdAt: new Date().toISOString()
    };

    messages.unshift(newMessage); // Add new message to the top of list
    writeData('messages.json', messages);

    // Send email notification via SMTP/Nodemailer
    try {
      const { sendNotificationEmail } = await import('@/lib/sendEmail');
      await sendNotificationEmail({
        name,
        email,
        phone: phone || '',
        eventDate: eventDate || '',
        message
      });
    } catch (emailError) {
      console.error('[POST ROUTE] Failed to send email notification:', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Your inquiry has been sent successfully. We will contact you soon!' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

