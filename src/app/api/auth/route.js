import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Default admin credentials
    if (username === 'admin' && password === 'sharma@2026') {
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
