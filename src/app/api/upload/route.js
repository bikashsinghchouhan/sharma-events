import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('sharma_session');
    
    if (!session || session.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create public/uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate safe unique filename
    const safeFileName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path.join(uploadsDir, safeFileName);

    // Save file
    fs.writeFileSync(filePath, buffer);

    const relativePath = `/uploads/${safeFileName}`;
    return NextResponse.json({ success: true, url: relativePath });
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
      { status: 500 }
    );
  }
}
