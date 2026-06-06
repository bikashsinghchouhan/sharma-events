import { NextResponse } from 'next/server';
import { readData } from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Read superadmin credentials from admin.json, fallback to request details if not found
    const credentials = readData('admin.json', { username: 'ADM001', password: 'Rahul@3967' });
    
    if (username === credentials.username && password === credentials.password) {
      const response = NextResponse.json({ 
        success: true, 
        message: 'Logged in successfully' 
      });
      
      // Set secure cookie
      response.cookies.set('sharma_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      
      return response;
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid username or password' }, 
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message }, 
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const session = request.cookies.get('sharma_session');
  if (session && session.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
  
  // Clear cookie
  response.cookies.set('sharma_session', '', {
    path: '/',
    maxAge: 0,
  });
  
  return response;
}

